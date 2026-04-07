import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import Settings from './pages/Settings';
import Terms from './pages/Terms';
import './Stylesheets/app.css';

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();
  const isAuthPage = !user;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className={`app ${isAuthPage ? 'auth-layout' : 'dashboard-layout'}`}>
      {isAuthPage ? (
        <main className="app-main auth-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="/register" element={<Register onRegister={setUser} />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            <Route path="/upload" element={<Navigate to="/login" replace />} />
            <Route path="/analytics" element={<Navigate to="/login" replace />} />
            <Route path="/reports" element={<Navigate to="/login" replace />} />
            <Route path="/visualization" element={<Navigate to="/login" replace />} />
            <Route path="/data-cleaning" element={<Navigate to="/login" replace />} />
            <Route path="/alerts" element={<Navigate to="/login" replace />} />
            <Route path="/settings" element={<Navigate to="/login" replace />} />
            <Route
              path="/admin"
              element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </main>
      ) : (
        <div className="app-shell">
          <Sidebar user={user} onLogout={logout} />
          <main className="app-main dashboard-main">
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/upload" element={<Dashboard user={user} />} />
              <Route path="/analytics" element={<Dashboard user={user} />} />
              <Route path="/reports" element={<Dashboard user={user} />} />
              <Route path="/visualization" element={<Dashboard user={user} />} />
              <Route path="/data-cleaning" element={<Dashboard user={user} />} />
              <Route path="/alerts" element={<Dashboard user={user} />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/admin"
                element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" replace />}
              />
            </Routes>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
