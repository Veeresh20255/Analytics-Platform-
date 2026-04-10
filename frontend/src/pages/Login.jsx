import React, { useEffect, useState } from 'react';
import { login } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import '../Stylesheets/index.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      if (remember) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      onLogin && onLogin(res.user);
      nav('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  return (
    <div className="auth-shell">
      <div className="auth-frame">
        <header className="auth-topbar">
          <div className="auth-brand">
            <span className="auth-brand-dot" aria-hidden="true">◉</span>
            <span className="auth-brand-name">Secondbrain</span>
            <span className="auth-brand-sub">/ TID</span>
          </div>

          <nav className="auth-nav" aria-label="Auth navigation">
            <button type="button" onClick={() => nav('/#hero')}>Home</button>
            <button type="button" onClick={() => nav('/#features')}>Features</button>
            <button type="button" onClick={() => nav('/#pricing')}>Pricing</button>
            <button type="button" className="auth-nav-btn" onClick={() => nav('/login')}>Sign In</button>
          </nav>
        </header>

        <section className="auth-stage">
          <div className="auth-card">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to continue to your account</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={submit} className="auth-form">
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </label>

              <div className="auth-row">
                <label className="auth-check">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <button type="button" className="auth-link-btn" onClick={() => nav('/help')}>Forgot password?</button>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="auth-switch-line">
              Do not have an account? <Link to="/register">Sign Up</Link>
            </p>

            <div className="auth-divider">
              <span>Or continue with</span>
            </div>

            <div className="auth-socials" aria-label="Social login options">
              <button type="button" onClick={() => setError('Google login is not configured yet.')}>G</button>
              <button type="button" onClick={() => setError('Microsoft login is not configured yet.')}>M</button>
              <button type="button" onClick={() => setError('LinkedIn login is not configured yet.')}>in</button>
            </div>
          </div>

          <p className="auth-footer">(C) 2023 Secondbrain. All rights reserved</p>
        </section>
      </div>
    </div>
  );
}
