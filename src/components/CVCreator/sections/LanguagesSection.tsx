import React from 'react';
import { Sparkles, Plus, Minus } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';
import type { CVContent, CVLanguage } from '../CVPreview';

interface LanguagesSectionProps {
  editableContent: CVContent;
  setEditableContent: React.Dispatch<React.SetStateAction<CVContent>>;
  languages: CVLanguage[];
  setLanguages: React.Dispatch<React.SetStateAction<CVLanguage[]>>;
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  customColor: string;
  titleColor: string;
  addLanguage: () => void;
  removeLanguage: (id: number) => void;
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

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  editableContent,
  setEditableContent,
  languages,
  setLanguages,
  editingField,
  setEditingField,
  customColor,
  titleColor,
  addLanguage,
  removeLanguage,
  generateWithAI,
  isLoading
}) => {
  return (
    <SectionWrapper id="languages" title="Langues">
      <div className="mt-4">
        {editingField === 'languagesTitle' ? (
          <input
            type="text"
            value={editableContent.languagesTitle}
            onChange={(e) => setEditableContent(prev => ({ ...prev, languagesTitle: e.target.value }))}
            onBlur={() => setEditingField(null)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
            className="text-md font-semibold w-full border-b border-gray-400 focus:outline-none focus:border-violet-500"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2">
            <h4
              className="text-md font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded"
              onClick={() => setEditingField('languagesTitle')}
              style={{ color: `#${titleColor}` }}
            >
              {editableContent.languagesTitle}
            </h4>
            <div className="flex gap-1 ml-auto">
              <AIButton
                isLoading={isLoading}
                onClick={() => generateWithAI('languagesTitle', editableContent.languagesTitle)}
                title="Modifier avec IA"
              />
              <button
                onClick={addLanguage}
                className="p-1 text-violet-600 hover:text-violet-800"
                title="Ajouter une langue"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Liste des langues */}
        <div className="mt-2">
          {languages.map(lang => (
            <div key={lang.id} className="relative group flex items-center gap-2 mt-1">
              <div className="absolute right-0 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <AIButton
                  isLoading={isLoading}
                  onClick={() => generateWithAI(`languageLevel-${lang.id}`, lang.level)}
                  title="Générer le niveau avec IA"
                />
                <button
                  onClick={() => removeLanguage(lang.id)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Supprimer la langue"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              {editingField === `languageName-${lang.id}` ? (
                <input
                  type="text"
                  value={lang.name}
                  onChange={(e) => setLanguages(prev => prev.map(item => item.id === lang.id ? { ...item, name: e.target.value } : item))}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                  className="text-sm w-1/2 border-b border-gray-400 focus:outline-none focus:border-violet-500"
                  autoFocus
                />
              ) : (
                <p
                  className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 transition-all duration-200 hover:scale-105"
                  onClick={() => setEditingField(`languageName-${lang.id}`)}
                  style={{ color: `#${customColor}` }}
                >
                  {lang.name}
                </p>
              )}

              {editingField === `languageLevel-${lang.id}` ? (
                <input
                  type="text"
                  value={lang.level}
                  onChange={(e) => setLanguages(prev => prev.map(item => item.id === lang.id ? { ...item, level: e.target.value } : item))}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                  className="text-sm w-1/2 border-b border-gray-400 focus:outline-none focus:border-violet-500"
                  autoFocus
                />
              ) : (
                <p
                  className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 transition-all duration-200 hover:scale-105"
                  onClick={() => setEditingField(`languageLevel-${lang.id}`)}
                  style={{ color: `#${customColor}` }}
                >
                  ({lang.level})
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};