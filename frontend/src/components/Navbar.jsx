import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ search, setSearch, onOpenCreateModal }) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="logo-icon">📝</span>
          <span className="brand-title">NotesApp</span>
          <span className="dashboard-badge">Dashboard</span>
        </div>

        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="navbar-actions">
          <button className="btn primary small" onClick={onOpenCreateModal}>
            + New Note
          </button>

          <div className="profile-menu-container" ref={dropdownRef}>
            <button
              className="user-badge-btn"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-label="User Profile Menu"
            >
              <span className="avatar">{user?.name ? user.name[0].toUpperCase() : 'U'}</span>
              <span className="username">{user?.name || 'User'}</span>
              <span className="arrow">{isProfileOpen ? '▲' : '▼'}</span>
            </button>

            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-user-info">
                  <p className="user-name">{user?.name || 'User'}</p>
                  <p className="user-email">{user?.email || 'user@example.com'}</p>
                </div>
                <hr className="dropdown-divider" />
                <button
                  className="dropdown-item logout-btn"
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
