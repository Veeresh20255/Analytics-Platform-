import React, { useEffect, useState } from 'react';
import UploadPanel from '../components/UploadPanel';
import ChartBuilder from '../components/ChartBuilder';
import { getHistory, generateInsights, saveDashboard } from '../api/api';
import "../Stylesheets/dashboard-style.css";
import StockChart from '../components/StockChart';

export default function Dashboard({ user }) {
  const [history, setHistory] = useState([]);
  const [currentUpload, setCurrentUpload] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [aiResults, setAIResults] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedDashboards, setSavedDashboards] = useState([]);

  // Load history
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

  // Generate AI insights
  const handleGenerateInsights = async (uploadId) => {
    setLoadingInsights(true);
    try {
      const res = await generateInsights(uploadId);
      setAIResults(prev => ({ ...prev, [uploadId]: res.insights }));
    } catch (err) {
      console.error('AI Insights error:', err);
      alert(err?.response?.data?.message || err.message);
    } finally {
      setLoadingInsights(false);
    }
  };

  // ✅ SAVE DASHBOARD FUNCTION
  const handleSaveDashboard = async () => {
    if (!currentUpload) return;

    try {
      setSaving(true);

      await saveDashboard({
        name: currentUpload.originalName || "My Dashboard",
        config: {
          uploadId: currentUpload._id,
          fileName: currentUpload.originalName,
          createdAt: currentUpload.createdAt,
          data: currentUpload.dataJson,
          insights: aiResults[currentUpload._id] || currentUpload.aiInsights || ""
        }
      });

      alert("✅ Dashboard saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard">
      
      {/* LEFT SIDE */}
      <div className="left">
        <UploadPanel
          onUploaded={async (upload) => {
            await loadHistory();
            setCurrentUpload(upload);
          }}
        />

        <h3>Upload History</h3>
        <ul className="history-list">
          {history.map(h => (
            <li key={h._id}>
              <button onClick={() => setCurrentUpload(h)}>
                {h.originalName} — {new Date(h.createdAt).toLocaleString()}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div className="right">

        <h2>Chart Builder</h2>
        <ChartBuilder data={currentUpload?.dataJson} />

        {/* ✅ SAVE DASHBOARD BUTTON */}
        {currentUpload && (
          <button
            onClick={handleSaveDashboard}
            disabled={saving}
            style={{ marginTop: "10px" }}
          >
            {saving ? "Saving..." : "💾 Save Dashboard"}
          </button>
        )}

        <h2>Live Market</h2>
        <StockChart />

        {/* AI INSIGHTS */}
        {currentUpload && (
          <div className="insights-panel">
            <h3>AI Insights</h3>

            {user?._id === currentUpload.user?._id && (
              <button
                onClick={() => handleGenerateInsights(currentUpload._id)}
                disabled={loadingInsights}
              >
                {loadingInsights ? 'Generating...' : 'Generate Insights'}
              </button>
            )}

            {aiResults[currentUpload._id] && (
              <div className="insights-content">
                {aiResults[currentUpload._id]}
              </div>
            )}

            {!aiResults[currentUpload._id] && currentUpload.aiInsights && (
              <div className="insights-content">
                {currentUpload.aiInsights}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}