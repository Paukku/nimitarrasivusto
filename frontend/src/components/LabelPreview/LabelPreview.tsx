import React from 'react';

type LabelPreviewProps = {
  color: string;
  text: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const calcFontSize = (text: string, width: number) => {
  if (!text) {
    return 32;
  }

  const base = Math.max(1, text.length);
  const size = Math.floor((width / base) * 0.9);
  return clamp(size, 10, 32);
};

export const getContrastColor = (hex: string) => {
  const normalized = hex.replace('#', '');
  const parsed = /^([0-9A-F]{6})$/i.exec(normalized);
  if (!parsed) {
    return '#000';
  }

  const intValue = parseInt(parsed[1], 16);
  const r = (intValue >> 16) & 255;
  const g = (intValue >> 8) & 255;
  const b = intValue & 255;

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#000' : '#fff';
};

export const LabelPreview: React.FC<LabelPreviewProps> = ({ color, text }) => {
  const fontSize = calcFontSize(text, 231);
  const contrastColor = getContrastColor(color);

  return (
    <div
      style={{
        width: 231,
        height: 100,
        borderRadius: 8,
        overflow: 'hidden',
        padding: '0 12px',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          color: contrastColor,
          fontSize,
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {text || ' '} 
      </span>
    </div>
  );
};
