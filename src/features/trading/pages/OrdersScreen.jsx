import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Pagination } from '../../../components/tables/Pagination';
import { TradingLayout } from '../components/TradingLayout';
import { TradingStatsCards } from '../components/TradingStatsCards';
import { TradingToolbar } from '../components/TradingToolbar';
import { TradingTable } from '../components/TradingTable';
import { TradingDrawer } from '../components/TradingDrawer';
import { OrderDetailsDrawer } from '../components/TradingDetailBodies';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import { ordersConfig } from '../data/workspaces/orders.workspace';
import { exportRows } from '../../../utils/exporters';

export function OrdersScreen() {
  const ws = useTradingWorkspace(ordersConfig);
  const [drawerRow, setDrawerRow] = useState(null);
  const [actionDone, setActionDone] = useState(null);

  const handleAction = (label) => setActionDone(label);

  return (
    <TradingLayout>
      <TradingStatsCards kpis={ordersConfig.kpis} />
      
      <TradingToolbar 
        search={ws.search} 
        onSearchChange={ws.setSearch} 
        filterSets={ws.filterSets}
        placeholder="Search orders by ticket, symbol or account..."
        onExport={() => exportRows(ws.filtered, 'trading-orders.csv')}
        onRefresh={() => { /* Logic to refresh orders */ }}
      />

      <Card title={ordersConfig.tableTitle} subtitle={ordersConfig.tableSubtitle} padding={false}>
        <TradingTable 
          columns={ordersConfig.columns} 
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
        subtitle={`${drawerRow?.symbol} · ${drawerRow?.orderType}`}
        onClose={() => { setDrawerRow(null); setActionDone(null); }}
        actionDone={actionDone}
      >
        {drawerRow && <OrderDetailsDrawer row={drawerRow} onAction={handleAction} />}
      </TradingDrawer>
    </TradingLayout>
  );
}
