import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

function KpiCard({ label, value, subtext, trend, positive, Icon: IconGlyph, accent }) {
  const iconMarkup = React.createElement(IconGlyph, { size: 18, style: { color: accent } });

  return (
    <div className="relative overflow-hidden rounded-[12px] border border-border/35 bg-surface-elevated p-4 shadow-[0_12px_32px_rgba(2,6,23,0.08)] transition-all duration-300 hover:border-border/60">
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/55">{label}</p>
          <p className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-text">{value}</p>
        </div>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-[10px]"
          style={{ background: `${accent}1c` }}
        >
          {iconMarkup}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        {trend && (
          positive
            ? <ArrowUpRight size={12} className="text-positive" />
            : <ArrowDownRight size={12} className="text-negative" />
        )}
        {trend && (
          <span className={`text-[11px] font-semibold ${positive ? 'text-positive' : 'text-negative'}`}>
            {trend}
          </span>
        )}
        <span className="text-[11px] text-text-muted/55">{subtext}</span>
      </div>
    </div>
  );
}

export function UsersKpiGrid({ items }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <KpiCard key={item.label} {...item} />
      ))}
    </section>
  );
}
