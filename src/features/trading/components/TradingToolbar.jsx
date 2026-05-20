import React from 'react';
import { Download, RefreshCw, Search } from 'lucide-react';

/**
 * TradingToolbar — Premium command toolbar for all Trading sub-pages.
 * Props: search, onSearchChange, placeholder, filterSets[], onExport, onRefresh
 */
export function TradingToolbar({
  search,
  onSearchChange,
  filterSets = [],
  placeholder = 'Search trading records…',
  onExport,
  onRefresh,
}) {
  return (
    <div className="mb-5 flex flex-col gap-3">
      {/* Top bar: Live badge + actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Live Status Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-positive/20 bg-positive/8 px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-positive" />
            <span className="text-[10px] font-black uppercase tracking-widest text-positive">Live Stream</span>
          </div>
          <span className="hidden sm:inline text-[10px] text-text-muted/40 font-mono">MT5 Bridge · Port 4432</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <RefreshCw size={12} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}
          {onExport && (
            <button
              type="button"
              onClick={onExport}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Search + Filter Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full h-8 pl-8 pr-3 rounded-[8px] border border-border/20 bg-surface-elevated text-[12px] text-text placeholder:text-text-muted/35 outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all"
          />
        </div>

        {/* Filter Chips */}
        {filterSets.map((fs) => (
          <div key={fs.label} className="flex items-center gap-1">
            <span className="text-[10px] text-text-muted/45 font-semibold uppercase tracking-wider shrink-0">{fs.label}:</span>
            <select
              value={fs.get}
              onChange={(e) => fs.set(e.target.value)}
              className="h-8 rounded-[8px] border border-border/20 bg-surface-elevated text-[11px] text-text-muted px-2 pr-6 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
              style={{ minWidth: '90px' }}
            >
              <option value="all">All</option>
              {fs.opts.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
