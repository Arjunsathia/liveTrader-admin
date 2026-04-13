import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Pagination } from '../../../components/tables/Pagination';
import { CopyTradingLayout } from '../components/CopyTradingLayout';
import { CopyTradingStatsCards } from '../components/CopyTradingStatsCards';
import { CopyTradingToolbar } from '../components/CopyTradingToolbar';
import { CopyTradingTable } from '../components/CopyTradingTable';
import { useCopyTradingWorkspace } from '../hooks/useCopyTradingWorkspace';
import { performanceConfig } from '../configs/performance.config';
import { exportRows } from '../../../utils/exporters';

export function PerformancePage() {
  const navigate = useNavigate();
  const ws = useCopyTradingWorkspace(performanceConfig);

  return (
    <CopyTradingLayout>
      <CopyTradingStatsCards kpis={performanceConfig.kpis} />

      <CopyTradingToolbar
        search={ws.search}
        onSearchChange={ws.setSearch}
        filterSets={ws.filterSets}
        placeholder="Search strategies by name or provider…"
        onExport={() => exportRows(ws.filtered, 'copy-trading-performance.csv')}
        slug="performance"
      />

      <Card
        title={performanceConfig.tableTitle}
        subtitle={`${ws.filtered.length} record${ws.filtered.length !== 1 ? 's' : ''} matched · click row to open`}
        padding={false}
      >
        <CopyTradingTable
          columns={performanceConfig.columns}
          items={ws.table.items}
          onRowClick={(row) => navigate(`/copy-trading/performance/${row.id}`)}
          slug="performance"
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
