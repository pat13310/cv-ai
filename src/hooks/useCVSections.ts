import { useState, useCallback } from 'react';

export interface SectionConfig {
  id: string;
  name: string;
  component: string;
  visible: boolean;
  layer?: number;
  width?: 'full' | 'half';
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'name', name: 'Nom', component: 'NameSection', visible: true, layer: 1, width: 'full' },
  { id: 'profile', name: 'Profil Professionnel', component: 'ProfileSection', visible: true, layer: 2, width: 'full' },
  { id: 'contact', name: 'Contact', component: 'ContactSection', visible: true, layer: 3, width: 'half' },
  { id: 'experience', name: 'Expérience Professionnelle', component: 'ExperienceSection', visible: true, layer: 3, width: 'half' },
  { id: 'education', name: 'Formation', component: 'EducationSection', visible: true, layer: 4, width: 'half' },
  { id: 'skills', name: 'Compétences', component: 'SkillsSection', visible: true, layer: 4, width: 'half' },
  { id: 'languages', name: 'Langues', component: 'LanguagesSection', visible: true, layer: 5, width: 'full' }
];

export const useCVSections = () => {
  const [sections, setSections] = useState<SectionConfig[]>(() => {
    // Essayer de récupérer l'ordre depuis localStorage
    const savedOrder = localStorage.getItem('cvSectionsOrder');
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        // Vérifier si la section nom existe, sinon forcer la réinitialisation
        const hasNameSection = parsed.some((section: SectionConfig) => section.id === 'name');
        if (hasNameSection) {
          return parsed;
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'ordre des sections:', error);
      }
    }
    // Forcer la sauvegarde des nouvelles sections par défaut
    localStorage.setItem('cvSectionsOrder', JSON.stringify(DEFAULT_SECTIONS));
    return DEFAULT_SECTIONS;
  });

  const reorderSections = useCallback((activeId: string, overId: string) => {
    setSections((sections) => {
      const oldIndex = sections.findIndex((section) => section.id === activeId);
      const newIndex = sections.findIndex((section) => section.id === overId);
      
      if (oldIndex === -1 || newIndex === -1) return sections;

      const newSections = [...sections];
      const [movedSection] = newSections.splice(oldIndex, 1);
      
      // Déterminer le layer de destination
      const targetSection = newSections[newIndex];
      const targetLayer = targetSection?.layer || 1;
      
      // Assigner le nouveau layer à la section déplacée
      movedSection.layer = targetLayer;
      
      newSections.splice(newIndex, 0, movedSection);

      // Nettoyer les layers vides et réorganiser
      const cleanedSections = cleanupLayers(newSections);

      // Sauvegarder dans localStorage
      localStorage.setItem('cvSectionsOrder', JSON.stringify(cleanedSections));
      
      return cleanedSections;
    });
  }, []);

  // Fonction pour nettoyer les layers vides et réorganiser
  const cleanupLayers = (sections: SectionConfig[]): SectionConfig[] => {
    // Grouper par layer
    const layerGroups = new Map<number, SectionConfig[]>();
    
    sections.forEach(section => {
      const layer = section.layer || 1;
      if (!layerGroups.has(layer)) {
        layerGroups.set(layer, []);
      }
      layerGroups.get(layer)!.push(section);
    });

    // Réorganiser les layers pour éliminer les trous
    const sortedLayers = Array.from(layerGroups.keys()).sort((a, b) => a - b);
    const newSections: SectionConfig[] = [];
    
    sortedLayers.forEach((oldLayer, index) => {
      const newLayer = index + 1;
      const sectionsInLayer = layerGroups.get(oldLayer)!;
      
      // Limiter à 2 sections par layer maximum
      const limitedSections = sectionsInLayer.slice(0, 2);
      
      limitedSections.forEach(section => {
        newSections.push({
          ...section,
          layer: newLayer
        });
      });
      
      // Si il y a plus de 2 sections, créer de nouveaux layers
      if (sectionsInLayer.length > 2) {
        sectionsInLayer.slice(2).forEach((section, extraIndex) => {
          newSections.push({
            ...section,
            layer: sortedLayers.length + extraIndex + 1
          });
        });
      }
    });

    return newSections;
  };

  const resetSectionsOrder = useCallback(() => {
    setSections(DEFAULT_SECTIONS);
    localStorage.removeItem('cvSectionsOrder');
  }, []);

  const toggleSectionVisibility = useCallback((sectionId: string) => {
    setSections((sections) => {
      const newSections = sections.map((section) =>
        section.id === sectionId
          ? { ...section, visible: !section.visible }
          : section
      );
      localStorage.setItem('cvSectionsOrder', JSON.stringify(newSections));
      return newSections;
    });
  }, []);

  const setSectionsOrder = useCallback((newOrder: SectionConfig[]) => {
    setSections(newOrder);
    localStorage.setItem('cvSectionsOrder', JSON.stringify(newOrder));
  }, []);

  return {
    sections,
    reorderSections,
    resetSectionsOrder,
    toggleSectionVisibility,
    setSectionsOrder
  };
};