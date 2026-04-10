import React, { useState } from 'react';
import { Bell, Lock, Palette, Save, ShieldCheck, UserCircle } from 'lucide-react';
import '../Stylesheets/settings-cyan.css';
import CyanShell from '../components/CyanShell';

const Settings = ({ user }) => {
  const [name, setName] = useState(user?.name || 'Alex User');
  const [email, setEmail] = useState(user?.email || 'alex.user@example.com');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('English');
  const [dateFormat, setDateFormat] = useState('DD-MM-YYYY');
  const [currencyFormat, setCurrencyFormat] = useState('USD');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [reportNotifications, setReportNotifications] = useState(true);
  const [teamNotifications, setTeamNotifications] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [theme, setTheme] = useState('Cyan Classic');
  const [landingPage, setLandingPage] = useState('Dashboard');
  const [autoSave, setAutoSave] = useState(true);
  const [exportPreference, setExportPreference] = useState('PDF');
  const [saveMessage, setSaveMessage] = useState('');

  const handleUpdate = () => {
    setSaveMessage('Settings saved successfully.');
  };

  const handleReset = () => {
    setName(user?.name || 'Alex User');
    setEmail(user?.email || 'alex.user@example.com');
    setPassword('');
    setLanguage('English');
    setDateFormat('DD-MM-YYYY');
    setCurrencyFormat('USD');
    setEmailAlerts(true);
    setReportNotifications(true);
    setTeamNotifications(false);
    setTwoFactor(false);
    setTheme('Cyan Classic');
    setLandingPage('Dashboard');
    setAutoSave(true);
    setExportPreference('PDF');
    setSaveMessage('Settings reset to defaults.');
  };

  return (
    <CyanShell user={user}>
      <div className="settings-cyan-shell in-shell">
        <header className="settings-cyan-header">
          <h1>Settings</h1>
          <p>Manage your profile, security, and notification preferences.</p>
        </header>

        <div className="settings-cyan-grid">
          <section className="settings-card">
            <h2>
              <UserCircle size={18} />
              Profile
            </h2>

            <label>
              Full Name
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>

            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <label>
              Profile Picture URL
              <input type="text" placeholder="https://..." />
            </label>
          </section>

          <section className="settings-card">
            <h2>
              <Lock size={18} />
              Security
            </h2>

            <label>
              New Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </label>

            <div className="settings-toggle-row">
              <span>
                <ShieldCheck size={16} />
                Two-factor authentication
              </span>
              <button
                type="button"
                onClick={() => setTwoFactor((s) => !s)}
                className={twoFactor ? 'is-on' : ''}
              >
                {twoFactor ? 'On' : 'Off'}
              </button>
            </div>

            <div className="settings-toggle-row">
              <span>Active login sessions</span>
              <button type="button">View</button>
            </div>
          </section>

          <section className="settings-card">
            <h2>
              <Bell size={18} />
              Notifications
            </h2>
            <div className="settings-toggle-row">
              <span>Email alerts</span>
              <button
                type="button"
                onClick={() => setEmailAlerts((s) => !s)}
                className={emailAlerts ? 'is-on' : ''}
              >
                {emailAlerts ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="settings-toggle-row">
              <span>Report notifications</span>
              <button
                type="button"
                onClick={() => setReportNotifications((s) => !s)}
                className={reportNotifications ? 'is-on' : ''}
              >
                {reportNotifications ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="settings-toggle-row">
              <span>Team notifications</span>
              <button
                type="button"
                onClick={() => setTeamNotifications((s) => !s)}
                className={teamNotifications ? 'is-on' : ''}
              >
                {teamNotifications ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </section>

          <section className="settings-card">
            <h2>
              <Palette size={18} />
              Preferences & Theme
            </h2>
            <label>
              Theme
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="Cyan Classic">Cyan Classic</option>
                <option value="Slate Sharp">Slate Sharp</option>
                <option value="Ocean Contrast">Ocean Contrast</option>
              </select>
            </label>

            <label>
              Language
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
              </select>
            </label>

            <label>
              Date Format
              <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </label>

            <label>
              Currency Format
              <select value={currencyFormat} onChange={(e) => setCurrencyFormat(e.target.value)}>
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
              </select>
            </label>
          </section>

          <section className="settings-card">
            <h2>
              <ShieldCheck size={18} />
              Workspace / App Settings
            </h2>

            <label>
              Default Landing Page
              <select value={landingPage} onChange={(e) => setLandingPage(e.target.value)}>
                <option value="Dashboard">Dashboard</option>
                <option value="Upload Data">Upload Data</option>
                <option value="Analytics">Analytics</option>
              </select>
            </label>

            <div className="settings-toggle-row">
              <span>Auto-save settings</span>
              <button
                type="button"
                onClick={() => setAutoSave((s) => !s)}
                className={autoSave ? 'is-on' : ''}
              >
                {autoSave ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <label>
              Export Preference
              <select value={exportPreference} onChange={(e) => setExportPreference(e.target.value)}>
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
                <option value="CSV">CSV</option>
              </select>
            </label>
          </section>
        </div>

        <div className="settings-actions">
          <button type="button" className="ghost" onClick={handleReset}>Reset</button>
          <button type="button" className="solid" onClick={handleUpdate}>
            <Save size={15} />
            Save Changes
          </button>
        </div>

        {saveMessage && <p className="settings-save-message">{saveMessage}</p>}
      </div>
    </CyanShell>
  );
};

export default Settings;
