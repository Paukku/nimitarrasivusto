import React from 'react';
import { LABEL_COLORS } from '../../constants';

type ColorPickerProps = {
  selectedColor: string;
  onChange: (hex: string) => void;
};

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onChange }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 10,
      }}
    >
      {LABEL_COLORS.map((color) => {
        const isSelected = color.hex.toLowerCase() === selectedColor.toLowerCase();
        return (
          <button
            key={color.hex}
            type="button"
            onClick={() => onChange(color.hex)}
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              borderRadius: 12,
              border: isSelected ? '3px solid #222' : '2px solid #ccc',
              backgroundColor: color.hex,
              cursor: 'pointer',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
            aria-label={color.name}
          />
        );
      })}
    </div>
  );
};
