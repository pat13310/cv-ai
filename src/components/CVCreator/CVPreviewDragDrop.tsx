import React from 'react';
import { StyleControls } from './StyleControls';
import { DraggableSections } from './DraggableSections';
import type { CVPreviewProps } from './types';


export const CVPreviewDragDrop: React.FC<CVPreviewProps> = ({
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
  customColor = '000000',
  setCustomColor,
  titleColor = '000000',
  setTitleColor,
  layoutColumns = 1,
  setLayoutColumns,
  nameAlignment = 'center',
  setNameAlignment,
  photoAlignment = 'center',
  setPhotoAlignment,
  photoSize = 'medium',
  setPhotoSize,
  photoShape = 'circle',
  setPhotoShape,
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
            nameAlignment={nameAlignment}
            setNameAlignment={setNameAlignment}
            photoAlignment={photoAlignment}
            setPhotoAlignment={setPhotoAlignment}
            photoSize={photoSize}
            setPhotoSize={setPhotoSize}
            photoShape={photoShape}
            setPhotoShape={setPhotoShape}
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


        {/* Sections déplaçables */}
        <DraggableSections
          editableContent={editableContent}
          setEditableContent={setEditableContent}
          experiences={experiences}
          setExperiences={setExperiences}
          skills={skills}
          setSkills={setSkills}
          languages={languages}
          setLanguages={setLanguages}
          educations={educations}
          setEducations={setEducations}
          editingField={editingField}
          setEditingField={setEditingField}
          customColor={customColor}
          titleColor={titleColor}
          addExperience={addExperience}
          removeExperience={removeExperience}
          addSkill={addSkill}
          removeSkill={removeSkill}
          addLanguage={addLanguage}
          removeLanguage={removeLanguage}
          addEducation={addEducation}
          removeEducation={removeEducation}
          generateWithAI={generateWithAI}
          isLoading={isLoading}
          nameAlignment={nameAlignment}
          photoAlignment={photoAlignment}
          photoSize={photoSize}
          photoShape={photoShape}
        />
      </div>
    </div>
  );
};
