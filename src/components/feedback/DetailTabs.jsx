import React from 'react';

export function DetailTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[10px] border border-border/40 bg-surface-elevated p-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab)}
          className={`rounded-[8px] px-4 py-2 text-[12px] font-medium tracking-[-0.01em] transition-all ${
            activeTab === tab.id
              ? 'bg-primary text-text-on-accent shadow-sm'
              : 'text-text-muted hover:bg-bg/70 hover:text-text'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
