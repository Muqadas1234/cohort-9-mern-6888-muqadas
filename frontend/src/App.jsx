import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';

const MainApp = () => {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState('login'); // 'login' or 'signup'

  if (isAuthenticated) {
    return <Dashboard />;
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
