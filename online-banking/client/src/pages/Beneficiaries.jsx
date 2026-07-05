import { useState, useEffect } from 'react';
import { beneficiaryApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ name: '', accountNumber: '', bankName: '', email: '', phone: '' });

  function fetchData() {
    setLoading(true);
    setError('');
    beneficiaryApi.getBeneficiaries()
      .then(d => setBeneficiaries(d.beneficiaries))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData(); }, []);

  function resetForm() {
    setForm({ name: '', accountNumber: '', bankName: '', email: '', phone: '' });
    setEditing(null);
    setShowForm(false);
  }

  function openEdit(ben) {
    setForm({ name: ben.name, accountNumber: ben.accountNumber, bankName: ben.bankName, email: ben.email || '', phone: ben.phone || '' });
    setEditing(ben.id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.accountNumber || !form.bankName) return;
    setSubmitting(true);
    try {
      if (editing) {
        await beneficiaryApi.updateBeneficiary(editing, form);
      } else {
        await beneficiaryApi.createBeneficiary(form);
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this beneficiary?')) return;
    try {
      await beneficiaryApi.deleteBeneficiary(id);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleFavorite(ben) {
    try {
      await beneficiaryApi.updateBeneficiary(ben.id, { isFavorite: !ben.isFavorite });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="page-loading"><LoadingSpinner size={60} /></div>;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="page beneficiaries-page">
      <div className="page-header">
        <h1>Beneficiaries</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>+ Add Beneficiary</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Beneficiary' : 'Add Beneficiary'}</h2>
              <button className="modal-close" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Account Number *</label>
                <input type="text" value={form.accountNumber} onChange={e => setForm(p => ({ ...p, accountNumber: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Bank Name *</label>
                <input type="text" value={form.bankName} onChange={e => setForm(p => ({ ...p, bankName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {beneficiaries.length === 0 ? (
        <EmptyState title="No beneficiaries" message="Add your first beneficiary to get started." icon="👥" />
      ) : (
        <div className="beneficiaries-grid">
          {beneficiaries.map(b => (
            <div key={b.id} className="beneficiary-card">
              <div className="beneficiary-avatar">{b.name[0]}</div>
              <div className="beneficiary-info">
                <h3>{b.name}</h3>
                <p>{b.bankName} · {b.accountNumber}</p>
                {b.email && <p className="text-muted">{b.email}</p>}
              </div>
              <div className="beneficiary-actions">
                <button className="icon-btn" onClick={() => toggleFavorite(b)} title={b.isFavorite ? 'Unfavorite' : 'Favorite'}>
                  {b.isFavorite ? '⭐' : '☆'}
                </button>
                <button className="icon-btn" onClick={() => openEdit(b)} title="Edit">✏️</button>
                <button className="icon-btn" onClick={() => handleDelete(b.id)} title="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
