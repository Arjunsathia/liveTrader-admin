import React, { useState } from 'react';
import { RefreshCw, Check, AlertTriangle, Terminal } from 'lucide-react';
import { TradingDrawer, TradingQuickActions } from './TradingDrawer';
import { DrawerSection, DrawerField, DrawerGrid } from '../../../components/overlays/DrawerUI';

/**
 * ExecutionLogDrawer: Specialized drawer for Execution Log details.
 */
export function ExecutionLogDrawer({ open, row, onClose }) {
  const [actionDone, setActionDone] = useState(null);

  if (!row) return null;

  const actions = [
    { label: 'Retry Event', color: 'var(--cyan)', icon: RefreshCw, onClick: () => setActionDone('Retry Scheduled') },
    { label: 'Acknowledge', color: 'var(--positive)', icon: Check, onClick: () => setActionDone('Acknowledged') },
    { label: 'Escalate', color: 'var(--negative)', icon: AlertTriangle, onClick: () => setActionDone('Escalated') },
    { label: 'Debug Trace', color: 'var(--text-muted)', icon: Terminal, onClick: () => setActionDone('Debug Trace Opened') },
  ];

  return (
    <TradingDrawer
      open={open}
      title={row.eventId}
      subtitle={`${row.type} · ${row.bridge}`}
      onClose={onClose}
      actionDone={actionDone}
      width="max-w-[500px]"
    >
      <div className="space-y-6">
        <DrawerSection title="Event Context">
          <DrawerGrid>
            <DrawerField label="Event ID" value={row.eventId} mono />
            <DrawerField label="Type" value={row.type} />
            <DrawerField label="Bridge" value={row.bridge} mono />
            <DrawerField label="Symbol" value={row.symbol} />
            <DrawerField 
              label="Latency" 
              value={row.latency} 
              mono 
              accent={parseInt(row.latency) > 500 ? 'var(--negative)' : parseInt(row.latency) > 200 ? 'var(--warning)' : 'var(--positive)'} 
            />
            <DrawerField label="Status Code" value={row.code} mono />
            <DrawerField label="Severity" value={row.severity} />
            <DrawerField label="Timestamp" value={row.timestamp} mono />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Deep Detail">
          <div className="rounded-[12px] border border-border/20 bg-bg/40 px-4 py-3.5 text-[12.5px] leading-relaxed text-text/90 font-medium">
            {row.detail}
          </div>
        </DrawerSection>

        {(row.severity === 'ERROR' || row.severity === 'CRITICAL') && (
          <DrawerSection title="Resolution Actions">
            <TradingQuickActions actions={actions} />
          </DrawerSection>
        )}
      </div>
    </TradingDrawer>
  );
}
