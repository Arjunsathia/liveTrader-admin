import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Pagination } from '../../../components/tables/Pagination';
import { TradingLayout } from '../components/TradingLayout';
import { TradingStatsCards } from '../components/TradingStatsCards';
import { TradingToolbar } from '../components/TradingToolbar';
import { TradingTable } from '../components/TradingTable';
import { TradingDrawer } from '../components/TradingDrawer';
import { HistoryDetailsDrawer } from '../components/TradingDetailBodies';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import { historyConfig } from '../configs/history.config';
import { exportRows } from '../../../utils/exporters';

export function TradeHistoryPage() {
  const ws = useTradingWorkspace(historyConfig);
  const [drawerRow, setDrawerRow] = useState(null);

  return (
    <TradingLayout>
      <TradingStatsCards kpis={historyConfig.kpis} />
      
      <TradingToolbar 
        search={ws.search} 
        onSearchChange={ws.setSearch} 
        filterSets={ws.filterSets}
        placeholder="Search history by ticket, symbol, account or user..."
        onExport={() => exportRows(ws.filtered, 'trade-history.csv')}
        onRefresh={() => { /* Logic to refresh history */ }}
      />

      <Card title={historyConfig.tableTitle} subtitle={historyConfig.tableSubtitle} padding={false}>
        <TradingTable 
          columns={historyConfig.columns} 
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
        subtitle={`${drawerRow?.symbol} · ${drawerRow?.closeTime}`}
        onClose={() => setDrawerRow(null)}
      >
        {drawerRow && <HistoryDetailsDrawer row={drawerRow} />}
      </TradingDrawer>
    </TradingLayout>
  );
}
