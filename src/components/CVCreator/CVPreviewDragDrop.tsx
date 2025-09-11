import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Sparkles, RotateCcw } from 'lucide-react';
import { StyleControls } from './StyleControls';
import { useCVSections } from '../../hooks/useCVSections';
import {
  ProfileSection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
} from './sections';
import type { CVPreviewProps } from './CVPreview';

// Composant de bouton IA pour les sections fixes
const AIButton: React.FC<{
  isLoading: boolean;
  onClick: () => void;
  title: string;
  className?: string;
}> = ({ isLoading, onClick, title, className = "" }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50 ${className}`}
    title={title}
  >
    {isLoading ? (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    ) : (
      <Sparkles className="w-4 h-4" />
    )}
  </button>
);

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
  availableFonts = ['Calibri', 'Georgia', 'Helvetica', 'Consolas', 'Times New Roman', 'Arial'],
  availableColors = [
    { name: 'Noir', value: '000000' },
    { name: 'Bleu marine', value: '2E3A59' },
    { name: 'Bleu vif', value: '2563EB' },
    { name: 'Gris foncé', value: '111827' },
    { name: 'Vert foncé', value: '064E3B' },
    { name: 'Violet', value: '7C3AED' }
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
  const { sections, reorderSections, resetSectionsOrder } = useCVSections();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderSections(active.id as string, over.id as string);
    }
  };

  // Props communes pour toutes les sections
  const commonSectionProps = {
    editableContent,
    setEditableContent,
    editingField,
    setEditingField,
    customColor,
    titleColor,
    generateWithAI,
    isLoading,
  };

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
            availableFonts={availableFonts}
            availableColors={availableColors}
          />
        )}

        {/* Bouton de réinitialisation de l'ordre */}
        <div className="flex justify-end mb-2">
          <button
            onClick={resetSectionsOrder}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-all duration-200"
            title="Réinitialiser l'ordre des sections"
          >
            <RotateCcw className="w-3 h-3" />
            Réinitialiser l'ordre
          </button>
        </div>

        {/* Affichage des erreurs */}
        {(error || openAIError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
            <strong className="font-bold">Erreur : </strong>
            <span className="block sm:inline">{error || openAIError}</span>
          </div>
        )}

        {/* Sections fixes : Nom et Contact */}
        <div className="mt-4 text-center">
          {editingField === 'name' ? (
            <input
              type="text"
              value={editableContent.name}
              onChange={(e) => setEditableContent(prev => ({ ...prev, name: e.target.value }))}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              className="text-lg font-bold w-full text-center border-b border-gray-400 focus:outline-none focus:border-violet-500"
              autoFocus
            />
          ) : (
            <div className="group flex items-center justify-center gap-2 relative">
              <h3
                className="text-lg font-bold cursor-pointer hover:bg-gray-100 p-1 rounded transition-all duration-200 hover:scale-105"
                onClick={() => setEditingField('name')}
                style={{ color: `#${titleColor}` }}
              >
                {editableContent.name}
              </h3>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <AIButton
                  isLoading={isLoading}
                  onClick={() => generateWithAI('name', editableContent.name)}
                  title="Modifier avec IA"
                />
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          {editingField === 'contact' ? (
            <input
              type="text"
              value={editableContent.contact}
              onChange={(e) => setEditableContent(prev => ({ ...prev, contact: e.target.value }))}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              className="text-sm w-full text-center border-b border-gray-400 focus:outline-none focus:border-violet-500"
              autoFocus
            />
          ) : (
            <div className="group flex items-center justify-center gap-2 relative">
              <p
                className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded transition-all duration-200 hover:scale-105"
                onClick={() => setEditingField('contact')}
                style={{ color: `#${customColor}` }}
              >
                {editableContent.contact}
              </p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <AIButton
                  isLoading={isLoading}
                  onClick={() => generateWithAI('contact', editableContent.contact)}
                  title="Modifier avec IA"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sections déplaçables */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.filter(s => s.visible).map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections
              .filter(section => section.visible)
              .map(section => {
                switch (section.id) {
                  case 'profile':
                    return (
                      <ProfileSection
                        key={section.id}
                        {...commonSectionProps}
                      />
                    );
                  case 'experience':
                    return (
                      <ExperienceSection
                        key={section.id}
                        {...commonSectionProps}
                        experiences={experiences}
                        setExperiences={setExperiences}
                        addExperience={addExperience}
                        removeExperience={removeExperience}
                      />
                    );
                  case 'education':
                    return (
                      <EducationSection
                        key={section.id}
                        {...commonSectionProps}
                        educations={educations}
                        setEducations={setEducations}
                        addEducation={addEducation}
                        removeEducation={removeEducation}
                      />
                    );
                  case 'skills':
                    return (
                      <SkillsSection
                        key={section.id}
                        {...commonSectionProps}
                        skills={skills}
                        setSkills={setSkills}
                        addSkill={addSkill}
                        removeSkill={removeSkill}
                      />
                    );
                  case 'languages':
                    return (
                      <LanguagesSection
                        key={section.id}
                        {...commonSectionProps}
                        languages={languages}
                        setLanguages={setLanguages}
                        addLanguage={addLanguage}
                        removeLanguage={removeLanguage}
                      />
                    );
                  default:
                    return null;
                }
              })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};