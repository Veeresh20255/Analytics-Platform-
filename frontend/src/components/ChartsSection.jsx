import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ChevronDown } from 'lucide-react';

const PIE_COLORS = ['#2dd4bf', '#60a5fa', '#f59e0b', '#22c55e', '#a78bfa', '#f87171'];

function EmptyChart() {
  return (
    <div className="h-full min-h-[240px] flex items-center justify-center text-[#9aa4b2] text-sm">
      Upload data to view analytics
    </div>
  );
}

function FilterPill({ label }) {
  return (
    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#dfe5ef] bg-[#f7f9fc] text-xs text-slate-600 hover:bg-white transition-colors">
      {label}
      <ChevronDown size={12} />
    </button>
  );
}

export default function ChartsSection({ rows }) {
  const parsed = useMemo(() => {
    if (!rows?.length) {
      const mock = [
        { label: 'Jan', sales: 34, revenue: 42 },
        { label: 'Feb', sales: 48, revenue: 34 },
        { label: 'Mar', sales: 41, revenue: 56 },
        { label: 'Apr', sales: 57, revenue: 61 },
        { label: 'May', sales: 63, revenue: 55 },
        { label: 'Jun', sales: 72, revenue: 79 },
      ];

      return {
        trimmed: mock,
        pie: mock.map((m) => ({ name: m.label, value: m.sales })),
        valueA: 'sales',
        valueB: 'revenue',
        isMock: true,
      };
    }

    const keys = Object.keys(rows[0] || {});
    const numericKeys = keys.filter((key) =>
      rows.every((row) => row[key] === null || row[key] === '' || !Number.isNaN(Number(row[key])))
    );

    if (!numericKeys.length) return null;

    const labelKey = keys.find((k) => !numericKeys.includes(k)) || keys[0];
    const valueA = numericKeys[0];
    const valueB = numericKeys[1] || numericKeys[0];

    const trimmed = rows.slice(0, 8).map((row, index) => ({
      label: String(row[labelKey] ?? `Row ${index + 1}`),
      [valueA]: Number(row[valueA] || 0),
      [valueB]: Number(row[valueB] || 0),
    }));

    const pie = trimmed.slice(0, 6).map((item) => ({
      name: item.label,
      value: item[valueA],
    }));

    return { trimmed, pie, valueA, valueB, isMock: false };
  }, [rows]);

  return (
    <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      <div className="bg-white p-5 rounded-[22px] shadow-[0_8px_20px_rgba(15,23,42,0.06)] border border-[#e9edf5] min-h-[320px]">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-[15px] font-semibold text-[#1f2937] tracking-[-0.02em]">Sales & Revenue Trends</h3>
          <div className="flex items-center gap-2">
            <FilterPill label="Year" />
            <FilterPill label="Month" />
            <FilterPill label="Region" />
          </div>
        </div>
        <div className="mt-4 h-[250px]">
          {parsed ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={parsed.trimmed} barCategoryGap={14} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey={parsed.valueA} name="Sales" fill="#2ecfc4" radius={[6, 6, 0, 0]} />
                <Bar dataKey={parsed.valueB} name="Revenue" fill="#66b6ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>
      </div>

      <div className="bg-white p-5 rounded-[22px] shadow-[0_8px_20px_rgba(15,23,42,0.06)] border border-[#e9edf5] min-h-[320px]">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-[15px] font-semibold text-[#1f2937] tracking-[-0.02em]">Sales Breakdown</h3>
          <div className="flex items-center gap-2">
            <FilterPill label="Year" />
            <FilterPill label="Category" />
            <FilterPill label="Channel" />
          </div>
        </div>
        <div className="mt-4 grid h-[250px] grid-cols-1 gap-3 lg:grid-cols-[1.15fr_0.85fr] items-center">
          {parsed ? (
            <>
              <div className="h-full rounded-[18px] bg-gradient-to-br from-[#f8fbfe] to-white p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={parsed.trimmed}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey={parsed.valueA} stroke="#2ecfc4" strokeWidth={2.2} dot={false} />
                    <Line type="monotone" dataKey={parsed.valueB} stroke="#66b6ff" strokeWidth={2.2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="relative h-full min-h-[220px] rounded-[18px] bg-gradient-to-br from-[#f8fbfe] to-white p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={parsed.pie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={84}
                      paddingAngle={2}
                    >
                      {parsed.pie.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-[#e3e8f0] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#8a94a6] shadow-sm">
                  894
                </div>
                <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-[#e3e8f0] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#8a94a6] shadow-sm">
                  10%
                </div>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[#f7f9fc] text-[#4b5563] shadow-[0_0_0_10px_rgba(247,249,252,0.8)]">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em]">USA</span>
                    <span className="text-[11px] text-[#7b8797]">Center</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="lg:col-span-2">
              <EmptyChart />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
