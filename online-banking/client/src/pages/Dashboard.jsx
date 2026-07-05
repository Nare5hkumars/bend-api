import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { accountApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function fetchData() {
    setLoading(true);
    setError('');
    accountApi.getDashboard()
      .then(d => setData(d))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="page-loading"><LoadingSpinner size={60} /></div>;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;
  if (!data) return null;

  const formatCurrency = (n) => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className="page dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="balance-card">
        <div className="balance-label">Total Balance</div>
        <div className="balance-amount">{formatCurrency(data.totalBalance)}</div>
        <div className="balance-accounts">{data.accounts.length} accounts</div>
      </div>

      <div className="accounts-grid">
        {data.accounts.map(account => (
          <div key={account.id} className={`account-card ${account.type === 'Credit Card' ? 'credit' : ''}`}>
            <div className="account-type">{account.type}</div>
            <div className="account-number">{account.number}</div>
            <div className={`account-balance ${account.balance < 0 ? 'negative' : ''}`}>
              {formatCurrency(account.balance)}
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Recent Transactions</h2>
          <Link to="/transactions" className="btn btn-outline btn-sm">View All</Link>
        </div>
        <div className="transactions-list">
          {data.recentTransactions.length === 0 ? (
            <div className="empty-state">No recent transactions</div>
          ) : (
            data.recentTransactions.map(tx => (
              <div key={tx.id} className="transaction-item">
                <div className="tx-icon">{tx.type === 'credit' ? '📈' : '📉'}</div>
                <div className="tx-info">
                  <div className="tx-description">{tx.description}</div>
                  <div className="tx-date">{new Date(tx.date).toLocaleDateString()} · {tx.category}</div>
                </div>
                <div className={`tx-amount ${tx.type === 'credit' ? 'credit' : 'debit'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Spending by Category</h2>
          <Link to="/insights" className="btn btn-outline btn-sm">Details</Link>
        </div>
        <div className="category-bars">
          {data.spendingByCategory?.map(cat => (
            <div key={cat.name} className="category-bar-item">
              <div className="category-bar-label">
                <span>{cat.name}</span>
                <span>{cat.percentage}%</span>
              </div>
              <div className="category-bar-track">
                <div className="category-bar-fill" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {data.unreadNotifications > 0 && (
        <div className="alert alert-info">
          You have {data.unreadNotifications} unread notification{data.unreadNotifications > 1 ? 's' : ''}.
          <Link to="/notifications" className="alert-link">View</Link>
        </div>
      )}
    </div>
  );
}
