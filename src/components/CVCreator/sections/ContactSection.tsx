import React from 'react';
import { Sparkles } from 'lucide-react';
import type { CVContent } from '../types';

interface ContactSectionProps {
  editableContent: CVContent;
  setEditableContent: React.Dispatch<React.SetStateAction<CVContent>>;
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  customColor: string;
  titleColor: string;
  generateWithAI: (field: string, content?: string) => Promise<void>;
  isLoading: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  editableContent,
  setEditableContent,
  editingField,
  setEditingField,
  customColor,
  titleColor,
  generateWithAI,
  isLoading,
}) => {
  return (
    <div className="mt-0">
      <div className="group flex items-center gap-2">
        <input
          type="text"
          value={editableContent.contactTitle}
          onChange={(e) => setEditableContent(prev => ({ ...prev, contactTitle: e.target.value }))}
          placeholder="Nom de la section (ex: Contact)"
          className="text-md font-semibold border-b border-transparent hover:border-gray-300 focus:border-violet-500 focus:outline-none bg-transparent transition-colors duration-200 flex-1"
          style={{ 
            color: `#${titleColor}`,
            width: `${Math.max(editableContent.contactTitle.length * 8 + 20, 200)}px` 
          }}
        />
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => generateWithAI('contactTitle', editableContent.contactTitle)}
            disabled={isLoading}
            className="p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50"
            title="Modifier avec IA"
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
        </div>
      </div>

      {editingField === 'contact' ? (
        <textarea
          value={editableContent.contact}
          onChange={(e) => setEditableContent(prev => ({ ...prev, contact: e.target.value }))}
          onBlur={() => setEditingField(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              setEditingField(null);
            }
          }}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-violet-500 resize-none"
          rows={3}
          autoFocus
        />
      ) : (
        <div className="group relative">
          <div
            className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors duration-200 whitespace-pre-wrap"
            onClick={() => setEditingField('contact')}
            style={{ color: `#${customColor}` }}
          >
            {editableContent.contact || 'Cliquez pour ajouter vos informations de contact'}
          </div>
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => generateWithAI('contact', editableContent.contact)}
              disabled={isLoading}
              className="p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50"
              title="Améliorer avec IA"
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
          </div>
        </div>
      )}
    </div>
  );
};
