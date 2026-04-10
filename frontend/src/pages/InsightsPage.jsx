import React, { useMemo, useState } from 'react';
import CyanShell from '../components/CyanShell';

const insightSeeds = [
  { title: 'Revenue Spike', value: '+24%', detail: 'North region is driving current growth.' },
  { title: 'Risk Watch', value: '-15%', detail: 'Product A has a demand decline pattern.' },
  { title: 'Opportunity', value: 'Electronics', detail: 'Best category for short-term expansion.' },
  { title: 'Outliers', value: '3', detail: 'Requires review before reporting.' },
];

export default function InsightsPage({ user, dataset }) {
  const [question, setQuestion] = useState('Why did revenue grow this month?');
  const [answer, setAnswer] = useState('Revenue grew because North region volume increased and Electronics stayed above average.');
  const [focus, setFocus] = useState('Trends');

  const rows = useMemo(() => dataset?.rows || [], [dataset]);
  const datasetLabel = rows.length ? `${dataset.fileName || 'uploaded file'} · ${rows.length} rows` : 'No active dataset';

  const ask = () => {
    const text = question.toLowerCase();
    if (text.includes('drop')) setAnswer('Sales dropped mainly in Accessories due to a weaker conversion rate.');
    else if (text.includes('top')) setAnswer('Top performers are Electronics, North region, and recurring customers.');
    else setAnswer('The data suggests healthy growth with one local decline cluster that should be monitored.');
  };

  return (
    <CyanShell user={user}>
      <section className="feature-bottom-grid" style={{ gridTemplateColumns: '1.15fr 0.85fr' }}>
        <article className="feature-panel" style={{ background: 'linear-gradient(135deg, #052e32 0%, #0f766e 55%, #14b8a6 100%)', color: '#fff' }}>
          <p style={{ letterSpacing: '0.18em', fontSize: 11, textTransform: 'uppercase', opacity: 0.8 }}>Insight studio</p>
          <h1 style={{ fontSize: 54, lineHeight: 0.95, marginTop: 10 }}>Why this happened?</h1>
          <p style={{ marginTop: 12, maxWidth: 680, color: 'rgba(255,255,255,0.82)' }}>
            Turn raw data into explanations, risks, and opportunities with a more analytical view than dashboards.
          </p>
          <div className="feature-action-list" style={{ marginTop: 18 }}>
            {['Trends', 'Risks', 'Opportunities', 'Why this happened?'].map((item) => (
              <button key={item} type="button" onClick={() => setFocus(item)}>{item}</button>
            ))}
          </div>
          <p className="feature-action-message" style={{ marginTop: 16, background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.18)' }}>
            Connected dataset: {datasetLabel}
          </p>
        </article>

        <article className="feature-panel">
          <header><h2>AI Question</h2></header>
          <div className="feature-input-grid">
            <label className="feature-input-wrap" style={{ gridColumn: '1 / -1' }}>
              <span>Ask a business question</span>
              <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Why did sales drop in one region?" />
            </label>
          </div>
          <div className="feature-action-list">
            <button type="button" onClick={ask}>Analyze</button>
            <button type="button" onClick={() => setQuestion('Show top products')}>Top products</button>
            <button type="button" onClick={() => setQuestion('Explain revenue drop')}>Explain drop</button>
          </div>
          <p className="feature-action-message">{answer}</p>
        </article>
      </section>

      <section className="feature-stats-grid">
        {insightSeeds.map((item) => (
          <article key={item.title} className="feature-stat-card">
            <p>{item.title}</p>
            <h3>{item.value}</h3>
            <small>{item.detail}</small>
          </article>
        ))}
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header><h2>Focus Mode</h2></header>
          <div className="feature-activity-table">
            <div className="row head"><span>Category</span><span>Status</span><span>Note</span></div>
            {['Trends', 'Risks', 'Opportunities', 'Recommendations'].map((item) => (
              <div className="row" key={item}>
                <span>{item}</span>
                <span className={focus === item ? 'ok' : 'pending'}>{focus === item ? 'Active' : 'Idle'}</span>
                <span>{item === 'Trends' ? 'Seasonality and spikes' : item === 'Risks' ? 'Watch low performers' : item === 'Opportunities' ? 'Scale top categories' : 'Suggested next action'}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="feature-panel">
          <header><h2>Business Suggestion</h2></header>
          <p className="feature-action-message">
            {focus === 'Risks'
              ? 'Focus more on low inventory categories and create alerts for sudden drops.'
              : focus === 'Opportunities'
                ? 'Double down on Electronics and North region campaigns.'
                : 'Use the insights panel to explain “why this happened?” in plain business language.'}
          </p>
        </article>
      </section>
    </CyanShell>
  );
}
