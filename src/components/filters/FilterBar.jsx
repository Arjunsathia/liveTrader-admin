import React from 'react';

export function FilterBar({ filters, values, onChange }) {
  return (
    <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {filters.map((filter) => (
        <select
          key={filter.key}
          value={values[filter.key] ?? 'all'}
          onChange={(event) => onChange(filter.key, event.target.value)}
          className="h-11 rounded-[8px] border border-white/5 bg-bg px-4 text-[12px] font-medium text-text outline-none"
        >
          <option value="all">{filter.label}: All</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ))}
    </div>
  );
}
