import React from 'react';
import { Sparkles, Plus, Minus } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';
import type { CVContent, CVSkill } from '../CVPreview';

interface SkillsSectionProps {
  editableContent: CVContent;
  setEditableContent: React.Dispatch<React.SetStateAction<CVContent>>;
  skills: CVSkill[];
  setSkills: React.Dispatch<React.SetStateAction<CVSkill[]>>;
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  customColor: string;
  titleColor: string;
  addSkill: () => void;
  removeSkill: (id: number) => void;
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

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  editableContent,
  setEditableContent,
  skills,
  setSkills,
  editingField,
  setEditingField,
  customColor,
  titleColor,
  addSkill,
  removeSkill,
  generateWithAI,
  isLoading
}) => {
  return (
    <SectionWrapper id="skills" title="Compétences">
      <div className="mt-4">
        {editingField === 'skillsTitle' ? (
          <input
            type="text"
            value={editableContent.skillsTitle}
            onChange={(e) => setEditableContent(prev => ({ ...prev, skillsTitle: e.target.value }))}
            onBlur={() => setEditingField(null)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
            className="text-md font-semibold w-full border-b border-gray-400 focus:outline-none focus:border-violet-500"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2">
            <h4
              className="text-md font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded transition-all duration-200 hover:scale-105"
              onClick={() => setEditingField('skillsTitle')}
              style={{ color: `#${titleColor}` }}
            >
              {editableContent.skillsTitle}
            </h4>
            <div className="flex gap-1 ml-auto">
              <AIButton
                isLoading={isLoading}
                onClick={() => generateWithAI('skillsTitle', editableContent.skillsTitle)}
                title="Modifier avec IA"
              />
              <button
                onClick={addSkill}
                className="p-1 text-violet-600 hover:text-violet-800 transition-all duration-200 hover:scale-110"
                title="Ajouter une compétence"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {skills.map(skill => (
          <div key={skill.id} className="relative group flex items-start gap-2 mt-1">
            <div className="absolute right-0 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <AIButton
                isLoading={isLoading}
                onClick={() => generateWithAI('skillContent', skill.content)}
                title="Modifier avec IA"
              />
              <button
                onClick={() => removeSkill(skill.id)}
                className="p-1 text-red-600 hover:text-red-800"
                title="Supprimer la compétence"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {editingField === `skillContent-${skill.id}` ? (
              <input
                type="text"
                value={skill.content}
                onChange={(e) => setSkills(prev => prev.map(item => item.id === skill.id ? { ...item, content: e.target.value } : item))}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                className="text-sm w-full border-b border-gray-400 focus:outline-none focus:border-violet-500"
                autoFocus
              />
            ) : (
              <p
                className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 transition-all duration-200 hover:scale-105"
                onClick={() => setEditingField(`skillContent-${skill.id}`)}
                style={{ color: `#${customColor}` }}
              >
                {skill.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};