import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Pagination } from '../../../components/tables/Pagination';
import { TradingLayout } from '../components/TradingLayout';
import { TradingStatsCards } from '../components/TradingStatsCards';
import { TradingToolbar } from '../components/TradingToolbar';
import { TradingTable } from '../components/TradingTable';
import { TradingDrawer } from '../components/TradingDrawer';
import { PositionDetailsDrawer } from '../components/TradingDetailBodies';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import { positionsConfig } from '../data/workspaces/positions.workspace';
import { exportRows } from '../../../utils/exporters';

export function PositionsScreen() {
  const ws = useTradingWorkspace(positionsConfig);
  const [drawerRow, setDrawerRow] = useState(null);
  const [actionDone, setActionDone] = useState(null);

  const handleAction = (label) => setActionDone(label);

  return (
    <TradingLayout>
      <TradingStatsCards kpis={positionsConfig.kpis} />
      
      <TradingToolbar 
        search={ws.search} 
        onSearchChange={ws.setSearch} 
        filterSets={ws.filterSets}
        placeholder="Search positions by symbol, ticket or account..."
        onExport={() => exportRows(ws.filtered, 'trading-positions.csv')}
        onRefresh={() => { /* Logic to refresh positions */ }}
      />

      <Card title={positionsConfig.tableTitle} subtitle={positionsConfig.tableSubtitle} padding={false}>
        <TradingTable 
          columns={positionsConfig.columns} 
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

      <TradingDrawer
        open={!!drawerRow}
        title={drawerRow?.ticket}
        subtitle={`${drawerRow?.symbol} · ${drawerRow?.side}`}
        onClose={() => { setDrawerRow(null); setActionDone(null); }}
        actionDone={actionDone}
      >
        {drawerRow && <PositionDetailsDrawer row={drawerRow} onAction={handleAction} />}
      </TradingDrawer>
    </TradingLayout>
  );
}
