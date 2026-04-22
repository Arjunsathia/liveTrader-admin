import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Pagination } from '../../../components/tables/Pagination';
import { CopyTradingLayout } from '../components/CopyTradingLayout';
import { CopyTradingStatsCards } from '../components/CopyTradingStatsCards';
import { CopyTradingToolbar } from '../components/CopyTradingToolbar';
import { CopyTradingTable } from '../components/CopyTradingTable';
import { useCopyTradingWorkspace } from '../hooks/useCopyTradingWorkspace';
import { subscriptionsConfig } from '../data/workspaces/subscriptions.workspace';
import { exportRows } from '../../../utils/exporters';

export function SubscriptionsScreen() {
  const navigate = useNavigate();
  const ws = useCopyTradingWorkspace(subscriptionsConfig);

  return (
    <CopyTradingLayout>
      <CopyTradingStatsCards kpis={subscriptionsConfig.kpis} />

      <CopyTradingToolbar
        search={ws.search}
        onSearchChange={ws.setSearch}
        filterSets={ws.filterSets}
        placeholder="Search subscriptions by ID, user, provider, plan…"
        onExport={() => exportRows(ws.filtered, 'copy-trading-subscriptions.csv')}
        slug="subscriptions"
      />

      <Card
        title={subscriptionsConfig.tableTitle}
        subtitle={`${ws.filtered.length} record${ws.filtered.length !== 1 ? 's' : ''} matched · click row to open`}
        padding={false}
      >
        <CopyTradingTable
          columns={subscriptionsConfig.columns}
          items={ws.table.items}
          onRowClick={(row) => navigate(`/copy-trading/subscriptions/${row.id}`)}
          slug="subscriptions"
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
