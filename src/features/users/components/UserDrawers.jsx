import React from 'react';
import {
  Activity,
  BarChart2,
  Edit2,
  FileCheck,
  Monitor,
  ShieldAlert,
  TrendingUp,
  User,
  Wallet,
} from 'lucide-react';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { Button } from '../../../components/ui/Button';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { StatusBadge } from '../../../components/feedback/StatusBadge';
import { userDetailTabs } from '../config/userTabs';
import { UserDetailContent } from './UserDetailContent';

const tabIcons = {
  overview: BarChart2,
  profile: User,
  kyc: FileCheck,
  wallet: Wallet,
  'mt5-accounts': Monitor,
  'trading-history': TrendingUp,
  'activity-logs': Activity,
  'risk-view': ShieldAlert,
  notes: Edit2,
};

function getAvatarStyle(name = '?') {
  const seed = name.charCodeAt(0) * 37;
  return {
    background: `hsl(${seed % 360},35%,22%)`,
    color: `hsl(${seed % 360},80%,65%)`,
    border: `1px solid hsl(${seed % 360},40%,30%)`,
  };
}

export function UserDetailDrawer({
  user,
  activeTab,
  onChangeTab,
  onClose,
  onEditUser,
}) {
  return (
    <AdminDrawer
      open={Boolean(user)}
      title={user?.name ?? 'User Detail'}
      subtitle={user ? `UID ${user.uid} | ${user.segment} | ${user.tier}` : ''}
      eyebrow="User Record"
      width="max-w-[760px]"
      onClose={onClose}
      footer={(
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11px] text-text-muted">Changes stay inside the users workspace while you review this record.</div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            {user && <Button variant="primary" onClick={() => onEditUser(user)}>Edit User</Button>}
          </div>
        </div>
      )}
    >
      {user && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 rounded-[12px] border border-border/25 bg-bg/55 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-semibold" style={getAvatarStyle(user.name)}>
              {user.name?.[0] ?? '?'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold text-text">{user.name}</div>
              <div className="truncate text-[12px] text-text-muted">{user.email}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={user.kycStatus} />
              <StatusBadge status={user.riskStatus} dot={false} />
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1">
            {userDetailTabs.map((tab) => {
              const Icon = tabIcons[tab.id] ?? User;
              const active = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onChangeTab(tab.id)}
                  className={`flex flex-shrink-0 items-center gap-1.5 rounded-[9px] border px-3 py-2 text-[12px] font-semibold transition-all ${active ? 'border-primary/25 bg-primary/10 text-primary' : 'border-transparent bg-transparent text-text-muted hover:border-border/35 hover:bg-bg/50 hover:text-text'}`}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <UserDetailContent user={user} activeTab={activeTab} />
        </div>
      )}
    </AdminDrawer>
  );
}

export function QuickUserDrawer({ user, onClose, onExpand }) {
  return (
    <AdminDrawer
      open={Boolean(user)}
      title={user?.name ?? 'Quick View'}
      subtitle={user ? `UID ${user.uid} | ${user.segment}` : ''}
      eyebrow="Quick View"
      width="max-w-[560px]"
      onClose={onClose}
      footer={(
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          {user && <Button variant="primary" onClick={() => onExpand(user.id)}>Open User</Button>}
        </div>
      )}
    >
      {user && (
        <div className="space-y-4">
          <InlineAlert tone="info" title="Operator Summary">
            {user.notesSummary}
          </InlineAlert>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ['Email', user.email],
              ['Phone', user.phone],
              ['Country', user.country],
              ['Funding', user.fundingState],
              ['Wallet', user.walletBalance],
              ['Equity', user.equity],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[10px] border border-border/25 bg-bg/60 px-3 py-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/50">{label}</div>
                <div className="mt-1 text-[13px] text-text">{value || 'N/A'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminDrawer>
  );
}

export function Mt5AccountDrawer({ entry, onClose }) {
  const isExistingAccount = Boolean(entry?.login);

  return (
    <AdminDrawer
      open={Boolean(entry)}
      title={entry ? `MT5 | ${entry.name ?? entry.user}` : 'MT5 Account'}
      subtitle={entry?.server ?? entry?.segment ?? ''}
      eyebrow="MT5 Console"
      width="max-w-[620px]"
      onClose={onClose}
      footer={(
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={onClose}>
            {isExistingAccount ? 'Keep Monitoring' : 'Save Setup'}
          </Button>
        </div>
      )}
    >
      {entry && (
        <div className="space-y-4">
          {isExistingAccount ? (
            <>
              <InlineAlert
                tone={entry.status === 'CONNECTED' ? 'success' : entry.status === 'SYNC_DELAY' ? 'warning' : 'danger'}
                title="Connection State"
              >
                {entry.status === 'CONNECTED'
                  ? 'Bridge sync is healthy and the account is operating normally.'
                  : entry.status === 'SYNC_DELAY'
                    ? 'Bridge sync is delayed. Review before approving new trading actions.'
                    : 'Account connectivity is degraded and operator intervention is recommended.'}
              </InlineAlert>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  ['Login', entry.login],
                  ['Group', entry.group],
                  ['Leverage', entry.leverage],
                  ['Connection', entry.connection ?? entry.status],
                  ['Balance', entry.balance ?? entry.equity],
                  ['Last Sync', entry.lastSync],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[10px] border border-border/25 bg-bg/60 px-3 py-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/50">{label}</div>
                    <div className="mt-1 font-mono text-[13px] text-text">{value}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <InlineAlert tone="info" title="New MT5 setup">
                A placeholder account will be prepared for the dealing desk using the settings defined in the user form.
              </InlineAlert>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-[10px] border border-border/25 bg-bg/60 px-3 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/50">User</div>
                  <div className="mt-1 text-[13px] text-text">{entry.name}</div>
                </div>
                <div className="rounded-[10px] border border-border/25 bg-bg/60 px-3 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/50">Segment</div>
                  <div className="mt-1 text-[13px] text-text">{entry.segment}</div>
                </div>
                <div className="rounded-[10px] border border-border/25 bg-bg/60 px-3 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/50">Tier</div>
                  <div className="mt-1 text-[13px] text-text">{entry.tier}</div>
                </div>
                <div className="rounded-[10px] border border-border/25 bg-bg/60 px-3 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/50">Wallet</div>
                  <div className="mt-1 font-mono text-[13px] text-text">{entry.walletBalance}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminDrawer>
  );
}
