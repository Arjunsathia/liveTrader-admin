import React from 'react';
import { Globe } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

const MARKET_PAIRS = [
  { pair: 'EUR/USD', bid: '1.08432', spread: '1.3', chg: '+0.18%', up: true },
  { pair: 'GBP/USD', bid: '1.26874', spread: '1.7', chg: '-0.09%', up: false },
  { pair: 'USD/JPY', bid: '149.812', spread: '1.9', chg: '+0.32%', up: true },
  { pair: 'XAU/USD', bid: '2341.50', spread: '0.5', chg: '-0.41%', up: false },
  { pair: 'BTC/USD', bid: '64210.0', spread: '12.0', chg: '+1.45%', up: true },
];

function PairRow({ pair }) {
  const color = pair.up ? 'var(--positive)' : 'var(--negative)';
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/10 last:border-0 group">
      <div className="flex items-center gap-2">
        <span
          className="w-[2px] h-3 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
          style={{ background: color }}
        />
        <span className="font-mono text-[11px] font-semibold text-text-muted w-14 group-hover:text-text transition-colors">
          {pair.pair}
        </span>
      </div>
      <div className="flex-1 flex justify-end gap-3 items-center">
        <span className="font-mono text-[11px] font-semibold text-text">{pair.bid}</span>
        <span className="text-[9px] text-text-muted/30 font-mono w-6 text-right">s{pair.spread}</span>
      </div>
      <div className="w-[50px] flex justify-end items-center">
        <span className="font-mono text-[10px] font-bold" style={{ color }}>{pair.chg}</span>
      </div>
    </div>
  );
}

export function DashboardMarket() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3 border-b border-border/15 pb-3">
        <div className="text-[13px] font-semibold text-text flex items-center gap-2">
          <Globe size={13} style={{ color: 'var(--cyan)' }} />
          Market Pricing
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-positive" />
          <span className="text-[10px] font-semibold text-positive">LIVE</span>
        </div>
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/50 pb-1.5 mb-0.5 border-b border-border/15">
        Pair — Bid — Chg
      </div>
      <div className="flex flex-col">
        {MARKET_PAIRS.map((p) => (
          <PairRow key={p.pair} pair={p} />
        ))}
      </div>
    </Card>
  );
}
