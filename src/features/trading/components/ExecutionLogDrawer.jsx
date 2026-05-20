import React, { useState } from 'react';
import { RefreshCw, Check, AlertTriangle, Terminal } from 'lucide-react';
import { TradingDrawer, TradingQuickActions } from './TradingDrawer';
import { DrawerSection, DrawerField, DrawerGrid } from '../../../components/overlays/DrawerUI';

const SEVERITY_META = {
  INFO:     { color: 'var(--positive)', bg: 'bg-positive/8 border-positive/20',   label: 'ℹ INFO' },
  WARN:     { color: 'var(--warning)',  bg: 'bg-warning/8 border-warning/20',     label: '⚠ WARNING' },
  ERROR:    { color: 'var(--negative)', bg: 'bg-negative/8 border-negative/20',   label: '✗ ERROR' },
  CRITICAL: { color: 'var(--negative)', bg: 'bg-negative/12 border-negative/30',  label: '⚡ CRITICAL' },
};

/**
 * ExecutionLogDrawer: Specialized drawer for Execution Log details.
 */
export function ExecutionLogDrawer({ open, row, onClose }) {
  const [actionDone, setActionDone] = useState(null);

  if (!row) return null;

  const actions = [
    { label: 'Retry Event', color: 'var(--cyan)',     icon: RefreshCw,    onClick: () => setActionDone('Retry Scheduled') },
    { label: 'Acknowledge', color: 'var(--positive)', icon: Check,        onClick: () => setActionDone('Acknowledged') },
    { label: 'Escalate',    color: 'var(--negative)', icon: AlertTriangle, onClick: () => setActionDone('Escalated') },
    { label: 'Debug Trace', color: 'var(--text-muted)', icon: Terminal,   onClick: () => setActionDone('Debug Trace Opened') },
  ];

  const showActions = row.severity === 'ERROR' || row.severity === 'CRITICAL' || row.severity === 'WARN';
  const sevMeta = SEVERITY_META[row.severity] ?? SEVERITY_META.INFO;

  return (
    <TradingDrawer
      open={open}
      title={row.eventId}
      subtitle={`${row.type} · Bridge: ${row.bridge}`}
      onClose={onClose}
      actionDone={actionDone}
      width="max-w-[720px]"
    >
      <div className="space-y-6">
        {/* Severity Banner */}
        <div
          className={`rounded-[12px] border px-4 py-3 flex items-center justify-between ${sevMeta.bg}`}
        >
          <div>
            <div className="text-[9.5px] uppercase tracking-wider text-text-muted/55 mb-1">Severity Level</div>
            <div className="text-[15px] font-black" style={{ color: sevMeta.color }}>
              {sevMeta.label}
            </div>
            <div className="text-[10px] text-text-muted/55 mt-1 font-mono">{row.timestamp}</div>
          </div>
          <div
            className="font-mono text-[11px] font-bold px-2.5 py-1.5 rounded-[8px] border"
            style={{
              color: sevMeta.color,
              borderColor: `color-mix(in srgb, ${sevMeta.color} 25%, transparent)`,
              background: `color-mix(in srgb, ${sevMeta.color} 8%, transparent)`,
            }}
          >
            {parseInt(row.latency) > 0 ? row.latency : row.latency}
          </div>
        </div>

        <DrawerSection title="Event Context">
          <DrawerGrid>
            <DrawerField label="Event ID"    value={row.eventId}   mono />
            <DrawerField label="Type"        value={row.type}      />
            <DrawerField label="Bridge"      value={row.bridge}    mono />
            <DrawerField label="Symbol"      value={row.symbol}    />
            <DrawerField
              label="Latency"
              value={row.latency}
              mono
              accent={
                parseInt(row.latency) > 500
                  ? 'var(--negative)'
                  : parseInt(row.latency) > 200
                  ? 'var(--warning)'
                  : 'var(--positive)'
              }
            />
            <DrawerField label="Status Code" value={row.code}      mono />
            <DrawerField label="Severity"    value={row.severity}  />
            <DrawerField label="Timestamp"   value={row.timestamp} mono />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Deep Detail">
          <div className="rounded-[12px] border border-border/20 bg-bg/60 px-4 py-3.5 font-mono text-[12px] leading-relaxed text-text/85">
            {row.detail}
          </div>
        </DrawerSection>

        {showActions && (
          <DrawerSection title="Resolution Actions">
            <TradingQuickActions actions={actions} />
          </DrawerSection>
        )}
      </div>
    </TradingDrawer>
  );
}
