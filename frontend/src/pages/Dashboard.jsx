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
          <div className="insights-panel">
            <h3>AI Insights</h3>
            <button onClick={handleGenerateInsights} disabled={loadingInsights}>
              {loadingInsights ? 'Generating...' : 'Generate Insights'}
            </button>
            {insights && <div className="insights-content">{insights}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
