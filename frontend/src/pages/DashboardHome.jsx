import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock3,
  FileBarChart2,
  History,
  Search,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CyanShell from '../components/CyanShell';

const recentHistory = [
  { file: 'sales_q1.xlsx', status: 'Processed', when: '2 min ago' },
  { file: 'users_march.csv', status: 'Processed', when: '25 min ago' },
  { file: 'inventory_week12.xlsx', status: 'Pending', when: '1 hour ago' },
  { file: 'revenue_2026.csv', status: 'Processed', when: 'Yesterday' },
];

function HomeCard({ icon, title, value, hint }) {
  return (
    <article className="home-card">
      <header>
        <span className="home-icon">{icon}</span>
        <p>{title}</p>
      </header>
      <h3>{value}</h3>
      <small>{hint}</small>
    </article>
  );
}

const trendData = [
  { month: 'Jan', sales: 120, revenue: 160, profit: 70, expense: 50 },
  { month: 'Feb', sales: 154, revenue: 188, profit: 84, expense: 61 },
  { month: 'Mar', sales: 138, revenue: 176, profit: 78, expense: 58 },
  { month: 'Apr', sales: 173, revenue: 210, profit: 95, expense: 62 },
  { month: 'May', sales: 196, revenue: 238, profit: 110, expense: 70 },
  { month: 'Jun', sales: 202, revenue: 251, profit: 118, expense: 72 },
];

export default function DashboardHome({ user }) {
  const navigate = useNavigate();
  const [aiQuestion, setAiQuestion] = useState('Show me top 5 products');
  const [aiAnswer, setAiAnswer] = useState('Electronics accessories currently lead by total sales value.');

  const quickActions = [
    { label: 'Upload New File', path: '/upload' },
    { label: 'Start Analysis', path: '/analytics' },
    { label: 'Create Report', path: '/reports' },
    { label: 'Clean Data', path: '/data-cleaning' },
  ];

  const insights = useMemo(
    () => [
      'Sales increased by 15% this month.',
      'Electronics is top category.',
      'North region is driving most revenue growth.',
    ],
    []
  );

  const runAskAi = () => {
    const q = aiQuestion.trim().toLowerCase();
    if (!q) {
      setAiAnswer('Ask a question to generate an insight answer.');
      return;
    }

    if (q.includes('top 5')) {
      setAiAnswer('Top 5 products: Headset, Smartwatch, Laptop Sleeve, Keyboard, and Mouse.');
      return;
    }

    if (q.includes('region')) {
      setAiAnswer('North region leads this month with a 24% revenue increase.');
      return;
    }

    setAiAnswer('AI summary: revenue trend is positive, while category performance remains strongest in electronics.');
  };

  return (
    <CyanShell user={user}>
      <div className="dash-heading-row">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Track core KPIs, activity, and quick actions from one place.</p>
        </div>
      </div>

      <section className="home-grid">
        <HomeCard icon={<TrendingUp size={16} />} title="Total Revenue" value="$251K" hint="Growth +15%" />
        <HomeCard icon={<FileBarChart2 size={16} />} title="Total Sales" value="10,847" hint="This month" />
        <HomeCard icon={<Clock3 size={16} />} title="Total Orders" value="3,402" hint="Fulfilled + pending" />
        <HomeCard icon={<TrendingUp size={16} />} title="Active Datasets" value="16" hint="Ready for analysis" />
        <HomeCard icon={<FileBarChart2 size={16} />} title="Growth %" value="15%" hint="Month-over-month" />
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header>
            <h2>Monthly Sales Trend</h2>
          </header>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#2ec7cb" strokeWidth={2.5} />
                <Line type="monotone" dataKey="revenue" stroke="#4ca3f5" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="feature-panel">
          <header>
            <h2>Category / Region / Profit vs Expense</h2>
          </header>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="profit" fill="#58d0c8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="#9bbaf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="feature-bottom-grid">
        <article className="feature-panel">
          <header>
            <h2>Quick Actions</h2>
          </header>
          <div className="feature-action-list">
            {quickActions.map((action) => (
              <button key={action.label} type="button" onClick={() => navigate(action.path)}>
                {action.label}
              </button>
            ))}
          </div>
        </article>

        <article className="feature-panel">
          <header>
            <h2>Search / Ask AI</h2>
          </header>
          <div className="feature-input-grid">
            <label className="feature-input-wrap">
              <span>Ask</span>
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Show me top 5 products"
              />
            </label>
            <button type="button" className="feature-apply-btn" onClick={runAskAi}>
              <Search size={14} /> Ask AI
            </button>
          </div>
          <p className="feature-action-message">{aiAnswer}</p>
        </article>
      </section>

      <section className="home-history-card">
        <header>
          <h2><History size={18} /> Upload History</h2>
        </header>

        <div className="home-history-table">
          <div className="row head">
            <span>File</span>
            <span>Status</span>
            <span>Last Updated</span>
          </div>
          {recentHistory.map((item) => (
            <div className="row" key={`${item.file}-${item.when}`}>
              <span>{item.file}</span>
              <span className={item.status === 'Processed' ? 'ok' : 'pending'}>{item.status}</span>
              <span>{item.when}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="feature-bottom-grid">
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
            <div className="row"><span>Recently uploaded files</span><span className="ok">Updated</span><span>8 min ago</span></div>
            <div className="row"><span>Latest generated reports</span><span className="ok">Updated</span><span>17 min ago</span></div>
            <div className="row"><span>Last alerts</span><span className="pending">Pending</span><span>1 hour ago</span></div>
          </div>
        </article>

        <article className="feature-panel">
          <header>
            <h2>Mini Insights</h2>
          </header>
          <div className="feature-insight-list">
            {insights.map((insight) => (
              <p key={insight}>{insight}</p>
            ))}
          </div>
        </article>
      </section>
    </CyanShell>
  );
}
