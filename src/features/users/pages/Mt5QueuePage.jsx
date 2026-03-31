import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../layout/PageShell';
import { useDrawerState } from '../../../hooks/useDrawerState';
import { useTableState } from '../../../hooks/useTableState';
import { exportRows } from '../../../utils/exporters';
import { usersService } from '../../../services/usersService';
import { UsersMt5Table } from '../components/UsersTables';
import { UsersToolbar } from '../components/UsersToolbar';
import { Mt5AccountDrawer } from '../components/UserDrawers';

function filterBySearch(items, search, fields) {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => (
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(query))
  ));
}

export function Mt5QueuePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const mt5Drawer = useDrawerState(null);

  const filteredMt5 = useMemo(
    () => filterBySearch(usersService.listMt5Accounts(), search, ['login', 'user', 'server', 'group', 'status']),
    [search],
  );

  const mt5Table = useTableState(filteredMt5, { searchFields: [], initialPageSize: 10 });

  return (
    <PageShell>
      <UsersToolbar
        view="mt5"
        search={search}
        onSearchChange={setSearch}
        onChangeView={(nextView) => navigate(`/users/${nextView === 'list' ? '' : nextView}`)}
        onExport={() => exportRows(filteredMt5, `mt5-accounts.csv`)}
      />

      <Card title="MT5 Monitoring Grid" subtitle="Operational account list with drawer-based details and user context." padding={false}>
        <UsersMt5Table
          tableState={mt5Table}
          onOpenUser={(nextUserId, nextTab) => navigate(`/users/${nextUserId}${nextTab ? `/${nextTab}` : ''}`)}
          onOpenMt5={(entry) => mt5Drawer.open(entry)}
        />
      </Card>

      <Mt5AccountDrawer
        entry={mt5Drawer.value}
        onClose={mt5Drawer.close}
      />
    </PageShell>
  );
}
