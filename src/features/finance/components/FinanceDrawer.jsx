/**
 * finance/components/FinanceDrawer.jsx
 * Drawer system, drawer sub-components, table shell, toolbar, UserCell, QuickActions.
 */
import React, { useState, useEffect } from 'react';
import {
  Activity, AlertTriangle, ArrowUpRight, Check, CheckCircle2,
  ChevronDown, Copy, Download, Eye, FileText, Flag, Lock,
  MessageSquare, Play, RefreshCw, Search, Send, ShieldAlert,
  User, X, XCircle, Zap,
} from 'lucide-react';
import { STATUS_CLR, RISK_CLR } from '../data/financeMockData';
import { IconBtn, SectionHead, StatusBadge, RiskBadge, MethodBadge, Pagination } from './FinanceShared';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { DrawerField, DrawerGrid, DrawerSection } from '../../../components/overlays/DrawerUI';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';

// Re-export shared atoms so pages importing them from FinanceDrawer continue to work
export { IconBtn, Pagination, SectionHead } from './FinanceShared';

/* ── Base drawer shell ───────────────────────────────────────── */
function FinanceDrawer({ open, onClose, title, subtitle, children, footer }) {
  return (
    <AdminDrawer open={open} onClose={onClose} title={title} subtitle={subtitle} eyebrow="Record Review" width="max-w-[720px]" footer={footer}>
      <div className="space-y-6">
        {children}
      </div>
    </AdminDrawer>
  );
}

/* ── Drawer field ────────────────────────────────────────────── */
const DF = DrawerField;

/* ── Drawer grid ─────────────────────────────────────────────── */
const DGrid = DrawerGrid;

/* ── Audit trail ─────────────────────────────────────────────── */
function DrawerAuditTrail({ entries }) {
  return (
    <div className="space-y-0 relative">
      <div className="absolute left-[7px] top-3 bottom-3 w-px bg-white/[0.06]" />
      {entries.map((e, i) => (
        <div key={i} className="flex gap-3 pb-3">
          <div className="w-3.5 h-3.5 rounded-full border border-white/[0.12] bg-white/[0.06] flex-shrink-0 mt-1 z-10"
            style={{ boxShadow: '0 0 0 2px var(--surface-elevated,#131313)' }} />
          <div className="min-w-0">
            <div className="text-[11.5px] font-heading font-semibold text-text/75">{e.action}</div>
            <div className="text-[10px] font-mono text-text-muted/35 mt-0.5">{e.by} · {e.ts}</div>
            {e.note && <div className="text-[10.5px] text-text-muted/45 font-heading mt-0.5">{e.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Note editor ─────────────────────────────────────────────── */
function DrawerNoteEditor({ onSave }) {
  const [text, setText] = useState('');
  return (
    <div className="space-y-2.5">
      <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
        placeholder="Add internal note…"
        className="w-full resize-none rounded-[10px] border border-border/25 bg-bg px-3 py-2.5 text-[12px] text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10" />
      <button onClick={() => { if (text.trim()) { onSave(text); setText(''); } }}
        disabled={!text.trim()}
        className="flex items-center gap-1.5 h-7 px-3 rounded-[7px] text-[10.5px] font-bold font-heading border border-primary/20 bg-primary/[0.07] text-primary cursor-pointer hover:brightness-110 transition-all disabled:opacity-30">
        <Send size={10} /> Save Note
      </button>
    </div>
  );
}

/* ── Risk panel ──────────────────────────────────────────────── */
function RiskPanel({ risk, flags = [] }) {
  const color = RISK_CLR[risk] || 'var(--text-muted)';
  const defaultFlags = {
    LOW:    ['Standard transaction velocity', 'No sanctions match', 'Verified KYC'],
    MEDIUM: ['Unusual transaction size', 'KYC review recommended'],
    HIGH:   ['AML threshold triggered', 'OFAC screening match', 'Source of funds unverified'],
  };
  const allFlags = flags.length > 0 ? flags : (defaultFlags[risk] || []);
  return (
    <div className="rounded-[10px] border px-4 py-3.5 space-y-3"
      style={{ borderColor: `color-mix(in srgb, ${color} 22%, transparent)`, background: `color-mix(in srgb, ${color} 5%, transparent)` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={14} style={{ color }} />
          <span className="text-[12px] font-bold font-heading" style={{ color }}>Risk Level: {risk}</span>
        </div>
        <RiskBadge value={risk} />
      </div>
      <div className="space-y-1.5">
        {allFlags.map((f, i) => {
          const flagColor = risk === 'HIGH' ? 'var(--negative)' : risk === 'MEDIUM' && i === 0 ? 'var(--warning)' : 'var(--positive)';
          return (
            <div key={i} className="flex items-center gap-2 text-[11.5px] font-heading">
              {risk === 'HIGH' || (risk === 'MEDIUM' && i === 0)
                ? <AlertTriangle size={11} style={{ color: flagColor }} className="flex-shrink-0" />
                : <Check size={11} style={{ color: flagColor }} className="flex-shrink-0" />
              }
              <span style={{ color: flagColor }}>{f}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Generic record drawer (Deposits + Withdrawals) ─────────── */
function FinanceRecordDrawer({ row, open, onClose, type, onAction }) {
  const [localNote, setLocalNote] = useState('');
  if (!row) return null;

  const u = row.user;
  const auditBase = [
    { action: 'Record created',                  by: 'System',     ts: row.created, note: `Source: ${row.method || row.type}` },
    { action: 'Auto-risk assessment completed',  by: 'RiskEngine', ts: row.created, note: `Risk level: ${row.risk}` },
  ];
  if (row.reviewedBy && row.reviewedBy !== '—' && row.reviewedBy !== 'Auto')
    auditBase.push({ action: 'Manual review initiated', by: row.reviewedBy, ts: row.created, note: null });
  if (['APPROVED', 'PAID', 'SETTLED'].includes(row.status))
    auditBase.push({ action: 'Record approved', by: row.reviewedBy || 'System', ts: row.created, note: null });
  if (['FLAGGED', 'FROZEN'].includes(row.status))
    auditBase.push({ action: 'Flagged for compliance review', by: row.reviewedBy || 'System', ts: row.created, note: 'Awaiting compliance team action' });

  return (
    <FinanceDrawer open={open} onClose={onClose} title={`${type} — ${row.id}`} subtitle="Inspect record details, user context, and audit logs." footer={
      <div className="grid grid-cols-2 gap-2 w-full">
        {row.status === 'PENDING' && <>
          <IconBtn label="Approve"      Icon={CheckCircle2} variant="success" onClick={() => { onAction('Approved', row.id); onClose(); }} />
          <IconBtn label="Reject"       Icon={XCircle}      variant="danger"  onClick={() => { onAction('Rejected', row.id); onClose(); }} />
        </>}
        {(row.status === 'FLAGGED' || row.status === 'FROZEN') && <>
          <IconBtn label="Release Hold" Icon={Play}         variant="warning" onClick={() => { onAction('Hold released', row.id); onClose(); }} />
          <IconBtn label="Escalate"     Icon={ArrowUpRight} variant="orange"  onClick={() => { onAction('Escalated', row.id);    onClose(); }} />
        </>}
        {row.status === 'FAILED' && <>
          <IconBtn label="Retry"        Icon={RefreshCw}    variant="warning" onClick={() => { onAction('Retried', row.id);      onClose(); }} />
        </>}
        <IconBtn label="Copy Record ID" Icon={Copy}         variant="default" onClick={() => { navigator.clipboard.writeText(row.id); onAction('ID copied', row.id); }} />
        <IconBtn label="Export Record"  Icon={Download}     variant="default" onClick={() => onAction('Exported', row.id)} />
        <IconBtn label="View User"      Icon={User}         variant="cyan"    onClick={() => onAction('User profile opened', row.id)} />
        {row.status !== 'REJECTED' && row.status !== 'PAID' && row.status !== 'SETTLED' &&
          <IconBtn label="Lock Record"  Icon={Lock}         variant="danger"  onClick={() => { onAction('Locked', row.id); onClose(); }} />
        }
      </div>
    }>
      {/* Status header */}
      <div className="rounded-[12px] border border-white/[0.07] overflow-hidden">
        <div className="px-4 py-3.5 flex items-center justify-between"
          style={{ background: `color-mix(in srgb, ${STATUS_CLR[row.status] || 'rgba(255,255,255,0.1)'} 6%, transparent)`, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <div className="text-[16px] font-black font-heading text-text tracking-[-0.02em]">{row.amount}</div>
            <div className="text-[10px] font-mono text-text-muted/40 mt-0.5">{row.id} · {row.created}</div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge value={row.status} size="lg" />
            {row.risk && <RiskBadge value={row.risk} />}
          </div>
        </div>
        <div className="px-4 py-2.5 flex gap-4 flex-wrap">
          {row.method && <MethodBadge value={row.method} />}
          {row.rail && <span className="text-[10px] font-heading text-text-muted/40 border border-white/[0.06] px-2 py-0.5 rounded-[4px]">{row.rail}</span>}
        </div>
      </div>

      {/* Transaction Summary */}
      <DrawerSection title="Transaction Summary">
        <DGrid>
          <DF label="Record ID"     value={row.id}      mono copyable />
          <DF label="Status"        value={row.status}  accent={STATUS_CLR[row.status]} />
          <DF label="Amount"        value={row.amount}  mono accent={row.amtRaw > 0 ? 'var(--positive)' : 'var(--negative)'} />
          <DF label="Method"        value={row.method} />
          {row.rail        && <DF label="Provider/Rail"    value={row.rail}        mono />}
          {row.reference   && <DF label="Reference"        value={row.reference}   mono copyable />}
          {row.destination && <DF label="Destination"      value={row.destination} mono copyable wide />}
          {row.hash        && <DF label="Tx Hash"          value={row.hash}        mono copyable wide />}
          {row.compliance  && <DF label="Compliance Check" value={row.compliance}  accent={row.compliance === 'PASS' ? 'var(--positive)' : 'var(--negative)'} />}
          {row.aml         && <DF label="AML Status"       value={row.aml}         accent={row.aml === 'CLEAR' ? 'var(--positive)' : row.aml === 'REVIEW' ? 'var(--warning)' : 'var(--negative)'} />}
          <DF label="Created"       value={row.created} mono />
          <DF label="Reviewed By"   value={row.reviewedBy || 'Unassigned'} />
        </DGrid>
      </DrawerSection>

      {/* User Context */}
      <DrawerSection title="User Context">
        <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.025] p-3.5">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/[0.05]">
            <div className="w-9 h-9 rounded-[9px] bg-primary/[0.1] border border-primary/[0.18] flex items-center justify-center text-[12px] font-bold text-primary font-heading flex-shrink-0">
              {u.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="text-[13px] font-bold font-heading text-text">{u.name}</div>
              <div className="text-[10.5px] font-mono text-text-muted/40">{u.uid} · {u.email}</div>
            </div>
            <div className="ml-auto text-[10px] font-heading font-semibold text-text-muted/40">{u.region}</div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            {[['KYC', 'VERIFIED', 'var(--positive)'], ['Wallet', 'ACTIVE', 'var(--positive)'], ['Trading', 'ACTIVE', 'var(--positive)']].map(([l, v, c]) => (
              <div key={l} className="text-center">
                <div className="text-[9px] text-text-muted/35 font-heading mb-0.5 uppercase tracking-wide">{l}</div>
                <div className="font-bold font-heading text-[10.5px]" style={{ color: c }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </DrawerSection>

      {/* Risk Analysis */}
      {row.risk && (
        <DrawerSection title="Risk Analysis">
          <RiskPanel risk={row.risk} flags={row.note && row.risk === 'HIGH' ? [row.note.split('.')[0]] : undefined} />
        </DrawerSection>
      )}

      {/* Internal Notes */}
      <DrawerSection title="Internal Notes" collapsible>
        {row.note && (
          <div className="rounded-[9px] border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 mb-2.5 text-[12px] text-text-muted/65 font-heading leading-snug">
            {row.note}
          </div>
        )}
        <DrawerNoteEditor onSave={n => { setLocalNote(n); onAction('Note saved', row.id); }} />
        {localNote && (
          <div className="rounded-[9px] border border-purple-500/20 bg-purple-500/[0.05] px-3 py-2.5 mt-2 text-[12px] text-purple-300/80 font-heading leading-snug">
            {localNote}
          </div>
        )}
      </DrawerSection>

      {/* Audit Trail */}
      <DrawerSection title="Audit Trail" collapsible>
        <DrawerAuditTrail entries={auditBase} />
      </DrawerSection>
    </FinanceDrawer>
  );
}

/* ── Table shell ─────────────────────────────────────────────── */
function FinanceTable({ cols, rows, onRow, empty = 'No records found', footer }) {
  if (!rows?.length) {
    return (
      <div className="p-6">
        <div className="text-center text-text-muted/50 font-heading">{empty}</div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    );
  }

  return (
    <>
      <Table
        headers={cols.map(c => c.label)}
        data={rows}
        rowRenderer={(row, ri) => (
          <TableRow
            key={row.id ?? ri}
            className={onRow ? 'cursor-pointer' : ''}
            onClick={onRow ? () => onRow(row) : undefined}
          >
            {cols.map(c => (
              <TableCell key={c.key}>
                {c.render ? c.render(row[c.key], row) : <span className="text-[12px] text-text/70">{row[c.key] ?? '—'}</span>}
              </TableCell>
            ))}
          </TableRow>
        )}
      />
      {footer && <div className="px-5 pb-5 mt-2">{footer}</div>}
    </>
  );
}

/* ── Search + filter toolbar ─────────────────────────────────── */
function FinanceToolbar({ search, setSearch, filters, activeFilter, setFilter, actions, extra }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID, user, UID, email…"
            className="w-full h-8 pl-8 pr-3 rounded-[8px] border border-border/25 bg-bg text-[12px] text-text placeholder:text-text-muted/30 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all font-heading" />
        </div>
        {filters && (
          <div className="flex gap-1 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 h-8 rounded-[7px] text-[10.5px] font-bold font-heading uppercase tracking-wide cursor-pointer transition-all border
                  ${activeFilter === f ? 'bg-primary/[0.12] text-primary border-primary/25' : 'border-border/25 text-text-muted/50 hover:text-text-muted hover:border-border/40 hover:bg-surface-bright/20 bg-transparent'}`}>
                {f}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2 ml-auto">
          {actions?.map((a, i) => (
            <button key={i} onClick={a.onClick}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[11px] font-semibold font-heading border transition-all duration-200 cursor-pointer
                ${a.primary ? 'bg-brand text-black border-brand/80 hover:brightness-110 shadow-[0_0_15px_rgba(var(--brand-rgb),0.2)]' : 'border-border/25 bg-surface-bright/10 text-text-muted/70 hover:text-text hover:border-border/40'}`}>
              {a.Icon && <a.Icon size={12} />}{a.label}
            </button>
          ))}
        </div>
      </div>
      {extra}
    </div>
  );
}

/* ── Secondary filter row ────────────────────────────────────── */
function FilterRow({ filters }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {filters.map(grp => (
        <div key={grp.label} className="flex items-center gap-1.5">
          <span className="text-[9.5px] font-black uppercase tracking-[0.15em] text-text-muted/30 font-heading">{grp.label}:</span>
          <div className="flex gap-1">
            {grp.options.map(o => (
              <button key={o} onClick={() => grp.set(o)}
                className={`px-2 h-7 rounded-[6px] text-[10.5px] font-bold font-heading cursor-pointer transition-all border
                  ${grp.value === o ? 'bg-primary/[0.1] text-primary border-primary/25' : 'border-border/20 text-text-muted/45 hover:text-text-muted hover:border-border/40 hover:bg-surface-bright/10 bg-transparent'}`}>
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── User cell ───────────────────────────────────────────────── */
function UserCell({ u }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-[6px] bg-primary/[0.1] border border-primary/[0.16] flex items-center justify-center text-[9px] font-bold text-primary font-heading flex-shrink-0">
        {u.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div>
        <div className="text-[12px] font-semibold font-heading text-text/85">{u.name}</div>
        <div className="text-[9.5px] font-mono text-text-muted/35">{u.uid}</div>
      </div>
    </div>
  );
}

/* ── Row quick-action buttons ────────────────────────────────── */
function QuickActions({ row, onApprove, onReject, onFlag, onRetry }) {
  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {onApprove && row.status === 'PENDING' &&
        <button onClick={e => { e.stopPropagation(); onApprove(row); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/[0.07] text-positive flex items-center justify-center cursor-pointer hover:brightness-110" title="Approve"><Check size={10} /></button>}
      {onReject && (row.status === 'PENDING' || row.status === 'FLAGGED') &&
        <button onClick={e => { e.stopPropagation(); onReject(row); }} className="w-6 h-6 rounded-[5px] border border-negative/20 bg-negative/[0.07] text-negative flex items-center justify-center cursor-pointer hover:brightness-110" title="Reject"><X size={10} /></button>}
      {onFlag && row.status !== 'FLAGGED' &&
        <button onClick={e => { e.stopPropagation(); onFlag(row); }} className="w-6 h-6 rounded-[5px] border border-warning/20 flex items-center justify-center text-warning/60 hover:text-warning cursor-pointer" title="Flag"><Flag size={10} /></button>}
      {onRetry && row.status === 'FAILED' &&
        <button onClick={e => { e.stopPropagation(); onRetry(row); }} className="w-6 h-6 rounded-[5px] border border-cyan/20 bg-cyan/[0.07] text-cyan flex items-center justify-center cursor-pointer hover:brightness-110" title="Retry"><RefreshCw size={10} /></button>}
    </div>
  );
}

export {
  FinanceDrawer, DF, DGrid, DrawerAuditTrail, DrawerNoteEditor, DrawerSection,
  RiskPanel, FinanceRecordDrawer,
  FinanceTable, FinanceToolbar, FilterRow, UserCell, QuickActions,
};
