import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  FileText,
  Palette,
  Wand2,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Upload Data', path: '/upload', icon: Upload },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Visualization', path: '/visualization', icon: Palette },
    { label: 'Data Cleaning', path: '/data-cleaning', icon: Wand2 },
    { label: 'Alerts', path: '/alerts', icon: Bell },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-teal-600 via-teal-500 to-cyan-500 text-white transition-all duration-300 ease-in-out z-40 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-white/10">
        <div className={`flex items-center gap-3 ${!isOpen && 'justify-center w-full'}`}>
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-white">
            📊
          </div>
          {isOpen && <span className="text-xl font-bold">SecondBrain</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isItemActive
                  ? 'bg-white/30 shadow-lg backdrop-blur-sm'
                  : 'hover:bg-white/10'
              }`}
              title={item.label}
            >
              <Icon size={20} className="flex-shrink-0" />
              {isOpen && <span className="font-medium text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center p-3 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
