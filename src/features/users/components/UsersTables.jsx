import React, { useRef, useState } from 'react';
import { Ban, Edit2, Eye, Monitor, MoreHorizontal } from 'lucide-react';
import { DataTable } from '../../../components/tables/DataTable';
import { Pagination } from '../../../components/tables/Pagination';
import { StatusBadge } from '../../../components/common/feedback/StatusBadge';
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
  const paged = tableState.items;

  return (
    <>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[9.5px] uppercase font-black text-text-muted/50 tracking-[0.12em] border-b border-border/10 bg-bg/20">
              <th className="px-4 py-3">User Profile</th>
              <th className="px-4 py-3">Segment / Tier</th>
              <th className="px-4 py-3">KYC Status</th>
              <th className="px-4 py-3">Collateral Wallet</th>
              <th className="px-4 py-3">MT5 terminals</th>
              <th className="px-4 py-3">Risk Assessment</th>
              <th className="px-4 py-3">Last Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/8">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-[12px] text-text-muted/40 italic">
                  No users matched the current filter criteria.
                </td>
              </tr>
            ) : (
              paged.map((row) => {
                const isSuspended = row.suspended;
                const isFlagged = ['FLAGGED', 'ELEVATED'].includes(row.riskStatus) || row.kycStatus === 'REJECTED';
                const isPending = row.kycStatus === 'PENDING' || row.riskStatus === 'WATCHLIST';

                return (
                  <tr
                    key={row.id}
                    onClick={() => onOpenUser(row.id)}
                    className={`group cursor-pointer transition-colors border-l-2 border-transparent ${isSuspended || isFlagged
                      ? 'hover:bg-negative/5 hover:border-l-negative'
                      : isPending
                        ? 'hover:bg-warning/5 hover:border-l-warning'
                        : 'hover:bg-positive/5 hover:border-l-positive'
                      }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={row.name} />
                        <div className="min-w-0">
                          <div className="text-[13px] font-black text-text group-hover:text-brand transition-colors">{row.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-mono font-bold text-text-muted/50 tracking-wider">UID {row.uid}</span>
                            {isSuspended && (
                              <span className="px-1 rounded-[3px] text-[8.5px] font-bold border border-negative/20 bg-negative/5 text-negative uppercase tracking-wide">
                                Suspended
                              </span>
                            )}
                          </div>
                          <div className="truncate text-[10.5px] text-text-muted/50 font-medium font-mono">{row.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-[12px] font-bold text-text">{row.segment}</div>
                        <div className="text-[10.5px] text-text-muted/55 font-bold text-brand">{row.tier}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.kycStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-mono text-[12px] font-bold text-text">{row.walletBalance}</div>
                        <div className="text-[10px] font-mono text-text-muted/50">EQ {row.equity}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-[12.5px] font-bold text-text">{row.mt5Accounts} terminals</div>
                        <div className="text-[10.5px] text-text-muted/50 font-medium">{row.openPositions} open trades</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.riskStatus} dot={false} />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-mono text-[11.5px] text-text font-semibold">{row.lastSeen}</div>
                        <div className="text-[10px] text-text-muted/55 font-semibold">{row.source}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
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
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border/10">
        <Pagination
          page={tableState.page}
          totalPages={tableState.totalPages}
          onPageChange={tableState.setPage}
          pageSize={tableState.pageSize}
          onPageSizeChange={tableState.setPageSize}
        />
      </div>
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
      <DataTable
        columns={columns}
        data={tableState.items}
        rowKey="id"
        emptyTitle="No KYC cases matched the current search"
        rowClassName={(item) => {
          const isFlagged = ['REJECTED', 'FAILED', 'FLAGGED'].includes(item.status);
          const isPending = ['PENDING', 'NONE'].includes(item.status);

          if (isFlagged) {
            return 'hover:bg-negative/5 [&>td:first-child]:border-l-2 [&>td:first-child]:border-l-transparent hover:[&>td:first-child]:border-l-negative [&>td:first-child]:transition-colors [&>td:first-child]:duration-200';
          }
          if (isPending) {
            return 'hover:bg-warning/5 [&>td:first-child]:border-l-2 [&>td:first-child]:border-l-transparent hover:[&>td:first-child]:border-l-warning [&>td:first-child]:transition-colors [&>td:first-child]:duration-200';
          }
          return 'hover:bg-positive/5 [&>td:first-child]:border-l-2 [&>td:first-child]:border-l-transparent hover:[&>td:first-child]:border-l-positive [&>td:first-child]:transition-colors [&>td:first-child]:duration-200';
        }}
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

export function UsersMt5Table({ tableState, onOpenUser, onOpenMt5 }) {
  const paged = tableState.items;

  return (
    <>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[9.5px] uppercase font-black text-text-muted/50 tracking-[0.12em] border-b border-border/10 bg-bg/20">
              <th className="px-4 py-3">Login</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Server</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Group</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Last Sync</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/8">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-[12px] text-text-muted/40 italic">
                  No MT5 accounts matched the current search.
                </td>
              </tr>
            ) : (
              paged.map((row) => {
                const isFailed = row.status === 'DISCONNECTED';
                const isWarning = row.status === 'SYNC_DELAY';

                return (
                  <tr
                    key={row.id}
                    onClick={() => onOpenMt5(row)}
                    className={`group cursor-pointer transition-colors border-l-2 border-transparent ${isFailed
                      ? 'hover:bg-negative/5 hover:border-l-negative'
                      : isWarning
                        ? 'hover:bg-warning/5 hover:border-l-warning'
                        : 'hover:bg-positive/5 hover:border-l-positive'
                      }`}
                  >
                    <td className="px-4 py-3.5">
                      <div>
                        <div className="font-mono text-[12px] font-semibold text-text">{row.login}</div>
                        <div className="text-[10px] text-text-muted/55 font-medium">{row.leverage}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
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
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-text-muted/80">{row.server}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-text-muted/80">{row.group}</td>
                    <td className="px-4 py-3.5 font-mono text-[12px] font-bold text-text">{row.balance}</td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-text-muted/50">{row.lastSync}</td>
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onOpenMt5(row)}
                        className="rounded-[6px] border border-border/25 bg-bg/50 px-2.5 py-1 text-[11px] font-bold text-text-muted transition-all hover:border-border/55 hover:text-text cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border/10">
        <Pagination
          page={tableState.page}
          totalPages={tableState.totalPages}
          onPageChange={tableState.setPage}
          pageSize={tableState.pageSize}
          onPageSizeChange={tableState.setPageSize}
        />
      </div>
    </>
  );
}
