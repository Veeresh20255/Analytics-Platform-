import React from 'react';
import '../Stylesheets/kpi-card.css';

const KPICard = ({ title, value, change, icon, color = '#14a697' }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <h3 className="kpi-title">{title}</h3>
        <span className="kpi-icon" style={{ backgroundColor: `${color}20`, color: color }}>
          {icon}
        </span>
      </div>
      <div className="kpi-value">{value}</div>
      <div className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
        <span className="change-icon">{isPositive ? '↑' : '↓'}</span>
        <span className="change-text">{Math.abs(change)}%</span>
        <span className="change-label">from last month</span>
      </div>
      <div className="kpi-indicator">
        <div className="indicator-bar">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`dot ${i <= Math.min(5, Math.ceil((Math.abs(change) / 20) * 5)) ? 'active' : ''}`}></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KPICard;
