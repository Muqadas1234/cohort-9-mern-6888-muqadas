import { useState, useEffect } from 'react';
import { signupUser } from '../services/api';

export const Signup = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Smooth Typewriter Animation for Title and Description
  const fullTitle = 'Welcome Back!';
  const fullDesc = 'To keep connected with us please login with your personal info';
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedDesc, setDisplayedDesc] = useState('');
  const [typingStep, setTypingStep] = useState('title'); // 'title', 'desc', 'done'

  useEffect(() => {
    let titleIdx = 0;
    setDisplayedTitle('');
    setDisplayedDesc('');
    setTypingStep('title');

    let descTimer = null;
    let pauseTimer = null;

    const titleTimer = setInterval(() => {
      titleIdx++;
      if (titleIdx <= fullTitle.length) {
        setDisplayedTitle(fullTitle.slice(0, titleIdx));
      } else {
        clearInterval(titleTimer);
        setTypingStep('desc');

        pauseTimer = setTimeout(() => {
          let descIdx = 0;
          descTimer = setInterval(() => {
            descIdx++;
            if (descIdx <= fullDesc.length) {
              setDisplayedDesc(fullDesc.slice(0, descIdx));
            } else {
              clearInterval(descTimer);
              setTypingStep('done');
            }
          }, 55); // Slower, readable speed for description
        }, 350); // Natural pause between title and description
      }
    }, 110); // Slower, relaxed speed for title

    return () => {
      clearInterval(titleTimer);
      if (descTimer) clearInterval(descTimer);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await signupUser(name, email, password);
      alert('Account created successfully! Please log in.');
      onSwitchToLogin();
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-split-card">
        {/* Left Side: Clean & Simple Welcome Banner with Typewriter Animation */}
        <div className="auth-banner-panel">
          <div className="auth-brand-badge">
            <span className="auth-brand-icon">📝</span>
            <span className="auth-brand-name">NotesApp</span>
          </div>

          <div className="auth-banner-content">
            <h1 className="auth-banner-title" style={{ minHeight: '2.5rem' }}>
              {displayedTitle}
              {typingStep === 'title' && <span className="typing-cursor">|</span>}
            </h1>
            <p className="auth-banner-desc" style={{ minHeight: '4.2rem' }}>
              {displayedDesc}
              {typingStep === 'desc' && <span className="typing-cursor">|</span>}
            </p>
            <button
              type="button"
              className="auth-banner-btn"
              onClick={onSwitchToLogin}
            >
              SIGN IN
            </button>
          </div>

          {/* Bottom spacer for balance */}
          <div style={{ height: '24px' }}></div>
        </div>

        {/* Right Side: Simple & Clean Create Account Form */}
        <div className="auth-form-panel">
          <h2 className="auth-form-title">Create Account</h2>
          <p className="auth-form-subtitle">Fill in your details to get started</p>

          {error && <div className="auth-alert error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <span className="input-icon">👤</span>
              <input
                id="signup-name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="auth-input-group">
              <span className="input-icon">✉️</span>
              <input
                id="signup-email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="auth-input-group">
              <span className="input-icon">🔒</span>
              <input
                id="signup-password"
                type="password"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
            </button>
          </form>

          {/* Mobile switcher link */}
          <p className="auth-mobile-switch">
            Already have an account?{' '}
            <button type="button" className="link-btn" onClick={onSwitchToLogin}>
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
