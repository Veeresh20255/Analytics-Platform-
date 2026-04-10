import React, { useMemo, useState } from 'react';
import CyanShell from '../components/CyanShell';

const members = [
  { name: 'Priya', role: 'Admin', status: 'Online' },
  { name: 'Rahul', role: 'Analyst', status: 'Busy' },
  { name: 'Nina', role: 'Viewer', status: 'Offline' },
  { name: 'Aarav', role: 'Analyst', status: 'Online' },
];

export default function TeamPage({ user, dataset }) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [role, setRole] = useState('Analyst');
  const [message, setMessage] = useState('Invite teammates and collaborate on reports or charts.');

  const rows = useMemo(() => dataset?.rows || [], [dataset]);

  const invite = () => {
    setMessage(inviteEmail ? `Invitation sent to ${inviteEmail} as ${role}.` : 'Enter an email address first.');
  };

  return (
    <CyanShell user={user}>
      <section className="feature-bottom-grid" style={{ gridTemplateColumns: '1.1fr 0.9fr' }}>
        <article className="feature-panel" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 50%, #14b8a6 100%)', color: '#fff' }}>
          <p style={{ letterSpacing: '0.18em', fontSize: 11, textTransform: 'uppercase', opacity: 0.8 }}>Collaboration hub</p>
          <h1 style={{ fontSize: 54, lineHeight: 0.95, marginTop: 10 }}>Team workspace</h1>
          <p style={{ marginTop: 12, maxWidth: 680, color: 'rgba(255,255,255,0.82)' }}>
            Share dashboards, manage roles, and leave comments on reports and charts.
          </p>
          <div className="feature-action-list" style={{ marginTop: 18 }}>
            <button type="button" onClick={() => setMessage('Dashboard sharing enabled.')}>Share dashboard</button>
            <button type="button" onClick={() => setMessage('Report comments mode enabled.')}>Comments on reports/charts</button>
            <button type="button" onClick={() => setMessage('Activity tracking opened.')}>Activity log</button>
          </div>
        </article>

        <article className="feature-panel">
          <header><h2>Invite member</h2></header>
          <div className="feature-input-grid">
            <label className="feature-input-wrap">
              <span>Email</span>
              <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="name@company.com" />
            </label>
            <label className="feature-input-wrap">
              <span>Role</span>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Admin</option>
                <option>Analyst</option>
                <option>Viewer</option>
              </select>
            </label>
          </div>
          <div className="feature-action-list">
            <button type="button" onClick={invite}>Invite Member</button>
          </div>
          <p className="feature-action-message">{message}</p>
        </article>
      </section>

      <section className="feature-stats-grid">
        <article className="feature-stat-card">
          <p>Members</p>
          <h3>{members.length}</h3>
          <small>Workspace collaborators</small>
        </article>
        <article className="feature-stat-card">
          <p>Uploaded Files</p>
          <h3>{rows.length}</h3>
          <small>Shared across the team</small>
        </article>
        <article className="feature-stat-card">
          <p>Open Comments</p>
          <h3>36</h3>
          <small>On charts and reports</small>
        </article>
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header><h2>Members</h2></header>
          <div className="feature-activity-table">
            <div className="row head"><span>Name</span><span>Role</span><span>Status</span></div>
            {members.map((member) => (
              <div className="row" key={member.name}>
                <span>{member.name}</span>
                <span>{member.role}</span>
                <span className={member.status === 'Online' ? 'ok' : 'pending'}>{member.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="feature-panel">
          <header><h2>Collaboration notes</h2></header>
          <div className="feature-insight-list">
            <p>Who uploaded data: Priya</p>
            <p>Who created reports: Rahul</p>
            <p>Who reviewed charts: Nina</p>
          </div>
        </article>
      </section>
    </CyanShell>
  );
}
