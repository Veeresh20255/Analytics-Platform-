import React, { useState } from 'react';
import { Search, Bell, Settings, LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="h-20 bg-white/40 backdrop-blur-lg border-b border-white/30 sticky top-0 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white/30 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-400 transition-all focus:ring-2 focus:ring-teal-200"
            />
            <Search
              size={18}
              className="absolute right-3 top-2.5 text-slate-400 group-hover:text-teal-500 transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notification Bell */}
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors relative">
            <Bell size={20} className="text-slate-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <Settings size={20} className="text-slate-700" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/30">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors ml-2"
            title="Logout"
          >
            <LogOut size={20} className="text-slate-700" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
