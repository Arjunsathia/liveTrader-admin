import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Pagination } from '../../../components/tables/Pagination';
import { CopyTradingLayout } from '../components/CopyTradingLayout';
import { CopyTradingStatsCards } from '../components/CopyTradingStatsCards';
import { CopyTradingToolbar } from '../components/CopyTradingToolbar';
import { CopyTradingTable } from '../components/CopyTradingTable';
import { useCopyTradingWorkspace } from '../hooks/useCopyTradingWorkspace';
import { logsConfig } from '../configs/logs.config';
import { exportRows } from '../../../utils/exporters';

export function LogsPage() {
  const navigate = useNavigate();
  const ws = useCopyTradingWorkspace(logsConfig);

  return (
    <CopyTradingLayout>
      <CopyTradingStatsCards kpis={logsConfig.kpis} />

      <CopyTradingToolbar
        search={ws.search}
        onSearchChange={ws.setSearch}
        filterSets={ws.filterSets}
        placeholder="Search logs by event ID, type, source, target…"
        onExport={() => exportRows(ws.filtered, 'copy-trading-logs.csv')}
        slug="logs"
      />

      <Card
        title={logsConfig.tableTitle}
        subtitle={`${ws.filtered.length} event${ws.filtered.length !== 1 ? 's' : ''} · click row to inspect`}
        padding={false}
      >
        <CopyTradingTable
          columns={logsConfig.columns}
          items={ws.table.items}
          onRowClick={(row) => navigate(`/copy-trading/logs/${row.id}`)}
          slug="logs"
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
