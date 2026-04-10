import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../Stylesheets/dashboard-exact.css';
import {
  Bell,
  ChevronDown,
  Circle,
  CircleUserRound,
  Gauge,
  LayoutDashboard,
  Link2,
  PieChart,
  Search,
  Settings,
  Upload,
  BarChart3,
  FileText,
  LifeBuoy,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Upload Data', path: '/upload', icon: Upload },
  { label: 'Data Cleaning', path: '/data-cleaning', icon: Sparkles },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Visualization', path: '/visualization', icon: PieChart },
  { label: 'Reports', path: '/reports', icon: FileText },
  { label: 'Insights', path: '/insights', icon: Gauge },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'Team', path: '/team', icon: CircleUserRound },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Help & Support', path: '/help', icon: LifeBuoy },
];

export default function CyanShell({ user, children }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="dash-v2-page">
      <div className="dash-v2-shell">
        <aside className="dash-side">
          <div className="dash-logo">
            <div className="dash-logo-mark">
              <Circle size={12} fill="currentColor" strokeWidth={0} />
            </div>
            <p>
              Secondbrain<span>/ITO</span>
            </p>
          </div>

          <nav className="dash-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path} className={active ? 'is-active' : ''}>
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="dash-side-footer">
            <span>Setiest</span>
            <ChevronDown size={13} />
          </div>
        </aside>

        <main className="dash-main">
          <header className="dash-topbar">
            <div className="dash-search">
              <Search size={14} />
              <input defaultValue="z-all-scasino" type="text" />
            </div>

            <div className="dash-links">
              <button type="button" onClick={() => navigate('/dashboard')}>Resources</button>
              <button type="button" onClick={() => navigate('/reports')}>Reports</button>
              <button type="button" onClick={() => navigate('/alerts')}>Alerts</button>
              <button type="button" onClick={() => navigate('/settings')}>Settings</button>
              <button type="button" onClick={() => navigate('/help')}>Support</button>
            </div>

            <div className="dash-user-tools">
              <button type="button" onClick={() => navigate('/alerts')} aria-label="Open alerts"><Bell size={15} /></button>
              <button type="button" onClick={() => navigate('/settings')} aria-label="Open settings"><Settings size={15} /></button>
              <button type="button" onClick={() => navigate('/reports')} aria-label="Open reports"><Link2 size={15} /></button>
              <button type="button" onClick={() => navigate('/analytics')} aria-label="Open analytics"><Gauge size={15} /></button>
              <div className="dash-avatar">
                {user?.avatar ? <img src={user.avatar} alt="avatar" /> : <CircleUserRound size={17} />}
              </div>
            </div>
          </header>

          <section className="dash-content-wrap">{children}</section>
        </main>
      </div>
    </div>
  );
}
