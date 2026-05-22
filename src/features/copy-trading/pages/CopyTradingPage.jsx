/**
 * copy-trading/pages/CopyTradingPage.jsx
 *
 * Dynamic workspace shell — a single component replaces the 6 previously
 * identical screen files (StrategiesScreen, ProvidersScreen, FollowersScreen,
 * SubscriptionsScreen, PerformanceScreen, LogsScreen).
 *
 * How it works:
 *  1. Reads the URL slug (the third path segment, e.g. "strategies" from
 *     /copy-trading/strategies) via useLocation().
 *  2. Looks up the matching workspace config from WORKSPACE_MAP.
 *  3. Renders CopyTradingContent with key={slug} so React unmounts and fully
 *     resets search / filter state whenever the user switches workspaces.
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card }                      from '../../../components/ui/Card';
import { Pagination }                from '../../../components/tables/Pagination';
import { CopyTradingLayout }         from '../components/CopyTradingLayout';
import { CopyTradingStatsCards }     from '../components/CopyTradingStatsCards';
import { CopyTradingToolbar }        from '../components/CopyTradingToolbar';
import { CopyTradingTable }          from '../components/CopyTradingTable';
import { useWorkspace }              from '@hooks/useWorkspace';
import { exportRows }                from '../../../utils/exporters';

import { strategiesConfig }    from '../data/workspaces/strategies.workspace';
import { providersConfig }     from '../data/workspaces/providers.workspace';
import { followersConfig }     from '../data/workspaces/followers.workspace';
import { subscriptionsConfig } from '../data/workspaces/subscriptions.workspace';
import { performanceConfig }   from '../data/workspaces/performance.workspace';
import { logsConfig }          from '../data/workspaces/logs.workspace';

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

      <CopyTradingToolbar
        search={ws.search}
        onSearchChange={ws.setSearch}
        filterSets={ws.filterSets}
        placeholder={placeholder}
        onExport={() => exportRows(ws.filtered, csvFile)}
        slug={slug}
      />

      <Card
        title={config.tableTitle}
        subtitle={subtitle(ws.filtered.length)}
        padding={false}
      >
        <CopyTradingTable
          columns={config.columns}
          items={ws.table.items}
          onRowClick={(row) => navigate(`/copy-trading/${slug}/${row.id}`)}
          slug={slug}
        />
        <Pagination
          page={ws.table.page}
          totalPages={ws.table.totalPages}
          onPageChange={ws.table.setPage}
          pageSize={ws.table.pageSize}
          onPageSizeChange={ws.table.setPageSize}
        />
      </Card>
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
