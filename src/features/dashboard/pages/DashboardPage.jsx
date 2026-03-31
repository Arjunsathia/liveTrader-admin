import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Area, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, ComposedChart, Line,
} from 'recharts';
import {
  Activity, ArrowDownRight, ArrowUpRight,
  ChevronRight, Copy, CreditCard,
  DollarSign, FileCheck, Globe, HeartPulse,
  RefreshCw, Shield, ShieldAlert, Terminal,
  UserCheck, Users, Wallet,
  Wifi, BarChart2, Search, Zap,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../layout/PageShell';

/* ─────────────────────────────────────────────
   MOCK DATA & CONSTANTS
───────────────────────────────────────────── */

const KPI_DATA = [
  { label: 'Platform Equity', value: '$42.8M', trend: '+3.2%', up: true, sub: 'vs yesterday', Icon: DollarSign, accent: 'var(--brand)' },
  { label: 'Active Traders', value: '1,847', trend: '+61', up: true, sub: 'since 00:00 UTC', Icon: Users, accent: '#4ae176' },
  { label: 'KYC Backlog', value: '73', trend: '+12', up: false, sub: 'awaiting review', Icon: FileCheck, accent: '#f59e0b' },
  { label: 'Pending W/D', value: '28', trend: '$184k', up: false, sub: 'total exposure', Icon: Wallet, accent: '#ef4444' },
  { label: '24H Volume', value: '$9.14M', trend: '-5.8%', up: false, sub: 'vs prior 24h', Icon: BarChart2, accent: '#a78bfa' },
  { label: 'Live Connections', value: '3,291', trend: 'stable', up: true, sub: 'across 14 servers', Icon: Wifi, accent: '#22d3ee' },
];

const TIME_FILTERS = ['1H', '4H', '1D', '1W', '1M'];

const CHART_DATA = {
  '1H': Array.from({ length: 12 }, (_, i) => ({
    time: `${String(i * 5).padStart(2, '0')}m`,
    volume: 180 + Math.round(Math.sin(i * 0.6) * 80 + Math.random() * 60),
    deposits: 40 + Math.round(Math.random() * 50),
    withdrawals: 20 + Math.round(Math.random() * 35),
  })),
  '4H': Array.from({ length: 16 }, (_, i) => ({
    time: `${i * 15}m`,
    volume: 200 + Math.round(Math.sin(i * 0.5) * 100 + Math.random() * 80),
    deposits: 50 + Math.round(Math.random() * 60),
    withdrawals: 25 + Math.round(Math.random() * 40),
  })),
  '1D': Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    volume: 150 + Math.round(Math.sin(i * 0.4) * 120 + Math.random() * 100),
    deposits: 60 + Math.round(Math.random() * 80),
    withdrawals: 30 + Math.round(Math.random() * 55),
  })),
  '1W': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => ({
    time: d,
    volume: 800 + Math.round(Math.random() * 600),
    deposits: 200 + Math.round(Math.random() * 200),
    withdrawals: 100 + Math.round(Math.random() * 150),
  })),
  '1M': ['W1', 'W2', 'W3', 'W4'].map((w) => ({
    time: w,
    volume: 3200 + Math.round(Math.random() * 2000),
    deposits: 900 + Math.round(Math.random() * 700),
    withdrawals: 400 + Math.round(Math.random() * 400),
  })),
};

const QUICK_ACTIONS = [
  { label: 'Approve KYC', Icon: UserCheck, path: '/compliance/kyc', accent: '#4ae176' },
  { label: 'Review W/D', Icon: CreditCard, path: '/finance/withdrawals', accent: '#f59e0b' },
  { label: 'Open User', Icon: Search, path: '/users', accent: 'var(--brand)' },
  { label: 'Trade Log', Icon: Terminal, path: '/trading/logs', accent: '#a78bfa' },
  { label: 'Copy Trading', Icon: Copy, path: '/copy-trading', accent: '#22d3ee' },
  { label: 'Support Ticket', Icon: Activity, path: '/support', accent: '#ef4444' },
];

const ALERTS = [
  { id: 1, level: 'critical', cat: 'RISK', title: 'Margin breach — Account #8821', text: 'Equity dropped 94% on open XAUUSD long. Auto-liquidation threshold breached.', stamp: '2m ago', action: 'Review', path: '/risk/accounts/8821' },
  { id: 2, level: 'critical', cat: 'FINANCE', title: '$47,500 withdrawal pending', text: 'Bank wire above threshold. AML flag triggered.', stamp: '11m ago', action: 'Approve', path: '/finance/withdrawals' },
  { id: 3, level: 'warning', cat: 'KYC', title: 'Document mismatch — #10043', text: 'Uploaded ID surname differs from registration.', stamp: '34m ago', action: 'Open', path: '/compliance/kyc' },
  { id: 4, level: 'warning', cat: 'COPY', title: 'Signal provider drawdown >12%', text: '"FX_Alpha" strategy hit 12.4% drawdown today. 231 followers impacted.', stamp: '51m ago', action: 'Review', path: '/copy-trading' },
];

const UNIFIED_STREAM = [
  { id: 'T-88421', type: 'trade', user: 'k.mueller', icon: Activity, detail: 'EUR/USD Buy 2.00 Lots', value: '+$342', status: 'open', time: 'Just now', color: '#22d3ee' },
  { id: 'D-44182', type: 'deposit', user: 'k.mueller', icon: ArrowDownRight, detail: 'Wire Transfer', value: '$10,000', status: 'confirmed', time: '1m ago', color: '#4ae176' },
  { id: 'A-1002', type: 'alert', user: 'System', icon: ShieldAlert, detail: 'Margin breach — Acc #8821', value: 'Critical', status: 'action req', time: '2m ago', color: '#ef4444' },
  { id: 'W-21034', type: 'withdraw', user: 'a.okonkwo', icon: ArrowUpRight, detail: 'Wire Transfer', value: '$47,500', status: 'pending', time: '11m ago', color: '#f59e0b' },
  { id: 'T-88419', type: 'trade', user: 'p.sharma', icon: Activity, detail: 'XAU/USD Sell 0.50 Lots', value: '-$128', status: 'open', time: '14m ago', color: '#22d3ee' },
  { id: 'A-1003', type: 'alert', user: 'System', icon: FileCheck, detail: 'Mismatch User #10043', value: 'Warning', status: 'review req', time: '34m ago', color: '#f59e0b' },
  { id: 'T-88418', type: 'trade', user: 'r.james', icon: Activity, detail: 'GBP/JPY Buy 1.20 Lots', value: '+$79', status: 'closed', time: '41m ago', color: 'var(--text-muted)' },
  { id: 'A-1004', type: 'alert', user: 'System', icon: Activity, detail: 'MT5 Bridge latency spike', value: 'Normal', status: 'resolved', time: '1h ago', color: '#22d3ee' },
];

const MARKET_PAIRS = [
  { pair: 'EUR/USD', bid: '1.08432', spread: '1.3', chg: '+0.18%', up: true },
  { pair: 'GBP/USD', bid: '1.26874', spread: '1.7', chg: '-0.09%', up: false },
  { pair: 'USD/JPY', bid: '149.812', spread: '1.9', chg: '+0.32%', up: true },
  { pair: 'XAU/USD', bid: '2341.50', spread: '0.5', chg: '-0.41%', up: false },
  { pair: 'BTC/USD', bid: '64210.0', spread: '12.0', chg: '+1.45%', up: true },
];

const SYSTEM_HEALTH = [
  { name: 'MT5 Bridge EU-1', value: 98, status: 'ok', metric: '89ms' },
  { name: 'MT5 Bridge EU-2', value: 71, status: 'warn', metric: '310ms' },
  { name: 'MT5 Bridge APAC', value: 97, status: 'ok', metric: '102ms' },
  { name: 'Database Primary', value: 99, status: 'ok', metric: '4ms' },
  { name: 'Liquidity Feed', value: 96, status: 'ok', metric: 'live' },
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function KpiBlock({ label, value, trend, up, sub, Icon, accent }) {
  return (
    <div
      className="relative flex flex-col gap-2 rounded-[8px] border border-border/40 bg-surface-elevated p-4 overflow-hidden group hover:border-border/60 transition-all duration-300"
    >
      <div
        className="absolute top-0 left-0 h-[2px] w-full transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
      
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/60">
          {label}
        </span>
        <span
          className="flex h-7 w-7 items-center justify-center rounded-[8px] transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${accent}1a` }}
        >
          <Icon size={14} style={{ color: accent }} />
        </span>
      </div>
      
      <div className="text-[22px] font-semibold tracking-[-0.03em] text-text leading-none mt-1">
        {value}
      </div>
      
      <div className="flex items-center gap-1.5 mt-0.5">
        {trend !== 'stable' ? (
          up ? (
            <ArrowUpRight size={11} className="text-[#4ae176]" />
          ) : (
            <ArrowDownRight size={11} className="text-[#ef4444]" />
          )
        ) : (
          <Activity size={11} className="text-text-muted/50" />
        )}
        <span
          className="text-[11px] font-semibold"
          style={{ color: trend === 'stable' ? 'var(--text-muted)' : up ? '#4ae176' : '#ef4444' }}
        >
          {trend}
        </span>
        <span className="text-[11px] text-text-muted/50">{sub}</span>
      </div>
    </div>
  );
}

function StreamRow({ item }) {
  const Icon = item.icon;
  const isGain = item.value.startsWith('+') || item.status === 'confirmed';
  const isLoss = item.value.startsWith('-') || item.status === 'action req';
  
  const valColor = isGain ? '#4ae176' : isLoss ? '#ef4444' : item.color;
  
  return (
    <tr className="border-b border-border/10 last:border-0 hover:bg-surface-1/40 transition-colors group">
      <td className="py-2.5 pl-4 pr-3 whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-[5px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: `${item.color}15`, color: item.color }}>
            <Icon size={11} strokeWidth={2.5} />
          </div>
          <span className="font-mono text-[11px] font-medium text-text-muted/60 tracking-wider">
            {item.id}
          </span>
        </div>
      </td>
      <td className="py-2.5 pr-3 whitespace-nowrap">
        <span className="text-[12px] font-medium text-text">{item.user}</span>
      </td>
      <td className="py-2.5 pr-3 whitespace-nowrap">
        <span className="text-[11px] font-medium text-text-muted">{item.detail}</span>
      </td>
      <td className="py-2.5 pr-3 text-right whitespace-nowrap">
        <span className="font-mono text-[12px] font-bold" style={{ color: valColor }}>
          {item.value}
        </span>
      </td>
      <td className="py-2.5 pr-5 text-right whitespace-nowrap text-[10px]">
         <span 
          className="font-bold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-[4px]"
          style={{ 
            color: item.status === 'open' || item.status === 'resolved' ? '#22d3ee' :
                   item.status === 'pending' || item.status === 'review req' ? '#f59e0b' :
                   item.status === 'confirmed' ? '#4ae176' :
                   item.status === 'action req' ? '#ef4444' : 'var(--text-muted)',
            background: item.status === 'open' || item.status === 'resolved' ? '#22d3ee15' :
                        item.status === 'pending' || item.status === 'review req' ? '#f59e0b15' :
                        item.status === 'confirmed' ? '#4ae17615' :
                        item.status === 'action req' ? '#ef444415' : 'rgba(255,255,255,0.05)',
           }}
        >
          {item.status}
        </span>
      </td>
      <td className="py-2.5 pr-4 text-right whitespace-nowrap">
        <span className="font-mono text-[11px] text-text-muted/40 font-medium tracking-wide">{item.time}</span>
      </td>
    </tr>
  );
}

function AlertItem({ alert, onAction }) {
  const levelColor = {
    critical: '#ef4444',
    warning: '#f59e0b',
    normal: '#22d3ee',
  }[alert.level];

  return (
    <div
      className="rounded-[10px] border border-border/20 bg-bg/60 p-3.5 hover:bg-surface-1/40 hover:border-border/40 transition-all cursor-pointer group"
      style={{ borderLeft: `2px solid ${levelColor}40` }}
      onClick={() => onAction(alert.path)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="text-[9px] font-black uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-[4px]"
              style={{ color: levelColor, background: `${levelColor}18` }}
            >
              {alert.level}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/50">
              {alert.cat}
            </span>
            <span className="ml-auto font-mono text-[10px] text-text-muted/40">{alert.stamp}</span>
          </div>
          <div className="text-[12px] font-semibold text-text leading-snug group-hover:text-primary transition-colors">{alert.title}</div>
          <div className="mt-1 text-[11px] leading-5 text-text-muted/70">{alert.text}</div>
        </div>
        <div className="shrink-0 pt-1">
           <button className="flex items-center justify-center h-6 w-6 rounded-md bg-surface-1/50 text-text-muted/50 group-hover:text-text group-hover:bg-surface-1 transition-colors border border-border/20 group-hover:border-border/60">
             <ChevronRight size={12} strokeWidth={2.5} />
           </button>
        </div>
      </div>
    </div>
  );
}

function PairRow({ pair }) {
  const isUp = pair.up;
  const color = isUp ? '#4ae176' : '#ef4444';
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/10 last:border-0 group">
      <div className="flex items-center gap-2">
         <span className="w-[2px] h-3 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" style={{ background: color }} />
         <span className="font-mono text-[11px] font-semibold text-text-muted w-14 group-hover:text-text transition-colors">{pair.pair}</span>
      </div>
      <div className="flex-1 flex justify-end gap-3 items-center">
        <span className="font-mono text-[11px] font-semibold text-text">{pair.bid}</span>
        <span className="text-[9px] text-text-muted/30 font-mono w-6 text-right">s{pair.spread}</span>
      </div>
      <div className="w-[45px] flex justify-end items-center gap-1">
         <span className="font-mono text-[10px] font-bold" style={{ color }}>{pair.chg}</span>
      </div>
    </div>
  );
}

function HealthBar({ item }) {
  const color = item.status === 'ok' ? '#4ae176' : item.status === 'warn' ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2.5 py-1.5 group">
      <div className="relative flex items-center justify-center w-2 h-2">
        <div className="absolute inset-0 rounded-full opacity-40 group-hover:opacity-100 group-hover:animate-ping" style={{ background: color }} />
        <div className="w-1.5 h-1.5 rounded-full relative z-10" style={{ background: color }} />
      </div>
      <span className="text-[12px] text-text-muted flex-1 truncate group-hover:text-text transition-colors">{item.name}</span>
      <span className="font-mono text-[11px] text-text-muted/60 w-16 text-right">{item.metric}</span>
      <div className="w-20 h-1 rounded-full bg-border/20 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${item.value}%`, background: color }} />
      </div>
    </div>
  );
}

const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div 
      className="rounded-[10px] border border-border/40 p-3"
      style={{
        background: 'var(--surface-2)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
        fontSize: '11px',
        fontFamily: 'IBM Plex Mono, monospace',
      }}
    >
      <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-text-muted/60 border-b border-border/20 pb-1.5">{label}</div>
      <div className="flex flex-col gap-1.5 mt-2">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-text-muted w-20">{p.name}:</span>
            <span className="font-semibold text-text">${p.value}k</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export function DashboardPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('1D');
  const chartData = CHART_DATA[activeFilter];

  return (
    <PageShell>
      {/* ── KPI ROW ─────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-6 mb-1">
        {KPI_DATA.map((k) => (
          <KpiBlock key={k.label} {...k} />
        ))}
      </section>

      {/* ROW 2: CORE ANALYTICS & OPS */}
      <section className="grid grid-cols-12 gap-5 mb-1">
        
        {/* Analytics Main Chart */}
        <div className="col-span-12 xl:col-span-8">
          <Card className="h-full p-0">
            <div className="p-5 border-b border-border/15">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-[13px] font-semibold text-text flex items-center gap-2">
                    <BarChart2 size={16} className="text-primary" />
                    Liquidity Flow & Revenue
                  </div>
                  <div className="text-[11px] text-text-muted/60 mt-1">Real-time platform volume, deposits, and performance metrics</div>
                </div>
                
                {/* Time Filters */}
                <div className="flex items-center gap-1 rounded-[8px] border border-border/25 bg-bg/60 p-0.5">
                  {TIME_FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className="rounded-[6px] px-3 py-1 text-[11px] font-semibold transition-all"
                      style={{
                        background: activeFilter === f ? 'var(--brand)' : 'transparent',
                        color: activeFilter === f ? '#000' : 'var(--text-muted)',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* Mini Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Volume', value: '$9.14M', color: 'var(--brand)' },
                  { label: 'Net Deposits', value: '+$1.23M', color: '#4ae176' },
                  { label: 'Total W/D', value: '-$384k', color: '#ef4444' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-[8px] border border-border/20 bg-bg/50 px-4 py-3 flex flex-col group hover:bg-surface-1/40 hover:border-border/40 transition-colors cursor-default">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">
                      {label}
                    </div>
                    <div className="mt-1.5 text-[18px] font-bold tracking-[-0.03em]" style={{ color }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Legend */}
              <div className="mb-6 flex items-center gap-4">
                {[
                  { label: 'Volume', color: 'var(--brand)' },
                  { label: 'Deposits', color: '#4ae176' },
                  { label: 'Withdrawals', color: '#ef4444' },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-1.5 ">
                    <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                    <span className="text-[11px] text-text-muted/70 font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* Chart Area */}
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(194,198,214,0.45)', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(194,198,214,0.45)', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace' }} 
                    />
                    <Tooltip content={<CUSTOM_TOOLTIP />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="volume" name="Volume" stroke="var(--brand)" fill="url(#volGrad)" strokeWidth={2.4} />
                    <Line type="monotone" dataKey="deposits" name="Deposits" stroke="#4ae176" strokeWidth={1.8} dot={false} strokeDasharray="0" />
                    <Line type="monotone" dataKey="withdrawals" name="Withdrawals" stroke="#ef4444" strokeWidth={1.6} dot={false} strokeDasharray="4 2" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Stack: Ops + Quick Actions */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-5 h-full">
          
          {/* Operations Queue - Original Theme */}
          <Card className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[13px] font-semibold text-text flex items-center gap-2">
                  <ShieldAlert size={14} className="text-[#ef4444]" />
                  Operations Queue
                </div>
                <div className="text-[11px] text-text-muted/60 mt-0.5">
                  <span className="text-[#ef4444] font-semibold">2 critical</span> • 2 warnings
                </div>
              </div>
              <button onClick={() => navigate('/alerts')} className="text-[11px] font-semibold text-text-muted/60 hover:text-text flex items-center gap-1 transition-colors bg-border/20 px-2 py-1 rounded-[6px]">
                All <ChevronRight size={11} />
              </button>
            </div>
            <div className="space-y-2.5 overflow-y-auto max-h-[380px] sb-scroll pr-1">
              {ALERTS.map((alert) => (
                <AlertItem key={alert.id} alert={alert} onAction={navigate} />
              ))}
            </div>
          </Card>

          {/* Quick Actions Grid - Built using native bg/border vars */}
          <Card className="p-4 bg-surface-1/40">
            <div className="text-[13px] font-semibold text-text mb-3">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map(({ label, Icon, path, accent }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="flex items-center gap-2.5 rounded-[9px] border border-border/20 bg-bg/50 px-3 py-2.5 text-left hover:border-border/50 hover:bg-surface-1/60 transition-all group"
                >
                  <div 
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[7px] transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${accent}1a`, color: accent }}
                  >
                    <Icon size={13} strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-semibold text-text-muted group-hover:text-text transition-colors leading-tight">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </Card>

        </div>
      </section>

      {/* ── ROW 3: GLOBAL PULSE & SYSTEM HEALTH ─────────── */}
      <section className="grid grid-cols-12 gap-5 items-start mt-1">
        
        {/* Global Stream (Replaces Tabs) */}
        <div className="col-span-12 xl:col-span-8">
          <Card className="h-full p-0">
            {/* Table Header Wrapper */}
            <div className="px-5 py-4 border-b border-border/15 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="text-[13px] font-semibold text-text flex items-center gap-2">
                   <Zap size={14} className="text-[#22d3ee] fill-[#22d3ee]/20" />
                   Global Activity Ledger
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-[6px] bg-bg/50 text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted/70 border border-border/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ae176] animate-pulse"/>
                  Live Stream
                </span>
              </div>
            </div>
            
            {/* Table Body */}
            <div className="overflow-x-auto pb-2 p-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/20">
                    <th className="pb-2 pt-3 pl-4 pr-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/50 w-24">Ref</th>
                    <th className="pb-2 pt-3 pr-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/50">User</th>
                    <th className="pb-2 pt-3 pr-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/50">Detail</th>
                    <th className="pb-2 pt-3 pr-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/50 text-right">Value</th>
                    <th className="pb-2 pt-3 pr-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/50 text-right">Status</th>
                    <th className="pb-2 pt-3 pr-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/50 text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {UNIFIED_STREAM.map((item) => (
                    <StreamRow key={item.id} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Stack: System & Markets */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
          
          {/* Market Snapshot */}
          <Card>
            <div className="flex items-center justify-between mb-3 border-b border-border/15 pb-3">
              <div className="text-[13px] font-semibold text-text flex items-center gap-2">
                <Globe size={13} style={{ color: '#22d3ee' }} />
                Market Pricing
              </div>
              <div className="flex items-center gap-1.5">
                 <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-[#4ae176]" />
                 <span className="text-[10px] font-semibold text-[#4ae176]">LIVE</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/50 pb-1.5 mb-0.5 border-b border-border/15">
                  Pair — Bid — Chg
              </div>
              {MARKET_PAIRS.map((p) => (
                <PairRow key={p.pair} pair={p} />
              ))}
            </div>
          </Card>

          {/* System Health */}
          <Card className="flex-1">
            <div className="flex items-center justify-between mb-3 border-b border-border/15 pb-3">
              <div className="text-[13px] font-semibold text-text flex items-center gap-2">
                <HeartPulse size={13} style={{ color: '#4ae176' }} />
                System Health
              </div>
              <button className="flex items-center gap-1 text-[11px] text-text-muted/50 hover:text-text transition-colors">
                <RefreshCw size={10} /> Ping
              </button>
            </div>
            
            <div className="space-y-1 mt-3">
              {SYSTEM_HEALTH.map((item) => (
                <HealthBar key={item.name} item={item} />
              ))}
            </div>
            
            {/* Quick Metrics */}
            <div className="mt-4 pt-4 border-t border-border/15 grid grid-cols-3 gap-2">
              {[
                { label: 'Uptime', value: '99.91%', color: '#4ae176' },
                { label: 'Errors/hr', value: '0', color: '#4ae176' },
                { label: 'DB QPS', value: '2,841', color: '#22d3ee' },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center rounded-[8px] border border-border/15 bg-bg/40 py-2">
                  <div className="font-mono text-[13px] font-semibold" style={{ color }}>{value}</div>
                  <div className="text-[10px] text-text-muted/50 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </section>
    </PageShell>
  );
}