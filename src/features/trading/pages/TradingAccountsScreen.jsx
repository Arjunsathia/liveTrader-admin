import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Pagination } from '../../../components/tables/Pagination';
import { TradingLayout } from '../components/TradingLayout';
import { TradingStatsCards } from '../components/TradingStatsCards';
import { TradingToolbar } from '../components/TradingToolbar';
import { TradingTable } from '../components/TradingTable';
import { TradingDrawer } from '../components/TradingDrawer';
import { AccountDetailsDrawer } from '../components/TradingDetailBodies';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import { accountsConfig } from '../data/workspaces/accounts.workspace';
import { exportRows } from '../../../utils/exporters';

export function TradingAccountsScreen() {
  const ws = useTradingWorkspace(accountsConfig);
  const [drawerRow, setDrawerRow] = useState(null);
  const [actionDone, setActionDone] = useState(null);

  const handleAction = (label) => setActionDone(label);

  return (
    <TradingLayout>
      <TradingStatsCards kpis={accountsConfig.kpis} />
      
      <TradingToolbar 
        search={ws.search} 
        onSearchChange={ws.setSearch} 
        filterSets={ws.filterSets}
        placeholder="Search accounts by login, name or group..."
        onExport={() => exportRows(ws.filtered, 'trading-accounts.csv')}
        onRefresh={() => { /* Logic to refresh accounts */ }}
      />

      <Card title={accountsConfig.tableTitle} subtitle={accountsConfig.tableSubtitle} padding={false}>
        <TradingTable 
          columns={accountsConfig.columns} 
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
        title={drawerRow?.login}
        subtitle={`${drawerRow?.type} · ${drawerRow?.server}`}
        onClose={() => { setDrawerRow(null); setActionDone(null); }}
        actionDone={actionDone}
      >
        {drawerRow && <AccountDetailsDrawer row={drawerRow} onAction={handleAction} />}
      </TradingDrawer>
    </TradingLayout>
  );
}
