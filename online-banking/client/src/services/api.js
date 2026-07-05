const API_URL = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

export const authApi = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password, phone) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, phone }) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
};

export const accountApi = {
  getAccounts: () => request('/account'),
  getDashboard: () => request('/dashboard'),
};

export const transactionApi = {
  getTransactions: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/transactions${qs ? `?${qs}` : ''}`);
  },
  transfer: (data) => request('/transfer', { method: 'POST', body: JSON.stringify(data) }),
};

export const beneficiaryApi = {
  getBeneficiaries: () => request('/beneficiaries'),
  createBeneficiary: (data) => request('/beneficiaries', { method: 'POST', body: JSON.stringify(data) }),
  updateBeneficiary: (id, data) => request(`/beneficiaries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBeneficiary: (id) => request(`/beneficiaries/${id}`, { method: 'DELETE' }),
};

export const cardApi = {
  getCards: () => request('/cards'),
  toggleFreeze: (id) => request(`/cards/${id}/freeze`, { method: 'PUT' }),
};

export const insightsApi = {
  getInsights: () => request('/insights'),
};

export const notificationApi = {
  getNotifications: () => request('/notifications'),
  markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: () => request('/notifications/read-all', { method: 'PUT' }),
};

export const profileApi = {
  getProfile: () => request('/profile'),
  updateProfile: (data) => request('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};
