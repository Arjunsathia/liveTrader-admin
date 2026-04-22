import React from 'react';
import { RISK_COLORS, STATUS_COLORS } from '@config/constants/status.constants';

export function StatusChip({ value, colorMap, size = 'sm', dot = true }) {
  const map = colorMap ?? STATUS_COLORS;
  const color = map[value] || 'var(--text-muted)';
  const cls = size === 'lg' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-[3px] text-[9.5px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[5px] font-black uppercase tracking-[0.09em] whitespace-nowrap font-heading ${cls}`}
      style={{
        color,
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
      }}
    >
      {dot && <span className="h-1 w-1 rounded-full flex-shrink-0" style={{ background: color }} />}
      {value}
    </span>
  );
}

export function RiskChip({ value }) {
  return <StatusChip value={value} colorMap={RISK_COLORS} dot={false} />;
}
