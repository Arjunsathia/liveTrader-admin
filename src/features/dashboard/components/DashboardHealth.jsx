import React from 'react';
import { HeartPulse, RefreshCw } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

const SYSTEM_HEALTH = [
  { name: 'MT5 Bridge EU-1', value: 98, status: 'ok', metric: '89ms' },
  { name: 'MT5 Bridge EU-2', value: 71, status: 'warn', metric: '310ms' },
  { name: 'MT5 Bridge APAC', value: 97, status: 'ok', metric: '102ms' },
  { name: 'Database Primary', value: 99, status: 'ok', metric: '4ms' },
  { name: 'Liquidity Feed', value: 96, status: 'ok', metric: 'live' },
];

const QUICK_METRICS = [
  { label: 'Uptime', value: '99.91%', color: 'var(--positive)' },
  { label: 'Errors/hr', value: '0', color: 'var(--positive)' },
  { label: 'DB QPS', value: '2,841', color: 'var(--cyan)' },
];

function HealthBar({ item }) {
  const color =
    item.status === 'ok' ? 'var(--positive)' :
    item.status === 'warn' ? 'var(--warning)' :
    'var(--negative)';

  return (
    <div className="flex items-center gap-2.5 py-1.5 group">
      <div className="relative flex items-center justify-center w-2 h-2">
        <div
          className="absolute inset-0 rounded-full opacity-40 group-hover:opacity-100 group-hover:animate-ping"
          style={{ background: color }}
        />
        <div className="w-1.5 h-1.5 rounded-full relative z-10" style={{ background: color }} />
      </div>
      <span className="text-[12px] text-text-muted flex-1 truncate group-hover:text-text transition-colors">
        {item.name}
      </span>
      <span className="font-mono text-[11px] text-text-muted/60 w-16 text-right">{item.metric}</span>
      <div className="w-20 h-1 rounded-full bg-border/20 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${item.value}%`, background: color }} />
      </div>
    </div>
  );
}

export function DashboardHealth() {
  return (
    <Card className="flex-1">
      <div className="flex items-center justify-between mb-3 border-b border-border/15 pb-3">
        <div className="text-[13px] font-semibold text-text flex items-center gap-2">
          <HeartPulse size={13} className="text-positive" />
          System Health
        </div>
        <button className="flex items-center gap-1 text-[11px] text-text-muted/50 hover:text-text transition-colors">
          <RefreshCw size={10} /> Ping
        </button>
      </div>

      <div className="space-y-1 mt-2">
        {SYSTEM_HEALTH.map((item) => (
          <HealthBar key={item.name} item={item} />
        ))}
      </div>

      {/* Quick Metrics */}
      <div className="mt-4 pt-4 border-t border-border/15 grid grid-cols-3 gap-2">
        {QUICK_METRICS.map(({ label, value, color }) => (
          <div
            key={label}
            className="text-center rounded-[8px] border border-border/15 bg-bg/40 py-2"
          >
            <div className="font-mono text-[13px] font-semibold" style={{ color }}>{value}</div>
            <div className="text-[10px] text-text-muted/50 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
