import React, { useState } from 'react';
import KPICard from '../components/KPICard';
import '../Stylesheets/dashboard-new.css';

const trendBars = [
  { month: 'Jan', sales: 28, revenue: 18 },
  { month: 'Feb', sales: 38, revenue: 26 },
  { month: 'Mar', sales: 33, revenue: 21 },
  { month: 'Apr', sales: 44, revenue: 31 },
  { month: 'May', sales: 39, revenue: 24 },
  { month: 'Jun', sales: 52, revenue: 35 },
  { month: 'Jul', sales: 46, revenue: 29 },
  { month: 'Aug', sales: 61, revenue: 42 },
];

const breakdownSegments = [
  { label: 'USA', value: 38, color: '#4a86ff' },
  { label: 'Europe', value: 20, color: '#ff9f59' },
  { label: 'Asia', value: 16, color: '#62d19b' },
  { label: 'Other', value: 26, color: '#77cbe1' },
];

export default function Dashboard() {
  const [fileName, setFileName] = useState('No file chosen');

  const donutStops = breakdownSegments.reduce(
    (acc, segment) => {
      const start = acc.offset;
      acc.offset += segment.value;
      acc.parts.push(`${segment.color} ${start}% ${acc.offset}%`);
      return acc;
    },
    { offset: 0, parts: [] }
  );

  const donutGradient = `conic-gradient(${donutStops.parts.join(', ')})`;

  return (
    <div className="dashboard-page">
      <header className="dashboard-topbar">
        <div className="topbar-brand">
          <span className="topbar-brand-mark">◧</span>
          <span className="topbar-brand-name">SecondBrain</span>
          <span className="topbar-brand-sub">/TTO</span>
        </div>

        <label className="topbar-search">
          <span className="topbar-search-icon">⌕</span>
          <input type="text" value="talk.scaling" readOnly />
        </label>

        <nav className="topbar-links" aria-label="Top navigation">
          <button type="button">Resources</button>
          <button type="button">Reports</button>
          <button type="button">Alerts</button>
          <button type="button">Settings</button>
          <button type="button">Settings</button>
        </nav>

        <div className="topbar-actions">
          <button type="button" className="icon-chip">⌂</button>
          <button type="button" className="icon-chip">◔</button>
          <div className="topbar-avatar">AM</div>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-hero">
          <div>
            <h1>Upload Data File</h1>
            <p>Export spreadsheets (.xlsx, .csv) for analysis</p>
          </div>

          <div className="hero-actions">
            <button type="button" className="hero-chip ghost">✦ folders</button>
            <button type="button" className="hero-chip solid">Oeaf / Generic</button>
          </div>
        </div>

        <div className="summary-grid">
          <div className="upload-card">
            <div className="upload-dropzone">
              <div className="upload-drop-icon">◧</div>
              <div className="upload-drop-copy">
                <div className="upload-drop-title">Buboze</div>
                <p>Drop your Excel or CSV file here, or</p>
              </div>
              <label className="upload-file-button">
                <input
                  type="file"
                  accept=".xls,.xlsx,.csv"
                  onChange={(event) => setFileName(event.target.files?.[0]?.name || 'No file chosen')}
                />
                Choose File
              </label>
              <button type="button" className="upload-submit">Upload Excel</button>
              <span className="upload-file-name">{fileName}</span>
            </div>
          </div>

          <KPICard title="Total Sales" value="$42,890" change={12} icon="💰" color="#49cdbd" />
          <KPICard title="New Users" value="1204" change={8} icon="👥" color="#72b4ff" />
          <KPICard title="Conversion" value="3879" change={9} icon="📈" color="#ffcb67" />
        </div>

        <div className="charts-grid">
          <article className="chart-card chart-card-bars">
            <div className="chart-card-head">
              <div>
                <h2>Sales & Revenue Trends</h2>
              </div>
              <div className="chart-filters">
                <button type="button">Year</button>
                <button type="button">Month</button>
                <button type="button">Region</button>
              </div>
            </div>

            <div className="bar-chart">
              <div className="bar-grid">
                {trendBars.map((bar) => (
                  <div key={bar.month} className="bar-group">
                    <div className="bar-column sales" style={{ height: `${bar.sales}%` }} />
                    <div className="bar-column revenue" style={{ height: `${bar.revenue}%` }} />
                  </div>
                ))}
              </div>

              <div className="chart-axis">
                {trendBars.map((bar) => (
                  <span key={bar.month}>{bar.month}</span>
                ))}
              </div>

              <div className="chart-legend">
                <span><i className="legend-swatch sales" /> Sales</span>
                <span><i className="legend-swatch revenue" /> Revenue</span>
              </div>
            </div>
          </article>

          <article className="chart-card chart-card-breakdown">
            <div className="chart-card-head">
              <div>
                <h2>Sales Breakdown</h2>
              </div>
              <span className="chart-count">694</span>
            </div>

            <div className="breakdown-chart">
              <div className="breakdown-plot">
                <div className="breakdown-lines">
                  <span className="line line-a" />
                  <span className="line line-b" />
                  <span className="line line-c" />
                </div>

                <div className="breakdown-donut" style={{ background: donutGradient }}>
                  <div className="breakdown-donut-hole">USA</div>
                </div>
              </div>

              <div className="breakdown-legend">
                {breakdownSegments.map((segment) => (
                  <span key={segment.label}><i style={{ background: segment.color }} /> {segment.label}</span>
                ))}
              </div>
            </div>
          </article>
        </div>

        <div className="action-rail">
          <button type="button">🧹 Data Cleaning</button>
          <button type="button">🔎 Filtering</button>
          <button type="button">🔷 Data Transform</button>
          <button type="button">✦ AI Insights</button>
          <button type="button">⬇ Download</button>
        </div>
      </section>
    </div>
  );
}
