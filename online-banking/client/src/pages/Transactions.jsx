import { useState, useEffect } from 'react';
import { transactionApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function Transactions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('date_desc');
  const [page, setPage] = useState(1);

  function fetchData() {
    setLoading(true);
    setError('');
    const params = { page, limit: 15 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (type) params.type = type;
    if (status) params.status = status;
    if (sort) params.sort = sort;
    transactionApi.getTransactions(params)
      .then(d => setData(d))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData(); }, [page, category, type, status, sort]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchData();
  }

  const formatCurrency = (n) => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const statusClass = (s) => ({ completed: 'success', pending: 'warning', failed: 'danger' }[s] || '');

  return (
    <div className="page transactions-page">
      <div className="page-header"><h1>Transaction History</h1></div>

      <div className="filters-bar">
        <form onSubmit={handleSearch} className="search-form">
          <input type="text" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {data?.categories?.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={type} onChange={e => { setType(e.target.value); setPage(1); }}>
          <option value="">All Types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="amount_desc">Highest Amount</option>
          <option value="amount_asc">Lowest Amount</option>
        </select>
      </div>

      {loading ? (
        <div className="page-loading"><LoadingSpinner size={50} /></div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : !data?.transactions?.length ? (
        <EmptyState title="No transactions found" message="Try adjusting your search or filters." icon="🔍" />
      ) : (
        <>
          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Counterparty</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>{tx.description}</td>
                    <td><span className="badge badge-category">{tx.category}</span></td>
                    <td>{tx.counterparty}</td>
                    <td className={`tx-amount ${tx.type === 'credit' ? 'credit' : 'debit'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    <td><span className={`badge badge-${statusClass(tx.status)}`}>{tx.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.totalPages > 1 && (
            <div className="pagination">
              <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
              <span className="page-info">Page {page} of {data.totalPages}</span>
              <button className="btn btn-outline btn-sm" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
