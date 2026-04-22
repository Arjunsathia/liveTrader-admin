import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Pagination } from '../../../components/tables/Pagination';
import { CopyTradingLayout } from '../components/CopyTradingLayout';
import { CopyTradingStatsCards } from '../components/CopyTradingStatsCards';
import { CopyTradingToolbar } from '../components/CopyTradingToolbar';
import { CopyTradingTable } from '../components/CopyTradingTable';
import { useCopyTradingWorkspace } from '../hooks/useCopyTradingWorkspace';
import { strategiesConfig } from '../data/workspaces/strategies.workspace';
import { exportRows } from '../../../utils/exporters';

export function StrategiesScreen() {
  const navigate = useNavigate();
  const ws = useCopyTradingWorkspace(strategiesConfig);

  return (
    <CopyTradingLayout>
      <CopyTradingStatsCards kpis={strategiesConfig.kpis} />

      <CopyTradingToolbar
        search={ws.search}
        onSearchChange={ws.setSearch}
        filterSets={ws.filterSets}
        placeholder="Search strategies by name, provider, status…"
        onExport={() => exportRows(ws.filtered, 'copy-trading-strategies.csv')}
        slug="strategies"
      />

      <Card
        title={strategiesConfig.tableTitle}
        subtitle={`${ws.filtered.length} record${ws.filtered.length !== 1 ? 's' : ''} matched · click row to open`}
        padding={false}
      >
        <CopyTradingTable
          columns={strategiesConfig.columns}
          items={ws.table.items}
          onRowClick={(row) => navigate(`/copy-trading/strategies/${row.id}`)}
          slug="strategies"
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
