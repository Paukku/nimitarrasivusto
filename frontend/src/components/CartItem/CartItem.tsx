import React from 'react';
import { CartItem as CartItemType } from '../../types';
import { LabelPreview } from '../LabelPreview/LabelPreview';

type CartItemProps = {
  item: CartItemType;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
};

export const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onQuantityChange }) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const handleQuantityInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    if (!Number.isNaN(nextValue) && nextValue >= 1) {
      onQuantityChange(item.id, nextValue);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        padding: 16,
        border: '1px solid #e0e0e0',
        borderRadius: 12,
        backgroundColor: '#fff',
      }}
    >
      <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
        <LabelPreview color={item.color} text={item.text} />
      </div>
      <div style={{ flex: 1, display: 'grid', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{item.text || 'Tyhjä teksti'}</div>
            <div style={{ color: '#555', fontSize: 14 }}>{item.color}</div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            style={{
              border: '1px solid #d00',
              background: '#fff',
              color: '#d00',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
            }}
          >
            Poista
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ color: '#333', fontSize: 14 }}>{`Määrä: ${item.quantity} × 120 kpl`}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid #ccc',
                background: '#f7f7f7',
                cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={handleQuantityInput}
              style={{
                width: 64,
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #ccc',
                textAlign: 'center',
              }}
            />
            <button
              type="button"
              onClick={handleIncrease}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid #ccc',
                background: '#f7f7f7',
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
