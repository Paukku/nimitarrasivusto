import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrder } from '../../hooks/useOrders';
import { UNITS_PER_BATCH } from '../../constants';
import './ConfirmationPage.css';

export function ConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useGetOrder(orderId);

  if (isLoading) {
    return (
      <div className="confirmation-page">
        <div className="spinner-container">
          <div className="spinner" />
          <p>Ladataan tilauksen tietoja...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="confirmation-page">
        <header className="confirmation-header">
          <h1>Virhe</h1>
        </header>
        <div className="error-container">
          <p>
            {error instanceof Error ? error.message : 'Tilauksen hausta tapahtui virhe'}
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Takaisin muokkausnäkymään
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="confirmation-page">
        <header className="confirmation-header">
          <h1>Virhe</h1>
        </header>
        <div className="error-container">
          <p>Tilausta ei löytynyt</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Takaisin muokkausnäkymään
          </button>
        </div>
      </div>
    );
  }

  const createdDate = new Date(order.createdAt);
  const formattedDate = createdDate.toLocaleDateString('fi-FI', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="confirmation-page">
      <header className="confirmation-header">
        <h1>Kiitos tilauksestasi!</h1>
      </header>

      <div className="confirmation-container">
        <div className="confirmation-content">
          <div className="success-icon">✓</div>

          <h2>Tilaus vahvistettu</h2>
          <p className="confirmation-message">
            Tilauksesi on vastaanotettu ja käsitellään.
          </p>

          <div className="order-details">
            <div className="detail-row">
              <span className="detail-label">Tilausnumero:</span>
              <span className="detail-value">{order.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Tilausaika:</span>
              <span className="detail-value">{formattedDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value">{order.status}</span>
            </div>
          </div>

          <div className="order-items-section">
            <h3>Tilauksen tuotteet</h3>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <div
                      className="item-color-swatch"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="item-details">
                      <div className="item-text">{item.text}</div>
                      <div className="item-batch">
                        {item.quantity} × {UNITS_PER_BATCH} kpl = {item.quantity * UNITS_PER_BATCH} kpl
                      </div>
                      <div className="item-color">Väri: {item.color}</div>
                    </div>
                  </div>
                  <div className="item-price">
                    {(item.quantity * item.unitPrice).toFixed(2)}€
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Yhteensä:</span>
              <strong>{order.totalPrice.toFixed(2)}€</strong>
            </div>
          </div>

          <div className="customer-info-section">
            <h3>Toimitusosoite</h3>
            <div className="customer-info">
              <p>{order.customerInfo.name}</p>
              <p>{order.customerInfo.address}</p>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Luo uusi tilaus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
