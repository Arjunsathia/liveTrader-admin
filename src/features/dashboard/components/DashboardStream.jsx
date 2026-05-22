import React from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, FileCheck, ShieldAlert, Zap } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { FeatureTable } from '../../../components/tables';

const UNIFIED_STREAM = [
  { id: 'T-88421', type: 'trade', user: 'k.mueller', icon: Activity, detail: 'EUR/USD Buy 2.00 Lots', value: '+$342', status: 'open', time: 'Just now', color: 'var(--cyan)' },
  { id: 'D-44182', type: 'deposit', user: 'k.mueller', icon: ArrowDownRight, detail: 'Wire Transfer', value: '$10,000', status: 'confirmed', time: '1m ago', color: 'var(--positive)' },
  { id: 'A-1002', type: 'alert', user: 'System', icon: ShieldAlert, detail: 'Margin breach — Acc #8821', value: 'Critical', status: 'action req', time: '2m ago', color: 'var(--negative)' },
  { id: 'W-21034', type: 'withdraw', user: 'a.okonkwo', icon: ArrowUpRight, detail: 'Wire Transfer', value: '$47,500', status: 'pending', time: '11m ago', color: 'var(--warning)' },
  { id: 'T-88419', type: 'trade', user: 'p.sharma', icon: Activity, detail: 'XAU/USD Sell 0.50 Lots', value: '-$128', status: 'open', time: '14m ago', color: 'var(--cyan)' },
  { id: 'A-1003', type: 'alert', user: 'System', icon: FileCheck, detail: 'Mismatch User #10043', value: 'Warning', status: 'review req', time: '34m ago', color: 'var(--warning)' },
  { id: 'T-88418', type: 'trade', user: 'r.james', icon: Activity, detail: 'GBP/JPY Buy 1.20 Lots', value: '+$79', status: 'closed', time: '41m ago', color: 'var(--text-muted)' },
  { id: 'A-1004', type: 'alert', user: 'System', icon: Activity, detail: 'MT5 Bridge latency spike', value: 'Normal', status: 'resolved', time: '1h ago', color: 'var(--cyan)' },
];

const STATUS_STYLE = {
  open: { color: 'var(--cyan)', bg: 'color-mix(in srgb, var(--cyan) 10%, transparent)' },
  resolved: { color: 'var(--cyan)', bg: 'color-mix(in srgb, var(--cyan) 10%, transparent)' },
  pending: { color: 'var(--warning)', bg: 'color-mix(in srgb, var(--warning) 10%, transparent)' },
  'review req': { color: 'var(--warning)', bg: 'color-mix(in srgb, var(--warning) 10%, transparent)' },
  confirmed: { color: 'var(--positive)', bg: 'color-mix(in srgb, var(--positive) 10%, transparent)' },
  'action req': { color: 'var(--negative)', bg: 'color-mix(in srgb, var(--negative) 10%, transparent)' },
  closed: { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.04)' },
};

function StreamRefCell({ item }) {
  const Icon = item.icon;
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] transition-transform group-hover:scale-110"
        style={{ background: `color-mix(in srgb, ${item.color} 12%, transparent)`, color: item.color }}
      >
        <Icon size={11} strokeWidth={2.5} />
      </div>
      <span className="font-mono text-[12px] font-medium tracking-wider text-text-muted/60">{item.id}</span>
    </div>
  );
}

function StreamValueCell({ item }) {
  const isGain = item.value.startsWith('+') || item.status === 'confirmed';
  const isLoss = item.value.startsWith('-') || item.status === 'action req';
  const valColor = isGain ? 'var(--positive)' : isLoss ? 'var(--negative)' : item.color;
  return <span className="font-mono text-[13px] font-bold" style={{ color: valColor }}>{item.value}</span>;
}

function StreamStatusCell({ item }) {
  const ss = STATUS_STYLE[item.status] ?? { color: 'var(--text-muted)', bg: 'transparent' };

  return (
    <span
      className="rounded-[4px] px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em]"
      style={{ color: ss.color, background: ss.bg }}
    >
      {item.status}
    </span>
  );
}

const streamColumns = [
  { key: 'id', label: 'Ref', render: (_, row) => <StreamRefCell item={row} /> },
  { key: 'user', label: 'User', render: (value) => <span className="text-[13px] font-medium text-text">{value}</span> },
  { key: 'detail', label: 'Detail', render: (value) => <span className="whitespace-nowrap text-[12px] font-medium text-text-muted">{value}</span> },
  { key: 'value', label: 'Value', align: 'right', render: (_, row) => <StreamValueCell item={row} /> },
  { key: 'status', label: 'Status', align: 'right', render: (_, row) => <StreamStatusCell item={row} /> },
  { key: 'time', label: 'Time', align: 'right', render: (value) => <span className="font-mono text-[12px] font-medium tracking-wide text-text-muted/40">{value}</span> },
];

export function DashboardStream() {
  return (
    <Card className="h-full p-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/15 flex items-center justify-between">
        <div className="text-[14px] font-semibold text-text flex items-center gap-2">
          <Zap size={14} className="text-cyan fill-cyan/20" style={{ color: 'var(--cyan)' }} />
          Global Activity Ledger
        </div>
        <span className="flex items-center gap-1.5 px-2 py-1 rounded-[6px] bg-bg/50 text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted/70 border border-border/20">
          <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
          Live Stream
        </span>
      </div>

      <div className="pb-2 p-1">
        <FeatureTable columns={streamColumns} data={UNIFIED_STREAM} rowKey="id" />
      </div>
    </Card>
  );
}
