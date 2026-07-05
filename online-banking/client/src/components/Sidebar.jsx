import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/transactions', label: 'Transactions', icon: '💳' },
  { to: '/transfer', label: 'Transfer', icon: '💸' },
  { to: '/beneficiaries', label: 'Beneficiaries', icon: '👥' },
  { to: '/cards', label: 'Cards', icon: '💳' },
  { to: '/insights', label: 'Insights', icon: '📈' },
  { to: '/notifications', label: 'Notifications', icon: '🔔' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar() {
  function closeSidebar() {
    document.body.classList.remove('sidebar-open');
  }

  return (
    <>
      <div className="sidebar-overlay" onClick={closeSidebar} />
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🏦</span>
          <span className="brand-text">Online Banking</span>
        </div>
        <nav className="sidebar-nav">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
