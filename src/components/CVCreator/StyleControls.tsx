import React from 'react';
import { CustomSelect } from './CustomSelect';
import { Columns, RectangleVertical, AlignLeft, AlignCenter, AlignRight, Circle, Square } from 'lucide-react';

interface StyleControlsProps {
  customFont: string;
  setCustomFont: (font: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  titleColor: string;
  setTitleColor: (color: string) => void;
  layoutColumns?: number;
  setLayoutColumns?: (columns: number) => void;
  nameAlignment?: 'left' | 'center' | 'right';
  setNameAlignment?: (alignment: 'left' | 'center' | 'right') => void;
  photoAlignment?: 'left' | 'center' | 'right';
  setPhotoAlignment?: (alignment: 'left' | 'center' | 'right') => void;
  photoSize?: 'small' | 'medium' | 'large';
  setPhotoSize?: (size: 'small' | 'medium' | 'large') => void;
  photoShape?: 'circle' | 'square' | 'rounded';
  setPhotoShape?: (shape: 'circle' | 'square' | 'rounded') => void;
  availableFonts: string[];
  availableColors: Array<{ name: string; value: string; category: string }>;
  selectedSection?: string | null;
}


export const StyleControls: React.FC<StyleControlsProps> = ({
  customFont,
  setCustomFont,
  customColor,
  setCustomColor,
  titleColor,
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
  availableFonts,
  availableColors,
  selectedSection
}) => {
  const fontOptions = availableFonts.map(font => ({ value: font, label: font }));

  // Si la section photo est sélectionnée, afficher seulement les contrôles photo
  if (selectedSection === 'photo') {
    return (
      <div className="bg-violet-50 rounded-lg shadow-sm p-4 mb-4 -mt-2 -ml-2 -mr-2">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium mb-2">Forme photo</label>
            <div className="flex gap-1">
              <button
                onClick={() => setPhotoShape?.('circle')}
                className={`p-1 rounded transition-all duration-200 ${
                  photoShape === 'circle'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-violet-100'
                }`}
                title="Photo ronde"
              >
                <Circle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPhotoShape?.('square')}
                className={`p-1 rounded transition-all duration-200 ${
                  photoShape === 'square'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-violet-100'
                }`}
                title="Photo carrée"
              >
                <Square className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPhotoShape?.('rounded')}
                className={`p-1 rounded transition-all duration-200 ${
                  photoShape === 'rounded'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-violet-100'
                }`}
                title="Photo arrondie"
              >
                <div className="w-4 h-4 border border-current rounded" />
              </button>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium mb-2">Taille photo</label>
            <div className="flex gap-1">
              <button
                onClick={() => setPhotoSize?.('small')}
                className={`px-2 py-1 rounded text-xs transition-all duration-200 ${
                  photoSize === 'small'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-violet-100'
                }`}
                title="Petite photo"
              >
                S
              </button>
              <button
                onClick={() => setPhotoSize?.('medium')}
                className={`px-2 py-1 rounded text-xs transition-all duration-200 ${
                  photoSize === 'medium'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-violet-100'
                }`}
                title="Photo moyenne"
              >
                M
              </button>
              <button
                onClick={() => setPhotoSize?.('large')}
                className={`px-2 py-1 rounded text-xs transition-all duration-200 ${
                  photoSize === 'large'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-violet-100'
                }`}
                title="Grande photo"
              >
                L
              </button>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium mb-2">Alignement photo</label>
            <div className="flex gap-1">
              <button
                onClick={() => setPhotoAlignment?.('left')}
                className={`p-1 rounded transition-all duration-200 ${
                  photoAlignment === 'left'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-violet-100'
                }`}
                title="Photo à gauche"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPhotoAlignment?.('center')}
                className={`p-1 rounded transition-all duration-200 ${
                  photoAlignment === 'center'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-violet-100'
                }`}
                title="Photo centrée"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPhotoAlignment?.('right')}
                className={`p-1 rounded transition-all duration-200 ${
                  photoAlignment === 'right'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-violet-100'
                }`}
                title="Photo à droite"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Déterminer si on affiche l'alignement nom
  const showNameAlignment = selectedSection === 'name' || selectedSection === null;
  // Déterminer si on affiche la couleur texte (pas pour la section nom)
  const showTextColor = selectedSection !== 'name';

  // Pour toutes les autres sections, afficher les contrôles appropriés
  return (
    <div className="bg-violet-50 rounded-lg shadow-sm p-4 mb-4 -mt-2 -ml-2 -mr-2">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <label className="block text-sm font-medium mb-2">Police</label>
          <div className="w-[120px]">
            <CustomSelect
              value={customFont}
              onChange={setCustomFont}
              options={fontOptions}
            />
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <label className="block text-sm font-medium mb-2">Mise en page</label>
          <div className="flex items-center justify-start h-[32px]">
            <button
              onClick={() => setLayoutColumns?.(layoutColumns === 1 ? 2 : 1)}
              className="top-0 flex items-center justify-center w-10 h-[30px] rounded-md text-sm font-medium transition-all bg-violet-500 text-white shadow-md hover:bg-violet-600 hover:shadow-lg"
              title={layoutColumns === 1 ? "Passer à deux colonnes" : "Passer à une colonne"}
            >
              {layoutColumns === 1 ? (
                <Columns className="w-4 h-4" />
              ) : (
                <RectangleVertical className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        
        {showNameAlignment && (
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium mb-2">Alignement nom</label>
            <div className="flex gap-1">
              <button
                onClick={() => setNameAlignment?.('left')}
                className={`p-1 rounded transition-all duration-200 ${
                  nameAlignment === 'left'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-violet-100'
                }`}
                title="Aligner à gauche"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setNameAlignment?.('center')}
                className={`p-1 rounded transition-all duration-200 ${
                  nameAlignment === 'center'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-violet-100'
                }`}
                title="Centrer"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setNameAlignment?.('right')}
                className={`p-1 rounded transition-all duration-200 ${
                  nameAlignment === 'right'
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-violet-100'
                }`}
                title="Aligner à droite"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex-shrink-0">
          <label className="block text-sm font-medium mb-2">Couleur titres</label>
          <div className="flex gap-1">
            {availableColors.reduce((acc, color) => {
              if (!acc.find(c => c.category === color.category)) {
                acc.push(color);
              }
              return acc;
            }, [] as Array<{ name: string; value: string; category: string }>).map((color) => (
              <button
                key={color.category}
                onClick={() => setTitleColor(color.value)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  titleColor === color.value
                    ? 'border-violet-500 shadow-lg ring-2 ring-violet-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: `#${color.value}` }}
                title={color.name}
              />
            ))}
          </div>
        </div>
        
        {showTextColor && (
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium mb-2">Couleur texte</label>
            <div className="flex gap-1">
              {availableColors.reduce((acc, color) => {
                if (!acc.find(c => c.category === color.category)) {
                  acc.push(color);
                }
                return acc;
              }, [] as Array<{ name: string; value: string; category: string }>).map((color) => (
                <button
                  key={color.category}
                  onClick={() => setCustomColor(color.value)}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    customColor === color.value
                      ? 'border-violet-500 shadow-lg ring-2 ring-violet-200'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: `#${color.value}` }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
