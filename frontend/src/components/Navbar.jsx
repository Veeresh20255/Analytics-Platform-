import React from 'react';
import { Bell, Search, Settings, Link2, Gauge, CircleUserRound } from 'lucide-react';

export default function Navbar({ user }) {
  return (
    <header className="bg-white border border-[#e4e8f0] rounded-[20px] shadow-[0_10px_28px_rgba(15,23,42,0.06)] px-5 py-2.5 flex items-center gap-4">
      <div className="relative w-full max-w-[260px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          defaultValue="z-all-scasino"
          className="w-full h-8 pl-8 pr-3 text-[11px] rounded-full border border-[#e3e8f0] bg-[#f8fafe] text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="hidden lg:flex items-center gap-5 text-[11px] text-slate-500 font-medium flex-1 justify-center tracking-wide">
        <span className="cursor-pointer hover:text-slate-700 transition-colors">Resources</span>
        <span className="cursor-pointer hover:text-slate-700 transition-colors">Reports</span>
        <span className="cursor-pointer hover:text-slate-700 transition-colors">Alerts</span>
        <span className="cursor-pointer hover:text-slate-700 transition-colors">Settings</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><Bell size={16} className="text-slate-500" /></button>
        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><Settings size={16} className="text-slate-500" /></button>
        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><Link2 size={16} className="text-slate-500" /></button>
        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><Gauge size={16} className="text-slate-500" /></button>
        <div className="ml-1 h-9 w-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-[11px] font-semibold shadow-sm overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt={user?.name || 'User'} className="h-full w-full object-cover" />
          ) : (
            <CircleUserRound size={17} />
          )}
        </div>
      </div>
    </header>
  );
}
