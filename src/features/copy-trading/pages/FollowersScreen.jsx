import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Pagination } from '../../../components/tables/Pagination';
import { CopyTradingLayout } from '../components/CopyTradingLayout';
import { CopyTradingStatsCards } from '../components/CopyTradingStatsCards';
import { CopyTradingToolbar } from '../components/CopyTradingToolbar';
import { CopyTradingTable } from '../components/CopyTradingTable';
import { useCopyTradingWorkspace } from '../hooks/useCopyTradingWorkspace';
import { followersConfig } from '../data/workspaces/followers.workspace';
import { exportRows } from '../../../utils/exporters';

export function FollowersScreen() {
  const navigate = useNavigate();
  const ws = useCopyTradingWorkspace(followersConfig);

  return (
    <CopyTradingLayout>
      <CopyTradingStatsCards kpis={followersConfig.kpis} />

      <CopyTradingToolbar
        search={ws.search}
        onSearchChange={ws.setSearch}
        filterSets={ws.filterSets}
        placeholder="Search followers by name, UID, provider, strategy…"
        onExport={() => exportRows(ws.filtered, 'copy-trading-followers.csv')}
        slug="followers"
      />

      <Card
        title={followersConfig.tableTitle}
        subtitle={`${ws.filtered.length} record${ws.filtered.length !== 1 ? 's' : ''} matched · click row to open`}
        padding={false}
      >
        <CopyTradingTable
          columns={followersConfig.columns}
          items={ws.table.items}
          onRowClick={(row) => navigate(`/copy-trading/followers/${row.id}`)}
          slug="followers"
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
