import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ search, setSearch, onOpenCreateModal, onExportJSON, onImportClick }) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const dropdownRef = useRef(null);
  const toolsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setIsToolsOpen(false);
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
            aria-label="Search notes by title or content"
            placeholder="Search notes by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="navbar-actions">
          {/* Ultra-Modern Tools Menu for Backup & Restore */}
          <div className="profile-menu-container" ref={toolsRef}>
            <button
              className="tools-menu-btn"
              onClick={() => setIsToolsOpen((prev) => !prev)}
              aria-label="Tools Menu"
              aria-expanded={isToolsOpen}
            >
              <span style={{ fontSize: '1rem' }}>⚙️</span>
              <span>Tools</span>
              <span className="arrow">{isToolsOpen ? '▲' : '▼'}</span>
            </button>

            {isToolsOpen && (
              <div className="profile-dropdown tools-dropdown">
                <div className="dropdown-section-header">
                  <span className="dropdown-section-icon">📦</span>
                  <span className="dropdown-section-label">Data Management</span>
                </div>

                <div className="dropdown-items-group">
                  <button
                    className="tool-action-btn"
                    onClick={() => {
                      setIsToolsOpen(false);
                      onImportClick();
                    }}
                  >
                    <div className="tool-icon-wrapper import">
                      📥
                    </div>
                    <div className="tool-btn-text">
                      <span className="tool-btn-title">Import JSON</span>
                      <span className="tool-btn-desc">Restore notes from backup file</span>
                    </div>
                  </button>

                  <button
                    className="tool-action-btn"
                    onClick={() => {
                      setIsToolsOpen(false);
                      onExportJSON();
                    }}
                  >
                    <div className="tool-icon-wrapper export">
                      📤
                    </div>
                    <div className="tool-btn-text">
                      <span className="tool-btn-title">Export JSON</span>
                      <span className="tool-btn-desc">Save notes to local JSON file</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="btn primary small" onClick={onOpenCreateModal}>
            + New Note
          </button>

          <div className="profile-menu-container" ref={dropdownRef}>
            <button
              className="user-badge-btn"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-label="User Profile Menu"
              aria-expanded={isProfileOpen}
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
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
