import React, { useRef, useState } from 'react';
import { Ban, Edit2, Eye, Monitor, MoreHorizontal } from 'lucide-react';
import { MainTable } from '../../../components/common/table';
import { StatusBadge } from '../../../components/ui';
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
      key: 'profile',
      label: 'User Profile',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={row.name} />
          <div className="min-w-0">
            <div className="text-[13px] font-black text-text group-hover:text-brand transition-colors">{row.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono font-bold text-text-muted/50 tracking-wider">UID {row.uid}</span>
              {row.suspended && (
                <span className="px-1 rounded-[3px] text-[8.5px] font-bold border border-negative/20 bg-negative/5 text-negative uppercase tracking-wide">
                  Suspended
                </span>
              )}
            </div>
            <div className="truncate text-[10.5px] text-text-muted/50 font-medium font-mono">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'segment',
      label: 'Segment / Tier',
      render: (_, row) => (
        <div>
          <div className="text-[12px] font-bold text-text">{row.segment}</div>
          <div className="text-[10.5px] text-text-muted/55 font-bold text-brand">{row.tier}</div>
        </div>
      ),
    },
    {
      key: 'kyc',
      label: 'KYC Status',
      render: (_, row) => <StatusBadge status={row.kycStatus} />,
    },
    {
      key: 'wallet',
      label: 'Collateral Wallet',
      render: (_, row) => (
        <div>
          <div className="font-mono text-[12px] font-bold text-text">{row.walletBalance}</div>
          <div className="text-[10px] font-mono text-text-muted/50">EQ {row.equity}</div>
        </div>
      ),
    },
    {
      key: 'mt5',
      label: 'MT5 terminals',
      render: (_, row) => (
        <div>
          <div className="text-[12.5px] font-bold text-text">{row.mt5Accounts} terminals</div>
          <div className="text-[10.5px] text-text-muted/50 font-medium">{row.openPositions} open trades</div>
        </div>
      ),
    },
    {
      key: 'risk',
      label: 'Risk Assessment',
      render: (_, row) => <StatusBadge status={row.riskStatus} dot={false} />,
    },
    {
      key: 'lastSeen',
      label: 'Last Active',
      render: (_, row) => (
        <div>
          <div className="font-mono text-[11.5px] text-text font-semibold">{row.lastSeen}</div>
          <div className="text-[10px] text-text-muted/55 font-semibold">{row.source}</div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onOpenUser(row.id)}
            className="rounded-[6px] border border-border/25 bg-bg/50 px-2.5 py-1 text-[11px] font-bold text-text-muted transition-all hover:border-border/55 hover:text-text cursor-pointer animate-fade-in"
          >
            Open
          </button>
          <RowActionsMenu
            user={row}
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
    <MainTable
      columns={columns}
      data={tableState.items}
      onRowClick={(row) => onOpenUser(row.id)}
      emptyTitle="No users matched the current filter criteria."
      pagination={tableState}
      rowClassName={(row) => {
        const isSuspended = row.suspended;
        const isFlagged = ['FLAGGED', 'ELEVATED'].includes(row.riskStatus) || row.kycStatus === 'REJECTED';
        const isPending = row.kycStatus === 'PENDING' || row.riskStatus === 'WATCHLIST';
        
        if (isSuspended || isFlagged) return 'hover:bg-negative/5 hover:border-l-negative';
        if (isPending) return 'hover:bg-warning/5 hover:border-l-warning';
        return 'hover:bg-positive/5 hover:border-l-positive';
      }}
    />
  );
}

export function UsersKYCTable({ tableState, onReviewUser }) {
  const columns = [
    { key: 'id', label: 'Case ID', render: (val) => <span className="font-mono text-[11px] text-text-muted/75">{val}</span> },
    {
      key: 'user',
      label: 'User',
      render: (val, row) => (
        <div>
          <div className="text-[12px] font-medium text-text">{val}</div>
          <div className="text-[11px] text-text-muted/60">{row.country}</div>
        </div>
      ),
    },
    { key: 'tier', label: 'Tier', render: (val) => <span className="text-[12px] text-text">{val}</span> },
    { key: 'docs', label: 'Docs', render: (val) => <span className="text-[12px] text-text-muted">{val}</span> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'risk', label: 'Risk', render: (val) => <StatusBadge status={val} dot={false} /> },
    { key: 'eta', label: 'ETA', render: (val) => <span className="font-mono text-[11px] text-text-muted/75">{val}</span> },
    {
      key: 'action',
      label: '',
      align: 'right',
      render: (_, row) => (
        <button
          type="button"
          onClick={() => onReviewUser(row.userId)}
          className="rounded-[8px] border border-border/25 px-3 py-1.5 text-[11px] font-semibold text-text-muted transition-all hover:border-border/55 hover:text-text"
        >
          Review
        </button>
      ),
    },
  ];

  return (
    <MainTable
      columns={columns}
      data={tableState.items}
      rowKey="id"
      emptyTitle="No KYC cases matched the current search"
      pagination={tableState}
      rowClassName={(item) => {
        const isFlagged = ['REJECTED', 'FAILED', 'FLAGGED'].includes(item.status);
        const isPending = ['PENDING', 'NONE'].includes(item.status);

        if (isFlagged) return 'hover:bg-negative/5 hover:border-l-negative';
        if (isPending) return 'hover:bg-warning/5 hover:border-l-warning';
        return 'hover:bg-positive/5 hover:border-l-positive';
      }}
    />
  );
}

export function UsersMt5Table({ tableState, onOpenUser, onOpenMt5 }) {
  const columns = [
    {
      key: 'login',
      label: 'Login',
      render: (_, row) => (
        <div>
          <div className="font-mono text-[12px] font-semibold text-text">{row.login}</div>
          <div className="text-[10px] text-text-muted/55 font-medium">{row.leverage}</div>
        </div>
      )
    },
    {
      key: 'user',
      label: 'User',
      render: (_, row) => (
        <div>
          <div className="text-[12px] font-semibold text-text">{row.user}</div>
          <button
            type="button"
            className="text-[10.5px] font-bold text-brand hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onOpenUser(row.userId, 'mt5-accounts');
            }}
          >
            Open user
          </button>
        </div>
      )
    },
    {
      key: 'server',
      label: 'Server',
      render: (_, row) => <span className="font-mono text-[11px] text-text-muted/80">{row.server}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => <StatusBadge status={row.status} />
    },
    {
      key: 'group',
      label: 'Group',
      render: (_, row) => <span className="font-mono text-[11px] text-text-muted/80">{row.group}</span>
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (_, row) => <span className="font-mono text-[12px] font-bold text-text">{row.balance}</span>
    },
    {
      key: 'lastSync',
      label: 'Last Sync',
      render: (_, row) => <span className="font-mono text-[11px] text-text-muted/50">{row.lastSync}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenMt5(row); }}
          className="rounded-[6px] border border-border/25 bg-bg/50 px-2.5 py-1 text-[11px] font-bold text-text-muted transition-all hover:border-border/55 hover:text-text cursor-pointer"
        >
          Details
        </button>
      )
    }
  ];

  return (
    <MainTable
      columns={columns}
      data={tableState.items}
      onRowClick={(row) => onOpenMt5(row)}
      emptyTitle="No MT5 accounts matched the current search."
      pagination={tableState}
      rowClassName={(row) => {
        const isFailed = row.status === 'DISCONNECTED';
        const isWarning = row.status === 'SYNC_DELAY';

        if (isFailed) return 'hover:bg-negative/5 hover:border-l-negative';
        if (isWarning) return 'hover:bg-warning/5 hover:border-l-warning';
        return 'hover:bg-positive/5 hover:border-l-positive';
      }}
    />
  );
}
