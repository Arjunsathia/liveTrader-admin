import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldAlert } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

const ALERTS = [
  { id: 1, level: 'critical', cat: 'RISK', title: 'Margin breach — Account #8821', text: 'Equity dropped 94% on open XAUUSD long. Auto-liquidation threshold breached.', stamp: '2m ago', path: '/risk/accounts/8821' },
  { id: 2, level: 'critical', cat: 'FINANCE', title: '$47,500 withdrawal pending', text: 'Bank wire above threshold. AML flag triggered.', stamp: '11m ago', path: '/finance/withdrawals' },
  { id: 3, level: 'warning', cat: 'KYC', title: 'Document mismatch — #10043', text: 'Uploaded ID surname differs from registration.', stamp: '34m ago', path: '/compliance/kyc' },
  { id: 4, level: 'warning', cat: 'COPY', title: 'Signal provider drawdown >12%', text: '"FX_Alpha" strategy hit 12.4% drawdown today. 231 followers impacted.', stamp: '51m ago', path: '/copy-trading' },
];

const LEVEL_COLOR = {
  critical: 'var(--negative)',
  warning: 'var(--warning)',
  normal: 'var(--cyan)',
};

function AlertItem({ alert }) {
  const navigate = useNavigate();
  const color = LEVEL_COLOR[alert.level] ?? 'var(--text-muted)';
  return (
    <div
      className="rounded-[10px] border border-border/20 bg-bg/60 p-3.5 hover:bg-surface/40 hover:border-border/40 transition-all cursor-pointer group"
      style={{ borderLeft: `2px solid color-mix(in srgb, ${color} 40%, transparent)` }}
      onClick={() => navigate(alert.path)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span
              className="text-[9px] font-black uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-[4px]"
              style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)` }}
            >
              {alert.level}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/50">
              {alert.cat}
            </span>
            <span className="ml-auto font-mono text-[10px] text-text-muted/40">{alert.stamp}</span>
          </div>
          <div className="text-[12px] font-semibold text-text leading-snug group-hover:text-primary transition-colors">
            {alert.title}
          </div>
          <div className="mt-1 text-[11px] leading-5 text-text-muted/70">{alert.text}</div>
        </div>
        <div className="shrink-0 pt-1">
          <span className="flex items-center justify-center h-6 w-6 rounded-md bg-surface/50 text-text-muted/50 group-hover:text-text group-hover:bg-surface transition-colors border border-border/20 group-hover:border-border/60">
            <ChevronRight size={12} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </div>
  );
}

export function DashboardAlerts() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[13px] font-semibold text-text flex items-center gap-2">
            <ShieldAlert size={14} className="text-negative" />
            Operations Queue
          </div>
          <div className="text-[11px] text-text-muted/60 mt-0.5">
            <span className="text-negative font-semibold">2 critical</span> • 2 warnings
          </div>
        </div>
      </div>
      <div className="space-y-2.5 overflow-y-auto max-h-[380px] sb-scroll pr-1">
        {ALERTS.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>
    </Card>
  );
}
