import React from 'react';

export function KpiCard({ label, value, delta, icon: Icon, tone = 'info', note }) {
  const tones = {
    info: 'bg-primary/10 text-primary',
    success: 'bg-positive/10 text-positive',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-negative/10 text-negative',
  };

  return (
    <div className="rounded-[10px] border border-border/40 bg-surface-elevated px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted/65">{label}</p>
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${tones[tone] ?? tones.info}`}>
            <Icon size={18} strokeWidth={2.2} />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="font-mono text-[26px] font-semibold tracking-[-0.05em] text-text">{value}</div>
        {delta && (
          <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${tones[tone] ?? tones.info}`}>
            {delta}
          </div>
        )}
      </div>
      {note && <p className="mt-2 text-[11px] text-text-muted/72">{note}</p>}
    </div>
  );
}
