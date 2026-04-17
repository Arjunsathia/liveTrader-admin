import React from 'react';
import { Download, Eye } from 'lucide-react';
import { PageToolbar } from '../../../components/toolbar/PageToolbar';

/**
 * CopyTradingToolbar — mirrors TradingToolbar.
 * Wraps PageToolbar with Copy Trading-specific default actions.
 */
export function CopyTradingToolbar({
  search,
  onSearchChange,
  filterSets = [],
  placeholder = 'Search records…',
  onExport,
  slug,
}) {
  const actions = [
    ...(onExport
      ? [{ label: 'Export', icon: Download, variant: 'secondary', onClick: onExport }]
      : []),
    ...(slug !== 'logs'
      ? [{ label: 'Performance Lens', icon: Eye, variant: 'secondary', onClick: () => {} }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Live signal badge — mirrors TradingToolbar "Live" badge */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-cyan/20 bg-cyan/8 px-3 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan">Live Signal</span>
        </div>
      </div>

      <PageToolbar
        search={search}
        onSearchChange={onSearchChange}
        placeholder={placeholder}
        filterSets={filterSets}
        actions={actions}
      />
    </div>
  );
}
