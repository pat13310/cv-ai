// src/hooks/useCVSections.ts
import { useState, useCallback } from 'react';
import type { SectionConfig } from '../components/CVCreator/types';

const STORAGE_KEY_V2 = 'cvSectionsOrder';
const LEGACY_KEYS = ['cvSectionsOrder'];

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'name', name: 'Nom', component: 'NameSection', visible: true, layer: 1, order: 0, width: 'full' },
  { id: 'profile', name: 'Profil Professionnel', component: 'ProfileSection', visible: true, layer: 2, order: 0, width: 'full' },
  { id: 'contact', name: 'Contact', component: 'ContactSection', visible: true, layer: 3, order: 0, width: 'half' },
  { id: 'experience', name: 'Expérience Professionnelle', component: 'ExperienceSection', visible: true, layer: 3, order: 1, width: 'half' },
  { id: 'education', name: 'Formation', component: 'EducationSection', visible: true, layer: 4, order: 0, width: 'half' },
  { id: 'skills', name: 'Compétences', component: 'SkillsSection', visible: true, layer: 4, order: 1, width: 'half' },
  { id: 'languages', name: 'Langues', component: 'LanguagesSection', visible: true, layer: 5, order: 0, width: 'full' },
];

/* ---------------- Type guards utilitaires ---------------- */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
function isString(v: unknown): v is string {
  return typeof v === 'string';
}
function isNumber(v: unknown): v is number {
  return typeof v === 'number' && !Number.isNaN(v);
}
function isBoolean(v: unknown): v is boolean {
  return typeof v === 'boolean';
}
function isLeftRight(v: unknown): v is 'left' | 'right' {
  return v === 'left' || v === 'right';
}
function isWidth(v: unknown): v is 'full' | 'half' {
  return v === 'full' || v === 'half';
}

/* ------------- Migration d’anciens schémas (sans any) ------------- */
function migrateSections(raw: unknown): SectionConfig[] | null {
  if (!Array.isArray(raw)) return null;

  const prelim: Array<Partial<SectionConfig> & { id: string }> = raw
    .filter((item: unknown): item is Record<string, unknown> => isRecord(item) && isString(item.id))
    .map((s): Partial<SectionConfig> & { id: string } => {
      const layer = isNumber(s.layer) ? s.layer : 1;

      let order: number | undefined = isNumber(s.order) ? s.order : undefined;
      if (order === undefined && isLeftRight(s.position)) {
        order = s.position === 'left' ? 0 : 1;
      }

      const width = isWidth(s.width) ? s.width : undefined;

      return {
        id: s.id as string,
        name: isString(s.name) ? s.name : (s.id as string),
        component: isString(s.component) ? s.component : '',
        visible: isBoolean(s.visible) ? s.visible : true,
        layer,
        order,
        width,
      };
    });

  // Assigner un order aux entrées qui n’en ont pas, par layer, selon l’ordre d’apparition
  const byLayer = new Map<number, (Partial<SectionConfig> & { id: string })[]>();
  for (const s of prelim) {
    const L = isNumber(s.layer) ? s.layer : 1;
    const arr = byLayer.get(L);
    if (arr) arr.push(s); else byLayer.set(L, [s]);
  }

  for (const arr of byLayer.values()) {
    const needAssign = arr.some((s) => !isNumber(s.order));
    if (needAssign) {
      arr.forEach((s, idx) => {
        if (!isNumber(s.order)) s.order = idx; // 0,1,2...
      });
    }
  }

  // Projection finale (width sera recalée par cleanup)
  return prelim.map((s) => ({
    id: s.id,
    name: s.name as string,
    component: s.component as string,
    visible: s.visible as boolean,
    layer: (isNumber(s.layer) ? s.layer : 1) as number,
    order: (isNumber(s.order) ? s.order : 0) as number,
    width: s.width,
  })) as SectionConfig[];
}

/* ------------- Nettoyage “pur” des layers (préserve order) ------------- */
function cleanupLayersPure(sections: SectionConfig[]): SectionConfig[] {
  const layerGroups = new Map<number, SectionConfig[]>();
  for (const section of sections) {
    const layer = section.layer ?? 1;
    const arr = layerGroups.get(layer);
    if (arr) arr.push(section); else layerGroups.set(layer, [section]);
  }

  const sortedLayers = Array.from(layerGroups.keys()).sort((a, b) => a - b);
  const result: SectionConfig[] = [];

  sortedLayers.forEach((oldLayer, index) => {
    const newLayer = index + 1;
    const sectionsInLayer = layerGroups.get(oldLayer)!;

    // ✅ respecter l’ordre existant (important pour SWAP)
    const sortedInLayer = [...sectionsInLayer].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    const limited = sortedInLayer.slice(0, 2);

    limited.forEach((section, i) => {
      result.push({
        ...section,
        layer: newLayer,
        order: i, // normalise en 0/1
        width: limited.length === 1 ? 'full' : 'half',
      });
    });

    if (sortedInLayer.length > 2) {
      sortedInLayer.slice(2).forEach((section, extraIndex) => {
        result.push({
          ...section,
          layer: sortedLayers.length + extraIndex + 1,
          order: 0,
          width: 'full',
        });
      });
    }
  });

  return result;
}

/* ---------------- Lecture initiale (localStorage + migration) ---------------- */
function loadInitialSections(): SectionConfig[] {
  const keysToTry = [STORAGE_KEY_V2, ...LEGACY_KEYS];
  for (const key of keysToTry) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as unknown;
      const migrated = migrateSections(parsed);
      if (migrated && migrated.length) {
        return cleanupLayersPure(migrated);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[useCVSections] Échec lecture/migration localStorage:', e);
    }
  }
  return cleanupLayersPure(DEFAULT_SECTIONS);
}

/* ---------------- Hook public ---------------- */
export const useCVSections = () => {
  const [sections, setSections] = useState<SectionConfig[]>(() => loadInitialSections());

  /** Nettoyage public (à appeler après un vrai drag/drop uniquement) */
  const cleanupLayers = useCallback((arr: SectionConfig[]): SectionConfig[] => {
    return cleanupLayersPure(arr);
  }, []);

  /** Écrit tel quel (ne nettoie pas ici pour ne pas écraser un SWAP) */
  const setSectionsOrder = useCallback((newOrder: SectionConfig[]) => {
    setSections(newOrder);
    try {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(newOrder));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[useCVSections] Échec écriture localStorage:', e);
    }
  }, []);

  /** Reset complet */
  const resetSectionsOrder = useCallback(() => {
    const clean = cleanupLayersPure(DEFAULT_SECTIONS);
    setSections(clean);
    try {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(clean));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[useCVSections] Échec écriture localStorage (reset):', e);
    }
  }, []);

  /** Toggle visibilité (NE touche PAS aux layers/orders) */
  const toggleSectionVisibility = useCallback((sectionId: string) => {
    setSections((prev) => {
      const next = prev.map((s) =>
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      );
      try {
        localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(next));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[useCVSections] Échec écriture localStorage (toggle):', e);
      }
      return next;
    });
  }, []);

  return {
    sections,
    setSectionsOrder,
    cleanupLayers,
    resetSectionsOrder,
    toggleSectionVisibility,
  };
};
