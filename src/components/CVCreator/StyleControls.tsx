import React from 'react';
import { CustomSelect } from './CustomSelect';

interface StyleControlsProps {
  customFont: string;
  setCustomFont: (font: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  titleColor: string;
  setTitleColor: (color: string) => void;
  availableFonts: string[];
  availableColors: Array<{ name: string; value: string }>;
}

export const StyleControls: React.FC<StyleControlsProps> = ({
  customFont,
  setCustomFont,
  customColor,
  setCustomColor,
  titleColor,
  setTitleColor,
  availableFonts,
  availableColors
}) => {
  const fontOptions = availableFonts.map(font => ({ value: font, label: font }));
  const colorOptions = availableColors.map(color => ({ value: color.value, label: color.name }));

  return (
    <div className="bg-violet-50 rounded-lg shadow-sm p-4 mb-4 -mt-2 -ml-2 -mr-2">
      <div className="flex gap-6 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">Police</label>
          <CustomSelect
            value={customFont}
            onChange={setCustomFont}
            options={fontOptions}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Couleur titres</label>
          <CustomSelect
            value={titleColor}
            onChange={setTitleColor}
            options={colorOptions}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Couleur texte</label>
          <CustomSelect
            value={customColor}
            onChange={setCustomColor}
            options={colorOptions}
          />
        </div>

      </div>
    </div>
  );
};