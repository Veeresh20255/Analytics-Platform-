import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  FileText,
  PieChart,
  Sparkles,
  Bell,
  Settings,
  LifeBuoy,
  ChevronRight,
  Circle,
} from 'lucide-react';

const items = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Upload Data', path: '/upload', icon: Upload },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Reports', path: '/reports', icon: FileText },
  { label: 'Visualization', path: '/visualization', icon: PieChart },
  { label: 'Data Cleaning', path: '/data-cleaning', icon: Sparkles },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Help & Support', path: '/help', icon: LifeBuoy },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-[176px] min-h-screen bg-gradient-to-b from-[#2fc9ca] via-[#21beb9] to-[#14a884] p-3 text-white flex flex-col rounded-r-[30px] shadow-[0_18px_44px_rgba(13,103,96,0.24)]">
      <div className="h-14 flex items-center px-2 mb-3 rounded-[18px] bg-white/10 backdrop-blur-sm ring-1 ring-white/10">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Circle size={12} fill="white" strokeWidth={0} />
        </div>
        <p className="ml-2 text-[18px] leading-none font-semibold tracking-[-0.03em]">Secondbrain</p>
        <span className="ml-1 text-[11px] text-white/70">/ITO</span>
      </div>

      <nav className="flex-1 flex flex-col gap-2.5 pt-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-white text-slate-700 shadow-[0_10px_20px_rgba(17,24,39,0.09)]'
                  : 'bg-transparent text-white hover:bg-white/12'
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <span className="text-[11.5px] font-semibold tracking-[0.01em]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-3 bg-white/10 rounded-xl px-3 py-2.5 flex items-center justify-between text-[12px] backdrop-blur-sm">
        <span className="font-medium">Setiest</span>
        <ChevronRight size={14} />
      </div>
    </aside>
  );
}
