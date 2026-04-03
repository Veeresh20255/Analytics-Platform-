import React, { useState } from 'react';
import { register } from '../api/api';
import { useNavigate } from 'react-router-dom';
import "../Stylesheets/index.css";

export default function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await register({ name, email, password });

      // ✅ Save user and token
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('user', JSON.stringify(res.user));

      // ✅ Update state in App
      onRegister && onRegister(res.user);

      // ✅ Go directly to dashboard (not landing page)
      nav('/dashboard');
    } catch (err) {
      let errorMsg = err?.response?.data?.message || err.message;
      if (err?.response?.status === 429) {
        errorMsg = 'Invalid email. Please check your email address and try again.';
      }
      alert(errorMsg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={submit}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit" className="btn">Register</button>
        </form>
      </div>
    </div>
  );
}
