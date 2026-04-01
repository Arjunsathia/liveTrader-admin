import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, Search, Download, RefreshCw, Filter, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

/**
 * Filter dropdown for the Trading Toolbar.
 */
function ToolbarFilter({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => o.value === value || o === value);
  const displayLabel = typeof selected === 'object' ? selected.label : selected;

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2 rounded-[9px] border border-border/30 bg-bg/70 px-3 text-[12px] font-semibold text-text-muted transition-all hover:border-border/55 hover:text-text"
      >
        {label}
        {value !== 'all' && (
          <span className="rounded-full bg-brand/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
            {displayLabel}
          </span>
        )}
        <ChevronDown size={12} className="text-text-muted/50" />
      </button>

      {open && (
        <div 
          className="absolute left-0 top-full z-50 mt-1.5 min-w-[170px] rounded-[10px] border border-border/40 bg-surface p-1 shadow-[0_16px_40px_rgba(2,6,23,0.2)]" 
        >
          <button
            onClick={() => { onChange('all'); setOpen(false); }}
            className="flex w-full items-center rounded-[8px] px-3 py-2 text-left text-[12px] text-text-muted transition-colors hover:bg-surface-elevated hover:text-text"
          >
            All
          </button>
          {options.map((o) => {
            const val = typeof o === 'object' ? o.value : o;
            const lab = typeof o === 'object' ? o.label : o;
            return (
              <button
                key={val}
                onClick={() => { onChange(val); setOpen(false); }}
                className="flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-[12px] text-text transition-colors hover:bg-surface-elevated"
              >
                <span>{lab}</span>
                {value === val && <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand">On</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function TradingToolbar({ 
  search, 
  onSearchChange, 
  filterSets = [], 
  placeholder = "Search terminal records...", 
  onExport,
  onRefresh 
}) {
  const activeFilters = filterSets.filter(f => f.get !== 'all');

  return (
    <section 
      className="rounded-[14px] border border-border/35 bg-surface-elevated p-4 shadow-card-subtle mb-6 animate-fade-in"
    >
      <div className="flex flex-col gap-4">
        {/* Top Row: Search & Meta Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[280px] flex-1">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/40" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="h-11 w-full rounded-[11px] border border-border/30 bg-bg/80 pl-11 pr-4 text-[13.5px] font-medium text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-brand/40 focus:ring-4 focus:ring-brand/5"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/40 hover:text-text transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-positive/8 border border-positive/20 mr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-positive">Live</span>
            </div>
            
            {onRefresh && (
              <Button variant="secondary" onClick={onRefresh} icon={RefreshCw} size="sm">
                Refresh
              </Button>
            )}
            
            {onExport && (
              <Button variant="secondary" onClick={onExport} icon={Download} size="sm">
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Row: Filters */}
        {filterSets.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.04] pt-4">
            <div className="flex items-center gap-2 mr-2">
              <div className="p-1.5 rounded-md bg-brand/10 text-brand">
                <Filter size={12} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted/40">Filters</span>
            </div>
            
            {filterSets.map((fs) => (
              <ToolbarFilter 
                key={fs.label} 
                label={fs.label} 
                value={fs.get} 
                onChange={fs.set} 
                options={fs.opts} 
              />
            ))}
            
            {activeFilters.length > 0 && (
              <button
                onClick={() => filterSets.forEach(f => f.set('all'))}
                className="ml-auto text-[11px] font-bold uppercase tracking-wider text-text-muted/30 hover:text-negative transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        )}

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {activeFilters.map(({ label, get, set, opts }) => {
              const selected = opts.find(o => o.value === get || o === get);
              const displayLabel = typeof selected === 'object' ? selected.label : selected;
              return (
                <div
                  key={label}
                  className="group flex items-center gap-2 rounded-full border border-brand/25 bg-brand/8 px-3 py-1.5 text-[11px] font-semibold text-brand transition-all hover:bg-brand/12"
                >
                  <span className="opacity-60">{label}:</span>
                  <span>{displayLabel}</span>
                  <button 
                    onClick={() => set('all')}
                    className="ml-1 rounded-full p-0.5 hover:bg-brand/20 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
