import React, { useMemo, useState } from 'react';
import { Download, FileCheck, Layers, Plus, Search, ShieldAlert, Users, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { PageShell } from '../../../components/layout/PageShell';
import { useDrawerState } from '../../../hooks/useDrawerState';
import { useTableState } from '../../../hooks/useTableState';
import { exportRows } from '../../../utils/exporters';
import { usersService } from '../services/userService';
import {
  FUNDING_OPTIONS, KYC_OPTIONS, RISK_OPTIONS,
} from '@/config/constants/USER_FORM';
import { applyDraftToUser, buildUserDraft, createDefaultUserDraft } from '@/utils/userDraftUtils';
import { AddUserDrawer } from '../components/AddUserDrawer';
import { UsersKPIGrid } from '../components/UsersKpiGrid';
import { UsersListTable } from '../components/UsersTable';
import { Mt5AccountDrawer, QuickUserDrawer } from '../components/UserDrawers';
import { TableToolbar } from '../../../components/common/table';

const USER_NAV_TABS = [
  { id: 'list', label: 'User Directory', path: '/users', Icon: Users },
  { id: 'kyc', label: 'KYC Requests', path: '/users/kyc', Icon: FileCheck },
  { id: 'mt5', label: 'MT5 Accounts', path: '/users/mt5', Icon: Layers },
];

const PAGE = {
  accent: 'var(--brand)',
  eyebrow: 'User Management',
  title: 'Master User Registry',
  description: 'Manage customer identity, onboarding segment tiers, wallet assets, and MT5 configurations.',
};

function filterBySearch(items, search, fields) {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => (
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(query))
  ));
}

function UsersPage() {
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
      <div className="space-y-5">

        {/* ── Page Header ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/45 mb-1">
              {PAGE.eyebrow}
            </p>
            <h2 className="text-[22px] font-black tracking-[-0.04em] text-text leading-none">
              {PAGE.title}
            </h2>
            <p className="text-[12px] text-text-muted/55 mt-1.5 leading-snug max-w-lg">
              {PAGE.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => exportRows(filteredUsers, `users-list.csv`)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export
            </button>
            <button
              type="button"
              onClick={() => { setFormMode('create'); setFormOpen(true); }}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              <Plus size={12} /> Add User
            </button>
          </div>
        </header>



        {/* ── KPI Grid ── */}
        <UsersKPIGrid items={kpis} />

        {/* ── Table registry panel ── */}
        <Card padding={false}>
          <TableToolbar
            title="User Registry"
            count={filteredUsers.length}
            accentColor={PAGE.accent}
            search={search}
            onSearchChange={(val) => { setSearch(val); usersTable.setPage(1); }}
            searchPlaceholder="Search directory..."
            filters={
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] text-text-muted/45 font-bold uppercase tracking-wider shrink-0">KYC:</span>
                  <select
                    value={kycFilter}
                    onChange={(e) => { setKycFilter(e.target.value); usersTable.setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-4 outline-none focus:border-brand/40 transition-all cursor-pointer"
                    style={{ minWidth: '76px' }}
                  >
                    <option value="all">ALL</option>
                    {KYC_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] text-text-muted/45 font-bold uppercase tracking-wider shrink-0">RISK:</span>
                  <select
                    value={riskFilter}
                    onChange={(e) => { setRiskFilter(e.target.value); usersTable.setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-4 outline-none focus:border-brand/40 transition-all cursor-pointer"
                    style={{ minWidth: '76px' }}
                  >
                    <option value="all">ALL</option>
                    {RISK_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] text-text-muted/45 font-bold uppercase tracking-wider shrink-0">FUNDING:</span>
                  <select
                    value={fundingFilter}
                    onChange={(e) => { setFundingFilter(e.target.value); usersTable.setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-4 outline-none focus:border-brand/40 transition-all cursor-pointer"
                    style={{ minWidth: '76px' }}
                  >
                    <option value="all">ALL</option>
                    {FUNDING_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </>
            }
          />

          <UsersListTable
            tableState={usersTable}
            onOpenUser={openUser}
            onQuickView={(user) => quickDrawer.open(user)}
            onEditUser={(u) => { setFormMode('edit'); setEditingUserId(u.id); setUserDraft(buildUserDraft(u)); setFormOpen(true); }}
            onSuspendUser={handleToggleSuspend}
            onOpenMt5={(entry) => mt5Drawer.open(entry)}
          />
        </Card>
      </div>

      <AddUserDrawer open={formOpen} mode={formMode} draft={userDraft} setDraft={setUserDraft} onSubmit={handleSaveUser} onClose={() => setFormOpen(false)} />
      <QuickUserDrawer open={quickDrawer.isOpen} user={quickDrawer.value} onClose={quickDrawer.close} onExpand={(uid) => { quickDrawer.close(); openUser(uid); }} />
      <Mt5AccountDrawer open={mt5Drawer.isOpen} entry={mt5Drawer.value} onClose={mt5Drawer.close} />
    </PageShell>
  );
}
export default UsersPage;
