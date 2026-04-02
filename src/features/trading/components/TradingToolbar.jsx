import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { PageToolbar } from '../../../components/shared/PageToolbar';

/**
 * TradingToolbar — thin wrapper around the shared PageToolbar.
 *
 * Props (unchanged from original):
 *   search, onSearchChange, placeholder, filterSets[], onExport, onRefresh
 *
 * The optional "Live" badge that was in the old toolbar is preserved via a
 * compact status chip rendered above — no visual regression.
 */
export function TradingToolbar({
  search,
  onSearchChange,
  filterSets = [],
  placeholder = 'Search terminal records…',
  onExport,
  onRefresh,
}) {
  const actions = [
    ...(onRefresh
      ? [{ label: 'Refresh', icon: RefreshCw, variant: 'secondary', onClick: onRefresh }]
      : []),
    ...(onExport
      ? [{ label: 'Export',  icon: Download,  variant: 'secondary', onClick: onExport }]
      : []),
  ];

  return (
    <div className="mb-6 flex flex-col gap-3">
      {/* Live status badge – preserved from original design */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-positive/20 bg-positive/8 px-3 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-positive" />
          <span className="text-[10px] font-black uppercase tracking-widest text-positive">Live</span>
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
