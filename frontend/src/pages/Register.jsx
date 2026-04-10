import React, { useState } from 'react';
import { register } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import '../Stylesheets/index.css';

export default function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!acceptTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({ name, email, password });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      onRegister && onRegister(res.user);
      nav('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

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
            <button type="button" className="auth-nav-btn" onClick={() => nav('/register')}>Sign Up</button>
          </nav>
        </header>

        <section className="auth-stage">
          <div className="auth-card">
            <h2>Create an Account</h2>
            <p className="auth-subtitle">Sign up to start your analytics journey</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={submit} className="auth-form">
              <label>
                <span>Full Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  required
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
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

              <label>
                <span>Confirm Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                />
              </label>

              <label className="auth-check terms-check">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                I agree to the Terms of Service and Privacy Policy
              </label>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <p className="auth-switch-line">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>

          <p className="auth-footer">(C) 2024 Secondbrain. All rights reserved</p>
        </section>
      </div>
    </div>
  );
}
