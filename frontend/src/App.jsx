import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

const MainApp = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [view, setView] = useState('login'); // 'login' or 'signup'

  if (isAuthenticated) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Welcome, {user?.name || 'User'}! 🎉</h2>
        <p style={{ color: '#94a3b8', margin: '1rem 0' }}>{user?.email}</p>
        <button onClick={logout} className="btn primary">
          Logout
        </button>
      </div>
    );
  }

  return (
    <>
      {view === 'login' ? (
        <Login onSwitchToSignup={() => setView('signup')} />
      ) : (
        <Signup onSwitchToLogin={() => setView('login')} />
      )}
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
