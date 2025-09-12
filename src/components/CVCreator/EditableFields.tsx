"use client";
import React from "react";
import { Plus, Minus, Sparkles, Loader2 } from "lucide-react";

/*************************
 *  Bouton IA minimal
 *************************/
interface AIButtonProps {
  isLoading: boolean;
  onClick: (e: React.MouseEvent) => void;
  title?: string;
}
const AIButton: React.FC<AIButtonProps> = ({ isLoading, onClick, title }) => (
  <button
    type="button"
    className="bg-violet-50 border border-violet-200 text-violet-700 rounded-lg px-2 py-1 inline-flex items-center gap-1 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-violet-400"
    onClick={onClick}
    title={title}
    disabled={isLoading}
  >
    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
  </button>
);

/*************************
 *  Types et composants éditables
 *************************/
// Props communes pour les champs éditables
interface BaseEditableProps {
  fieldKey: string;
  value: string;
  editingField: string | null;
  setEditingField: (field: string | null) => void;
  isLoading: boolean;
  generateWithAI: (field: string, currentContent?: string) => Promise<void>;
  color: string;
}

// Composant pour champ de texte simple
interface EditableFieldProps extends BaseEditableProps {
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  fieldKey,
  value,
  editingField,
  setEditingField,
  onChange,
  isLoading,
  generateWithAI,
  color,
  placeholder,
  className = "",
  inputClassName = "",
}) => {
  const isEditing = React.useMemo(() => editingField === fieldKey, [editingField, fieldKey]);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = React.useCallback(() => setEditingField(fieldKey), [setEditingField, fieldKey]);

  const handleBlur = (e: React.FocusEvent) => {
    // Ne fermer que si le focus ne va pas vers les boutons IA ou les contrôles de style
    if (
      !e.relatedTarget ||
      (!e.currentTarget.contains(e.relatedTarget as Node) && !(e.relatedTarget as Element)?.closest(".bg-violet-50"))
    ) {
      setEditingField(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") setEditingField(null);
  };

  return (
    <div className={`relative ${className}`}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`border-b border-gray-400 focus:outline-none focus:border-violet-500 w-full ${inputClassName}`}
            placeholder={placeholder}
            autoFocus
          />
          {/* Bouton IA affiché uniquement en édition */}
          <div className="absolute right-0 top-0 flex gap-1">
            <AIButton
              isLoading={isLoading}
              onClick={(e) => {
                e?.preventDefault();
                e?.stopPropagation();
                generateWithAI(fieldKey, value);
              }}
              title="Modifier avec IA"
            />
          </div>
        </>
      ) : (
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span
            className="editable-field cursor-pointer hover:bg-gray-100 p-1 rounded transition-all duration-200 hover:scale-105 block"
            onClick={handleClick}
            style={{
              color: `#${color}`,
            }}
          >
            {value}
          </span>
          {/* Bouton IA affiché au hover */}
          {isHovered && (
            <div className="absolute right-0 top-0 flex gap-1 opacity-0 hover:opacity-100 transition-opacity duration-200" style={{ opacity: isHovered ? 1 : 0 }}>
              <AIButton
                isLoading={isLoading}
                onClick={(e) => {
                  e?.preventDefault();
                  e?.stopPropagation();
                  generateWithAI(fieldKey, value);
                }}
                title="Modifier avec IA"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Composant pour champ de texte multi-lignes
interface EditableTextareaProps extends BaseEditableProps {
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
}

export const EditableTextarea: React.FC<EditableTextareaProps> = ({
  fieldKey,
  value,
  editingField,
  setEditingField,
  onChange,
  isLoading,
  generateWithAI,
  color,
  rows = 3,
  className = "",
}) => {
  const isEditing = React.useMemo(() => editingField === fieldKey, [editingField, fieldKey]);
  const [hasFocus, setHasFocus] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setEditingField(fieldKey);
  }, [setEditingField, fieldKey]);

  const handleFocus = () => {
    setHasFocus(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    setHasFocus(false);
    // Ne fermer que si le focus ne va pas vers le bouton IA ou les contrôles de style
    if (
      !e.relatedTarget ||
      (!e.currentTarget.contains(e.relatedTarget as Node) && !(e.relatedTarget as Element)?.closest(".bg-violet-50"))
    ) {
      setEditingField(null);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isEditing ? (
        <div className="flex items-start gap-2">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex-1 border border-gray-400 focus:outline-none focus:border-violet-500 p-1 rounded resize-none"
            autoFocus
            rows={rows}
          />
          {/* Bouton IA visible uniquement au focus */}
          {(hasFocus || isLoading) && (
            <div className="transition-opacity duration-200">
              <AIButton
                isLoading={isLoading}
                onClick={(e) => {
                  e?.preventDefault();
                  e?.stopPropagation();
                  generateWithAI(fieldKey, value);
                }}
                title="Modifier avec IA"
              />
            </div>
          )}
        </div>
      ) : (
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <p
            className="editable-field cursor-pointer hover:bg-gray-100 p-1 rounded line-clamp-3"
            onClick={handleClick}
            style={{
              color: `#${color}`,
            }}
          >
            {value}
          </p>
          {/* Bouton IA affiché au hover */}
          {isHovered && (
            <div className="absolute right-0 top-0 flex gap-1 opacity-0 hover:opacity-100 transition-opacity duration-200" style={{ opacity: isHovered ? 1 : 0 }}>
              <AIButton
                isLoading={isLoading}
                onClick={(e) => {
                  e?.preventDefault();
                  e?.stopPropagation();
                  generateWithAI(fieldKey, value);
                }}
                title="Modifier avec IA"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Composant pour titre de section
interface SectionTitleProps extends BaseEditableProps {
  onChange: (value: string) => void;
  onAdd?: () => void;
  addTitle?: string;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  fieldKey,
  value,
  editingField,
  setEditingField,
  onChange,
  isLoading,
  generateWithAI,
  color,
  onAdd,
  addTitle,
  className = "",
}) => {
  const isEditing = React.useMemo(() => editingField === fieldKey, [editingField, fieldKey]);
  const [showButtons, setShowButtons] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setEditingField(fieldKey);
  }, [setEditingField, fieldKey]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setEditingField(null);
    }
  };

  const handleMouseEnter = () => {
    setShowButtons(true);
  };

  const handleMouseLeave = () => {
    setShowButtons(false);
  };

  return (
    <div className={`relative ${className}`}>
      {isEditing ? (
        <div className="flex items-center gap-2 w-full">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-md font-semibold w-full border-b border-gray-400 focus:outline-none focus:border-violet-500"
            autoFocus
          />

          {/* Bouton IA toujours visible en mode édition */}
          <AIButton
            isLoading={isLoading}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              generateWithAI(fieldKey, value);
            }}
            title="Modifier avec IA"
          />

          {onAdd && (
            <button
              onClick={onAdd}
              className="p-1 text-violet-600 hover:text-violet-800 transition-transform duration-200 hover:scale-110"
              title={addTitle}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          className="flex items-center gap-2"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <h4
            className="editable-title text-md font-semibold cursor-pointer p-1 rounded whitespace-nowrap"
            onClick={handleClick}
            style={{
              color: `#${color}`,
            }}
          >
            {value}
          </h4>

          {/* Boutons affichés seulement si showButtons est true */}
          {showButtons && (
            <div className="flex gap-1">
              <AIButton
                isLoading={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  generateWithAI(fieldKey, value);
                }}
                title="Modifier avec IA"
              />
              {onAdd && (
                <button
                  onClick={onAdd}
                  className="p-1 text-violet-600 hover:text-violet-800 transition-transform duration-200 hover:scale-110"
                  title={addTitle}
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Composant pour élément de liste simple (compétences)
interface EditableListItemProps {
  id: number;
  value: string;
  fieldKey: string;
  editingField: string | null;
  setEditingField: (field: string | null) => void;
  onChange: (value: string) => void;
  onRemove: () => void;
  isLoading: boolean;
  generateWithAI: (field: string, currentContent?: string) => Promise<void>;
  color: string;
  className?: string;
}

export const EditableListItem: React.FC<EditableListItemProps> = ({
  value,
  fieldKey,
  editingField,
  setEditingField,
  onChange,
  onRemove,
  isLoading,
  generateWithAI,
  color,
  className = "",
}) => {
  const isEditing = React.useMemo(() => editingField === fieldKey, [editingField, fieldKey]);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setEditingField(fieldKey);
  }, [setEditingField, fieldKey]);

  const handleBlur = (e: React.FocusEvent) => {
    // Ne fermer que si le focus ne va pas vers les boutons IA ou les contrôles de style
    if (
      !e.relatedTarget ||
      (!e.currentTarget.contains(e.relatedTarget as Node) && !(e.relatedTarget as Element)?.closest(".bg-violet-50"))
    ) {
      setEditingField(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditingField(null);
    }
  };

  return (
    <div className={`relative mt-1 ${className}`}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="text-sm w-full border-b border-gray-400 focus:outline-none focus:border-violet-500"
            autoFocus
          />
          <div className="absolute right-0 top-0 flex gap-1">
            <AIButton
              isLoading={isLoading}
              onClick={(e) => {
                e?.preventDefault();
                e?.stopPropagation();
                generateWithAI("skillContent", value);
              }}
              title="Modifier avec IA"
            />
            <button onClick={onRemove} className="p-1 text-red-600 hover:text-red-800" title="Supprimer">
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <p
            className="editable-field text-sm cursor-pointer hover:bg-gray-100 p-1 rounded transition-all duration-200 hover:scale-105"
            onClick={handleClick}
            style={{
              color: `#${color}`,
            }}
          >
            {value}
          </p>
          {/* Boutons IA et supprimer affichés au hover */}
          {isHovered && (
            <div className="absolute right-0 top-0 flex gap-1 opacity-0 hover:opacity-100 transition-opacity duration-200" style={{ opacity: isHovered ? 1 : 0 }}>
              <AIButton
                isLoading={isLoading}
                onClick={(e) => {
                  e?.preventDefault();
                  e?.stopPropagation();
                  generateWithAI("skillContent", value);
                }}
                title="Modifier avec IA"
              />
              <button onClick={onRemove} className="p-1 text-red-600 hover:text-red-800" title="Supprimer">
                <Minus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Composant pour expérience (titre + détails)
interface EditableExperienceProps {
  id: number;
  content: string;
  details: string;
  editingField: string | null;
  setEditingField: (field: string | null) => void;
  onContentChange: (value: string) => void;
  onDetailsChange: (value: string) => void;
  onRemove: () => void;
  isLoading: boolean;
  generateWithAI: (field: string, currentContent?: string) => Promise<void>;
  color: string;
}

export const EditableExperience: React.FC<EditableExperienceProps> = ({
  id,
  content,
  details,
  editingField,
  setEditingField,
  onContentChange,
  onDetailsChange,
  onRemove,
  isLoading,
  generateWithAI,
  color,
}) => {
  return (
    <div className="relative">
      {/* Bouton supprimer visible seulement pendant l'édition */}
      {(editingField === `experienceContent-${id}` || editingField === `experienceDetails-${id}`) && (
        <div className="absolute right-0 top-0 flex gap-1">
          <button onClick={onRemove} className="p-1 text-red-600 hover:text-red-800" title="Supprimer l'expérience">
            <Minus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Titre de l'expérience */}
      <EditableField
        fieldKey={`experienceContent-${id}`}
        value={content}
        editingField={editingField}
        setEditingField={setEditingField}
        onChange={onContentChange}
        isLoading={isLoading}
        generateWithAI={generateWithAI}
        color={color}
        className="mt-2"
        inputClassName="text-sm font-bold"
      />

      {/* Détails de l'expérience */}
      <EditableTextarea
        fieldKey={`experienceDetails-${id}`}
        value={details}
        editingField={editingField}
        setEditingField={setEditingField}
        onChange={onDetailsChange}
        isLoading={isLoading}
        generateWithAI={generateWithAI}
        color={color}
        rows={2}
        className="mt-1"
      />
    </div>
  );
};

// Composant pour langue (nom + niveau)
interface EditableLanguageProps {
  id: number;
  name: string;
  level: string;
  editingField: string | null;
  setEditingField: (field: string | null) => void;
  onNameChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onRemove: () => void;
  isLoading: boolean;
  generateWithAI: (field: string, currentContent?: string) => Promise<void>;
  color: string;
}

export const EditableLanguage: React.FC<EditableLanguageProps> = ({
  id,
  name,
  level,
  editingField,
  setEditingField,
  onNameChange,
  onLevelChange,
  onRemove,
  isLoading,
  generateWithAI,
  color,
}) => {
  const isEditingName = React.useMemo(() => editingField === `languageName-${id}`, [editingField, id]);
  const isEditingLevel = React.useMemo(() => editingField === `languageLevel-${id}`, [editingField, id]);

  const handleNameClick = React.useCallback(() => {
    setEditingField(`languageName-${id}`);
  }, [setEditingField, id]);

  const handleLevelClick = React.useCallback(() => {
    setEditingField(`languageLevel-${id}`);
  }, [setEditingField, id]);

  const handleBlur = (e: React.FocusEvent) => {
    // Ne fermer que si le focus ne va pas vers les boutons IA ou les contrôles de style
    if (
      !e.relatedTarget ||
      (!e.currentTarget.contains(e.relatedTarget as Node) && !(e.relatedTarget as Element)?.closest(".bg-violet-50"))
    ) {
      setEditingField(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditingField(null);
    }
  };

  return (
    <div className="relative flex items-center gap-2 mt-1">
      {/* Boutons à droite pendant l'édition */}
      {(isEditingName || isEditingLevel) && (
        <div className="absolute right-0 top-0 flex gap-1">
          {isEditingLevel && (
            <AIButton
              isLoading={isLoading}
              onClick={(e) => {
                e?.preventDefault();
                e?.stopPropagation();
                generateWithAI(`languageLevel-${id}`, level);
              }}
              title="Générer le niveau avec IA"
            />
          )}
          <button onClick={onRemove} className="p-1 text-red-600 hover:text-red-800" title="Supprimer la langue">
            <Minus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Nom de la langue */}
      {isEditingName ? (
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-sm w-1/2 border-b border-gray-400 focus:outline-none focus:border-violet-500"
          autoFocus
        />
      ) : (
        <p
          className="editable-field text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 transition-all duration-200 hover:scale-105"
          onClick={handleNameClick}
          style={{
            color: `#${color}`,
          }}
        >
          {name}
        </p>
      )}

      {/* Niveau de la langue */}
      {isEditingLevel ? (
        <input
          type="text"
          value={level}
          onChange={(e) => onLevelChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-sm w-1/2 border-b border-gray-400 focus:outline-none focus:border-violet-500"
          autoFocus
        />
      ) : (
        <p
          className="editable-field text-sm cursor-pointer hover:bg-gray-100 p-1 rounded transition-all duration-200 hover:scale-105"
          onClick={handleLevelClick}
          style={{
            color: `#${color}`,
          }}
        >
          ({level})
        </p>
      )}
    </div>
  );
};