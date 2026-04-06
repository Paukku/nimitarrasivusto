import React from 'react';
import { MAX_TEXT_LENGTH } from '../../constants';

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export const TextInput: React.FC<TextInputProps> = ({ value, onChange, error }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value.slice(0, MAX_TEXT_LENGTH);
    onChange(nextValue);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        maxLength={MAX_TEXT_LENGTH}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 8,
          border: '1px solid #ccc',
          fontSize: 16,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 14 }}>
        <span style={{ color: '#666' }}>{`${value.length}/${MAX_TEXT_LENGTH}`}</span>
        {error ? <span style={{ color: '#d10000' }}>{error}</span> : null}
      </div>
    </div>
  );
};
