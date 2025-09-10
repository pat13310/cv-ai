import React from 'react';
import { Sparkles, Plus, Minus } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';
import type { CVContent, CVExperience } from '../CVPreview';

interface ExperienceSectionProps {
  editableContent: CVContent;
  setEditableContent: React.Dispatch<React.SetStateAction<CVContent>>;
  experiences: CVExperience[];
  setExperiences: React.Dispatch<React.SetStateAction<CVExperience[]>>;
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  customColor: string;
  titleColor: string;
  addExperience: () => void;
  removeExperience: (id: number) => void;
  generateWithAI: (field: string, currentContent?: string) => Promise<void>;
  isLoading: boolean;
}

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

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  editableContent,
  setEditableContent,
  experiences,
  setExperiences,
  editingField,
  setEditingField,
  customColor,
  titleColor,
  addExperience,
  removeExperience,
  generateWithAI,
  isLoading
}) => {
  return (
    <SectionWrapper id="experience" title="Expérience Professionnelle">
      <div className="mt-4">
        {editingField === 'experienceTitle' ? (
          <input
            type="text"
            value={editableContent.experienceTitle}
            onChange={(e) => setEditableContent(prev => ({ ...prev, experienceTitle: e.target.value }))}
            onBlur={() => setEditingField(null)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
            className="text-md font-semibold w-full border-b border-gray-400 focus:outline-none focus:border-violet-500"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2">
            <h4
              className="text-md font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded whitespace-nowrap transition-all duration-200 hover:scale-105"
              onClick={() => setEditingField('experienceTitle')}
              style={{ color: `#${titleColor}` }}
            >
              {editableContent.experienceTitle}
            </h4>
            <div className="flex gap-1 ml-auto">
              <AIButton
                isLoading={isLoading}
                onClick={() => generateWithAI('experienceTitle', editableContent.experienceTitle)}
                title="Modifier avec IA"
              />
              <button
                onClick={addExperience}
                className="p-1 text-violet-600 hover:text-violet-800 transition-all duration-200 hover:scale-110"
                title="Ajouter une expérience"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {experiences.map(exp => (
          <div key={exp.id} className="relative group">
            <div className="absolute right-0 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <AIButton
                isLoading={isLoading}
                onClick={() => generateWithAI('experienceContent', exp.content)}
                title="Modifier avec IA"
              />
              <button
                onClick={() => removeExperience(exp.id)}
                className="p-1 text-red-600 hover:text-red-800"
                title="Supprimer l'expérience"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {editingField === `experienceContent-${exp.id}` ? (
              <input
                type="text"
                value={exp.content}
                onChange={(e) => setExperiences(prev => prev.map(item => item.id === exp.id ? { ...item, content: e.target.value } : item))}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                className="text-sm w-full border-b border-gray-400 focus:outline-none focus:border-violet-500 mt-2"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <p
                  className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 font-bold transition-all duration-200 hover:scale-105"
                  onClick={() => setEditingField(`experienceContent-${exp.id}`)}
                  style={{ color: `#${customColor}` }}
                >
                  {exp.content}
                </p>
              </div>
            )}

            {editingField === `experienceDetails-${exp.id}` ? (
              <textarea
                value={exp.details}
                onChange={(e) => setExperiences(prev => prev.map(item => item.id === exp.id ? { ...item, details: e.target.value } : item))}
                onBlur={() => setEditingField(null)}
                className="text-sm w-full border border-gray-400 focus:outline-none focus:border-violet-500 p-1 rounded mt-1"
                autoFocus
                rows={2}
              />
            ) : (
              <div className="flex items-start gap-2 mt-1">
                <p
                  className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 transition-all duration-200 hover:scale-105"
                  onClick={() => setEditingField(`experienceDetails-${exp.id}`)}
                  style={{ color: `#${customColor}` }}
                >
                  {exp.details}
                </p>
                <AIButton
                  isLoading={isLoading}
                  onClick={() => generateWithAI('experienceDetails', exp.details)}
                  title="Modifier avec IA"
                  className="mt-1"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};