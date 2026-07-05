import { useState, useEffect } from 'react';
import { accountApi, transactionApi, beneficiaryApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    fromAccountId: '',
    toAccountNumber: '',
    toBankName: '',
    amount: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLoading(true);
    Promise.all([
      accountApi.getAccounts(),
      beneficiaryApi.getBeneficiaries(),
    ])
      .then(([accData, benData]) => {
        setAccounts(accData.accounts.filter(a => a.type !== 'Credit Card'));
        setBeneficiaries(benData.beneficiaries);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function update(field) {
    return e => {
      setForm(p => ({ ...p, [field]: e.target.value }));
      setErrors(p => ({ ...p, [field]: '' }));
      setSuccess('');
    };
  }

  function selectBeneficiary(ben) {
    setForm(p => ({ ...p, toAccountNumber: ben.accountNumber, toBankName: ben.bankName }));
  }

  function validate() {
    const errs = {};
    if (!form.fromAccountId) errs.fromAccountId = 'Select source account';
    if (!form.toAccountNumber) errs.toAccountNumber = 'Enter account number';
    if (form.toAccountNumber.length < 4) errs.toAccountNumber = 'Invalid account number';
    if (!form.toBankName) errs.toBankName = 'Enter bank name';
    if (!form.amount) errs.amount = 'Enter amount';
    else {
      const amt = parseFloat(form.amount);
      if (isNaN(amt) || amt <= 0) errs.amount = 'Enter a valid amount';
      else if (amt > 10000) errs.amount = 'Maximum transfer is $10,000';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const data = await transactionApi.transfer(form);
      setSuccess(`$${parseFloat(form.amount).toFixed(2)} transferred successfully!`);
      setForm({ fromAccountId: '', toAccountNumber: '', toBankName: '', amount: '', description: '' });
      const accData = await accountApi.getAccounts();
      setAccounts(accData.accounts.filter(a => a.type !== 'Credit Card'));
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="page-loading"><LoadingSpinner size={60} /></div>;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="page transfer-page">
      <div className="page-header"><h1>Transfer Funds</h1></div>

      <div className="transfer-grid">
        <div className="card">
          <h2>Quick Beneficiaries</h2>
          {beneficiaries.length === 0 ? (
            <p className="text-muted">No beneficiaries saved.</p>
          ) : (
            <div className="beneficiaries-mini-list">
              {beneficiaries.map(b => (
                <button key={b.id} className="beneficiary-chip" onClick={() => selectBeneficiary(b)}>
                  <span className="chip-avatar">{b.name[0]}</span>
                  <span className="chip-name">{b.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card transfer-form-card">
          <h2>Make a Transfer</h2>
          {success && <div className="alert alert-success">{success}</div>}
          {errors.submit && <div className="alert alert-error">{errors.submit}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>From Account *</label>
              <select value={form.fromAccountId} onChange={update('fromAccountId')}>
                <option value="">Select account</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.type} ({a.number}) - ${a.balance.toFixed(2)}
                  </option>
                ))}
              </select>
              {errors.fromAccountId && <span className="field-error">{errors.fromAccountId}</span>}
            </div>
            <div className="form-group">
              <label>Beneficiary Account Number *</label>
              <input type="text" value={form.toAccountNumber} onChange={update('toAccountNumber')} placeholder="****5678" />
              {errors.toAccountNumber && <span className="field-error">{errors.toAccountNumber}</span>}
            </div>
            <div className="form-group">
              <label>Bank Name *</label>
              <input type="text" value={form.toBankName} onChange={update('toBankName')} placeholder="Bank of America" />
              {errors.toBankName && <span className="field-error">{errors.toBankName}</span>}
            </div>
            <div className="form-group">
              <label>Amount (USD) *</label>
              <input type="number" step="0.01" min="0.01" max="10000" value={form.amount} onChange={update('amount')} placeholder="0.00" />
              {errors.amount && <span className="field-error">{errors.amount}</span>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" value={form.description} onChange={update('description')} placeholder="What's this for?" />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Processing...' : 'Send Transfer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
