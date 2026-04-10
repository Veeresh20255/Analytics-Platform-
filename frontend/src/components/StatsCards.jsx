import React from 'react';

function StatCard({ title, value, growth, dots }) {
  return (
    <div className="bg-white p-4 rounded-[18px] shadow-[0_8px_20px_rgba(15,23,42,0.06)] border border-[#e9edf5] h-[136px] flex flex-col justify-between">
      <p className="text-[13px] text-[#566071] tracking-[-0.01em]">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-[40px] leading-none font-semibold text-[#1f2937] tracking-[-0.04em]">{value}</h3>
        <span className="text-[22px] font-semibold text-[#10b981]">+{growth}%</span>
      </div>
      <div className="flex gap-1.5">
        {dots.map((d, idx) => (
          <span key={idx} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d }} />
        ))}
      </div>
    </div>
  );
}

export default function StatsCards({ metrics }) {
  return (
    <section className="grid grid-cols-3 gap-3.5">
      <StatCard
        title="Total Sales"
        value={metrics.totalSales}
        growth={12}
        dots={['#2dd4bf', '#60a5fa', '#fbbf24']}
      />
      <StatCard
        title="New Users"
        value={metrics.newUsers}
        growth={8}
        dots={['#60a5fa', '#34d399', '#f59e0b']}
      />
      <StatCard
        title="Conversion"
        value={metrics.conversion}
        growth={9}
        dots={['#22c55e', '#2dd4bf', '#93c5fd']}
      />
    </section>
  );
}
