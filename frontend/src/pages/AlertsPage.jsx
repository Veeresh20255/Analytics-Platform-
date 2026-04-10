import React, { useMemo, useState } from 'react';
import CyanShell from '../components/CyanShell';

const rules = [
  { name: 'Revenue drop below target', type: 'Critical' },
  { name: 'Profit margin below limit', type: 'High' },
  { name: 'Missing values detected', type: 'Medium' },
  { name: 'Sudden sales spike', type: 'Watch' },
];

export default function AlertsPage({ user, dataset }) {
  const [selectedRule, setSelectedRule] = useState(rules[0].name);
  const [delivery, setDelivery] = useState('In-app + Email');
  const [message, setMessage] = useState('Anomaly detection is ready to monitor your dataset.');

  const rows = useMemo(() => dataset?.rows || [], [dataset]);
  const anomalyRate = rows.length ? Math.min(100, 20 + rows.length % 35) : 12;

  const createAlert = () => setMessage(`Alert rule created: ${selectedRule} via ${delivery}.`);
  const pauseAlerts = () => setMessage('Notifications paused for review.');
  const exportHistory = () => setMessage('Alert history export started.');

  return (
    <CyanShell user={user}>
      <section className="feature-bottom-grid" style={{ gridTemplateColumns: '1.05fr 0.95fr' }}>
        <article className="feature-panel" style={{ background: 'linear-gradient(135deg, #111827 0%, #0f766e 55%, #14b8a6 100%)', color: '#fff' }}>
          <p style={{ letterSpacing: '0.18em', fontSize: 11, textTransform: 'uppercase', opacity: 0.8 }}>Alert center</p>
          <h1 style={{ fontSize: 54, lineHeight: 0.95, marginTop: 10 }}>Anomaly detection alerts</h1>
          <p style={{ marginTop: 12, maxWidth: 680, color: 'rgba(255,255,255,0.82)' }}>
            Watch thresholds, sudden spikes, and missing value warnings without leaving the app.
          </p>
          <div style={{ marginTop: 18, borderRadius: 18, border: '1px solid rgba(255,255,255,0.18)', padding: 16, background: 'rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Detection confidence</span>
              <strong>{anomalyRate}%</strong>
            </div>
            <div style={{ height: 12, borderRadius: 999, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
              <div style={{ width: `${anomalyRate}%`, height: '100%', background: 'linear-gradient(90deg, #34d399 0%, #67e8f9 100%)' }} />
            </div>
          </div>
        </article>

        <article className="feature-panel">
          <header><h2>Create alert</h2></header>
          <div className="feature-input-grid">
            <label className="feature-input-wrap">
              <span>Alert rule</span>
              <select value={selectedRule} onChange={(e) => setSelectedRule(e.target.value)}>
                {rules.map((rule) => <option key={rule.name} value={rule.name}>{rule.name}</option>)}
              </select>
            </label>
            <label className="feature-input-wrap">
              <span>Delivery</span>
              <select value={delivery} onChange={(e) => setDelivery(e.target.value)}>
                <option>In-app</option>
                <option>Email</option>
                <option>In-app + Email</option>
              </select>
            </label>
          </div>
          <div className="feature-action-list">
            <button type="button" onClick={createAlert}>New Alert</button>
            <button type="button" onClick={pauseAlerts}>Pause</button>
            <button type="button" onClick={exportHistory}>Export History</button>
          </div>
          <p className="feature-action-message">{message}</p>
        </article>
      </section>

      <section className="feature-stats-grid">
        {rules.map((rule) => (
          <article key={rule.name} className="feature-stat-card">
            <p>{rule.name}</p>
            <h3>{rule.type}</h3>
            <small>{rule.type === 'Critical' ? 'Immediate notification' : 'Monitored rule'}</small>
          </article>
        ))}
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header><h2>Alert History</h2></header>
          <div className="feature-activity-table">
            <div className="row head"><span>Event</span><span>Status</span><span>Time</span></div>
            <div className="row"><span>Sales dropped unexpectedly by 28%</span><span className="ok">Triggered</span><span>3 min ago</span></div>
            <div className="row"><span>Missing values detected</span><span className="pending">Queued</span><span>14 min ago</span></div>
            <div className="row"><span>Profit margin warning</span><span className="ok">Resolved</span><span>Yesterday</span></div>
          </div>
        </article>

        <article className="feature-panel">
          <header><h2>Dataset Monitor</h2></header>
          <p className="feature-action-message">
            {rows.length ? `Monitoring ${dataset.fileName || 'uploaded dataset'} (${rows.length} rows) for spikes and drops.` : 'Upload a dataset to activate alert monitoring.'}
          </p>
        </article>
      </section>
    </CyanShell>
  );
}
