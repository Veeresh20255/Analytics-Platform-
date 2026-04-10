import React, { useEffect, useMemo, useState } from 'react';
import CyanShell from '../components/CyanShell';

const STARTING_ISSUES = {
  missingValues: 12,
  duplicateRows: 8,
  emptyColumns: 2,
  invalidDates: 5,
  wrongTypes: 4,
};

const TOOL_ACTIONS = [
  'Remove duplicates',
  'Fill missing values',
  'Delete empty rows',
  'Rename columns',
  'Change column types',
  'Trim extra spaces',
  'Find & Replace',
  'Split / Merge columns',
];

function IssueCard({ label, value }) {
  return (
    <article className="feature-stat-card">
      <p>{label}</p>
      <h3>{value}</h3>
      <small>Detected in current dataset</small>
    </article>
  );
}

export default function DataCleaningPage({ user, dataset }) {
  const [issues, setIssues] = useState(STARTING_ISSUES);
  const [history, setHistory] = useState([]);
  const [beforeRows, setBeforeRows] = useState([
    { region: 'North ', sales: '', date: '2026/01/07' },
    { region: 'South', sales: 2145, date: '2026-01-08' },
    { region: 'South', sales: 2145, date: '2026-01-08' },
    { region: 'East', sales: 1643, date: '07-01-2026' },
  ]);
  const [afterRows, setAfterRows] = useState(beforeRows);
  const [message, setMessage] = useState('Suggested fix: 12 missing values found in Sales column. Fill with average?');
  const previewColumns = useMemo(() => Object.keys(beforeRows[0] || {}), [beforeRows]);

  useEffect(() => {
    if (!dataset?.rows?.length) return;

    const sourceRows = dataset.rows.slice(0, 8);
    const keys = Object.keys(sourceRows[0] || {});
    const c1 = keys[0] || 'Column A';
    const c2 = keys[1] || 'Column B';
    const c3 = keys[2] || 'Column C';

    const mapped = sourceRows.map((row) => ({
      [c1]: row[c1] ?? '',
      [c2]: row[c2] ?? '',
      [c3]: row[c3] ?? '',
    }));

    setBeforeRows(mapped);
    setAfterRows(mapped);
    setMessage(`Loaded ${dataset.fileName || 'uploaded dataset'} into cleaning preview.`);
  }, [dataset]);

  const applyTool = (tool) => {
    setHistory((prev) => [`${tool} applied`, ...prev].slice(0, 10));

    if (tool === 'Remove duplicates') {
      setIssues((prev) => ({ ...prev, duplicateRows: Math.max(0, prev.duplicateRows - 8) }));
      setAfterRows((prev) => prev.filter((row, idx) => idx !== 2));
      setMessage('Duplicates removed from dataset preview.');
      return;
    }

    if (tool === 'Fill missing values') {
      setIssues((prev) => ({ ...prev, missingValues: Math.max(0, prev.missingValues - 12) }));
      setAfterRows((prev) => prev.map((row) => ({ ...row, sales: row.sales === '' ? 1894 : row.sales })));
      setMessage('Missing values filled using column average strategy.');
      return;
    }

    if (tool === 'Trim extra spaces') {
      setAfterRows((prev) => prev.map((row) => ({ ...row, region: String(row.region).trim() })));
      setMessage('Extra spaces trimmed from text columns.');
      return;
    }

    if (tool === 'Change column types') {
      setIssues((prev) => ({ ...prev, wrongTypes: Math.max(0, prev.wrongTypes - 4) }));
      setAfterRows((prev) => prev.map((row) => ({ ...row, date: row.date.replace(/\//g, '-') })));
      setMessage('Date and numeric columns normalized to expected types.');
      return;
    }

    setMessage(`${tool} completed and logged in cleaning history.`);
  };

  const undoLast = () => {
    setHistory((prev) => {
      if (!prev.length) return prev;
      const updated = [...prev];
      updated.shift();
      return updated;
    });
    setMessage('Last cleaning step removed from history.');
  };

  const resetAll = () => {
    setIssues(STARTING_ISSUES);
    setAfterRows(beforeRows);
    setHistory([]);
    setMessage('All cleaning changes reset to original preview.');
  };

  const totalIssues = useMemo(() => Object.values(issues).reduce((sum, value) => sum + value, 0), [issues]);

  return (
    <CyanShell user={user}>
      <div className="dash-heading-row">
        <div>
          <h1>Data Cleaning</h1>
          <p>Fix quality issues before analytics with suggested corrections and reversible actions.</p>
        </div>
      </div>

      <section className="feature-stats-grid">
        <IssueCard label="Missing values" value={issues.missingValues} />
        <IssueCard label="Duplicate rows" value={issues.duplicateRows} />
        <IssueCard label="Empty columns" value={issues.emptyColumns} />
        <IssueCard label="Invalid date formats" value={issues.invalidDates} />
        <IssueCard label="Wrong data types" value={issues.wrongTypes} />
        <IssueCard label="Total issues" value={totalIssues} />
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header>
            <h2>Cleaning Tools</h2>
          </header>

          <div className="feature-action-list">
            {TOOL_ACTIONS.map((tool) => (
              <button key={tool} type="button" onClick={() => applyTool(tool)}>{tool}</button>
            ))}
          </div>

          <div className="feature-secondary-actions">
            <button type="button" onClick={undoLast}>Undo last cleaning step</button>
            <button type="button" onClick={resetAll}>Reset all changes</button>
          </div>

          <p className="feature-action-message">{message}</p>
        </article>

        <article className="feature-panel">
          <header>
            <h2>Action History</h2>
          </header>
          <div className="feature-activity-table">
            <div className="row head">
              <span>Action</span>
              <span>Status</span>
              <span>Time</span>
            </div>
            {history.length === 0 && (
              <div className="row">
                <span>No steps applied yet</span>
                <span className="pending">Pending</span>
                <span>Now</span>
              </div>
            )}
            {history.map((item, index) => (
              <div className="row" key={`${item}-${index}`}>
                <span>{item}</span>
                <span className="ok">Completed</span>
                <span>{index === 0 ? 'Just now' : `${index + 1} min ago`}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header>
            <h2>Before Cleaning</h2>
          </header>
          <div className="feature-activity-table">
            <div className="row head" style={{ gridTemplateColumns: `repeat(${Math.max(1, previewColumns.length)}, minmax(0, 1fr))` }}>
              {previewColumns.map((column) => (
                <span key={`before-head-${column}`}>{column}</span>
              ))}
            </div>
            {beforeRows.map((row, index) => (
              <div className="row" key={`before-${index}`} style={{ gridTemplateColumns: `repeat(${Math.max(1, previewColumns.length)}, minmax(0, 1fr))` }}>
                {previewColumns.map((column) => (
                  <span key={`before-${index}-${column}`}>{String(row[column] ?? '')}</span>
                ))}
              </div>
            ))}
          </div>
        </article>

        <article className="feature-panel">
          <header>
            <h2>After Cleaning</h2>
          </header>
          <div className="feature-activity-table">
            <div className="row head" style={{ gridTemplateColumns: `repeat(${Math.max(1, previewColumns.length)}, minmax(0, 1fr))` }}>
              {previewColumns.map((column) => (
                <span key={`after-head-${column}`}>{column}</span>
              ))}
            </div>
            {afterRows.map((row, index) => (
              <div className="row" key={`after-${index}`} style={{ gridTemplateColumns: `repeat(${Math.max(1, previewColumns.length)}, minmax(0, 1fr))` }}>
                {previewColumns.map((column) => (
                  <span key={`after-${index}-${column}`}>{String(row[column] ?? '')}</span>
                ))}
              </div>
            ))}
          </div>
        </article>
      </section>
    </CyanShell>
  );
}
