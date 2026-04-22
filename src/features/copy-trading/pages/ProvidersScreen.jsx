import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Pagination } from '../../../components/tables/Pagination';
import { CopyTradingLayout } from '../components/CopyTradingLayout';
import { CopyTradingStatsCards } from '../components/CopyTradingStatsCards';
import { CopyTradingToolbar } from '../components/CopyTradingToolbar';
import { CopyTradingTable } from '../components/CopyTradingTable';
import { useCopyTradingWorkspace } from '../hooks/useCopyTradingWorkspace';
import { providersConfig } from '../data/workspaces/providers.workspace';
import { exportRows } from '../../../utils/exporters';

export function ProvidersScreen() {
  const navigate = useNavigate();
  const ws = useCopyTradingWorkspace(providersConfig);

  return (
    <CopyTradingLayout>
      <CopyTradingStatsCards kpis={providersConfig.kpis} />

      <CopyTradingToolbar
        search={ws.search}
        onSearchChange={ws.setSearch}
        filterSets={ws.filterSets}
        placeholder="Search providers by name, UID, region, approval…"
        onExport={() => exportRows(ws.filtered, 'copy-trading-providers.csv')}
        slug="providers"
      />

      <Card
        title={providersConfig.tableTitle}
        subtitle={`${ws.filtered.length} record${ws.filtered.length !== 1 ? 's' : ''} matched · click row to open`}
        padding={false}
      >
        <CopyTradingTable
          columns={providersConfig.columns}
          items={ws.table.items}
          onRowClick={(row) => navigate(`/copy-trading/providers/${row.id}`)}
          slug="providers"
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
