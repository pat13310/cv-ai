import React from 'react';

// Types pour le contenu du CV
export interface CVContent {
  name: string;
  contact: string;
  contactTitle: string;
  profileTitle: string;
  profileContent: string;
  experienceTitle: string;
  educationTitle: string;
  skillsTitle: string;
  languagesTitle: string;
}

export interface CVExperience {
  id: number;
  content: string;
  details: string;
}

export interface CVSkill {
  id: number;
  content: string;
}

export interface CVLanguage {
  id: number;
  name: string;
  level: string;
}

export interface CVEducation {
  id: number;
  degree: string;
  school: string;
  year: string;
}

// Interface pour les sections
export interface SectionConfig {
  id: string;
  name: string;
  component: string;
  visible: boolean;
  layer?: number;
  width?: 'full' | 'half';
}

// Interface pour les props du composant CVPreview
export interface CVPreviewProps {
  editableContent: CVContent;
  setEditableContent: React.Dispatch<React.SetStateAction<CVContent>>;
  experiences: CVExperience[];
  setExperiences: React.Dispatch<React.SetStateAction<CVExperience[]>>;
  skills: CVSkill[];
  setSkills: React.Dispatch<React.SetStateAction<CVSkill[]>>;
  languages: CVLanguage[];
  setLanguages: React.Dispatch<React.SetStateAction<CVLanguage[]>>;
  educations: CVEducation[];
  setEducations: React.Dispatch<React.SetStateAction<CVEducation[]>>;
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  customFont?: string;
  setCustomFont?: React.Dispatch<React.SetStateAction<string>>;
  customColor?: string;
  setCustomColor?: React.Dispatch<React.SetStateAction<string>>;
  titleColor?: string;
  setTitleColor?: React.Dispatch<React.SetStateAction<string>>;
  layoutColumns?: number;
  setLayoutColumns?: React.Dispatch<React.SetStateAction<number>>;
  nameAlignment?: 'left' | 'center' | 'right';
  setNameAlignment?: React.Dispatch<React.SetStateAction<'left' | 'center' | 'right'>>;
  availableFonts?: string[];
  availableColors?: Array<{
    name: string;
    value: string;
    category: string;
  }>;
  addExperience: () => void;
  removeExperience: (id: number) => void;
  addSkill: () => void;
  removeSkill: (id: number) => void;
  addLanguage: () => void;
  removeLanguage: (id: number) => void;
  addEducation: () => void;
  removeEducation: (id: number) => void;
  generateWithAI: (field: string, currentContent?: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  openAIError?: string | null;
  setSectionsOrder?: (sections: SectionConfig[]) => void;
  templateName?: string;
}