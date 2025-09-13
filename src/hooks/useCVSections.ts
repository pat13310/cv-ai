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
  { id: 'profile', name: 'Profil Professionnel', component: 'ProfileSection', visible: true },
  { id: 'contact', name: 'Contact', component: 'ContactSection', visible: true },
  { id: 'experience', name: 'Expérience Professionnelle', component: 'ExperienceSection', visible: true },
  { id: 'education', name: 'Formation', component: 'EducationSection', visible: true },
  { id: 'skills', name: 'Compétences', component: 'SkillsSection', visible: true },
  { id: 'languages', name: 'Langues', component: 'LanguagesSection', visible: true }
];

export const useCVSections = () => {
  const [sections, setSections] = useState<SectionConfig[]>(() => {
    // Essayer de récupérer l'ordre depuis localStorage
    const savedOrder = localStorage.getItem('cvSectionsOrder');
    if (savedOrder) {
      try {
        return JSON.parse(savedOrder);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'ordre des sections:', error);
      }
    }
    return DEFAULT_SECTIONS;
  });

  const reorderSections = useCallback((activeId: string, overId: string) => {
    setSections((sections) => {
      const oldIndex = sections.findIndex((section) => section.id === activeId);
      const newIndex = sections.findIndex((section) => section.id === overId);
      
      if (oldIndex === -1 || newIndex === -1) return sections;

      const newSections = [...sections];
      const [movedSection] = newSections.splice(oldIndex, 1);
      newSections.splice(newIndex, 0, movedSection);

      // Sauvegarder dans localStorage
      localStorage.setItem('cvSectionsOrder', JSON.stringify(newSections));
      
      return newSections;
    });
  }, []);

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