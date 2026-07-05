import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, profileApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      profileApi.getProfile()
        .then(data => setUser(data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    const data = await authApi.login(email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  }

  async function register(name, email, password) {
    const data = await authApi.register(name, email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  }

  async function logout() {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
