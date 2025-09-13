import React from 'react';
import { Sparkles } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';
import type { CVContent } from '../types';

interface NameSectionProps {
  editableContent: CVContent;
  setEditableContent: React.Dispatch<React.SetStateAction<CVContent>>;
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  customColor: string;
  titleColor: string;
  generateWithAI: (field: string, content?: string) => Promise<void>;
  isLoading: boolean;
  nameAlignment: 'left' | 'center' | 'right';
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

export const NameSection: React.FC<NameSectionProps> = ({
  editableContent,
  setEditableContent,
  editingField,
  setEditingField,
  titleColor,
  generateWithAI,
  isLoading,
  nameAlignment
}) => {
  return (
    <SectionWrapper id="name" title="Nom">
      <div className={`mt-4 ${nameAlignment === 'left' ? 'text-left' : nameAlignment === 'right' ? 'text-right' : 'text-center'}`}>
        {editingField === 'name' ? (
          <input
            type="text"
            value={editableContent.name}
            onChange={(e) => setEditableContent(prev => ({ ...prev, name: e.target.value }))}
            onBlur={() => setEditingField(null)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
            className={`text-lg font-bold w-full border-b border-gray-400 focus:outline-none focus:border-violet-500 bg-transparent ${nameAlignment === 'left' ? 'text-left' : nameAlignment === 'right' ? 'text-right' : 'text-center'}`}
            autoFocus
          />
        ) : (
          <div className={`group flex items-center gap-2 relative ${nameAlignment === 'left' ? 'justify-start' : nameAlignment === 'right' ? 'justify-end' : 'justify-center'}`}>
            <h3
              className="text-lg font-bold cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors duration-200"
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
    </SectionWrapper>
  );
};