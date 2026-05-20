import React from 'react';
import { STATUS_COLORS, RISK_COLORS, PRIORITY_COLORS, CATEGORY_COLORS } from '@config/constants/status.constants';

/**
 * StatusChip — THE canonical status/badge chip for the entire app.
 *
 * Usage:
 *   <StatusChip value="APPROVED" />                     — uses STATUS_COLORS
 *   <StatusChip value="HIGH" colorMap={RISK_COLORS} />  — custom map
 *   <StatusChip value="CRITICAL" colorMap={PRIORITY_COLORS} dot /> — with pulse dot
 *   <StatusChip value="PENDING" size="lg" />
 */
export function StatusChip({ value, colorMap, size = 'sm', dot = true, className = '' }) {
  const map   = colorMap ?? STATUS_COLORS;
  const color = map[value] || 'var(--text-muted)';
  const cls   = size === 'lg' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-[3px] text-[9.5px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[5px] font-black uppercase tracking-[0.09em] whitespace-nowrap font-heading ${cls} ${className}`}
      style={{
        color,
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        border:     `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
      }}
    >
      {dot && (
        <span
          className={`h-1 w-1 rounded-full flex-shrink-0 ${value === 'CRITICAL' ? 'animate-pulse' : ''}`}
          style={{ background: color }}
        />
      )}
      {value}
    </span>
  );
}

/** RiskChip — convenience wrapper using RISK_COLORS without dot */
export function RiskChip({ value, size }) {
  return <StatusChip value={value} colorMap={RISK_COLORS} dot={false} size={size} />;
}

/** PriorityChip — convenience wrapper using PRIORITY_COLORS with animated dot */
export function PriorityChip({ value, size }) {
  return <StatusChip value={value} colorMap={PRIORITY_COLORS} dot size={size} />;
}

/** CatChip — category tag (Support) using CATEGORY_COLORS */
export function CatChip({ value }) {
  const color = CATEGORY_COLORS[value] || 'rgba(255,255,255,0.35)';
  return (
    <span
      className="inline-flex items-center rounded-[5px] px-1.5 py-[2px] text-[9px] font-bold uppercase tracking-[0.09em] whitespace-nowrap font-heading"
      style={{
        color,
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        border:     `1px solid color-mix(in srgb, ${color} 18%, transparent)`,
      }}
    >
      {value}
    </span>
  );
}
