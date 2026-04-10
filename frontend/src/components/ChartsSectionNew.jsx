import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';

const ChartCard = ({ title, children, icon: Icon, subtitle }) => (
  <div className="p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/30 shadow-glass hover:shadow-glass-lg transition-all">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          {Icon && <Icon size={20} className="text-teal-600" />}
          {title}
        </h3>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

const EmptyState = ({ title, subtitle }) => (
  <div className="h-80 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border border-dashed border-slate-300 flex items-center justify-center">
    <div className="text-center">
      <div className="text-4xl mb-3">📊</div>
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  </div>
);

const ChartsSection = ({ fileData, isLoading }) => {
  // Parse and prepare chart data
  const chartData = useMemo(() => {
    if (!fileData || !fileData.data || fileData.data.length === 0) {
      return null;
    }

    // Find numeric columns
    const firstRow = fileData.data[0];
    const numericColumns = Object.keys(firstRow).filter((key) => {
      const values = fileData.data.map((row) => parseFloat(row[key]));
      return values.every((v) => !isNaN(v));
    });

    if (numericColumns.length === 0) {
      return null;
    }

    // Take first two numeric columns for bar chart
    const col1 = numericColumns[0];
    const col2 = numericColumns[1] || numericColumns[0];

    // Transform data for charts
    const data = fileData.data.slice(0, 8).map((row, idx) => ({
      name: `Item ${idx + 1}`,
      [col1]: parseFloat(row[col1]) || 0,
      [col2]: parseFloat(row[col2]) || 0,
    }));

    return {
      barData: data,
      pieData: data.slice(0, 5).map((item) => ({
        name: item.name,
        value: item[col1],
      })),
      col1,
      col2,
    };
  }, [fileData]);

  const COLORS = ['#14b8a6', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <ChartCard
        title="Sales & Revenue Trends"
        icon={BarChart3}
        subtitle="Monthly performance analytics"
      >
        {!isLoading && chartData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Bar dataKey={chartData.col1} fill="#14b8a6" radius={[8, 8, 0, 0]} />
              <Bar dataKey={chartData.col2} fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            title="No data uploaded"
            subtitle="Upload an Excel or CSV file to view trends"
          />
        )}
      </ChartCard>

      {/* Pie Chart */}
      <ChartCard
        title="Sales Breakdown"
        icon={PieIcon}
        subtitle="Distribution by category"
      >
        {!isLoading && chartData ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            title="No data uploaded"
            subtitle="Upload an Excel or CSV file to view breakdown"
          />
        )}
      </ChartCard>
    </div>
  );
};

export default ChartsSection;
