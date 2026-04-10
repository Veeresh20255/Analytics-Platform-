import React, { useState } from 'react';
import CyanShell from '../components/CyanShell';

const faqs = [
  { q: 'How do I upload data?', a: 'Go to Upload Data and drop an Excel/CSV file into the upload area.' },
  { q: 'How do I create a report?', a: 'Open Reports, choose a template, then generate a summary and export it.' },
  { q: 'How do I build charts?', a: 'Open Visualization, map X/Y fields, choose a chart type, and save it.' },
  { q: 'How do I clean data?', a: 'Use Data Cleaning to remove duplicates, fill missing values, and fix formats.' },
];

export default function HelpPage({ user }) {
  const [query, setQuery] = useState('How do I upload data?');
  const [result, setResult] = useState(faqs[0].a);
  const [ticket, setTicket] = useState('');

  const search = () => {
    const match = faqs.find((item) => item.q.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(item.q.toLowerCase()));
    setResult(match ? match.a : 'No exact match found. Try a different question or browse tutorials.');
  };

  return (
    <CyanShell user={user}>
      <section className="feature-bottom-grid" style={{ gridTemplateColumns: '1.1fr 0.9fr' }}>
        <article className="feature-panel" style={{ background: 'linear-gradient(135deg, #111827 0%, #0f766e 50%, #38bdf8 100%)', color: '#fff' }}>
          <p style={{ letterSpacing: '0.18em', fontSize: 11, textTransform: 'uppercase', opacity: 0.8 }}>Support center</p>
          <h1 style={{ fontSize: 54, lineHeight: 0.95, marginTop: 10 }}>Help & support</h1>
          <p style={{ marginTop: 12, maxWidth: 680, color: 'rgba(255,255,255,0.82)' }}>
            Search FAQs, follow tutorials, raise tickets, and report bugs or feature ideas.
          </p>
          <div className="feature-action-list" style={{ marginTop: 18 }}>
            <button type="button" onClick={() => setResult('Step 1: upload data. Step 2: clean it. Step 3: visualize it.')}>
              How to use this page?
            </button>
            <button type="button" onClick={() => setResult('Beginner guide: upload data first, then explore analytics and reports.')}>Beginner guide</button>
            <button type="button" onClick={() => setResult('Video walkthrough and tooltips are available in the guide section.')}>Video walkthrough</button>
          </div>
        </article>

        <article className="feature-panel">
          <header><h2>Search help</h2></header>
          <div className="feature-input-grid">
            <label className="feature-input-wrap">
              <span>FAQ search</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="How do I create a report?" />
            </label>
          </div>
          <div className="feature-action-list">
            <button type="button" onClick={search}>Search</button>
          </div>
          <p className="feature-action-message">{result}</p>
        </article>
      </section>

      <section className="feature-grid">
        {faqs.map((item) => (
          <article key={item.q} className="feature-card">
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </article>
        ))}
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header><h2>Contact support</h2></header>
          <div className="feature-input-grid">
            <label className="feature-input-wrap" style={{ gridColumn: '1 / -1' }}>
              <span>Describe your issue</span>
              <input value={ticket} onChange={(e) => setTicket(e.target.value)} placeholder="Report a bug, ask a question, or suggest a feature." />
            </label>
          </div>
          <div className="feature-action-list">
            <button type="button" onClick={() => setResult(ticket ? `Ticket submitted: ${ticket}` : 'Enter a message first.')}>Raise Ticket</button>
            <button type="button" onClick={() => setResult('Bug report form opened.')}>Report Bug</button>
            <button type="button" onClick={() => setResult('Feature suggestion saved.')}>Suggest Feature</button>
          </div>
        </article>

        <article className="feature-panel">
          <header><h2>Support metrics</h2></header>
          <div className="feature-activity-table">
            <div className="row head"><span>Metric</span><span>Value</span><span>Note</span></div>
            <div className="row"><span>Open tickets</span><span>3</span><span>Awaiting updates</span></div>
            <div className="row"><span>Resolved this week</span><span>12</span><span>Strong closure rate</span></div>
            <div className="row"><span>Avg. response time</span><span>18m</span><span>Current SLA</span></div>
          </div>
        </article>
      </section>
    </CyanShell>
  );
}
