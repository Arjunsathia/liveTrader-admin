import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Pagination } from '../../../components/tables/Pagination';
import { TradingLayout } from '../components/TradingLayout';
import { TradingStatsCards } from '../components/TradingStatsCards';
import { TradingToolbar } from '../components/TradingToolbar';
import { TradingTable } from '../components/TradingTable';
import { ExecutionLogDrawer } from '../components/ExecutionLogDrawer';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import { logsConfig } from '../data/workspaces/logs.workspace';
import { exportRows } from '../../../utils/exporters';

export function ExecutionLogsScreen() {
  const ws = useTradingWorkspace(logsConfig);
  const [drawerRow, setDrawerRow] = useState(null);

  return (
    <TradingLayout>
      <TradingStatsCards kpis={logsConfig.kpis} />
      
      <TradingToolbar 
        search={ws.search} 
        onSearchChange={ws.setSearch} 
        filterSets={ws.filterSets}
        placeholder="Search event logs by message, ticket or source..."
        onExport={() => exportRows(ws.filtered, 'execution-logs.csv')}
        onRefresh={() => { /* Logic to refresh logs */ }}
      />

      <Card title={logsConfig.tableTitle} subtitle={logsConfig.tableSubtitle} padding={false}>
        <TradingTable 
          columns={logsConfig.columns} 
          items={ws.table.items} 
          onRowClick={setDrawerRow} 
        />
        <Pagination
          page={ws.table.page}
          totalPages={ws.table.totalPages}
          onPageChange={ws.table.setPage}
          pageSize={ws.table.pageSize}
          onPageSizeChange={ws.table.setPageSize}
        />
      </Card>

      <ExecutionLogDrawer
        open={!!drawerRow}
        row={drawerRow}
        onClose={() => setDrawerRow(null)}
      />
    </TradingLayout>
  );
}
