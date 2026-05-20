import React, { useState } from 'react';
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
  KeyRound,
  RefreshCw,
  Check,
  History,
} from 'lucide-react';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { DrawerField, DrawerGrid, DrawerSection, SelectField } from '../../../components/overlays/DrawerUI';
import { Button } from '../../../components/ui/Button';
import { InlineAlert } from '../../../components/common/feedback/InlineAlert';
import { StatusBadge } from '../../../components/common/feedback/StatusBadge';
import { StatusChip } from '../../../components/ui/StatusChip';
import { userDetailTabs } from '../data/userTabs';
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
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center h-9 px-4 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              Close
            </button>
            {user && (
              <button
                type="button"
                onClick={() => onEditUser(user)}
                className="flex items-center justify-center h-9 px-4 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[12px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                Edit User
              </button>
            )}
          </div>
        </div>
      )}
    >
      {user && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 rounded-[10px] border border-border/25 bg-bg/55 p-4 shadow-card-subtle">
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

          <div className="flex gap-1 border-b border-white/[0.06] overflow-x-auto no-scrollbar pb-px mb-2">
            {userDetailTabs.map((tab) => {
              const Icon = tabIcons[tab.id] ?? User;
              const active = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onChangeTab(tab.id)}
                  className={`group relative flex h-11 items-center gap-2.5 border-b-2 px-4 transition-all duration-200 cursor-pointer whitespace-nowrap
                    ${active
                      ? 'border-brand text-brand font-bold'
                      : 'border-transparent text-text-muted/40 hover:text-text-muted hover:border-white/10'
                    }`}
                >
                  <Icon size={14} className={active ? 'text-brand' : 'text-text-muted/30 group-hover:text-text-muted/50'} />
                  <span className="text-[12px] font-bold uppercase tracking-wider font-heading">{tab.label}</span>
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
      width="max-w-[720px]"
      onClose={onClose}
      footer={(
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center h-9 px-4 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
          >
            Close
          </button>
          {user && (
            <button
              type="button"
              onClick={() => onExpand(user.id)}
              className="flex items-center justify-center h-9 px-4 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[12px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              Open User
            </button>
          )}
        </div>
      )}
    >
      {user && (
        <div className="space-y-5">
          <InlineAlert tone="info" title="Operator Summary">
            {user.notesSummary}
          </InlineAlert>
          <DrawerSection title="User Snapshot">
            <DrawerGrid>
              {[
                ['Email', user.email],
                ['Phone', user.phone],
                ['Country', user.country],
                ['Funding', user.fundingState],
                ['Wallet', user.walletBalance],
                ['Equity', user.equity],
              ].map(([label, value]) => (
                <DrawerField key={label} label={label} value={value} />
              ))}
            </DrawerGrid>
          </DrawerSection>
        </div>
      )}
    </AdminDrawer>
  );
}

export function Mt5AccountDrawer({ entry, onClose, onSave, onSync, onResetPassword }) {
  const [leverage, setLeverage] = useState('');
  const [status, setStatus] = useState('');
  const [showStatusSuccess, setShowStatusSuccess] = useState(false);
  const [prevEntry, setPrevEntry] = useState(null);

  if (entry !== prevEntry) {
    setPrevEntry(entry);
    if (entry) {
      setLeverage(entry.leverage || '1:100');
      setStatus(entry.status || 'CONNECTED');
      setShowStatusSuccess(false);
    }
  }

  if (!entry) return null;

  const isExistingAccount = Boolean(entry.login);
  const isBlocked = status === 'DISCONNECTED' || status === 'BLOCKED' || status === 'SUSPENDED';
  const statusAccent = isBlocked ? 'var(--negative)' : 'var(--positive)';
  const balanceVal = entry.balance ? parseFloat(String(entry.balance).replace(/[$,]/g, '')) : 0;
  const equityVal = entry.equity ? parseFloat(String(entry.equity).replace(/[$,]/g, '')) : balanceVal;
  const delta = equityVal - balanceVal;

  const handleSave = () => {
    onSave?.({ ...entry, leverage, status });
    setShowStatusSuccess(true);
    setTimeout(() => {
      setShowStatusSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <AdminDrawer
      open={Boolean(entry)}
      title={entry ? `MT5 Account — #${entry.login ?? 'NEW'}` : 'MT5 Account'}
      subtitle="Inspect credentials, balance metrics, and adjust operational settings."
      eyebrow="MT5 Account Review"
      width="max-w-[720px]"
      onClose={onClose}
      footer={(
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="text-[10px] text-text-muted/55 max-w-[280px] leading-snug">
            Leverage adjustments push directly to the MT5 dealing gateway cluster.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center h-9 px-4 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={showStatusSuccess}
              className="flex items-center justify-center h-9 px-4 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[12px] font-bold disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              {showStatusSuccess ? (
                <span className="flex items-center gap-1.5">
                  <Check size={12} /> Pushed to MT5
                </span>
              ) : isExistingAccount ? 'Keep Monitoring' : 'Save Setup'}
            </button>
          </div>
        </div>
      )}
    >
      <div className="space-y-6">
        {isExistingAccount ? (
          <>
            {/* Connection Status Card */}
            <div
              className="rounded-[12px] border overflow-hidden p-4"
              style={{ borderColor: `color-mix(in srgb, ${statusAccent} 22%, var(--border))`, background: `color-mix(in srgb, ${statusAccent} 4%, transparent)` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[15px] font-black text-text">{entry.user ?? 'MT5 User'}</div>
                  <div className="text-[10px] font-mono text-text-muted/50 mt-0.5">UID: {entry.uid || 'U-499201'}</div>
                </div>
                <StatusChip value={status} size="lg" />
              </div>

              {/* Equity / Balance Scoreboard */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/10">
                <div className="text-center">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted/50 mb-1">Balance</div>
                  <div className="font-mono text-[13px] font-bold text-text">{entry.balance ?? '$0.00'}</div>
                </div>
                <div className="text-center">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted/50 mb-1">Equity</div>
                  <div className="font-mono text-[13px] font-bold text-brand">{entry.equity ?? entry.balance ?? '$0.00'}</div>
                </div>
                <div className="text-center">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted/50 mb-1">Float</div>
                  <div
                    className="font-mono text-[13px] font-bold"
                    style={{ color: delta >= 0 ? 'var(--positive)' : 'var(--negative)' }}
                  >
                    {delta >= 0 ? '+' : ''}{delta.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-text-muted/55 flex items-center gap-1.5 mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                Active cluster connection · Latency stable
              </div>
            </div>

            {showStatusSuccess && (
              <InlineAlert tone="success" title="MT5 Sync Complete">
                Leverage changed to {leverage} and status synchronized with MT5 Node.
              </InlineAlert>
            )}

            {/* Account Snapshot */}
            <DrawerSection title="Account Snapshot">
              <DrawerGrid>
                <DrawerField label="Login" value={entry.login} mono copyable />
                <DrawerField label="Server" value={entry.server} mono />
                <DrawerField label="Group" value={entry.group || 'retail_usd_std'} mono copyable />
                <DrawerField label="Account Type" value={entry.type || 'Live'} />
                <DrawerField label="Currency" value={entry.currency || 'USD'} />
                <DrawerField label="Last Synced" value={entry.lastSync} mono />
              </DrawerGrid>
            </DrawerSection>

            {/* Capital Metrics */}
            <DrawerSection title="Balance & Capital Metrics">
              <DrawerGrid>
                <DrawerField label="Balance" value={entry.balance} mono accent="var(--cyan)" />
                <DrawerField label="Equity" value={entry.equity ?? entry.balance} mono accent="var(--brand)" />
                <DrawerField label="Margin Used" value={entry.margin || '$0'} mono accent="var(--warning)" />
                <DrawerField label="Free Margin" value={entry.freeMargin || entry.balance} mono accent="var(--positive)" />
                <DrawerField
                  label="Margin Level"
                  value={entry.marginLvl || '—'}
                  mono
                  accent={
                    entry.marginLvl && entry.marginLvl.includes('%') && parseInt(entry.marginLvl) < 150
                      ? 'var(--negative)'
                      : 'var(--text)'
                  }
                />
              </DrawerGrid>
            </DrawerSection>

            {/* Dealing Desk Controls */}
            <DrawerSection title="Dealing Desk Controls">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Adjust Account Leverage"
                  value={leverage}
                  onChange={setLeverage}
                  options={['1:50', '1:100', '1:200', '1:500']}
                />
                <SelectField
                  label="Operational Status"
                  value={status}
                  onChange={setStatus}
                  options={['CONNECTED', 'DISCONNECTED', 'SYNC_DELAY', 'BLOCKED', 'READONLY']}
                />
              </div>
            </DrawerSection>

            {/* Quick Actions */}
            <DrawerSection title="Quick Actions" collapsible>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onSync?.(entry);
                    setShowStatusSuccess(true);
                    setTimeout(() => setShowStatusSuccess(false), 1500);
                  }}
                  className="flex items-center justify-center gap-1.5 h-9 rounded-[8px] border border-brand/20 bg-brand/5 text-brand text-[11px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                >
                  <RefreshCw size={12} className="animate-spin-slow" /> Force Sync
                </button>
                <button
                  type="button"
                  onClick={() => onResetPassword?.(entry)}
                  className="flex items-center justify-center gap-1.5 h-9 rounded-[8px] border border-negative/20 bg-negative/5 text-negative text-[11px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                >
                  <KeyRound size={12} /> Reset Password
                </button>
                <button
                  type="button"
                  disabled
                  className="flex items-center justify-center gap-1.5 h-9 rounded-[8px] border border-border/15 bg-surface-elevated text-text-muted/40 text-[11px] font-bold cursor-not-allowed opacity-50"
                  title="Coming soon"
                >
                  <History size={12} /> Trade History
                </button>
              </div>
            </DrawerSection>
          </>
        ) : (
          <div className="space-y-3">
            <InlineAlert tone="info" title="New MT5 setup">
              A placeholder account will be prepared for the dealing desk using the settings defined in the user form.
            </InlineAlert>
            <DrawerSection title="Setup Snapshot">
              <DrawerGrid>
                <DrawerField label="User" value={entry.name} />
                <DrawerField label="Segment" value={entry.segment} />
                <DrawerField label="Tier" value={entry.tier} />
                <DrawerField label="Wallet" value={entry.walletBalance} mono />
              </DrawerGrid>
            </DrawerSection>
          </div>
        )}
      </div>
    </AdminDrawer>
  );
}
