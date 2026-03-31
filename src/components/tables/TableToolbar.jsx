import React from 'react';
import { Search } from 'lucide-react';

export function TableToolbar({ searchValue, onSearchChange, searchPlaceholder, actions, children }) {
  return (
    <div className="flex flex-col gap-4 rounded-[10px] border border-border/40 bg-surface-elevated p-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex-1 flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="relative w-full xl:max-w-[420px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/60" size={16} strokeWidth={2.5} />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-[8px] border border-white/5 bg-bg pl-10 pr-4 text-[13px] text-text outline-none transition-all focus:border-primary/40"
          />
        </div>
        {children}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
