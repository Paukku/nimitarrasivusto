import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useCart } from '../../hooks/useCart';
import { ColorPicker } from '../../components/ColorPicker/ColorPicker';
import { TextInput } from '../../components/TextInput/TextInput';
import { LabelPreview } from '../../components/LabelPreview/LabelPreview';
import { LABEL_COLORS } from '../../constants';
import './EditorPage.css';

export function EditorPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>(LABEL_COLORS[0].hex);
  const [text, setText] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleAddToCart = () => {
    // Validointi: teksti ei tyhjä
    if (text.trim() === '') {
      setError('Teksti ei voi olla tyhjä');
      return;
    }

    setError('');

    // Lisää koriin
    addItem({
      id: uuid(),
      color: selectedColor,
      text,
      quantity: 1,
    });

    // Näytä vahvistusviesti ja nollaa tila
    setMessage('Lisätty ostoskoriin!');
    setText('');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="editor-page">
      <header className="editor-header">
        <h1>Nimitarra – Luo omasi</h1>
      </header>

      <div className="editor-container">
        <div className="editor-controls">
          <div className="color-picker-section">
            <h2>Valitse väri</h2>
            <ColorPicker selectedColor={selectedColor} onChange={setSelectedColor} />
          </div>

          <div className="text-input-section">
            <h2>Kirjoita teksti</h2>
            <TextInput
              value={text}
              onChange={setText}
              error={error}
            />
          </div>

          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
            >
              Lisää koriin
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/cart')}
            >
              Siirry ostoskoriin
            </button>
          </div>

          {message && <div className="success-message">{message}</div>}
        </div>

        <div className="preview-section">
          <h2>Esikatselu</h2>
          <LabelPreview color={selectedColor} text={text || 'Esikatselu'} />
        </div>
      </div>
    </div>
  );
}
