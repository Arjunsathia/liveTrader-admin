import React, { useRef, useState } from 'react';
import { Ban, Edit2, Eye, Monitor, MoreHorizontal } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable';
import { Pagination } from '../../../components/tables/Pagination';
import { StatusBadge } from '../../../components/feedback/StatusBadge';
import { useClickOutside } from '../../../hooks/useClickOutside';

function getAvatarStyle(name = '?') {
  const seed = name.charCodeAt(0) * 37;
  return {
    background: `hsl(${seed % 360},35%,22%)`,
    color: `hsl(${seed % 360},80%,65%)`,
    border: `1px solid hsl(${seed % 360},40%,30%)`,
  };
}

function UserAvatar({ name }) {
  return (
    <div
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-semibold"
      style={getAvatarStyle(name)}
    >
      {name?.[0] ?? '?'}
    </div>
  );
}

function RowActionsMenu({ user, onOpenUser, onQuickView, onEditUser, onSuspendUser, onOpenMt5 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false));

  const actions = [
    { label: 'Open User', Icon: Eye, onClick: () => onOpenUser(user.id) },
    { label: 'Quick View', Icon: MoreHorizontal, onClick: () => onQuickView(user) },
    { label: 'Edit User', Icon: Edit2, onClick: () => onEditUser(user) },
    { label: 'Create MT5', Icon: Monitor, onClick: () => onOpenMt5(user) },
    { label: user.suspended ? 'Unsuspend' : 'Suspend', Icon: Ban, onClick: () => onSuspendUser(user), danger: true },
  ];

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/25 bg-bg/70 text-text-muted transition-all hover:border-border/50 hover:text-text"
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-1.5 w-[170px] rounded-[10px] border border-border/35 bg-surface p-1 shadow-card-subtle">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => { action.onClick(); setOpen(false); }}
              className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-[12px] transition-colors hover:bg-surface-elevated"
              style={{ color: action.danger ? 'var(--negative)' : 'var(--text)' }}
            >
              <action.Icon size={13} />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function UsersListTable({
  tableState,
  onOpenUser,
  onQuickView,
  onEditUser,
  onSuspendUser,
  onOpenMt5,
}) {
  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (user) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-text">{user.name}</div>
            <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-text-muted/55">UID {user.uid}</div>
            <div className="truncate text-[11px] text-text-muted/60">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'segment',
      label: 'Segment',
      render: (user) => (
        <div>
          <div className="text-[12px] font-medium text-text">{user.segment}</div>
          <div className="text-[11px] text-text-muted/60">{user.tier}</div>
        </div>
      ),
    },
    {
      key: 'kyc',
      label: 'KYC',
      render: (user) => <StatusBadge status={user.kycStatus} />,
    },
    {
      key: 'wallet',
      label: 'Wallet',
      render: (user) => (
        <div>
          <div className="font-mono text-[12px] font-semibold text-text">{user.walletBalance}</div>
          <div className="text-[11px] text-text-muted/60">EQ {user.equity}</div>
        </div>
      ),
    },
    {
      key: 'mt5',
      label: 'MT5',
      render: (user) => (
        <div>
          <div className="text-[12px] font-medium text-text">{user.mt5Accounts} accounts</div>
          <div className="text-[11px] text-text-muted/60">{user.openPositions} open positions</div>
        </div>
      ),
    },
    {
      key: 'risk',
      label: 'Risk',
      render: (user) => <StatusBadge status={user.riskStatus} dot={false} />,
    },
    {
      key: 'lastSeen',
      label: 'Last Active',
      render: (user) => (
        <div>
          <div className="font-mono text-[12px] text-text-muted/80">{user.lastSeen}</div>
          <div className="text-[11px] text-text-muted/55">{user.source}</div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpenUser(user.id); }}
            className="rounded-[8px] border border-border/25 bg-bg/70 px-3 py-1.5 text-[11px] font-semibold text-text-muted transition-all hover:border-border/55 hover:text-text"
          >
            Open
          </button>
          <RowActionsMenu
            user={user}
            onOpenUser={onOpenUser}
            onQuickView={onQuickView}
            onEditUser={onEditUser}
            onSuspendUser={onSuspendUser}
            onOpenMt5={onOpenMt5}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={tableState.items}
        onRowClick={(user) => onOpenUser(user.id)}
        emptyTitle="No users matched the current filters"
        emptyDescription="Try adjusting the search or filter combinations."
      />
      <Pagination
        page={tableState.page}
        totalPages={tableState.totalPages}
        onPageChange={tableState.setPage}
        pageSize={tableState.pageSize}
        onPageSizeChange={tableState.setPageSize}
      />
    </>
  );
}

export function UsersKycTable({ tableState, onReviewUser }) {
  const columns = [
    { key: 'id', label: 'Case ID', render: (item) => <span className="font-mono text-[11px] text-text-muted/75">{item.id}</span> },
    {
      key: 'user',
      label: 'User',
      render: (item) => (
        <div>
          <div className="text-[12px] font-medium text-text">{item.user}</div>
          <div className="text-[11px] text-text-muted/60">{item.country}</div>
        </div>
      ),
    },
    { key: 'tier', label: 'Tier', render: (item) => <span className="text-[12px] text-text">{item.tier}</span> },
    { key: 'docs', label: 'Docs', render: (item) => <span className="text-[12px] text-text-muted">{item.docs}</span> },
    { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status} /> },
    { key: 'risk', label: 'Risk', render: (item) => <StatusBadge status={item.risk} dot={false} /> },
    { key: 'eta', label: 'ETA', render: (item) => <span className="font-mono text-[11px] text-text-muted/75">{item.eta}</span> },
    {
      key: 'action',
      label: '',
      render: (item) => (
        <div className="text-right">
          <button
            type="button"
            onClick={() => onReviewUser(item.userId)}
            className="rounded-[8px] border border-border/25 px-3 py-1.5 text-[11px] font-semibold text-text-muted transition-all hover:border-border/55 hover:text-text"
          >
            Review
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={tableState.items} rowKey="id" emptyTitle="No KYC cases matched the current search" />
      <Pagination
        page={tableState.page}
        totalPages={tableState.totalPages}
        onPageChange={tableState.setPage}
        pageSize={tableState.pageSize}
        onPageSizeChange={tableState.setPageSize}
      />
    </>
  );
}

export function UsersMt5Table({ tableState, onOpenUser, onOpenMt5 }) {
  const columns = [
    {
      key: 'login',
      label: 'Login',
      render: (account) => (
        <div>
          <div className="font-mono text-[12px] font-semibold text-text">{account.login}</div>
          <div className="text-[11px] text-text-muted/60">{account.leverage}</div>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'User',
      render: (account) => (
        <div>
          <div className="text-[12px] font-medium text-text">{account.user}</div>
          <button
            type="button"
            className="text-[11px] font-semibold text-primary hover:underline"
            onClick={() => onOpenUser(account.userId, 'mt5-accounts')}
          >
            Open user
          </button>
        </div>
      ),
    },
    { key: 'server', label: 'Server', render: (account) => <span className="font-mono text-[11px] text-text-muted">{account.server}</span> },
    { key: 'status', label: 'Status', render: (account) => <StatusBadge status={account.status} /> },
    { key: 'group', label: 'Group', render: (account) => <span className="font-mono text-[11px] text-text-muted">{account.group}</span> },
    { key: 'balance', label: 'Balance', render: (account) => <span className="font-mono text-[12px] font-semibold text-text">{account.balance}</span> },
    { key: 'lastSync', label: 'Last Sync', render: (account) => <span className="font-mono text-[11px] text-text-muted/75">{account.lastSync}</span> },
    {
      key: 'action',
      label: '',
      render: (account) => (
        <button
          type="button"
          onClick={() => onOpenMt5(account)}
          className="rounded-[8px] border border-border/25 px-3 py-1.5 text-[11px] font-semibold text-text-muted transition-all hover:border-border/55 hover:text-text"
        >
          Details
        </button>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={tableState.items} rowKey="id" emptyTitle="No MT5 accounts matched the current search" />
      <Pagination
        page={tableState.page}
        totalPages={tableState.totalPages}
        onPageChange={tableState.setPage}
        pageSize={tableState.pageSize}
        onPageSizeChange={tableState.setPageSize}
      />
    </>
  );
}
