import { useState, useEffect } from 'react';
import { cardApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function Cards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function fetchData() {
    setLoading(true);
    setError('');
    cardApi.getCards()
      .then(d => setCards(d.cards))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData(); }, []);

  async function handleFreeze(id) {
    try {
      await cardApi.toggleFreeze(id);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  }

  const maskedNumber = (n) => {
    const parts = n.match(/.{4}/g);
    return parts ? parts.join(' ') : n;
  };

  if (loading) return <div className="page-loading"><LoadingSpinner size={60} /></div>;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="page cards-page">
      <div className="page-header"><h1>My Cards</h1></div>

      {cards.length === 0 ? (
        <EmptyState title="No cards" message="You don't have any cards yet." icon="💳" />
      ) : (
        <div className="cards-grid">
          {cards.map(card => (
            <div key={card.id} className={`card-item ${card.isFrozen ? 'frozen' : ''} ${!card.isActive ? 'inactive' : ''}`}>
              <div className="card-bg" style={{ backgroundColor: card.color }}>
                <div className="card-type">{card.network} {card.type.charAt(0).toUpperCase() + card.type.slice(1)}</div>
                <div className="card-number">{maskedNumber(card.number)}</div>
                <div className="card-holder">{card.holderName}</div>
                <div className="card-expiry">Expires {card.expiryDate}</div>
                {card.isFrozen && <div className="card-frozen-badge">Frozen</div>}
                {!card.isActive && <div className="card-frozen-badge inactive-badge">Inactive</div>}
              </div>
              <div className="card-actions-row">
                {card.type === 'credit' && (
                  <div className="card-balance-info">
                    <span>Used: ${card.outstandingBalance?.toFixed(2)}</span>
                    <span>Limit: ${card.creditLimit?.toFixed(2)}</span>
                  </div>
                )}
                {card.type === 'debit' && (
                  <div className="card-balance-info">
                    <span>Daily limit: ${card.spendingLimit?.toFixed(2)}</span>
                  </div>
                )}
                <button
                  className={`btn btn-sm ${card.isFrozen ? 'btn-warning' : 'btn-outline'}`}
                  onClick={() => handleFreeze(card.id)}
                  disabled={!card.isActive}
                >
                  {card.isFrozen ? 'Unfreeze' : 'Freeze'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
