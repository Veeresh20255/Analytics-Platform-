import React, { useState } from 'react';
import CyanShell from '../components/CyanShell';

export default function FeaturePage({
  user,
  dataset,
  title,
  subtitle,
  cards = [],
  stats = [],
  actions = [],
  activity = [],
  formFields = [],
}) {
  const [message, setMessage] = useState('Ready. Use any quick action to log work on this page.');
  const [activityLog, setActivityLog] = useState(activity);
  const [formValues, setFormValues] = useState(() => {
    const initial = {};
    formFields.forEach((field) => {
      initial[field.label] = field.type === 'select' ? field.options?.[0] || '' : '';
    });
    return initial;
  });

  const handleAction = (action) => {
    setMessage(`${action} completed successfully.`);
    setActivityLog((prev) => [
      { event: action, status: 'Completed', time: 'Just now' },
      ...prev,
    ].slice(0, 8));
  };

  const handleFieldChange = (label, value) => {
    setFormValues((prev) => ({ ...prev, [label]: value }));
  };

  const handleApplyForm = () => {
    const datasetMsg = dataset?.rows?.length
      ? ` Active dataset: ${dataset.fileName || 'uploaded file'} (${dataset.rows.length} rows).`
      : ' No uploaded dataset connected yet.';
    setMessage(`Selections applied. Panels and results are now updated for your current inputs.${datasetMsg}`);
    setActivityLog((prev) => [
      { event: `${title} form inputs applied`, status: 'Completed', time: 'Just now' },
      ...prev,
    ].slice(0, 8));
  };

  return (
    <CyanShell user={user}>
      <div className="dash-heading-row">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      {!!stats.length && (
        <section className="feature-stats-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="feature-stat-card">
              <p>{stat.label}</p>
              <h3>{stat.value}</h3>
              <small>{stat.hint}</small>
            </article>
          ))}
        </section>
      )}

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header>
            <h2>Connected Dataset</h2>
          </header>
          <p className="feature-action-message">
            {dataset?.rows?.length
              ? `Using ${dataset.fileName || 'uploaded file'} with ${dataset.rows.length} rows for this page context.`
              : 'No uploaded dataset found. Upload a file from Upload Data to sync analysis context.'}
          </p>
        </article>
      </section>

      <section className="feature-grid">
        {cards.map((card) => (
          <article key={card.title} className="feature-card">
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header>
            <h2>Quick Actions</h2>
          </header>

          {!!formFields.length && (
            <div className="feature-input-grid">
              {formFields.map((field) => (
                <label key={field.label} className="feature-input-wrap">
                  <span>{field.label}</span>
                  {field.type === 'select' ? (
                    <select
                      value={formValues[field.label] || ''}
                      onChange={(e) => handleFieldChange(field.label, e.target.value)}
                    >
                      {(field.options || []).map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={field.placeholder || ''}
                      value={formValues[field.label] || ''}
                      onChange={(e) => handleFieldChange(field.label, e.target.value)}
                    />
                  )}
                </label>
              ))}
              <button type="button" className="feature-apply-btn" onClick={handleApplyForm}>Apply Inputs</button>
            </div>
          )}

          <div className="feature-action-list">
            {actions.map((action) => (
              <button key={action} type="button" onClick={() => handleAction(action)}>{action}</button>
            ))}
          </div>

          <p className="feature-action-message">{message}</p>
        </article>

        <article className="feature-panel">
          <header>
            <h2>Recent Activity</h2>
          </header>

          <div className="feature-activity-table">
            <div className="row head">
              <span>Event</span>
              <span>Status</span>
              <span>Time</span>
            </div>
            {activityLog.map((item) => (
              <div className="row" key={`${item.event}-${item.time}`}>
                <span>{item.event}</span>
                <span className={item.status === 'Completed' ? 'ok' : 'pending'}>{item.status}</span>
                <span>{item.time}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </CyanShell>
  );
}
