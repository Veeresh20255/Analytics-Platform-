import React, { useEffect, useState } from 'react';
import UploadPanel from '../components/UploadPanel';
import ChartBuilder from '../components/ChartBuilder';
import { getHistory, generateInsights } from '../api/api';
import "../Stylesheets/dashboard-style.css";

export default function Dashboard({ user }) {
  const [history, setHistory] = useState([]);
  const [currentUpload, setCurrentUpload] = useState(null);
  const [insights, setInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  const loadHistory = async () => {
    try {
      const res = await getHistory();
      setHistory(res.uploads || []);
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  useEffect(() => {
    if (user) loadHistory();
  }, [user]);

  const handleGenerateInsights = async () => {
    if (!currentUpload) return;
    setLoadingInsights(true);
    try {
      const res = await generateInsights(currentUpload._id);
      setInsights(res.insights);
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="left">
        <UploadPanel
          onUploaded={async () => {
            await loadHistory();
          }}
        />

        <h3>Upload History</h3>
        <ul className="history-list">
          {history.map(h => (
            <li key={h._id}>
              <button onClick={() => {
                setCurrentUpload(h);
                setInsights(h.aiInsights || '');
              }}>
                {h.originalName} — {new Date(h.createdAt).toLocaleString()}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="right">
        <h2>Chart Builder</h2>
        <ChartBuilder data={currentUpload?.dataJson} />

        {currentUpload && (
          <>
            <div className="insights-panel">
              <h3>AI Insights</h3>
              <button onClick={handleGenerateInsights} disabled={loadingInsights}>
                {loadingInsights ? 'Generating...' : 'Generate Insights'}
              </button>
              {insights && <div className="insights-content">{insights}</div>}
            </div>

            <KPICard title="Total Sales" value="$42,890" change={12} icon="💰" color="#49cdbd" />
            <KPICard title="New Users" value="1204" change={8} icon="👥" color="#72b4ff" />
            <KPICard title="Conversion" value="3879" change={9} icon="📈" color="#ffcb67" />
          </>
        )}

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
      </div>
    </div>
  );
}