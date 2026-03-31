import React from 'react';

export function FilterChips({ filters, onClear }) {
  const entries = Object.entries(filters).filter(([, value]) => value && value !== 'all');

  if (!entries.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([key, value]) => (
        <button
          key={key}
          type="button"
          onClick={() => onClear(key)}
          className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary"
        >
          {key}: {value}
        </button>
      ))}
    </div>
  );
}
