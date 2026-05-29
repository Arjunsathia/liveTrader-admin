import React from 'react';
import { MainDrawer, DrawerHeader, DrawerBody, DrawerFooter } from '../../../components/common/drawer';
import { DrawerSection, DrawerFormGrid, DrawerField } from '../../../components/common/drawer';
import { ActionBtn } from '../../../components/ui';
import {
  Download, RefreshCw, PlayCircle, Copy, Trash2, FileText,
  Archive, Hash, Clock, CheckCircle2, XCircle, AlertTriangle,
  Timer, Send, User, Database, Calendar, Activity
} from 'lucide-react';
import { FORMAT_ICONS, FORMAT_CLR, STATUS_CLR, FormatBadge, StatusBadge } from './ReportsComponents';

/* ── Audit Trail ─────────────────────────────────────────────── */
function AuditTrail({ entries, status }) {
  const nodeColor = status === 'FAILED'
    ? 'var(--negative)'
    : status === 'READY'
    ? 'var(--positive)'
    : 'var(--warning)';

  const lastIdx = entries.length - 1;

  return (
    <div className="relative space-y-0">
      {/* Connector line */}
      <div
        className="absolute left-[9px] top-3 w-px"
        style={{
          bottom: '12px',
          background: `linear-gradient(to bottom, color-mix(in srgb, ${nodeColor} 25%, transparent), transparent)`,
        }}
      />
      {entries.map((e, i) => {
        const isLast = i === lastIdx;
        const isError = e.action.toLowerCase().includes('error') || e.action.toLowerCase().includes('fail');
        const dotColor = isError ? 'var(--negative)' : isLast ? nodeColor : 'var(--border)';
        return (
          <div key={i} className="flex gap-3.5 pb-4">
            {/* Node */}
            <div
              className="relative mt-0.5 flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center z-10 border"
              style={{
                borderColor: `color-mix(in srgb, ${dotColor} 40%, transparent)`,
                background: `color-mix(in srgb, ${dotColor} 10%, var(--bg))`,
                boxShadow: isLast ? `0 0 8px color-mix(in srgb, ${dotColor} 30%, transparent)` : 'none',
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: dotColor, opacity: isLast ? 1 : 0.55 }}
              />
            </div>
            {/* Content */}
            <div className="min-w-0 flex-1 pt-0.5">
              <div
                className="text-[11.5px] font-semibold font-heading"
                style={{ color: isError ? 'var(--negative)' : 'var(--text)' }}
              >
                {e.action}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] font-mono text-text-muted/65">{e.by}</span>
                <span className="text-text-muted/45 text-[10px]">·</span>
                <span className="text-[11px] font-mono text-text-muted/60">{e.ts}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Status hero badge ───────────────────────────────────────── */
function StatusHeroBanner({ status, format, size, rows, generated }) {
  const FormatIc = FORMAT_ICONS[format] || FileText;
  const fmtColor = FORMAT_CLR[format] || 'var(--text-muted)';

  const statusCfg = {
    READY:      { color: 'var(--positive)', Icon: CheckCircle2, label: 'Ready for Download' },
    FAILED:     { color: 'var(--negative)', Icon: XCircle,      label: 'Generation Failed' },
    SCHEDULED:  { color: 'var(--warning)',  Icon: Timer,         label: 'Scheduled for Later' },
    PROCESSING: { color: 'var(--cyan)',     Icon: Activity,      label: 'Processing Now' },
    QUEUED:     { color: 'var(--warning)',  Icon: Timer,         label: 'Queued for Processing' },
  };

  const cfg = statusCfg[status] ?? statusCfg.SCHEDULED;
  const { color, Icon, label } = cfg;

  return (
    <div
      className="rounded-[14px] border p-5 relative overflow-hidden"
      style={{
        borderColor: `color-mix(in srgb, ${color} 20%, var(--border))`,
        background: `color-mix(in srgb, ${color} 5%, var(--bg))`,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: color }}
      />

      <div className="flex items-start justify-between gap-4 relative z-[1]">
        {/* Format icon + status */}
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-[11px] flex items-center justify-center border flex-shrink-0"
            style={{
              background: `color-mix(in srgb, ${fmtColor} 12%, transparent)`,
              borderColor: `color-mix(in srgb, ${fmtColor} 22%, transparent)`,
            }}
          >
            <FormatIc size={20} style={{ color: fmtColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Icon size={12} style={{ color }} />
              <span
                className="text-[11.5px] font-bold uppercase tracking-[0.05em]"
                style={{ color }}
              >
                {label}
              </span>
            </div>
            <div className="text-[11px] text-text-muted/70 font-semibold">
              {format} format
              {size && size !== '—' ? ` · ${size}` : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Metric row */}
      {(size !== '—' || rows > 0 || generated) && (
        <div className="grid grid-cols-3 gap-3 mt-4 pt-3.5 border-t" style={{ borderColor: `color-mix(in srgb, ${color} 12%, var(--border))` }}>
          {size && size !== '—' && (
            <div className="flex flex-col gap-1 items-center text-center">
              <Archive size={12} className="text-text-muted/60" />
              <div className="font-mono text-[13px] font-bold text-text">{size}</div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70">File Size</div>
            </div>
          )}
          {rows > 0 && (
            <div className="flex flex-col gap-1 items-center text-center">
              <Database size={12} className="text-text-muted/60" />
              <div className="font-mono text-[13px] font-bold text-text">{rows.toLocaleString()}</div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70">Records</div>
            </div>
          )}
          {generated && generated !== '—' && (
            <div className="flex flex-col gap-1 items-center text-center">
              <Clock size={12} className="text-text-muted/60" />
              <div className="font-mono text-[11px] font-bold text-text/80 leading-tight">{generated}</div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70">Generated</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main Drawer ─────────────────────────────────────────────── */
export function ReportDetailDrawer({ open, row, onClose, onAction }) {
  if (!row) return null;

  const statusOk = ['READY', 'SUCCESS'].includes(row.status);
  const statusFailed = row.status === 'FAILED';

  const audit = statusFailed ? [
    { action: 'Report triggered by scheduler', by: row.owner || 'System', ts: row.generated || '—' },
    { action: 'Data extraction started', by: 'System', ts: row.generated || '—' },
    { action: 'ERROR: Job failed — check system log', by: 'System', ts: row.generated || '—' },
  ] : [
    { action: 'Report triggered by scheduler', by: row.owner || 'System', ts: row.generated || '—' },
    { action: 'Data extraction complete', by: 'System', ts: row.generated || '—' },
    { action: 'File rendered and compressed', by: 'System', ts: row.generated || '—' },
    { action: 'Delivered to export queue', by: 'System', ts: row.generated || '—' },
  ];

  const deliveryData = [
    { label: 'Channel',   val: 'Email + Export Queue' },
    { label: 'Recipients', val: 'ops@firm.com, risk@firm.com' },
    { label: 'Delivery',   val: statusOk ? 'Delivered' : statusFailed ? 'Failed' : 'Pending' },
    { label: 'Retention',  val: '90 days' },
  ];

  const deliveryStatusColor = statusOk ? 'var(--positive)' : statusFailed ? 'var(--negative)' : 'var(--warning)';

  return (
    <MainDrawer
      open={open}
      width="max-w-[720px]"
      onClose={onClose}
    >
      <DrawerHeader
        title={row.name || row.title || row.id}
        subtitle={row.id}
        eyebrow="Report Details"
        onClose={onClose}
      />

      <DrawerBody>
        <div className="space-y-6">

          {/* ── Hero Status Banner ── */}
          <StatusHeroBanner
            status={row.status}
            format={row.format}
            size={row.size}
            rows={row.rows}
            generated={row.generated}
          />

          {/* ── Core Info ── */}
          <DrawerSection title="Report Information">
            <DrawerFormGrid>
              {row.period  && <DrawerField label="Period"    value={row.period} />}
              {row.owner   && <DrawerField label="Owner"     value={row.owner} Icon={User} />}
              {row.source  && <DrawerField label="Source"    value={row.source} />}
              {row.scope   && <DrawerField label="Scope"     value={row.scope} />}
              {row.symbols && <DrawerField label="Symbols"   value={row.symbols} mono />}
              {row.service && <DrawerField label="Service"   value={row.service} mono />}
              {row.segment && <DrawerField label="Segment"   value={row.segment} />}
              {row.kyc     && (
                <DrawerField
                  label="KYC Filter"
                  value={row.kyc}
                  accent={STATUS_CLR[row.kyc]?.c ?? 'var(--text-muted)'}
                />
              )}
              {row.risk    && (
                <DrawerField
                  label="Risk Filter"
                  value={row.risk}
                  accent={row.risk === 'HIGH' ? 'var(--negative)' : row.risk === 'LOW' ? 'var(--positive)' : 'var(--warning)'}
                />
              )}
            </DrawerFormGrid>
          </DrawerSection>

          {/* ── Performance Metrics (trading-specific) ── */}
          {(row.pnl || row.winRate || row.drawdown || row.retries !== undefined) && (
            <DrawerSection title="Key Metrics">
              <DrawerFormGrid>
                {row.pnl      && <DrawerField label="PnL"        value={row.pnl}      mono accent={row.pnl?.startsWith('+') ? 'var(--positive)' : 'var(--negative)'} />}
                {row.winRate  && <DrawerField label="Win Rate"   value={row.winRate}  mono accent="var(--cyan)" />}
                {row.drawdown && <DrawerField label="Drawdown"   value={row.drawdown} mono accent="var(--negative)" />}
                {row.retries !== undefined && (
                  <DrawerField
                    label="Retries"
                    value={row.retries > 0 ? `${row.retries}×` : '—'}
                    mono
                    accent={row.retries > 0 ? 'var(--warning)' : 'var(--positive)'}
                  />
                )}
              </DrawerFormGrid>
            </DrawerSection>
          )}

          {/* ── Delivery Info ── */}
          <DrawerSection title="Delivery & Distribution">
            <div className="rounded-[12px] border border-border/20 bg-bg/25 overflow-hidden">
              {deliveryData.map((d, i) => (
                <div
                  key={d.label}
                  className={`flex items-center justify-between px-4 py-3 text-[11.5px] ${i !== deliveryData.length - 1 ? 'border-b border-border/10' : ''}`}
                >
                  <span className="text-text-muted/55 font-heading font-semibold tracking-wide">{d.label}</span>
                  <span
                    className="font-heading font-bold text-right"
                    style={{ color: d.label === 'Delivery' ? deliveryStatusColor : 'var(--text)' }}
                  >
                    {d.val}
                  </span>
                </div>
              ))}
            </div>
          </DrawerSection>

          {/* ── Audit Trail ── */}
          <DrawerSection title="Audit Trail">
            <div className="rounded-[12px] border border-border/15 bg-bg/20 px-4 py-4">
              <AuditTrail entries={audit} status={row.status} />
            </div>
          </DrawerSection>

          {/* ── Actions ── */}
          <DrawerSection title="Actions">
            <div className="grid grid-cols-2 gap-2">
              {statusOk && (
                <button
                  onClick={() => { onAction('Downloaded', row.id); onClose(); }}
                  className="group flex items-center gap-2 h-10 px-4 rounded-[10px] border font-bold font-heading text-[11px] transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer"
                  style={{
                    color: 'var(--positive)',
                    background: 'color-mix(in srgb, var(--positive) 8%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--positive) 22%, transparent)',
                  }}
                >
                  <Download size={12} className="group-hover:translate-y-0.5 transition-transform" />
                  Download Report
                </button>
              )}
              {statusFailed && (
                <button
                  onClick={() => { onAction('Retried', row.id); onClose(); }}
                  className="group flex items-center gap-2 h-10 px-4 rounded-[10px] border font-bold font-heading text-[11px] transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer"
                  style={{
                    color: 'var(--warning)',
                    background: 'color-mix(in srgb, var(--warning) 8%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--warning) 22%, transparent)',
                  }}
                >
                  <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                  Retry Generation
                </button>
              )}
              {row.status === 'SCHEDULED' && (
                <button
                  onClick={() => { onAction('Triggered', row.id); onClose(); }}
                  className="group flex items-center gap-2 h-10 px-4 rounded-[10px] border font-bold font-heading text-[11px] transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer"
                  style={{
                    color: 'var(--brand)',
                    background: 'color-mix(in srgb, var(--brand) 8%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--brand) 22%, transparent)',
                  }}
                >
                  <PlayCircle size={12} />
                  Run Now
                </button>
              )}
              <button
                onClick={() => onAction('Link copied', row.id)}
                className="group flex items-center gap-2 h-10 px-4 rounded-[10px] border font-bold font-heading text-[11px] transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer border-border/20 bg-bg/30 text-text-muted/70 hover:text-text"
              >
                <Copy size={12} />
                Copy Link
              </button>
              <button
                onClick={() => { onAction('Deleted', row.id); onClose(); }}
                className="group flex items-center gap-2 h-10 px-4 rounded-[10px] border font-bold font-heading text-[11px] transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer"
                style={{
                  color: 'var(--negative)',
                  background: 'color-mix(in srgb, var(--negative) 5%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--negative) 15%, transparent)',
                }}
              >
                <Trash2 size={12} />
                Archive Record
              </button>
              <button
                onClick={() => onAction('Export', row.id)}
                className="group flex items-center gap-2 h-10 px-4 rounded-[10px] border font-bold font-heading text-[11px] transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer border-border/20 bg-bg/30 text-text-muted/70 hover:text-text"
              >
                <Send size={12} />
                Re-send Report
              </button>
            </div>
          </DrawerSection>

        </div>
      </DrawerBody>

      <DrawerFooter>
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge value={row.status} />
            <FormatBadge value={row.format} />
            {row.generated && row.generated !== '—' && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-text-muted/60">
                <Calendar size={11} />
                {row.generated}
              </span>
            )}
          </div>
          <ActionBtn variant="default" onClick={onClose} label="Close" />
        </div>
      </DrawerFooter>
    </MainDrawer>
  );
}
