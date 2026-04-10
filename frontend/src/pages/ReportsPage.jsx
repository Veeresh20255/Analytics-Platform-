import React, { useMemo, useState } from 'react';
import CyanShell from '../components/CyanShell';

const templates = [
  { name: 'Sales Report', tone: 'Teal', summary: 'Revenue increased by 18% this quarter.' },
  { name: 'Financial Report', tone: 'Blue', summary: 'Margin stayed healthy across all regions.' },
  { name: 'Performance Report', tone: 'Cyan', summary: 'Top category drove most of the growth.' },
  { name: 'Marketing Report', tone: 'Emerald', summary: 'Campaign CTR improved after the last refresh.' },
];

const reportSections = ['Summary', 'KPI Cards', 'Charts', 'Tables', 'Notes'];

function TemplateCard({ name, summary, tone, onPick }) {
  return (
    <button type="button" onClick={onPick} className="feature-card text-left w-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3>{name}</h3>
          <p>{summary}</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
          {tone}
        </span>
      </div>
    </button>
  );
}

export default function ReportsPage({ user, dataset }) {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [selectedSections, setSelectedSections] = useState(reportSections);
  const [autoSummary, setAutoSummary] = useState('Revenue increased by 18% this quarter. North region contributed 24% of the uplift.');
  const [status, setStatus] = useState('Choose a report template to begin building.');

  const datasetLabel = useMemo(
    () => (dataset?.rows?.length ? `${dataset.fileName || 'uploaded file'} (${dataset.rows.length} rows)` : 'No active dataset'),
    [dataset]
  );

  const pickTemplate = (template) => {
    setSelectedTemplate(template);
    setAutoSummary(template.summary);
    setStatus(`Template selected: ${template.name}`);
  };

  const toggleSection = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section) ? prev.filter((item) => item !== section) : [...prev, section]
    );
  };

  const generateAutoSummary = () => {
    const rows = dataset?.rows?.length || 0;
    if (!rows) {
      setAutoSummary('Upload a dataset to generate an auto summary.');
      setStatus('No dataset connected.');
      return;
    }

    setAutoSummary(
      `Auto summary generated from ${rows} rows: revenue trend is positive, sales are rising, and ${selectedTemplate.name.toLowerCase()} is ready for export.`
    );
    setStatus('Auto summary refreshed from connected dataset.');
  };

  const createReport = () => {
    setStatus(`Report created: ${selectedTemplate.name}`);
  };

  const exportReport = (type) => {
    setStatus(`Export started: ${type}`);
  };

  const shareReport = (type) => {
    setStatus(`Share action triggered: ${type}`);
  };

  return (
    <CyanShell user={user}>
      <div className="dash-heading-row">
        <div>
          <h1>Reports</h1>
          <p>Build business reports with templates, auto summaries, export options, and sharing workflows.</p>
        </div>
      </div>

      <section className="feature-stats-grid">
        <article className="feature-stat-card">
          <p>Selected Template</p>
          <h3>{selectedTemplate.name}</h3>
          <small>Current report base</small>
        </article>
        <article className="feature-stat-card">
          <p>Dataset Context</p>
          <h3>{dataset?.rows?.length || 0}</h3>
          <small>{datasetLabel}</small>
        </article>
        <article className="feature-stat-card">
          <p>Sections Enabled</p>
          <h3>{selectedSections.length}</h3>
          <small>Summary, tables, charts, notes</small>
        </article>
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header>
            <h2>Templates</h2>
          </header>
          <div className="feature-grid">
            {templates.map((template) => (
              <TemplateCard
                key={template.name}
                name={template.name}
                summary={template.summary}
                tone={template.tone}
                onPick={() => pickTemplate(template)}
              />
            ))}
          </div>
        </article>

        <article className="feature-panel">
          <header>
            <h2>Auto Summary</h2>
          </header>
          <p className="feature-action-message">{autoSummary}</p>
          <div className="feature-action-list">
            <button type="button" onClick={generateAutoSummary}>Generate Auto Summary</button>
            <button type="button" onClick={createReport}>Create Report</button>
            <button type="button" onClick={() => exportReport('PDF')}>Export PDF</button>
            <button type="button" onClick={() => exportReport('Excel')}>Export Excel</button>
          </div>
          <div className="feature-secondary-actions">
            <button type="button" onClick={() => shareReport('Email')}>Share by Email</button>
            <button type="button" onClick={() => shareReport('Link')}>Copy Share Link</button>
          </div>
          <p className="feature-action-message">{status}</p>
        </article>
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header>
            <h2>Report Sections</h2>
          </header>
          <div className="feature-action-list">
            {reportSections.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => toggleSection(section)}
                className={selectedSections.includes(section) ? 'solid' : ''}
              >
                {selectedSections.includes(section) ? `✓ ${section}` : section}
              </button>
            ))}
          </div>
        </article>

        <article className="feature-panel">
          <header>
            <h2>Report Preview</h2>
          </header>
          <div className="feature-activity-table">
            <div className="row head">
              <span>Section</span>
              <span>Status</span>
              <span>Notes</span>
            </div>
            {reportSections.map((section) => (
              <div className="row" key={section}>
                <span>{section}</span>
                <span className={selectedSections.includes(section) ? 'ok' : 'pending'}>
                  {selectedSections.includes(section) ? 'Included' : 'Skipped'}
                </span>
                <span>{section === 'Summary' ? autoSummary : 'Ready to customize'}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </CyanShell>
  );
}
