import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { notificationApi } from '../services/api';

export default function Header() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const dropdownRef = useRef();

  useEffect(() => {
    if (user) {
      notificationApi.getNotifications()
        .then(d => setNotifCount(d.unreadCount))
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={() => document.body.classList.toggle('sidebar-open')}>
          ☰
        </button>
        <h2 className="brand">Online Banking</h2>
      </div>
      <div className="header-right">
        <button className="icon-btn" onClick={toggleTheme} title={dark ? 'Light mode' : 'Dark mode'}>
          {dark ? '☀️' : '🌙'}
        </button>
        <Link to="/notifications" className="icon-btn notif-btn">
          🔔
          {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
        </Link>
        <div className="user-dropdown" ref={dropdownRef}>
          <button className="user-btn" onClick={() => setShowDropdown(p => !p)}>
            <div className="avatar">{user?.name?.[0] || 'U'}</div>
            <span className="user-name">{user?.name}</span>
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>Profile</Link>
              <button className="dropdown-item" onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
