import { useState, useEffect } from 'react';
import { notificationApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function fetchData() {
    setLoading(true);
    setError('');
    notificationApi.getNotifications()
      .then(d => setNotifications(d.notifications))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData(); }, []);

  async function handleMarkRead(id) {
    try {
      await notificationApi.markRead(id);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleMarkAllRead() {
    try {
      await notificationApi.markAllRead();
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  }

  const typeIcon = { transaction: '💳', credit: '💰', alert: '⚠️', account: '👤' };
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (loading) return <div className="page-loading"><LoadingSpinner size={60} /></div>;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="page notifications-page">
      <div className="page-header">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <button className="btn btn-outline btn-sm" onClick={handleMarkAllRead}>
            Mark All Read ({unreadCount})
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState title="No notifications" message="You're all caught up!" icon="🔔" />
      ) : (
        <div className="notifications-list">
          {notifications.map(n => (
            <div key={n.id} className={`notification-item ${!n.isRead ? 'unread' : ''}`} onClick={() => !n.isRead && handleMarkRead(n.id)}>
              <div className="notif-icon">{typeIcon[n.type] || '📋'}</div>
              <div className="notif-content">
                <div className="notif-title">{n.title}</div>
                <div className="notif-message">{n.message}</div>
                <div className="notif-time">{timeAgo(n.date)}</div>
              </div>
              {!n.isRead && <div className="notif-unread-dot" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
