import React from 'react';
import { Sparkles } from 'lucide-react';
import type { CVContent } from '../types';

interface ProfileSectionProps {
  editableContent: CVContent;
  setEditableContent: React.Dispatch<React.SetStateAction<CVContent>>;
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  customColor: string;
  titleColor: string;
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

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  editableContent,
  setEditableContent,
  editingField,
  setEditingField,
  customColor,
  titleColor,
  generateWithAI,
  isLoading
}) => {
  return (
    <div className="mt-4">
      {editingField === 'profileTitle' ? (
        <input
          type="text"
          value={editableContent.profileTitle}
          onChange={(e) => setEditableContent(prev => ({ ...prev, profileTitle: e.target.value }))}
          onBlur={() => setEditingField(null)}
          onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
          className="text-md font-semibold border-b border-gray-400 focus:outline-none focus:border-violet-500 bg-transparent"
          style={{ width: `${Math.max(editableContent.profileTitle.length * 8 + 20, 200)}px` }}
          autoFocus
        />
      ) : (
        <div className="group flex items-center gap-2">
          <h4
            className="text-md font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors duration-200"
            onClick={() => setEditingField('profileTitle')}
            style={{ color: `#${titleColor}` }}
          >
            {editableContent.profileTitle}
          </h4>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <AIButton
              isLoading={isLoading}
              onClick={() => generateWithAI('profileTitle', editableContent.profileTitle)}
              title="Modifier avec IA"
            />
          </div>
        </div>
      )}

      {editingField === 'profileContent' ? (
        <textarea
          value={editableContent.profileContent}
          onChange={(e) => setEditableContent(prev => ({ ...prev, profileContent: e.target.value }))}
          onBlur={() => setEditingField(null)}
          className="text-sm w-full border border-gray-400 focus:outline-none focus:border-violet-500 p-1 rounded"
          autoFocus
          rows={3}
        />
      ) : (
        <div className="group flex items-start gap-2 relative">
          <p
            className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 transition-colors duration-200 line-clamp-3"
            onClick={() => setEditingField('profileContent')}
            style={{ color: `#${customColor}` }}
          >
            {editableContent.profileContent}
          </p>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
            <AIButton
              isLoading={isLoading}
              onClick={() => generateWithAI('profileContent', editableContent.profileContent)}
              title="Modifier avec IA"
              className="mt-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};
