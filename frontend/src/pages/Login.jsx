import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

export const Login = ({ onSwitchToSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Smooth Typewriter Animation for Title and Description
  const fullTitle = 'Hello, Friend!';
  const fullDesc = 'Capture your ideas, organize your tasks, and boost your daily productivity';
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedDesc, setDisplayedDesc] = useState('');
  const [typingStep, setTypingStep] = useState('title'); // 'title', 'desc', 'done'

  useEffect(() => {
    let titleIdx = 0;
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

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(email, password);
      login(res.token, res.user);
    } catch (err) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-split-card">
        {/* Left Side: Clean & Simple Banner Panel with Typewriter Animation */}
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
              onClick={onSwitchToSignup}
            >
              SIGN UP
            </button>
          </div>

          {/* Bottom spacer for balance */}
          <div style={{ height: '24px' }}></div>
        </div>

        {/* Right Side: Simple & Clean Form Panel */}
        <div className="auth-form-panel">
          <h2 className="auth-form-title">Sign In</h2>
          <p className="auth-form-subtitle">Enter your email and password to continue</p>

          {error && <div className="auth-alert error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <span className="input-icon">✉️</span>
              <input
                id="login-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="auth-input-group">
              <span className="input-icon">🔒</span>
              <input
                id="login-password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* Mobile switcher link */}
          <p className="auth-mobile-switch">
            Don't have an account?{' '}
            <button type="button" className="link-btn" onClick={onSwitchToSignup}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
