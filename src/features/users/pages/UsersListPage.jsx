import React, { useMemo, useState } from 'react';
import { FileCheck, ShieldAlert, Users, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../layout/PageShell';
import { useDrawerState } from '../../../hooks/useDrawerState';
import { useTableState } from '../../../hooks/useTableState';
import { exportRows } from '../../../utils/exporters';
import { usersService } from '../../../services/usersService';
import {
  applyDraftToUser, buildUserDraft, createDefaultUserDraft,
  FUNDING_OPTIONS, KYC_OPTIONS, RISK_OPTIONS,
} from '../data/userFormConfig';
import { AddUserDrawer } from '../components/AddUserDrawer';
import { UsersKpiGrid } from '../components/UsersKpiGrid';
import { UsersListTable } from '../components/UsersTables';
import { UsersToolbar } from '../components/UsersToolbar';
import { Mt5AccountDrawer, QuickUserDrawer } from '../components/UserDrawers';

function filterBySearch(items, search, fields) {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => (
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(query))
  ));
}

export function UsersListPage() {
  const navigate = useNavigate();

  const [userRows, setUserRows] = useState(() => usersService.list());
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [fundingFilter, setFundingFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingUserId, setEditingUserId] = useState(null);
  const [userDraft, setUserDraft] = useState(() => createDefaultUserDraft());

  const quickDrawer = useDrawerState(null);
  const mt5Drawer = useDrawerState(null);

  const filteredUsers = useMemo(() => {
    let rows = filterBySearch(userRows, search, ['name', 'uid', 'email', 'phone', 'segment']);
    if (kycFilter !== 'all') rows = rows.filter((user) => user.kycStatus === kycFilter);
    if (riskFilter !== 'all') rows = rows.filter((user) => user.riskStatus === riskFilter);
    if (fundingFilter !== 'all') rows = rows.filter((user) => user.fundingState === fundingFilter);
    return rows;
  }, [fundingFilter, kycFilter, riskFilter, search, userRows]);

  const usersTable = useTableState(filteredUsers, { searchFields: [], initialPageSize: 10 });

  const kpis = useMemo(() => [
    { label: 'Total Users', value: userRows.length.toLocaleString(), subtext: 'registered accounts', trend: '+24', positive: true, Icon: Users, accent: 'var(--brand)' },
    { label: 'Pending KYC', value: userRows.filter((user) => user.kycStatus === 'PENDING').length, subtext: 'awaiting review', trend: `${KYC_OPTIONS.length - 1} view`, positive: true, Icon: FileCheck, accent: 'var(--warning)' },
    { label: 'Funded Accounts', value: userRows.filter((user) => user.fundingState === 'FUNDED').length, subtext: 'live funding', trend: `${FUNDING_OPTIONS.length} modes`, positive: true, Icon: Wallet, accent: 'var(--positive)' },
    { label: 'Flagged / Risk', value: userRows.filter((user) => ['ELEVATED', 'WATCHLIST', 'FLAGGED'].includes(user.riskStatus)).length, subtext: 'watchlist or elevated', trend: `${RISK_OPTIONS.length} groups`, positive: false, Icon: ShieldAlert, accent: 'var(--negative)' },
  ], [userRows]);

  const openUser = (nextUserId) => navigate(`/users/${nextUserId}`);
  
  const handleSaveUser = () => {
    if (formMode === 'edit' && editingUserId) {
      setUserRows((rows) => rows.map((user) => (user.id === editingUserId ? applyDraftToUser(user, userDraft) : user)));
    } else {
      setUserRows((rows) => [applyDraftToUser(usersService.create({}), userDraft), ...rows]);
    }
    setFormOpen(false);
  };

  const handleToggleSuspend = (user) => {
    setUserRows((rows) => rows.map((item) => (item.id === user.id ? { ...item, suspended: !item.suspended } : item)));
  };

  return (
    <PageShell>
      <UsersKpiGrid items={kpis} />

      <UsersToolbar
        view="list"
        search={search}
        onSearchChange={setSearch}
        onChangeView={(nextView) => navigate(`/users/${nextView === 'list' ? '' : nextView}`)}
        onOpenAdd={() => { setFormMode('create'); setFormOpen(true); }}
        onExport={() => exportRows(filteredUsers, `users-list.csv`)}
        kycFilter={kycFilter}
        onChangeKycFilter={setKycFilter}
        riskFilter={riskFilter}
        onChangeRiskFilter={setRiskFilter}
        fundingFilter={fundingFilter}
        onChangeFundingFilter={setFundingFilter}
      />

      <Card title="Main Working Queue" subtitle={`${filteredUsers.length} user${filteredUsers.length === 1 ? '' : 's'} matched. Click any row to open full dossier.`} padding={false}>
        <UsersListTable
          tableState={usersTable}
          onOpenUser={openUser}
          onQuickView={(user) => quickDrawer.open(user)}
          onEditUser={(u) => { setFormMode('edit'); setEditingUserId(u.id); setUserDraft(buildUserDraft(u)); setFormOpen(true); }}
          onSuspendUser={handleToggleSuspend}
          onOpenMt5={(entry) => mt5Drawer.open(entry)}
        />
      </Card>

      <AddUserDrawer open={formOpen} mode={formMode} draft={userDraft} setDraft={setUserDraft} onSubmit={handleSaveUser} onClose={() => setFormOpen(false)} />
      <QuickUserDrawer user={quickDrawer.value} onClose={quickDrawer.close} onExpand={(uid) => { quickDrawer.close(); openUser(uid); }} />
      <Mt5AccountDrawer entry={mt5Drawer.value} onClose={mt5Drawer.close} />
    </PageShell>
  );
}
