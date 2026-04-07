import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Stylesheets/sidebar.css';

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Upload Data', path: '/upload' },
    { label: 'Analytics', path: '/analytics' },
    { label: 'Reports', path: '/reports' },
    { label: 'Visualization', path: '/visualization' },
    { label: 'Data Cleaning', path: '/data-cleaning' },
    { label: 'Alerts', path: '/alerts' },
    { label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">◧</span>
          <span className="logo-text">SecondBrain</span>
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
        >
          {isOpen ? '✕' : '≡'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            title={item.label}
          >
            <span className="item-icon-wrap" aria-hidden="true">
              <span className="item-icon">◌</span>
            </span>
            {isOpen && <span className="item-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        {isOpen && user && (
          <div className="user-info">
            <div className="user-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
            <div className="user-details">
              <p className="user-name">{user.name || 'User'}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
        )}
        <button onClick={onLogout} className="logout-btn">
          {isOpen ? 'Logout' : '⇢'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
