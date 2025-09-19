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
  nameFontSize = 18,
  setNameFontSize,
  // Nouveaux props pour les ajustements d'image
  photoZoom = 100,
  setPhotoZoom,
  photoPositionX = 0,
  setPhotoPositionX,
  photoPositionY = 0,
  setPhotoPositionY,
  photoRotation = 0,
  setPhotoRotation,
  photoObjectFit = 'contain',
  setPhotoObjectFit,
  selectedSection,
  setSelectedSection,
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
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-lg">
        {/* Dégradés décoratifs discrets autour du CV */}
        <div className="absolute -inset-4 bg-gradient-to-br from-gray-100 via-slate-50 to-gray-100 rounded-2xl opacity-40 blur-sm"></div>
        <div className="absolute -inset-2 bg-gradient-to-tr from-violet-50 via-gray-50 to-violet-50 rounded-xl opacity-30 blur-xs"></div>
        
        {/* CV au format A4 */}
        <div className="relative border border-violet-500 rounded-lg bg-white shadow-xl flex flex-col" style={{
          fontFamily: customFont,
          boxSizing: 'border-box',
          minHeight: 'fit-content'
        }}>

          {/* Zone de contenu CV sans scroll */}
          <div className="flex-1 p-4 overflow-visible">
            {/* Affichage des erreurs avec auto-hide */}
            {(error || openAIError) && showError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 pr-12 rounded relative mb-4 transition-opacity duration-300" role="alert">
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
              nameFontSize={nameFontSize}
              // Props pour les ajustements d'image
              photoZoom={photoZoom}
              photoPositionX={photoPositionX}
              photoPositionY={photoPositionY}
              photoRotation={photoRotation}
              photoObjectFit={photoObjectFit}
              setSelectedSection={setSelectedSection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
