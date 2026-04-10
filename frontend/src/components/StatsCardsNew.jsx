import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color = 'teal' }) => {
  const isPositive = change >= 0;
  const colorClasses = {
    teal: {
      bg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
      border: 'border-teal-200/50',
      icon: 'text-teal-600',
      badge: 'bg-teal-100 text-teal-700',
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      border: 'border-blue-200/50',
      icon: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700',
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
      border: 'border-orange-200/50',
      icon: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-700',
    },
  };

  const classes = colorClasses[color] || colorClasses.teal;

  return (
    <div className={`p-6 rounded-2xl border shadow-glass ${classes.bg} ${classes.border} transition-all hover:shadow-glass-lg hover:-translate-y-1`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
        </div>
        <div className={`p-3 rounded-lg bg-white/50 backdrop-blur-sm ${classes.icon}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${classes.badge}`}>
            {isPositive ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-slate-500">from last month</span>
        </div>
      </div>

      {/* Mini chart indicator */}
      <div className="mt-4 flex gap-1">
        {[65, 58, 72, 68, 85].map((height, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all ${
              isPositive ? 'bg-green-300' : 'bg-red-300'
            }`}
            style={{ opacity: 0.4 + (height / 100) * 0.6 }}
          ></div>
        ))}
      </div>
    </div>
  );
};

const StatsCards = ({ data }) => {
  const stats = [
    { title: 'Total Sales', value: data?.totalSales || '$42,890', change: 12, icon: '💰', color: 'teal' },
    { title: 'New Users', value: data?.newUsers || '1,204', change: 8, icon: '👥', color: 'blue' },
    { title: 'Conversion', value: data?.conversion || '3,879', change: 9, icon: '📈', color: 'orange' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Sales"
        value="$42,890"
        change={12}
        icon={() => <span className="text-2xl">💰</span>}
        color="teal"
      />
      <StatCard
        title="New Users"
        value="1,204"
        change={8}
        icon={() => <span className="text-2xl">👥</span>}
        color="blue"
      />
      <StatCard
        title="Conversion"
        value="3,879"
        change={9}
        icon={() => <span className="text-2xl">📈</span>}
        color="orange"
      />
    </div>
  );
};

export default StatsCards;
