import React, { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  Activity, ArrowLeft, ArrowUpRight, ArrowDownRight,
  Ban, BarChart2, Edit2, FileCheck, Globe, Monitor,
  ShieldAlert, TrendingUp, Unlock, User, Wallet, MessageSquare
} from 'lucide-react';

import { PageShell } from '../../../layout/PageShell';
import { StatusBadge } from '../../../components/feedback/StatusBadge';
import { usersService } from '../../../services/usersService';
import { enrichUser } from '../mocks/enrichUser';

import { ActionBtn, StatPill, KpiCard, MoreActionsMenu } from '../components/user-detail/shared/UserDetailShared';
import { RightPanel } from '../components/user-detail/layout/RightPanel';
import {
  TabOverview, TabProfile, TabKyc, TabWallet, TabMt5,
  TabTrading, TabActivity, TabRisk, TabNotes
} from '../components/user-detail/tabs/UserDetailTabs';

const TABS = [
  { id: 'overview', label: 'Overview', Icon: BarChart2 },
  { id: 'profile', label: 'Profile', Icon: User },
  { id: 'kyc', label: 'KYC', Icon: FileCheck },
  { id: 'wallet', label: 'Wallet', Icon: Wallet },
  { id: 'mt5-accounts', label: 'MT5 Accounts', Icon: Monitor },
  { id: 'trading-history', label: 'Trading', Icon: TrendingUp },
  { id: 'activity-logs', label: 'Activity', Icon: Activity },
  { id: 'risk-view', label: 'Risk', Icon: ShieldAlert },
  { id: 'notes', label: 'Notes', Icon: MessageSquare },
];

export function UserDetailPage() {
  const { userId, tab } = useParams();
  const navigate = useNavigate();

  const rawUser = usersService.getById(userId);
  if (!rawUser) return <Navigate to="/users" replace />;

  const user = enrichUser(rawUser);
  const [suspended, setSuspended] = useState(user.suspended);
  const [activeTab, setActiveTab] = useState(
    TABS.some((t) => t.id === tab) ? tab : 'overview'
  );

  const hue = (user.name.charCodeAt(0) * 37) % 360;
  const avatarBg = `hsl(${hue},35%,20%)`;
  const avatarText = `hsl(${hue},80%,65%)`;
  const avatarBorder = `hsl(${hue},40%,28%)`;

  const kpis = [
    { label: 'Wallet Balance', value: user.walletBalance, sub: `30d P&L ${user.pnl30d}`, dir: user.pnlDir, accent: 'var(--brand)', Icon: Wallet },
    { label: 'Equity', value: user.equity, sub: `Margin ${user.margin}`, dir: 'up', accent: '#4ae176', Icon: TrendingUp },
    { label: 'Open Positions', value: String(user.openPositions), sub: 'live trades', dir: null, accent: '#22d3ee', Icon: Activity },
    { label: 'Total Deposits', value: user.totalDeposits, sub: 'lifetime', dir: 'up', accent: '#a78bfa', Icon: ArrowUpRight },
    { label: 'Withdrawals', value: user.totalWithdrawals, sub: 'lifetime', dir: null, accent: '#f59e0b', Icon: ArrowDownRight },
    { label: 'Net P&L', value: user.pnl, sub: 'all time', dir: 'up', accent: '#4ae176', Icon: BarChart2 },
  ];

  const tabContent = {
    'overview': <TabOverview user={user} />,
    'profile': <TabProfile user={user} />,
    'kyc': <TabKyc user={user} />,
    'wallet': <TabWallet user={user} />,
    'mt5-accounts': <TabMt5 user={user} />,
    'trading-history': <TabTrading user={user} />,
    'activity-logs': <TabActivity user={user} />,
    'risk-view': <TabRisk user={user} />,
    'notes': <TabNotes user={user} />,
  }[activeTab];

  return (
    <PageShell>

      {/* ── BACK ───────────────────────────────────── */}
      <button
        type="button"
        onClick={() => navigate('/users')}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-text-muted/55 hover:text-text transition-colors"
      >
        <ArrowLeft size={13} />
        Back to Users
      </button>

      {/* ══ HEADER ══════════════════════════════════ */}
      <div
        className="relative overflow-hidden rounded-[14px] border border-border/40 bg-surface-elevated p-5 mt-4"
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
      >
        {/* Accent glow top-left */}
        <div
          className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full opacity-10"
          style={{ background: `hsl(${hue},70%,55%)`, filter: 'blur(50px)' }}
        />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
          {/* Avatar + name block */}
          <div className="flex items-center gap-4">
            <div
              className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-[20px] font-semibold z-10"
              style={{ background: avatarBg, color: avatarText, border: `1.5px solid ${avatarBorder}` }}
            >
              {user.name[0]}
              <span
                className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2"
                style={{
                  borderColor: 'var(--surface-elevated)',
                  background: suspended ? '#ef4444' : '#4ae176',
                }}
              />
            </div>

            <div className="z-10">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-text leading-none">
                  {user.name}
                </h1>
                <StatusBadge status={user.kycStatus} />
                <StatusBadge status={user.riskStatus} dot={false} />
                {suspended && (
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-[4px] bg-[#ef444420] text-[#ef4444]">
                    SUSPENDED
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex items-center gap-3 flex-wrap text-[12px] text-text-muted/60">
                <span className="flex items-center gap-1">
                  <span className="font-mono font-semibold">UID {user.uid}</span>
                </span>
                <span className="h-3 w-px bg-border/40" />
                <span>{user.segment} · {user.tier}</span>
                <span className="h-3 w-px bg-border/40" />
                <span className="flex items-center gap-1">
                  <Globe size={11} />
                  {user.country}
                </span>
                <span className="h-3 w-px bg-border/40" />
                <span>{user.email}</span>
                <span className="h-3 w-px bg-border/40" />
                <span className="flex items-center gap-1">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: '#4ae176' }}
                  />
                  Last active {user.lastSeen}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-wrap lg:ml-auto z-10">
            <ActionBtn
              label="Edit"
              Icon={Edit2}
              variant="primary"
              onClick={() => { }}
            />
            <ActionBtn
              label={suspended ? 'Activate' : 'Suspend'}
              Icon={suspended ? Unlock : Ban}
              variant={suspended ? 'success' : 'danger'}
              onClick={() => setSuspended((v) => !v)}
            />
            <ActionBtn
              label="Create MT5"
              Icon={Monitor}
              onClick={() => { }}
            />
            <MoreActionsMenu
              suspended={suspended}
              onSuspend={() => setSuspended((v) => !v)}
              onReset={() => { }}
              onFreeze={() => { }}
            />
          </div>
        </div>

        {/* Stat pills row */}
        <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-border/20 z-10 relative">
          {[
            { label: 'Balance', value: user.walletBalance, color: 'var(--brand)' },
            { label: 'Equity', value: user.equity, color: '#4ae176' },
            { label: 'Open', value: `${user.openPositions} positions`, color: '#22d3ee' },
            { label: 'MT5', value: `${user.mt5.length} accounts`, color: '#a78bfa' },
            { label: 'KYC', value: user.kycStatus, color: user.kycStatus === 'VERIFIED' ? '#4ae176' : '#f59e0b' },
            { label: 'Risk', value: user.riskStatus, color: user.riskStatus === 'LOW' ? '#4ae176' : '#f59e0b' },
          ].map(({ label, value, color }) => (
            <StatPill key={label} label={label} value={value} color={color} />
          ))}
        </div>
      </div>

      {/* ── KPI STRIP ──────────────────────────────── */}
      <section className="grid grid-cols-3 gap-3 xl:grid-cols-6 mt-6">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </section>

      {/* ══ MAIN CONTENT ════════════════════════════ */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.4fr)_300px] mt-6">

        {/* LEFT: Tabbed content */}
        <div>
          {/* Tab bar */}
          <div
            className="mb-4 flex gap-1 overflow-x-auto rounded-[10px] border border-border/40 bg-surface-elevated p-1.5 shadow-sm"
          >
            {TABS.map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    navigate(id === 'overview' ? `/users/${userId}` : `/users/${userId}/${id}`);
                  }}
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-[6px] px-3 py-2 text-[11px] font-semibold transition-all"
                  style={{
                    background: isActive ? 'var(--surface-overlay)' : 'transparent',
                    color: isActive ? 'var(--text)' : 'var(--text-muted)',
                    border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  <Icon size={11} />
                  <span className="whitespace-nowrap">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab body */}
          <div
            className="rounded-[12px] border border-border/40 bg-surface-elevated p-5"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            {tabContent}
          </div>
        </div>

        {/* RIGHT: Persistent panel */}
        <RightPanel user={user} />
      </section>

    </PageShell>
  );
}