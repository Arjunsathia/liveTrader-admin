import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import {
  Activity, AlertTriangle, ArrowLeft, BarChart2, Check,
  CheckCircle2, ChevronDown, Clock, Copy,
  CreditCard, Download, Edit2, Eye, FileText, Flag,
  Lock, LogOut, MessageSquare, MoreHorizontal, PauseCircle,
  RefreshCw, Send, Settings as SettingsIcon,
  ShieldAlert, Star, Terminal, TrendingDown, TrendingUp, UserCheck, Users, X, XCircle, Zap, Globe, ShieldCheck, ExternalLink, Hash, Wallet,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { PageShell } from '../../../layout/PageShell';
import { Card } from '../../../components/ui/Card';
import { KpiCard } from '../../../components/cards/KpiCard';
import { strategiesConfig } from '../configs/strategies.config';
import { providersConfig } from '../configs/providers.config';
import { followersConfig } from '../configs/followers.config';
import { subscriptionsConfig } from '../configs/subscriptions.config';
import { performanceConfig } from '../configs/performance.config';
import { logsConfig } from '../configs/logs.config';

/* ─────────────────────────────────────────────────────────────
   CONFIG & UTILS
   ───────────────────────────────────────────────────────────── */
const CONFIGS = {
  strategies: strategiesConfig,
  providers: providersConfig,
  followers: followersConfig,
  subscriptions: subscriptionsConfig,
  performance: performanceConfig,
  logs: logsConfig,
};

const HEADER_ICONS = {
  strategies: BarChart2,
  providers: UserCheck,
  followers: Copy,
  subscriptions: CreditCard,
  performance: TrendingUp,
  logs: Terminal,
};

function getRowLabel(slug, row) {
  switch (slug) {
    case 'strategies': return { title: row.name, sub: `${row.provider} · ${row.pid}`, initials: row.name?.[0] };
    case 'providers': return { title: row.provider, sub: `${row.uid} · ${row.region}`, initials: row.provider?.[0] };
    case 'followers': return { title: row.follower, sub: `${row.uid} · ${row.strategy}`, initials: row.follower?.[0] };
    case 'subscriptions': return { title: row.id, sub: `${row.user} · ${row.provider}`, initials: 'SUB' };
    case 'performance': return { title: row.strategy, sub: `${row.provider} · ${row.window ?? '30D'}`, initials: 'PERF' };
    case 'logs': return { title: row.eventId || row.id, sub: `${row.type?.replace(/_/g, ' ')} · ${row.timestamp}`, initials: 'LOG' };
    default: return { title: row.id, sub: '', initials: '?' };
  }
}

const STATUS_COLOR = {
  ACTIVE: 'var(--positive)', PAUSED: 'var(--warning)', SUSPENDED: 'var(--negative)',
  REVIEW: 'var(--cyan)', INACTIVE: 'var(--text-muted)', FAILED: 'var(--negative)',
  RENEWED: 'var(--positive)', SUCCESS: 'var(--positive)', PENDING: 'var(--warning)',
  ERROR: 'var(--negative)', CRITICAL: 'var(--negative)', APPROVED: 'var(--positive)',
};

const RISK_COLOR = {
  LOW: 'var(--positive)',
  MEDIUM: 'var(--warning)',
  HIGH: 'var(--negative)',
};

/* ─────────────────────────────────────────────────────────────
   SHARED UI ATOMS (Digital Obsidian Style)
   ───────────────────────────────────────────────────────────── */

function StatusBadge({ value, size = 'sm' }) {
  const color = STATUS_COLOR[value] || RISK_COLOR[value] || 'var(--text-muted)';
  if (!value) return null;
  const px = size === 'lg' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-0.5 text-[10px]';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[6px] font-black uppercase tracking-[0.1em] whitespace-nowrap ${px}`}
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}
    >
      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
      {value}
    </span>
  );
}

function Field({ label, value, mono, accent, wide, copyable, className = '' }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className={`group relative rounded-[10px] border border-border/30 bg-surface-elevated shadow-card-subtle px-3 py-2.5 transition-all duration-200 hover:border-border/55 ${wide ? 'col-span-2' : ''} ${className}`}>
      <div className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-text-muted/50 mb-1.5 font-heading select-none">{label}</div>
      <div className={`text-[13px] leading-snug truncate ${mono ? 'font-mono tracking-tight' : 'font-semibold font-heading'}`} style={{ color: accent ?? 'var(--text)' }}>
        {value ?? '—'}
      </div>
      {copyable && value && (
        <button onClick={handleCopy} className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-text-muted/30 hover:text-text-muted cursor-pointer">
          {copied ? <Check size={11} /> : <Copy size={11} />}
        </button>
      )}
    </div>
  );
}

function SectionLabel({ title, Icon: Ic, action }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-1">
      {Ic && <Ic size={11} className="text-text-muted/35 flex-shrink-0" />}
      <span className="text-[9.5px] font-black uppercase tracking-[0.18em] text-text-muted/35 font-heading select-none">{title}</span>
      <div className="flex-1 h-px bg-white/[0.05]" />
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function ActionBtn({ label, Icon: Ic, variant = 'default', onClick, small, disabled }) {
  const variantStyles = {
    danger:  { border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.07)', color: '#ef4444' },
    success: { border: '1px solid rgba(74,225,118,0.25)', background: 'rgba(74,225,118,0.07)', color: 'var(--positive)' },
    warning: { border: '1px solid rgba(217,119,6,0.25)', background: 'rgba(217,119,6,0.07)', color: '#d97706' },
    brand:   { border: '1px solid rgba(var(--brand-rgb),0.25)', background: 'rgba(var(--brand-rgb),0.08)', color: 'var(--brand)' },
    cyan:    { border: '1px solid rgba(6,182,212,0.25)', background: 'rgba(6,182,212,0.07)', color: 'var(--cyan)' },
    default: { border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-muted)' },
  };
  const h = small ? 'h-7 text-[10.5px] px-2.5' : 'h-8 text-[11px] px-3.5';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex ${h} w-full justify-center items-center gap-2 rounded-[8px] font-semibold font-heading transition-all duration-200 hover:brightness-110 active:scale-[0.97] disabled:opacity-30 cursor-pointer select-none`}
      style={variantStyles[variant] ?? variantStyles.default}
    >
      {Ic && <Ic size={small ? 11 : 12} />}
      {label}
    </button>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div className="flex items-center gap-1.5 rounded-[8px] border border-border/30 bg-bg/50 px-2.5 py-1.5 transition-all hover:bg-bg/80">
      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
      <span className="text-[10px] font-bold text-text-muted/60 uppercase tracking-[0.14em]">{label}</span>
      <span className="font-mono text-[11px] font-bold text-text tracking-tight">{value}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MOCK COMPONENTS & DATA
   ───────────────────────────────────────────────────────────── */

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-lg px-3 py-2.5 text-[11px] font-mono">
      <div className="text-text-muted/60 mb-1.5 font-heading font-semibold uppercase tracking-[0.14em] text-[10px]">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
          <span className="text-text-muted capitalize">{p.dataKey}:</span>
          <span className="font-semibold" style={{ color: p.color }}>{typeof p.value === 'number' && p.value > 0 ? '+' : ''}{p.value}</span>
        </div>
      ))}
    </div>
  );
}

const PERF_DATA = [
  { date: 'Jan', pnl: 1200, equity: 10200, drawdown: -2.1 },
  { date: 'Feb', pnl: 850, equity: 11050, drawdown: -1.4 },
  { date: 'Mar', pnl: -320, equity: 10730, drawdown: -4.2 },
  { date: 'Apr', pnl: 1640, equity: 12370, drawdown: -0.8 },
  { date: 'May', pnl: 920, equity: 13290, drawdown: -2.0 },
  { date: 'Jun', pnl: -180, equity: 13110, drawdown: -3.5 },
  { date: 'Jul', pnl: 2100, equity: 15210, drawdown: -0.5 },
  { date: 'Aug', pnl: 760, equity: 15970, drawdown: -1.1 },
];

const MOCK_FOLLOWERS = [
  { id: 'F01', user: 'Marcus Chen', uid: 'U-7823', allocation: '$5,000', ratio: '1:1', pnl: '+$312', status: 'ACTIVE', since: '2024-01-12' },
  { id: 'F02', user: 'Aisha Nwosu', uid: 'U-3341', allocation: '$2,500', ratio: '0.5:1', pnl: '-$48', status: 'PAUSED', since: '2024-02-01' },
  { id: 'F03', user: 'Dev Patel', uid: 'U-9102', allocation: '$10,000', ratio: '2:1', pnl: '+$1,204', status: 'ACTIVE', since: '2023-11-20' },
  { id: 'F04', user: 'Lena Schmidt', uid: 'U-5588', allocation: '$1,000', ratio: '0.25:1', pnl: '+$67', status: 'ACTIVE', since: '2024-03-07' },
];

/* ─────────────────────────────────────────────────────────────
   TABS COMPONENTS
   ───────────────────────────────────────────────────────────── */

function TabOverview({ row, slug }) {
  const roiPos = row.roi?.startsWith('+');
  return (
    <div className="space-y-6">
      <div>
        <SectionLabel title="Core Identity" Icon={FileText} />
        <div className="grid grid-cols-2 gap-2.5">
          {row.name && <Field label="Strategy Name" value={row.name} wide copyable />}
          {row.provider && <Field label="Provider" value={row.provider} copyable />}
          {row.pid && <Field label="Provider ID" value={row.pid} mono copyable accent="var(--cyan)" />}
          {row.uid && <Field label="User ID" value={row.uid} mono copyable />}
          {row.region && <Field label="Region" value={row.region} />}
          {row.minDeposit && <Field label="Min. Deposit" value={row.minDeposit} mono />}
          {row.fee && <Field label="Perf. Fee" value={row.fee} mono accent="var(--warning)" />}
        </div>
      </div>

      {(row.roi || row.winRate || row.drawdown) && (
        <div>
          <SectionLabel title="Performance Stats" Icon={BarChart2} />
          <div className="grid grid-cols-3 gap-2.5">
            {row.roi && <Field label="ROI (All Time)" value={row.roi} mono accent={roiPos ? 'var(--positive)' : 'var(--negative)'} />}
            {row.winRate && <Field label="Win Rate" value={row.winRate} mono />}
            {row.drawdown && <Field label="Max Drawdown" value={row.drawdown} mono accent="var(--negative)" />}
            {row.sharpe && <Field label="Sharpe Ratio" value={row.sharpe} mono accent="var(--cyan)" />}
            {row.copiedVolume && <Field label="Copied Volume" value={row.copiedVolume} mono accent="var(--brand)" />}
            {row.aum && <Field label="AUM" value={row.aum} mono accent="var(--brand)" />}
          </div>
        </div>
      )}

      <div>
        <SectionLabel title="Metadata & Audit" Icon={Clock} />
        <div className="grid grid-cols-2 gap-2.5">
          {row.startDate && <Field label="Created At" value={row.startDate} mono />}
          {row.lastUpdated && <Field label="Last Activity" value={row.lastUpdated} mono />}
          {row.plan && <Field label="Platform Plan" value={row.plan} />}
          <Field label="System Audit" value="PASSED" accent="var(--positive)" />
        </div>
      </div>
    </div>
  );
}

function TabPerformance({ row }) {
  const [chartType, setChartType] = useState('equity');
  return (
    <div className="space-y-6">
      <SectionLabel title="Equity Curve" Icon={TrendingUp} action={
        <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] p-0.5 rounded-[7px]">
          {['equity', 'pnl', 'drawdown'].map((t) => (
            <button key={t} onClick={() => setChartType(t)}
              className={`px-2 py-0.5 rounded-[5px] text-[9.5px] font-bold uppercase tracking-widest font-heading cursor-pointer transition-all duration-150
                ${chartType === t ? 'bg-primary text-[#000]' : 'text-text-muted/30 hover:text-text-muted'}`}
            >
              {t}
            </button>
          ))}
        </div>
      } />
      <div className="rounded-[12px] border border-white/[0.06] bg-white/[0.015] p-5 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pnl' ? (
            <BarChart data={PERF_DATA} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="pnl" fill="var(--brand)" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : chartType === 'drawdown' ? (
            <AreaChart data={PERF_DATA}>
              <defs>
                <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--negative)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--negative)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="drawdown" stroke="var(--negative)" strokeWidth={2} fill="url(#ddGrad)" />
            </AreaChart>
          ) : (
            <AreaChart data={PERF_DATA}>
              <defs>
                <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} width={50} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="equity" stroke="var(--brand)" strokeWidth={2} fill="url(#eqGrad)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <SectionLabel title="Performance Matrix" Icon={BarChart2} />
      <div className="grid grid-cols-3 gap-2.5">
        <Field label="Monthly Growth" value="+4.2%" mono accent="var(--positive)" />
        <Field label="Win Rate" value={row.winRate ?? '68%'} mono />
        <Field label="Avg. Trade Duration" value="4.2h" />
        <Field label="Total Trades" value="1,240" mono />
        <Field label="Profit Factor" value="1.84" mono accent="var(--cyan)" />
        <Field label="Max Drawdown" value={row.drawdown ?? '12%'} mono accent="var(--negative)" />
      </div>
    </div>
  );
}

function TabFollowers() {
  return (
    <div className="space-y-6">
      <SectionLabel title="Active Copy Followers" Icon={Users} action={<button className="text-[10px] font-bold text-primary hover:underline">Export List →</button>} />
      <div className="rounded-[12px] border border-white/[0.08] bg-black/20 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead className="bg-white/[0.03] border-b border-white/[0.06]">
            <tr>
              <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-[10px] text-text-muted/40">User</th>
              <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-[10px] text-text-muted/40 text-center">Allocation</th>
              <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-[10px] text-text-muted/40 text-center">Ratio</th>
              <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-[10px] text-text-muted/40 text-center">P&L Impact</th>
              <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-[10px] text-text-muted/40">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {MOCK_FOLLOWERS.map((f) => (
              <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <div className="font-bold text-text/80">{f.user}</div>
                  <div className="text-[10px] font-mono text-text-muted/40">{f.uid}</div>
                </td>
                <td className="px-4 py-3 text-center font-mono font-bold text-brand">{f.allocation}</td>
                <td className="px-4 py-3 text-center font-mono text-text/60">{f.ratio}</td>
                <td className="px-4 py-3 text-center font-mono font-bold text-positive">{f.pnl}</td>
                <td className="px-4 py-3"><StatusBadge value={f.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ActionBtn label="Send Notification to All" Icon={MessageSquare} />
        <ActionBtn label="View Follower Hierarchy" Icon={Users} variant="brand" />
      </div>
    </div>
  );
}

function TabSubscriptions({ row }) {
  return (
    <div className="space-y-6">
      <SectionLabel title="Subscription Model" Icon={CreditCard} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Active Plan" value={row.plan ?? 'Performance Elite'} accent="var(--brand)" />
        <Field label="Billing Cycle" value="Monthly" />
        <Field label="Next Renewal" value={row.renewal ?? '2024-02-15'} mono />
        <Field label="Current Allocation" value={row.allocation ?? row.copiedVolume ?? '$15,000'} mono />
      </div>
      
      <SectionLabel title="Fee Structure" Icon={ShieldCheck} />
      <div className="grid grid-cols-3 gap-3">
        <Field label="Performance Fee" value={row.fee ?? '20%'} mono accent="var(--warning)" />
        <Field label="Service Fee" value="0%" />
        <Field label="Entry Fee" value="None" />
      </div>

      <div className="mt-4 space-y-2">
        <ActionBtn label="Force Manual Renewal" Icon={RefreshCw} variant="success" />
        <ActionBtn label="Cancel User Subscription" Icon={XCircle} variant="danger" />
      </div>
    </div>
  );
}

function TabLogs() {
  const logs = [
    { id: 'EVT-01', type: 'STATUS', msg: 'Strategy status changed PAUSED → ACTIVE', actor: 'admin.arjun', time: '2024-07-01 14:32', severity: 'INFO' },
    { id: 'EVT-02', type: 'FEE', msg: 'Performance fee updated from 20% → 25%', actor: 'system.auto', time: '2024-06-28 09:14', severity: 'WARN' },
    { id: 'EVT-03', type: 'RISK', msg: 'Max drawdown threshold breached: -8.4%', actor: 'risk-engine', time: '2024-06-20 03:41', severity: 'ERROR' },
    { id: 'EVT-04', type: 'COPIER', msg: 'New follower Marcus Chen (UID-7823) joined', actor: 'client-api', time: '2024-06-19 11:22', severity: 'INFO' },
  ];
  const SEV_COLOR_MAP = { INFO: 'var(--cyan)', WARN: 'var(--warning)', ERROR: 'var(--negative)', CRITICAL: 'var(--negative)' };

  return (
    <div className="space-y-5">
      <SectionLabel title="System Event Timeline" Icon={Terminal} />
      <div className="relative pl-6 space-y-4">
        {/* Timeline spine */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.08]" />
        
        {logs.map((log) => {
          const sc = SEV_COLOR_MAP[log.severity] || 'var(--text-muted)';
          return (
            <div key={log.id} className="relative group">
              {/* Node */}
              <div className="absolute -left-[23px] top-1.5 w-4 h-4 rounded-full border-4 border-black z-10" style={{ background: sc, boxShadow: `0 0 10px ${sc}40` }} />
              
              <div className="rounded-[10px] border border-white/[0.04] bg-white/[0.015] p-3.5 hover:border-white/[0.08] transition-all">
                <div className="flex items-center justify-between mb-1.5 font-mono text-[9px] uppercase tracking-widest">
                  <span style={{ color: sc }} className="font-bold">{log.severity} · {log.type}</span>
                  <span className="text-text-muted/30">{log.id}</span>
                </div>
                <p className="text-[12px] font-medium text-text/80 leading-relaxed">{log.msg}</p>
                <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-text-muted/40">
                  <span className="flex items-center gap-1.5"><UserCheck size={10} /> {log.actor}</span>
                  <span>{log.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="w-full py-2.5 border border-dashed border-white/[0.1] rounded-[10px] text-[11px] font-bold text-text-muted/40 hover:text-primary hover:border-primary/30 transition-all">Load More Events</button>
    </div>
  );
}

function TabSettings({ row }) {
  const [flags, setFlags] = useState({ public: true, autoApprove: false, notify: true });
  const toggle = (k) => setFlags(p => ({ ...p, [k]: !p[k] }));

  const CheckItem = ({ label, active, onToggle }) => (
    <div className="flex items-center justify-between p-3.5 rounded-[12px] border border-white/[0.06] bg-black/20 hover:border-white/[0.1] transition-all cursor-pointer" onClick={onToggle}>
      <span className="text-[13px] font-semibold text-text/80 font-heading">{label}</span>
      <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${active ? 'bg-primary/20 border-primary/30' : 'bg-white/[0.05] border-white/[0.1] shadow-inner'} border`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 shadow-sm ${active ? 'translate-x-[20px] bg-primary' : 'translate-x-0.5 bg-text-muted/40'}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionLabel title="Visibility & Access" Icon={Eye} />
      <div className="space-y-2">
        <CheckItem label="Publicly Visible on Marketplace" active={flags.public} onToggle={() => toggle('public')} />
        <CheckItem label="Allow New Subscriptions" active={true} onToggle={() => {}} />
        <CheckItem label="Auto-Approve Join Requests" active={flags.autoApprove} onToggle={() => toggle('autoApprove')} />
      </div>

      <SectionLabel title="Risk Notification Controls" Icon={ShieldAlert} />
      <div className="space-y-2">
        <CheckItem label="Notify Admin on Drawdown Breach" active={flags.notify} onToggle={() => toggle('notify')} />
        <CheckItem label="Instant Email on Execution Error" active={true} onToggle={() => {}} />
      </div>

      <div className="pt-4">
        <ActionBtn label="Apply General Settings" Icon={Check} variant="brand" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PERSISTENT SIDEBAR
   ───────────────────────────────────────────────────────────── */

function OperatorSidebar({ row, onFlush }) {
  const [note, setNote] = useState('');
  const status = row.status ?? row.severity ?? 'ACTIVE';
  const riskColor = row.risk === 'HIGH' ? 'var(--negative)' : row.risk === 'LOW' ? 'var(--positive)' : 'var(--warning)';

  return (
    <div className="space-y-4 lg:sticky lg:top-4">
      {/* 1. Entity Card */}
       <div className="rounded-[10px] border border-border/40 bg-surface-elevated p-6 shadow-card-subtle relative overflow-hidden">
        {/* Animated background pulse */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/[0.03] rounded-full blur-[80px]" />
        
        <div className="relative z-10">
          <SectionLabel title="Status Monitor" Icon={Terminal} />
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between p-3 rounded-[8px] bg-bg/50 border border-border/30 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">Current State</span>
              <StatusBadge value={status} size="lg" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-[8px] bg-bg/50 border border-border/30 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">Risk Profile</span>
              <span className="text-[10px] font-black uppercase tracking-[0.12em] px-2.5 py-1 rounded-[6px]" style={{ color: riskColor, background: `color-mix(in srgb, ${riskColor} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${riskColor} 20%, transparent)` }}>{row.risk || 'MEDIUM'} LEVEL</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Actions */}
      <div className="rounded-[10px] border border-border/40 bg-surface-elevated p-6 shadow-card-subtle">
        <SectionLabel title="Control Panel" Icon={Zap} />
        <div className="space-y-2 mt-4">
          <ActionBtn label="Approve Strategy" Icon={CheckCircle2} variant="success" onClick={() => onFlush('Entity approved')} />
          <ActionBtn label="Pause Copying" Icon={PauseCircle} variant="warning" onClick={() => onFlush('Operations paused')} />
          <ActionBtn label="Instant Suspend" Icon={Lock} variant="danger" onClick={() => onFlush('Entity suspended')} />
          <ActionBtn label="Emergency Flush" Icon={RefreshCw} variant="cyan" onClick={() => onFlush('Cache flushed')} />
        </div>
      </div>

      {/* 3. Internal Notes */}
      <div className="rounded-[10px] border border-border/40 bg-surface-elevated p-6 shadow-card-subtle">
        <SectionLabel title="Administrator Note" Icon={MessageSquare} />
        <div className="mt-4 space-y-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Compliance remarks or internal investigation notes..."
            className="w-full h-28 rounded-[12px] border border-white/[0.06] bg-black/30 p-4 text-[13px] text-text outline-none placeholder:text-text-muted/20 focus:border-primary/20 transition-all duration-300 resize-none font-heading shadow-inner"
          />
          <button
            onClick={() => { if (note) { onFlush('Note saved to chain'); setNote(''); } }}
            className={`w-full flex h-10 items-center justify-center gap-2 rounded-[10px] bg-primary text-[#000] text-[11px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-primary/20 ${!note.trim() && 'opacity-30 cursor-not-allowed'}`}
          >
            <Send size={12} /> Commit Note
          </button>
        </div>
      </div>

      <div className="px-6 py-2 opacity-30 select-none">
        <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-[0.2em] mb-1">
          <span>System Sequence</span>
          <span>#LT-CT-{row.id}</span>
        </div>
        <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-[0.2em]">
          <span>Security Poll</span>
          <span className="text-positive">SECURE</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE EXPORT
   ───────────────────────────────────────────────────────────── */

export function CopyTradingDetailPage() {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);

  const config = CONFIGS[slug];
  if (!config) return <Navigate to="/copy-trading/strategies" replace />;

  const row = config.rows.find((r) => String(r.id) === String(id));
  if (!row) return <Navigate to={`/copy-trading/${slug}`} replace />;

  const { title, sub, initials } = getRowLabel(slug, row);
  const hue = (String(title).charCodeAt(0) * 37) % 360;
  const avatarBg = `hsl(${hue}, 40%, 15%)`;
  const avatarText = `hsl(${hue}, 85%, 75%)`;
  const avatarBorder = `hsl(${hue}, 45%, 28%)`;

  const tabs = [
    { id: 'overview', label: 'Overview', Icon: FileText },
    { id: 'performance', label: 'Performance', Icon: TrendingUp },
    { id: 'followers', label: 'Followers', Icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', Icon: CreditCard },
    { id: 'logs', label: 'Log Center', Icon: Terminal },
    { id: 'settings', label: 'Settings', Icon: SettingsIcon },
  ];

  const kpis = [
    { label: 'Followers', value: row.followers ?? '0', sub: 'total copying', accent: 'var(--brand)', Icon: Users },
    { label: 'Managed Capital', value: row.copiedVolume ?? row.aum ?? '$0', sub: 'AUM volume', accent: 'var(--cyan)', Icon: Wallet },
    { label: 'Net ROI', value: row.roi ?? '0.0%', sub: 'all time impact', trendUp: row.roi?.startsWith('+'), trend: ' ', accent: 'var(--positive)', Icon: BarChart2 },
    { label: 'Commission', value: '$12,240', sub: 'last 30 days', accent: 'var(--warning)', Icon: CreditCard },
    { label: 'Success Rate', value: row.winRate ?? '0%', sub: 'execution', accent: 'var(--positive)', Icon: Star },
    { label: 'Health Score', value: '4.9', sub: 'system poll', accent: 'var(--purple)', Icon: ShieldCheck },
  ];

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <PageShell>
      {/* 1. Back Nav */}
      <button
        onClick={() => navigate(`/copy-trading/${slug}`)}
        className="inline-flex items-center gap-2 mb-6 text-[11px] font-bold text-text-muted/45 hover:text-text transition-all duration-300 cursor-pointer group"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.08] group-hover:bg-primary/[0.1] group-hover:border-primary/30 transition-all">
          <ArrowLeft size={11} className="group-hover:text-primary transition-colors" />
        </div>
        Back to {config.title}
      </button>

      {/* 2. Standardized Header Block */}
      <div className="relative overflow-hidden rounded-[10px] border border-border/40 bg-surface-elevated p-8 mb-6 shadow-card-subtle">
        {/* Dynamic theme glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full opacity-[0.05] pointer-events-none blur-[100px]" style={{ background: avatarText }} />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10 relative z-10">
          {/* Entity Profile */}
          <div className="flex items-center gap-6">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] text-[24px] font-black border-2 shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-transform hover:scale-105"
              style={{ background: avatarBg, color: avatarText, borderColor: avatarBorder }}
            >
              {initials}
            </div>
            
            <div className="z-10 min-w-0">
              <div className="flex items-center gap-3.5 flex-wrap mb-2">
                <h1 className="text-[28px] font-bold tracking-[-0.04em] text-text leading-tight">{title}</h1>
                <StatusBadge value={row.status || 'ACTIVE'} />
                <StatusBadge value={row.risk} />
              </div>
              <div className="flex items-center gap-5 flex-wrap text-[13px] font-medium text-text-muted/40 font-heading">
                <span className="flex items-center gap-2"><Hash size={12} className="opacity-40" /><span className="font-mono text-text/70">{row.id}</span></span>
                <span className="h-4 w-px bg-white/[0.08]" />
                <span className="flex items-center gap-2"><UserCheck size={13} className="opacity-40" />{row.provider || 'System Network'}</span>
                <span className="h-4 w-px bg-white/[0.08]" />
                <span className="flex items-center gap-2"><Globe size={13} className="opacity-40" />{row.region || 'International'}</span>
              </div>
            </div>
          </div>

          {/* Top Actions Pane */}
          <div className="flex items-center gap-2 lg:ml-auto z-10 flex-wrap">
            <button className="flex h-10 items-center gap-2.5 rounded-[12px] border border-white/[0.08] bg-white/[0.03] px-5 text-[12px] font-bold text-text-muted/70 hover:text-text hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 shadow-sm"><Download size={14} /> Performance Report</button>
            <button className="flex h-10 items-center gap-2.5 rounded-[12px] border border-white/[0.08] bg-white/[0.03] px-5 text-[12px] font-bold text-text-muted/70 hover:text-text hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 shadow-sm"><Edit2 size={13} /> Update Record</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/[0.08] bg-white/[0.03] text-text-muted/50 hover:text-text hover:bg-white/[0.08] hover:border-white/[0.2] transition-all shadow-sm"><MoreHorizontal size={18} /></button>
          </div>
        </div>

        {/* Vital Info Strip */}
        <div className="mt-8 pt-6 border-t border-border/30 flex flex-wrap gap-2">
          <StatPill label="Public Success" value={row.winRate ?? '0.0%'} color="var(--positive)" />
          <StatPill label="Copy Followers" value={row.followers ?? '0'} color="var(--brand)" />
          <StatPill label="Peak Drawdown" value={row.drawdown ?? '0.0%'} color="var(--negative)" />
          <StatPill label="Platform Fee" value={row.fee ?? '20%'} color="var(--warning)" />
          <StatPill label="Region" value={row.region ?? 'GLOBAL'} color="var(--cyan)" />
        </div>
      </div>

      {/* 3. Global KPI Snapshot */}
      <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </section>

      {/* 4. Feature Space */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_340px]">
        {/* Module Content */}
        <div className="min-w-0">
          {/* Premium Segmented Navigation */}
          <div className="flex gap-1 overflow-x-auto rounded-[10px] border border-border/30 bg-bg p-1.5 mb-6 shadow-inner no-scrollbar">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 rounded-[8px] px-5 py-2.5 text-[12px] font-bold transition-all duration-300 outline-none flex-shrink-0 cursor-pointer select-none
                    ${active ? 'bg-surface-elevated text-text shadow-sm border border-border/50 scale-[1.02]' : 'border border-transparent text-text-muted/50 hover:text-text-muted/80 hover:bg-white/[0.02]'}`}
                >
                  <tab.Icon size={13} className={active ? 'text-primary' : ''} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-[10px] border border-border/40 bg-surface-elevated p-8 shadow-card-subtle">
            {activeTab === 'overview' && <TabOverview row={row} slug={slug} />}
            {activeTab === 'performance' && <TabPerformance row={row} />}
            {activeTab === 'followers' && <TabFollowers />}
            {activeTab === 'subscriptions' && <TabSubscriptions row={row} />}
            {activeTab === 'logs' && <TabLogs />}
            {activeTab === 'settings' && <TabSettings row={row} />}
          </div>
        </div>

        {/* Operator Deck */}
        <div className="min-w-0">
          <OperatorSidebar row={row} onFlush={triggerToast} />
        </div>
      </div>

      {/* Dynamic Toast System */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[100] flex items-center gap-4 rounded-[16px] border border-positive/30 bg-black/80 backdrop-blur-xl px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-6 zoom-in-95 duration-500">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-positive/20 border border-positive/30 shrink-0">
            <CheckCircle2 size={20} className="text-positive" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-black uppercase tracking-widest text-positive">Transmission Success</span>
            <span className="text-[11px] font-medium text-text-muted mt-0.5">{toast}</span>
          </div>
        </div>
      )}

      {/* Global Scroll fix for tabs */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </PageShell>
  );
}