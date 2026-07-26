import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ search, setSearch, onOpenCreateModal }) => {
  const { user, logout } = useAuth();

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

          <div className="user-badge" title={user?.email}>
            <span className="avatar">{user?.name ? user.name[0].toUpperCase() : 'U'}</span>
            <span className="username">{user?.name || 'User'}</span>
          </div>

          <button className="btn outline small" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
