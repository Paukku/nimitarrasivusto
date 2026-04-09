import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useCreateOrder } from '../../hooks/useOrders';
import { UNIT_PRICE } from '../../constants';
import './CheckoutPage.css';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { mutate: createOrder, isPending, error } = useCreateOrder();

  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    address?: string;
  }>({});

  const totalPrice = items.reduce((sum, item) => sum + item.quantity * UNIT_PRICE, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validointi
    const errors: typeof validationErrors = {};
    if (!name.trim()) {
      errors.name = 'Nimi on pakollinen';
    }
    if (!address.trim()) {
      errors.address = 'Osoite on pakollinen';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    // Luo tilaus
    createOrder(
      {
        items,
        customerInfo: {
          name: name.trim(),
          address: address.trim(),
        },
      },
      {
        onSuccess: (order) => {
          clearCart();
          navigate(`/confirmation/${order.id}`);
        },
      }
    );
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <header className="checkout-header">
          <h1>Kassalle</h1>
        </header>
        <div className="checkout-empty">
          <p>Ostoskori on tyhjä. Palaa muokkausnäkymään.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Takaisin muokkausnäkymään
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <h1>Kassalle</h1>
        <button className="btn-back" onClick={() => navigate('/cart')}>
          ← Takaisin ostoskoriin
        </button>
      </header>

      <div className="checkout-container">
        <div className="checkout-form-section">
          <h2>Toimitusosoite</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label htmlFor="name">Nimi *</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Etunimi Sukunimi"
                disabled={isPending}
              />
              {validationErrors.name && (
                <span className="error-message">{validationErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="address">Osoite *</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Katuosoite, postinumero, postitoimipaikka"
                rows={3}
                disabled={isPending}
              />
              {validationErrors.address && (
                <span className="error-message">{validationErrors.address}</span>
              )}
            </div>

            {error && (
              <div className="error-container">
                <p className="error-message">
                  {error instanceof Error ? error.message : 'Virhe tilauksen luomisessa'}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? 'Lähetetään...' : 'Vahvista tilaus'}
            </button>
          </form>
        </div>

        <div className="checkout-summary">
          <h2>Tilausyhteenveto</h2>
          <div className="summary-items">
            {items.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="item-info">
                  <div
                    className="item-color-swatch"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="item-details">
                    <div className="item-text">{item.text}</div>
                    <div className="item-batch">{item.quantity} × 120 kpl</div>
                  </div>
                </div>
                <div className="item-price">
                  {(item.quantity * UNIT_PRICE).toFixed(2)}€
                </div>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <strong>Yhteensä: {totalPrice.toFixed(2)}€</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
