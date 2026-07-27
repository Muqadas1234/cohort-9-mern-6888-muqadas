/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';

// Create global authentication context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Restore authentication token from local storage on startup
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // Restore user profile data from local storage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });

  // Save session upon successful login
  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  // Clear session data on logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for accessing auth state across components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
