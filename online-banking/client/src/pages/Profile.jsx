import { useState, useEffect } from 'react';
import { profileApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });

  function fetchData() {
    setLoading(true);
    setError('');
    profileApi.getProfile()
      .then(d => {
        setUser(d.user);
        setForm({ name: d.user.name, email: d.user.email, phone: d.user.phone || '', address: d.user.address || '' });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData(); }, []);

  function update(field) {
    return e => {
      setForm(p => ({ ...p, [field]: e.target.value }));
      setSuccess('');
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const data = await profileApi.updateProfile(form);
      setUser(data.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="page-loading"><LoadingSpinner size={60} /></div>;
  if (error && !user) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="page profile-page">
      <div className="page-header"><h1>Profile</h1></div>

      <div className="profile-layout">
        <div className="card profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">{user?.name?.[0] || 'U'}</div>
            <h2>{user?.name}</h2>
            <p className="text-muted">{user?.email}</p>
            <p className="text-muted">Joined {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : ''}</p>
          </div>
        </div>

        <div className="card profile-form-card">
          <h2>Edit Profile</h2>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={form.name} onChange={update('name')} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} disabled />
              <span className="field-hint">Email cannot be changed</span>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+1-555-0100" />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" value={form.address} onChange={update('address')} placeholder="123 Main St, City" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
