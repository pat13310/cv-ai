import React from 'react';
import { StyleControls } from './StyleControls';
import {
  EditableField,
  EditableTextarea,
  SectionTitle,
  EditableListItem,
  EditableExperience,
  EditableLanguage
} from './EditableFields';
import { EditableEducationSingleColumn, EditableEducationTwoColumns } from './EditableEducation';

// Interfaces pour les données du CV
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

export interface CVContent {
  name: string;
  contact: string;
  profileTitle: string;
  profileContent: string;
  experienceTitle: string;
  educationTitle: string;
  skillsTitle: string;
  languagesTitle: string;
}

// Props du composant CVPreview
export interface CVPreviewProps {
  // Données du CV
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
  
  // État d'édition
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  
  // Styles (optionnels avec valeurs par défaut)
  customFont?: string;
  setCustomFont?: React.Dispatch<React.SetStateAction<string>>;
  customColor?: string;
  setCustomColor?: React.Dispatch<React.SetStateAction<string>>;
  titleColor?: string;
  setTitleColor?: React.Dispatch<React.SetStateAction<string>>;
  layoutColumns?: number;
  setLayoutColumns?: React.Dispatch<React.SetStateAction<number>>;
  availableFonts?: string[];
  availableColors?: Array<{ name: string; value: string; category: string }>;
  
  // Fonctions de gestion
  addExperience: () => void;
  removeExperience: (id: number) => void;
  addSkill: () => void;
  removeSkill: (id: number) => void;
  addLanguage: () => void;
  removeLanguage: (id: number) => void;
  addEducation: () => void;
  removeEducation: (id: number) => void;
  
  // IA
  generateWithAI: (field: string, currentContent?: string) => Promise<void>;
  isLoading: boolean;
  
  // Erreurs
  error: string | null;
  openAIError: string | null;
}

// Composant principal CVPreview
export const CVPreview: React.FC<CVPreviewProps> = ({
  editableContent,
  setEditableContent,
  experiences,
  setExperiences,
  skills,
  setSkills,
  languages,
  setLanguages,
  educations,
  setEducations,
  editingField,
  setEditingField,
  customFont = 'Calibri',
  setCustomFont,
  customColor = '000000', // Noir par défaut
  setCustomColor,
  titleColor = '000000', // Noir par défaut
  setTitleColor,
  layoutColumns = 1,
  setLayoutColumns,
  availableFonts = ['Calibri', 'Georgia', 'Helvetica', 'Consolas', 'Times New Roman', 'Arial'],
  availableColors = [
    { name: 'Noir', value: '000000', category: 'Neutres' },
    { name: 'Bleu marine', value: '2E3A59', category: 'Bleus' },
    { name: 'Bleu vif', value: '2563EB', category: 'Bleus' },
    { name: 'Gris foncé', value: '111827', category: 'Neutres' },
    { name: 'Vert foncé', value: '064E3B', category: 'Verts' },
    { name: 'Violet', value: '7C3AED', category: 'Violets' }
  ],
  addExperience,
  removeExperience,
  addSkill,
  removeSkill,
  addLanguage,
  removeLanguage,
  addEducation,
  removeEducation,
  generateWithAI,
  isLoading,
  error,
  openAIError
}) => {
  const [showError, setShowError] = React.useState(false);

  // Auto-hide error after 3 seconds
  React.useEffect(() => {
    if (error || openAIError) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [error, openAIError]);
  return (
    <div className="w-full" style={{ aspectRatio: '1 / 1.414' }}>
      <div className="border border-violet-500 rounded-lg p-4 bg-gray-50 h-full overflow-auto shadow-md" style={{
        fontFamily: customFont,
        boxSizing: 'border-box'
      }}>
        {setCustomFont && setCustomColor && setTitleColor && (
          <StyleControls
            customFont={customFont}
            setCustomFont={setCustomFont}
            customColor={customColor}
            setCustomColor={setCustomColor}
            titleColor={titleColor}
            setTitleColor={setTitleColor}
            layoutColumns={layoutColumns}
            setLayoutColumns={setLayoutColumns}
            availableFonts={availableFonts}
            availableColors={availableColors}
          />
        )}

        {/* Affichage des erreurs avec auto-hide */}
        {(error || openAIError) && showError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 pr-12 rounded relative mt-4 transition-opacity duration-300" role="alert">
            <strong className="font-bold">Erreur : </strong>
            <span className="block sm:inline">{error || openAIError}</span>
            <button
              onClick={() => setShowError(false)}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-red-700 hover:text-red-900 hover:bg-red-200 rounded-full text-lg font-bold transition-colors duration-200"
              aria-label="Fermer"
              title="Fermer le message"
            >
              ×
            </button>
          </div>
        )}

        {/* En-tête (nom et contact) - toujours en pleine largeur */}
        <div className="mt-4 text-center">
          <EditableField
            fieldKey="name"
            value={editableContent.name}
            editingField={editingField}
            setEditingField={setEditingField}
            onChange={(value) => setEditableContent(prev => ({ ...prev, name: value }))}
            isLoading={isLoading}
            generateWithAI={generateWithAI}
            color={titleColor}
            className="justify-center"
            inputClassName="text-lg font-bold w-full text-center"
          />
        </div>

        <div className="text-center">
          <EditableField
            fieldKey="contact"
            value={editableContent.contact}
            editingField={editingField}
            setEditingField={setEditingField}
            onChange={(value) => setEditableContent(prev => ({ ...prev, contact: value }))}
            isLoading={isLoading}
            generateWithAI={generateWithAI}
            color={customColor}
            className="justify-center"
            inputClassName="text-sm w-full text-center"
          />
        </div>

        {/* Contenu principal - mise en page conditionnelle */}
        <div className={layoutColumns === 2 ? "grid grid-cols-2 gap-6 mt-4" : "mt-4"}>
          {/* Colonne gauche ou contenu unique */}
          <div className={layoutColumns === 2 ? "" : ""}>
            {/* Profil professionnel */}
            <div className="mt-4">
              <SectionTitle
                fieldKey="profileTitle"
                value={editableContent.profileTitle}
                editingField={editingField}
                setEditingField={setEditingField}
                onChange={(value) => setEditableContent(prev => ({ ...prev, profileTitle: value }))}
                isLoading={isLoading}
                generateWithAI={generateWithAI}
                color={titleColor}
              />

              <EditableTextarea
                fieldKey="profileContent"
                value={editableContent.profileContent}
                editingField={editingField}
                setEditingField={setEditingField}
                onChange={(value) => setEditableContent(prev => ({ ...prev, profileContent: value }))}
                isLoading={isLoading}
                generateWithAI={generateWithAI}
                color={customColor}
                rows={3}
              />
            </div>

            {/* Expérience professionnelle */}
            <div className="mt-4">
              <SectionTitle
                fieldKey="experienceTitle"
                value={editableContent.experienceTitle}
                editingField={editingField}
                setEditingField={setEditingField}
                onChange={(value) => setEditableContent(prev => ({ ...prev, experienceTitle: value }))}
                isLoading={isLoading}
                generateWithAI={generateWithAI}
                color={titleColor}
                onAdd={addExperience}
                addTitle="Ajouter une expérience"
              />

              {experiences.map(exp => (
                <EditableExperience
                  key={exp.id}
                  id={exp.id}
                  content={exp.content}
                  details={exp.details}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  onContentChange={(value) => setExperiences(prev => prev.map(item => item.id === exp.id ? { ...item, content: value } : item))}
                  onDetailsChange={(value) => setExperiences(prev => prev.map(item => item.id === exp.id ? { ...item, details: value } : item))}
                  onRemove={() => removeExperience(exp.id)}
                  isLoading={isLoading}
                  generateWithAI={generateWithAI}
                  color={customColor}
                />
              ))}
            </div>

            {/* Formation - seulement en mode une colonne */}
            {layoutColumns === 1 && (
              <div className="mt-4">
                <SectionTitle
                  fieldKey="educationTitle"
                  value={editableContent.educationTitle}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  onChange={(value) => setEditableContent(prev => ({ ...prev, educationTitle: value }))}
                  isLoading={isLoading}
                  generateWithAI={generateWithAI}
                  color={titleColor}
                  onAdd={addEducation}
                  addTitle="Ajouter une formation"
                />

                {educations.map(edu => (
                  <EditableEducationSingleColumn
                    key={edu.id}
                    id={edu.id}
                    degree={edu.degree}
                    school={edu.school}
                    year={edu.year}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    onDegreeChange={(value) => setEducations(prev => prev.map(item => item.id === edu.id ? { ...item, degree: value } : item))}
                    onSchoolChange={(value) => setEducations(prev => prev.map(item => item.id === edu.id ? { ...item, school: value } : item))}
                    onYearChange={(value) => setEducations(prev => prev.map(item => item.id === edu.id ? { ...item, year: value } : item))}
                    onRemove={() => removeEducation(edu.id)}
                    isLoading={isLoading}
                    generateWithAI={generateWithAI}
                    color={customColor}
                  />
                ))}
              </div>
            )}

            {/* Compétences - seulement en mode une colonne */}
            {layoutColumns === 1 && (
              <div className="mt-4">
                <SectionTitle
                  fieldKey="skillsTitle"
                  value={editableContent.skillsTitle}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  onChange={(value) => setEditableContent(prev => ({ ...prev, skillsTitle: value }))}
                  isLoading={isLoading}
                  generateWithAI={generateWithAI}
                  color={titleColor}
                  onAdd={addSkill}
                  addTitle="Ajouter une compétence"
                />

                {skills.map(skill => (
                  <EditableListItem
                    key={skill.id}
                    id={skill.id}
                    value={skill.content}
                    fieldKey={`skillContent-${skill.id}`}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    onChange={(value) => setSkills(prev => prev.map(item => item.id === skill.id ? { ...item, content: value } : item))}
                    onRemove={() => removeSkill(skill.id)}
                    isLoading={isLoading}
                    generateWithAI={generateWithAI}
                    color={customColor}
                  />
                ))}
              </div>
            )}

            {/* Langues - seulement en mode une colonne */}
            {layoutColumns === 1 && (
              <div className="mt-4">
                <SectionTitle
                  fieldKey="languagesTitle"
                  value={editableContent.languagesTitle}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  onChange={(value) => setEditableContent(prev => ({ ...prev, languagesTitle: value }))}
                  isLoading={isLoading}
                  generateWithAI={generateWithAI}
                  color={titleColor}
                  onAdd={addLanguage}
                  addTitle="Ajouter une langue"
                />

                {/* Liste des langues */}
                <div className="mt-2">
                  {languages.map(lang => (
                    <EditableLanguage
                      key={lang.id}
                      id={lang.id}
                      name={lang.name}
                      level={lang.level}
                      editingField={editingField}
                      setEditingField={setEditingField}
                      onNameChange={(value) => setLanguages(prev => prev.map(item => item.id === lang.id ? { ...item, name: value } : item))}
                      onLevelChange={(value) => setLanguages(prev => prev.map(item => item.id === lang.id ? { ...item, level: value } : item))}
                      onRemove={() => removeLanguage(lang.id)}
                      isLoading={isLoading}
                      generateWithAI={generateWithAI}
                      color={customColor}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite - seulement en mode deux colonnes */}
          {layoutColumns === 2 && (
            <div>
              {/* Formation */}
              <div className="mt-4">
                <SectionTitle
                  fieldKey="educationTitle"
                  value={editableContent.educationTitle}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  onChange={(value) => setEditableContent(prev => ({ ...prev, educationTitle: value }))}
                  isLoading={isLoading}
                  generateWithAI={generateWithAI}
                  color={titleColor}
                  onAdd={addEducation}
                  addTitle="Ajouter une formation"
                />

                {educations.map(edu => (
                  <EditableEducationTwoColumns
                    key={edu.id}
                    id={edu.id}
                    degree={edu.degree}
                    school={edu.school}
                    year={edu.year}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    onDegreeChange={(value) => setEducations(prev => prev.map(item => item.id === edu.id ? { ...item, degree: value } : item))}
                    onSchoolChange={(value) => setEducations(prev => prev.map(item => item.id === edu.id ? { ...item, school: value } : item))}
                    onYearChange={(value) => setEducations(prev => prev.map(item => item.id === edu.id ? { ...item, year: value } : item))}
                    onRemove={() => removeEducation(edu.id)}
                    isLoading={isLoading}
                    generateWithAI={generateWithAI}
                    color={customColor}
                  />
                ))}
              </div>

              {/* Compétences */}
              <div className="mt-4">
                <SectionTitle
                  fieldKey="skillsTitle"
                  value={editableContent.skillsTitle}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  onChange={(value) => setEditableContent(prev => ({ ...prev, skillsTitle: value }))}
                  isLoading={isLoading}
                  generateWithAI={generateWithAI}
                  color={titleColor}
                  onAdd={addSkill}
                  addTitle="Ajouter une compétence"
                />

                {skills.map(skill => (
                  <EditableListItem
                    key={skill.id}
                    id={skill.id}
                    value={skill.content}
                    fieldKey={`skillContent-${skill.id}`}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    onChange={(value) => setSkills(prev => prev.map(item => item.id === skill.id ? { ...item, content: value } : item))}
                    onRemove={() => removeSkill(skill.id)}
                    isLoading={isLoading}
                    generateWithAI={generateWithAI}
                    color={customColor}
                  />
                ))}
              </div>

              {/* Langues */}
              <div className="mt-4">
                <SectionTitle
                  fieldKey="languagesTitle"
                  value={editableContent.languagesTitle}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  onChange={(value) => setEditableContent(prev => ({ ...prev, languagesTitle: value }))}
                  isLoading={isLoading}
                  generateWithAI={generateWithAI}
                  color={titleColor}
                  onAdd={addLanguage}
                  addTitle="Ajouter une langue"
                />

                {/* Liste des langues */}
                <div className="mt-2">
                  {languages.map(lang => (
                    <EditableLanguage
                      key={lang.id}
                      id={lang.id}
                      name={lang.name}
                      level={lang.level}
                      editingField={editingField}
                      setEditingField={setEditingField}
                      onNameChange={(value) => setLanguages(prev => prev.map(item => item.id === lang.id ? { ...item, name: value } : item))}
                      onLevelChange={(value) => setLanguages(prev => prev.map(item => item.id === lang.id ? { ...item, level: value } : item))}
                      onRemove={() => removeLanguage(lang.id)}
                      isLoading={isLoading}
                      generateWithAI={generateWithAI}
                      color={customColor}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};