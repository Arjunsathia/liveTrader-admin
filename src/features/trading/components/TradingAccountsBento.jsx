import React from 'react';
import { ArrowUpRight, Monitor, ShieldAlert, Radio, Wallet } from 'lucide-react';

/* Static decorative sparkline SVG path */
function SparklinePath() {
  return (
    <svg
      viewBox="0 0 120 28"
      className="absolute bottom-3 right-3 w-24 h-7 opacity-20 pointer-events-none"
      fill="none"
    >
      <polyline
        points="0,22 15,18 30,20 45,10 60,14 75,6 90,9 105,4 120,7"
        stroke="var(--brand)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TradingAccountsBento({ stats }) {
  const s = {
    equity: '$284,102.45',
    equityChange: '+4.2%',
    activeAccounts: '03',
    allowedAccounts: '5',
    riskLevel: 'High',
    marginLevel: '112%',
    latency: '14ms',
    node: 'NY4',
    ...stats,
  };

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-7 mb-6">

      {/* ── HERO: Total Equity (3-col wide) ── */}
      <div className="relative xl:col-span-3 flex flex-col justify-between rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle p-5 overflow-hidden transition-all duration-300 min-h-[120px]">
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 h-[3px] w-full rounded-t-[12px]"
          style={{ background: 'var(--brand)' }}
        />

        {/* Decorative sparkline */}
        <SparklinePath />

        <div className="flex items-start justify-between relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted/55">
            Total Portfolio Equity
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-brand/10">
            <Wallet size={14} className="text-brand" />
          </span>
        </div>

        <div className="relative z-10 mt-2">
          <div className="text-[32px] font-black tracking-[-0.045em] text-text leading-none">
            {s.equity}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="flex items-center gap-0.5 text-[11px] font-bold text-positive">
              <ArrowUpRight size={12} className="shrink-0" />
              {s.equityChange}
            </span>
            <span className="text-[10px] text-text-muted/40">vs. last session</span>
          </div>
        </div>
      </div>

      {/* ── Active Accounts ── */}
      <div className="relative xl:col-span-1 sm:col-span-1 flex flex-col gap-2 rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle p-4 overflow-hidden transition-all duration-300">
        <div
          className="absolute top-0 left-0 h-[3px] w-full rounded-t-[12px]"
          style={{ background: 'var(--cyan)' }}
        />
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted/55">
            Active
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-cyan/10">
            <Monitor size={12} className="text-cyan" />
          </span>
        </div>
        <div className="text-[26px] font-black tracking-[-0.04em] text-text leading-none mt-1">
          {s.activeAccounts}
        </div>
        <div className="text-[10px] text-text-muted/45 mt-auto">
          of {s.allowedAccounts} allowed
        </div>
      </div>

      {/* ── Risk Exposure ── */}
      <div className="relative xl:col-span-1 sm:col-span-1 flex flex-col gap-2 rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle p-4 overflow-hidden transition-all duration-300">
        <div
          className="absolute top-0 left-0 h-[3px] w-full rounded-t-[12px]"
          style={{ background: 'var(--negative)' }}
        />
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted/55">
            Risk
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-negative/10">
            <ShieldAlert size={12} className="text-negative" />
          </span>
        </div>
        <div className="text-[26px] font-black tracking-[-0.04em] text-text leading-none mt-1">
          {s.riskLevel}
        </div>
        <div className="flex items-center gap-1 mt-auto text-[10px] font-semibold text-negative">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-negative animate-ping shrink-0" />
          Margin {s.marginLevel}
        </div>
      </div>

      {/* ── Connection Health ── */}
      <div className="relative xl:col-span-2 sm:col-span-2 flex flex-col gap-2 rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle p-4 overflow-hidden transition-all duration-300">
        <div
          className="absolute top-0 left-0 h-[3px] w-full rounded-t-[12px]"
          style={{ background: 'var(--positive)' }}
        />
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted/55">
            Cluster Health
          </span>
          <div className="flex items-center gap-1.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-positive animate-pulse" />
            <Radio size={12} className="text-positive" />
          </div>
        </div>
        <div className="text-[26px] font-black tracking-[-0.04em] text-positive leading-none mt-1">
          Healthy
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[10px] text-text-muted/45">
            {s.node} Node
          </span>
          <span className="font-mono text-[10px] text-text-muted/55 bg-surface-bright/30 px-2 py-0.5 rounded">
            {s.latency}
          </span>
        </div>
      </div>

    </section>
  );
}
