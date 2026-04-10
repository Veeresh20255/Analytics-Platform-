import React from 'react';
import { Wand2, Filter, Zap, Sparkles, Download } from 'lucide-react';

const ActionButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/40 border border-white/30 hover:bg-white/60 hover:border-white/50 hover:shadow-glass transition-all duration-200 text-slate-700 font-medium text-sm group"
  >
    <Icon
      size={18}
      className="group-hover:scale-110 transition-transform"
    />
    {label}
  </button>
);

const ActionBar = ({ onDataCleaning, onFiltering, onTransform, onInsights, onDownload, hasData = false }) => {
  return (
    <div className="flex flex-wrap gap-3 p-6 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 shadow-glass">
      <ActionButton
        icon={Wand2}
        label="Data Cleaning"
        onClick={onDataCleaning}
      />
      <ActionButton
        icon={Filter}
        label="Filtering"
        onClick={onFiltering}
      />
      <ActionButton
        icon={Zap}
        label="Data Transform"
        onClick={onTransform}
      />
      <ActionButton
        icon={Sparkles}
        label="AI Insights"
        onClick={onInsights}
      />
      <ActionButton
        icon={Download}
        label="Download"
        onClick={onDownload}
        disabled={!hasData}
      />
    </div>
  );
};

export default ActionBar;
