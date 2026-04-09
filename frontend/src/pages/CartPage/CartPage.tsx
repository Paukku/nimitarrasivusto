import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { CartItem as CartItemComponent } from '../../components/CartItem/CartItem';
import { UNIT_PRICE } from '../../constants';
import './CartPage.css';

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity } = useCart();

  const totalPrice = items.reduce((sum, item) => sum + item.quantity * UNIT_PRICE, 0);

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <header className="cart-header">
          <h1>Ostoskori</h1>
        </header>
        <div className="cart-empty">
          <p>Ostoskori on tyhjä</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Takaisin muokkausnäkymään
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h1>Ostoskori</h1>
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Takaisin
        </button>
      </header>

      <div className="cart-container">
        <div className="cart-items">
          <h2>Tuotteet ({items.length})</h2>
          <div className="items-list">
            {items.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onRemove={removeItem}
                onQuantityChange={updateQuantity}
              />
            ))}
          </div>
        </div>

        <div className="cart-summary">
          <h2>Yhteenveto</h2>
          <div className="summary-items">
            {items.map((item) => (
              <div key={item.id} className="summary-item">
                <span className="item-text">{item.text}</span>
                <span className="item-price">
                  {item.quantity} × {UNIT_PRICE.toFixed(2)}€ = {(item.quantity * UNIT_PRICE).toFixed(2)}€
                </span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <strong>Yhteensä: {totalPrice.toFixed(2)}€</strong>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/checkout')}>
            Tilaa
          </button>
        </div>
      </div>
    </div>
  );
}
