import React, { useState } from 'react';
import { CustomSelect } from './CustomSelect';
import { Columns, RectangleVertical } from 'lucide-react';

interface StyleControlsProps {
  customFont: string;
  setCustomFont: (font: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  titleColor: string;
  setTitleColor: (color: string) => void;
  layoutColumns?: number;
  setLayoutColumns?: (columns: number) => void;
  availableFonts: string[];
  availableColors: Array<{ name: string; value: string; category: string }>;
}

// Composant pour sélecteur de couleur visuel avec expansion
const ColorPicker: React.FC<{
  value: string;
  onChange: (color: string) => void;
  colors: Array<{ name: string; value: string; category: string }>;
  label: string;
}> = ({ value, onChange, colors, label }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Grouper les couleurs par catégorie
  const colorsByCategory = colors.reduce((acc, color) => {
    if (!acc[color.category]) {
      acc[color.category] = [];
    }
    acc[color.category].push(color);
    return acc;
  }, {} as Record<string, Array<{ name: string; value: string; category: string }>>);

  // Obtenir la couleur principale (première) de chaque catégorie
  const mainColors = Object.entries(colorsByCategory).map(([category, categoryColors]) => ({
    category,
    mainColor: categoryColors[0], // Première couleur = couleur principale
    allColors: categoryColors
  }));

  const handleMainColorClick = (category: string, mainColor: { name: string; value: string; category: string }) => {
    if (expandedCategory === category) {
      // Si déjà étendu, sélectionner la couleur principale et fermer
      onChange(mainColor.value);
      setExpandedCategory(null);
    } else {
      // Étendre pour montrer les déclinaisons
      setExpandedCategory(category);
    }
  };

  return (
    <div className="flex-1 relative">
      <label className="block text-sm font-medium mb-2">{label}</label>
      
      {/* Couleurs principales - tiles plus petits sur une seule ligne */}
      <div className="flex gap-1">
        {mainColors.map(({ category, mainColor }) => (
          <button
            key={category}
            onClick={() => handleMainColorClick(category, mainColor)}
            className={`w-5 h-5 rounded-2xl border-1 transition-all duration-200 ring-2 hover:ring-violet-200 hover:shadow-xs ${
              value === mainColor.value
                ? 'border-violet-500 shadow-lg ring-2 ring-violet-500 '
                : 'border-gray-300 hover:border-gray-400'
            }`}
            style={{ backgroundColor: `#${mainColor.value}` }}
            title={`${mainColor.name} - Cliquer pour voir les déclinaisons`}
            aria-label={`Sélectionner ${mainColor.name} ou voir les déclinaisons`}
          />
        ))}
      </div>

      {/* Palette de déclinaisons - positionnée en dehors du cadre */}
      {expandedCategory && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-lg z-50 min-w-max">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-gray-600">
              Déclinaisons {expandedCategory.toLowerCase()}
            </div>
            <button
              onClick={() => setExpandedCategory(null)}
              className="text-xs text-gray-400 hover:text-gray-600 ml-3"
              title="Fermer"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-2">
            {colorsByCategory[expandedCategory].map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  onChange(color.value);
                  setExpandedCategory(null);
                }}
                className={`w-8 h-8 rounded-md border-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${
                  value === color.value
                    ? 'border-violet-500 shadow-lg ring-2 ring-violet-200 scale-105'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: `#${color.value}` }}
                title={color.name}
                aria-label={`Sélectionner la couleur ${color.name}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const StyleControls: React.FC<StyleControlsProps> = ({
  customFont,
  setCustomFont,
  customColor,
  setCustomColor,
  titleColor,
  setTitleColor,
  layoutColumns = 1,
  setLayoutColumns,
  availableFonts,
  availableColors
}) => {
  const fontOptions = availableFonts.map(font => ({ value: font, label: font }));

  return (
    <div className="bg-violet-50 rounded-lg shadow-sm p-4 mb-4 -mt-2 -ml-2 -mr-2">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium mb-2">Police</label>
          <CustomSelect
            value={customFont}
            onChange={setCustomFont}
            options={fontOptions}
          />
        </div>
        
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium mb-2">Mise en page</label>
          <button
            onClick={() => setLayoutColumns?.(layoutColumns === 1 ? 2 : 1)}
            className="flex items-center justify-center w-12 h-8 rounded-md text-sm font-medium transition-all bg-violet-500 text-white shadow-md hover:bg-violet-600 hover:shadow-lg"
            title={layoutColumns === 1 ? "Passer à deux colonnes" : "Passer à une colonne"}
          >
            {layoutColumns === 1 ? (
              <Columns className="w-5 h-4" />
            ) : (
              <RectangleVertical className="w-5 h-4" />
            )}
          </button>
        </div>
        
        <ColorPicker
          value={titleColor}
          onChange={setTitleColor}
          colors={availableColors}
          label="Couleur titres"
        />
        
        <ColorPicker
          value={customColor}
          onChange={setCustomColor}
          colors={availableColors}
          label="Couleur texte"
        />
      </div>
    </div>
  );
};