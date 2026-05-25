/**
 * copy-trading/pages/CopyTradingPage.jsx
 *
 * Dynamic workspace shell — a single component replaces the 6 previously
 * identical screen files (StrategiesScreen, ProvidersScreen, FollowersScreen,
 * SubscriptionsScreen, PerformanceScreen, LogsScreen).
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Eye }             from 'lucide-react';
import { CopyTradingLayout }         from '../components/CopyTradingLayout';
import { CopyTradingStatsCards }     from '../components/CopyTradingStatsCards';
import { CopyTradingTable }          from '../components/CopyTradingTable';
import { useWorkspace }              from '@/hooks/useWorkspace';
import { exportRows }                from '../../../utils/exporters';
import { TableToolbar }              from '../../../components/common/table';

import { strategiesConfig }    from '@/config/constants/copy-trading/workspaces/strategies.workspace';
import { providersConfig }     from '@/config/constants/copy-trading/workspaces/providers.workspace';
import { followersConfig }     from '@/config/constants/copy-trading/workspaces/followers.workspace';
import { subscriptionsConfig } from '@/config/constants/copy-trading/workspaces/subscriptions.workspace';
import { performanceConfig }   from '@/config/constants/copy-trading/workspaces/performance.workspace';
import { logsConfig }          from '@/config/constants/copy-trading/workspaces/logs.workspace';

/* ── Per-workspace metadata that differs between the old screen files ── */
const WORKSPACE_MAP = {
  strategies: {
    config:      strategiesConfig,
    placeholder: 'Search strategies by name, provider, status…',
    csvFile:     'copy-trading-strategies.csv',
    subtitle:    (n) => `${n} record${n !== 1 ? 's' : ''} matched · click row to open`,
  },
  providers: {
    config:      providersConfig,
    placeholder: 'Search providers by name, UID, region, approval…',
    csvFile:     'copy-trading-providers.csv',
    subtitle:    (n) => `${n} record${n !== 1 ? 's' : ''} matched · click row to open`,
  },
  followers: {
    config:      followersConfig,
    placeholder: 'Search followers by name, UID, provider, strategy…',
    csvFile:     'copy-trading-followers.csv',
    subtitle:    (n) => `${n} record${n !== 1 ? 's' : ''} matched · click row to open`,
  },
  subscriptions: {
    config:      subscriptionsConfig,
    placeholder: 'Search subscriptions by ID, user, provider, plan…',
    csvFile:     'copy-trading-subscriptions.csv',
    subtitle:    (n) => `${n} record${n !== 1 ? 's' : ''} matched · click row to open`,
  },
  performance: {
    config:      performanceConfig,
    placeholder: 'Search strategies by name or provider…',
    csvFile:     'copy-trading-performance.csv',
    subtitle:    (n) => `${n} record${n !== 1 ? 's' : ''} matched · click row to open`,
  },
  logs: {
    config:      logsConfig,
    placeholder: 'Search logs by event ID, type, source, target…',
    csvFile:     'copy-trading-logs.csv',
    subtitle:    (n) => `${n} event${n !== 1 ? 's' : ''} · click row to inspect`,
  },
};

/* ── Inner content — receives config directly so key={slug} resets state ── */
function CopyTradingContent({ slug, config, placeholder, csvFile, subtitle }) {
  const navigate = useNavigate();
  const ws       = useWorkspace(config);

  return (
    <CopyTradingLayout>
      <CopyTradingStatsCards kpis={config.kpis} />

      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-1.5 rounded-full border border-cyan/20 bg-cyan/8 px-3 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan">Live Signal</span>
        </div>
      </div>

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title={config.tableTitle}
          count={ws.filtered.length}
          accentColor="var(--cyan)"
          search={ws.search}
          onSearchChange={ws.setSearch}
          searchPlaceholder={placeholder}
          filters={
            <div className="flex items-center gap-3">
               {ws.filterSets?.map(fs => (
                  <div key={fs.label} className="flex items-center gap-1">
                     <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">{fs.label}:</span>
                     <select
                        value={fs.get}
                        onChange={(e) => fs.set(e.target.value)}
                        className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-cyan/40 transition-all cursor-pointer appearance-none"
                     >
                        {fs.opts.map(opt => (
                           <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                     </select>
                  </div>
               ))}
            </div>
          }
          actions={
            <div className="flex gap-2">
               {slug !== 'logs' && (
                 <button onClick={() => {}} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
                   <Eye size={12}/> Performance Lens
                 </button>
               )}
               <button onClick={() => exportRows(ws.filtered, csvFile)} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
                 <Download size={12}/> Export
               </button>
            </div>
          }
        />
        <CopyTradingTable
          columns={config.columns}
          items={ws.table.items}
          onRowClick={(row) => navigate(`/copy-trading/${slug}/${row.id}`)}
          slug={slug}
          pagination={{
            page: ws.table.page,
            totalPages: ws.table.totalPages,
            setPage: ws.table.setPage,
            pageSize: ws.table.pageSize,
            setPageSize: ws.table.setPageSize,
          }}
        />
      </section>
    </CopyTradingLayout>
  );
}

/* ── Shell — reads URL, picks workspace, forces state reset on tab switch ── */
export function CopyTradingPage() {
  const location = useLocation();

  // Extract slug: /copy-trading/strategies  →  "strategies"
  const slug      = location.pathname.split('/')[2] ?? 'strategies';
  const workspace = WORKSPACE_MAP[slug] ?? WORKSPACE_MAP.strategies;

  return (
    <CopyTradingContent
      key={slug}                       /* unmounts+remounts on slug change */
      slug={slug}
      config={workspace.config}
      placeholder={workspace.placeholder}
      csvFile={workspace.csvFile}
      subtitle={workspace.subtitle}
    />
  );
}
