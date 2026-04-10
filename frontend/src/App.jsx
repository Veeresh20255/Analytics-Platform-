import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './index.css';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const FeaturePage = lazy(() => import('./pages/FeaturePage'));
const DataCleaningPage = lazy(() => import('./pages/DataCleaningPage'));
const VisualizationPage = lazy(() => import('./pages/VisualizationPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const AlertsPage = lazy(() => import('./pages/AlertsPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Settings = lazy(() => import('./pages/Settings'));
const Terms = lazy(() => import('./pages/Terms'));

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const [dataset, setDataset] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('activeDataset')) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!dataset) {
      localStorage.removeItem('activeDataset');
      return;
    }

    const bounded = {
      ...dataset,
      rows: Array.isArray(dataset.rows) ? dataset.rows.slice(0, 500) : [],
    };
    localStorage.setItem('activeDataset', JSON.stringify(bounded));
  }, [dataset]);

  const navigate = useNavigate();
  const isAuthPage = !user;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <Suspense
      fallback={(
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium shadow-2xl shadow-cyan-950/20">
            Loading workspace...
          </div>
        </div>
      )}
    >
      {isAuthPage ? (
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="/register" element={<Register onRegister={setUser} />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            <Route path="/upload" element={<Navigate to="/login" replace />} />
            <Route path="/analytics" element={<Navigate to="/login" replace />} />
            <Route path="/reports" element={<Navigate to="/login" replace />} />
            <Route path="/visualization" element={<Navigate to="/login" replace />} />
            <Route path="/insights" element={<Navigate to="/login" replace />} />
            <Route path="/data-cleaning" element={<Navigate to="/login" replace />} />
            <Route path="/alerts" element={<Navigate to="/login" replace />} />
            <Route path="/team" element={<Navigate to="/login" replace />} />
            <Route path="/settings" element={<Navigate to="/login" replace />} />
            <Route path="/help" element={<Navigate to="/login" replace />} />
            <Route
              path="/admin"
              element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </main>
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardHome user={user} onLogout={logout} />} />
            <Route
              path="/upload"
              element={<Dashboard user={user} onLogout={logout} onDatasetChange={setDataset} dataset={dataset} />}
            />
            <Route
              path="/analytics"
              element={
                <FeaturePage
                  user={user}
                  dataset={dataset}
                  title="Analytics"
                  subtitle="Explore trends, filters, comparisons, and drill-down analysis from uploaded datasets."
                  stats={[
                    { label: 'Top Product', value: 'Wireless Headset', hint: 'Highest revenue contributor' },
                    { label: 'Best Region', value: 'North', hint: '24% growth in current quarter' },
                    { label: 'Lowest Performer', value: 'Accessories', hint: 'Needs campaign support' },
                    { label: 'Highest Growth Category', value: 'Electronics', hint: 'YoY leader' },
                  ]}
                  cards={[
                    { title: 'Filter Panel', text: 'Apply date, category, region, and product filters for precise slicing.' },
                    { title: 'Trend Analysis', text: 'Inspect pattern shifts, seasonality, and performance turns over time.' },
                    { title: 'Comparison Analysis', text: 'Switch to compare mode to evaluate Jan vs Feb and 2023 vs 2024.' },
                    { title: 'Drill-down View', text: 'Click a category to open sub-category and SKU-level detail instantly.' },
                  ]}
                  actions={['Apply Filters', 'Open Compare Mode', 'Run YoY Comparison', 'Drill Into Category']}
                  formFields={[
                    { label: 'Date Filter', type: 'select', options: ['Last 30 days', 'Last 90 days', 'This year'] },
                    { label: 'Category Filter', type: 'select', options: ['All', 'Electronics', 'Home', 'Fashion'] },
                    { label: 'Region Filter', type: 'select', options: ['All', 'North', 'South', 'East', 'West'] },
                    { label: 'Metrics', type: 'select', options: ['Revenue', 'Sales', 'Quantity', 'Profit', 'Growth'] },
                  ]}
                  activity={[
                    { event: 'Trend analysis run', status: 'Completed', time: '4 min ago' },
                    { event: 'Compare mode: Jan vs Feb', status: 'Completed', time: '22 min ago' },
                    { event: 'Drill-down to product-level', status: 'Pending', time: '1 hour ago' },
                  ]}
                />
              }
            />
            <Route
              path="/reports"
              element={<ReportsPage user={user} dataset={dataset} />}
            />
            <Route
              path="/visualization"
              element={<VisualizationPage user={user} dataset={dataset} />}
            />
            <Route
              path="/data-cleaning"
              element={<DataCleaningPage user={user} dataset={dataset} />}
            />
            <Route
              path="/insights"
              element={<InsightsPage user={user} dataset={dataset} />}
            />
            <Route
              path="/alerts"
              element={<AlertsPage user={user} dataset={dataset} />}
            />
            <Route
              path="/team"
              element={<TeamPage user={user} dataset={dataset} />}
            />
            <Route
              path="/help"
              element={<HelpPage user={user} dataset={dataset} />}
            />
            <Route path="/settings" element={<Settings user={user} />} />
            <Route
              path="/admin"
              element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" replace />}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </>
      )}
    </Suspense>
  );
}

export default App;
