import React from 'react';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { DrawerSection, DrawerGrid, DrawerField } from '../../../components/overlays';
import { Button } from '../../../components/ui/Button';
import { ActionBtn } from '../../../components/ui';
import { Download, RefreshCw, PlayCircle, Copy, MessageSquare, Trash2, FileText, Activity, Send, Archive, Hash, Clock } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { FORMAT_ICONS, FORMAT_CLR, STATUS_CLR, FormatBadge, StatusBadge } from './ReportsComponents';

function AuditTrail({ entries }) {
  return (
    <div className="space-y-0 relative">
      <div className="absolute left-[7px] top-3 bottom-3 w-px bg-border/20" />
      {entries.map((e, i) => (
        <div key={i} className="flex gap-3 pb-3">
          <div className="w-3.5 h-3.5 rounded-full border border-border/30 bg-bg/60 flex-shrink-0 mt-1 z-10" style={{ boxShadow: '0 0 0 2px var(--bg)' }} />
          <div className="min-w-0">
            <div className="text-[11.5px] font-heading font-semibold text-text/80">{e.action}</div>
            <div className="text-[10px] font-mono text-text-muted/50 mt-0.5">{e.by} · {e.ts}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReportDetailDrawer({ open, row, onClose, onAction }) {
  if (!row) return null;

  const FormatIc = FORMAT_ICONS[row.format] || FileText;
  const fmtColor = FORMAT_CLR[row.format] || 'var(--text-muted)';
  
  const audit = [
    { action: 'Report triggered by scheduler', by: row.owner || 'System', ts: row.generated || '—' },
    { action: 'Data extraction complete', by: 'System', ts: row.generated || '—' },
    { action: 'File rendered and compressed', by: 'System', ts: row.generated || '—' },
    { action: 'Delivered to export queue', by: 'System', ts: row.generated || '—' },
  ];

  const failedAudit = [
    { action: 'Report triggered by scheduler', by: row.owner || 'System', ts: row.generated || '—' },
    { action: 'Data extraction started', by: 'System', ts: row.generated || '—' },
    { action: 'ERROR: Job failed — see system log', by: 'System', ts: row.generated || '—' },
  ];

  return (
    <AdminDrawer
      open={open}
      title={row.name || row.title || row.id}
      subtitle={row.id}
      eyebrow="Report Details"
      width="max-w-[500px]"
      onClose={onClose}
      footer={(
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
             <StatusBadge value={row.status} />
             <FormatBadge value={row.format} />
          </div>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      )}
    >
      <div className="space-y-6">
        
        {/* Quick Stats Header */}
        <div className="flex gap-4 text-[10.5px] border border-border/20 bg-bg/30 px-4 py-3 rounded-[10px]">
          {row.size && row.size !== '—' && <div className="flex items-center gap-1.5 text-text-muted/60 font-heading"><Archive size={12} />{row.size}</div>}
          {row.rows > 0 && <div className="flex items-center gap-1.5 text-text-muted/60 font-heading"><Hash size={12} />{row.rows?.toLocaleString()} rows</div>}
          {row.generated && row.generated !== '—' && <div className="flex items-center gap-1.5 text-text-muted/60 font-heading"><Clock size={12} />{row.generated}</div>}
        </div>

        <DrawerSection title="Core Information">
          <DrawerGrid>
            {row.period && <DrawerField label="Period" value={row.period} />}
            {row.owner && <DrawerField label="Owner" value={row.owner} />}
            {row.source && <DrawerField label="Source" value={row.source} />}
            {row.scope && <DrawerField label="Scope" value={row.scope} />}
            {row.symbols && <DrawerField label="Symbols" value={row.symbols} mono />}
            {row.pnl && <DrawerField label="PnL" value={row.pnl} mono accent={row.pnl?.startsWith('+') ? 'var(--positive)' : 'var(--negative)'} />}
            {row.winRate && <DrawerField label="Win Rate" value={row.winRate} mono />}
            {row.drawdown && <DrawerField label="Drawdown" value={row.drawdown} mono accent="var(--negative)" />}
            {row.segment && <DrawerField label="Segment" value={row.segment} />}
            {row.kyc && <DrawerField label="KYC Filter" value={row.kyc} accent={STATUS_CLR[row.kyc]} />}
            {row.risk && <DrawerField label="Risk Filter" value={row.risk} accent={row.risk === 'HIGH' ? 'var(--negative)' : row.risk === 'LOW' ? 'var(--positive)' : 'var(--warning)'} />}
            {row.service && <DrawerField label="Service" value={row.service} mono />}
            {row.retries !== undefined && <DrawerField label="Retries" value={row.retries} mono accent={row.retries > 0 ? 'var(--warning)' : 'var(--positive)'} />}
            <DrawerField label="Format" value={row.format} accent={fmtColor} />
            <DrawerField label="Generated" value={row.generated || '—'} mono />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Delivery Info">
          <DrawerGrid cols={1}>
            <div className="rounded-[10px] border border-border/20 bg-bg/30 px-4 py-3 space-y-2">
              {[
                { label: 'Delivery Channel', val: 'Email + Export Queue' },
                { label: 'Recipients', val: 'ops@firm.com, risk@firm.com' },
                { label: 'Delivery Status', val: row.status === 'READY' ? 'Delivered' : row.status === 'FAILED' ? 'Failed' : 'Pending' },
                { label: 'Retention', val: '90 days' },
              ].map(d => (
                <div key={d.label} className="flex items-center justify-between text-[11.5px]">
                  <span className="text-text-muted/60 font-heading">{d.label}</span>
                  <span className="font-heading font-semibold text-text/90">{d.val}</span>
                </div>
              ))}
            </div>
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Audit Trail">
          <AuditTrail entries={row.status === 'FAILED' ? failedAudit : audit} />
        </DrawerSection>

        <DrawerSection title="Record Actions">
          <div className="grid grid-cols-2 gap-2">
            {row.status === 'READY' && <ActionBtn label="Download" Icon={Download} variant="success" onClick={() => { onAction('Downloaded', row.id); onClose(); }} />}
            {row.status === 'FAILED' && <ActionBtn label="Retry" Icon={RefreshCw} variant="warning" onClick={() => { onAction('Retried', row.id); onClose(); }} />}
            {row.status === 'SCHEDULED' && <ActionBtn label="Run Now" Icon={PlayCircle} variant="primary" onClick={() => { onAction('Triggered', row.id); onClose(); }} />}
            <ActionBtn label="Copy Link" Icon={Copy} variant="default" onClick={() => { onAction('Link copied', row.id); }} />
            <ActionBtn label="Add Note" Icon={MessageSquare} variant="default" onClick={() => { }} />
            <ActionBtn label="Delete" Icon={Trash2} variant="danger" onClick={() => { onAction('Deleted', row.id); onClose(); }} />
          </div>
        </DrawerSection>
      </div>
    </AdminDrawer>
  );
}
