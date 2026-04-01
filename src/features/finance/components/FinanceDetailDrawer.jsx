import React, { useState } from 'react';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { DrawerSection, DrawerField, DrawerGrid } from '../../../components/overlays/DrawerUI';
import { Button } from '../../../components/ui/Button';
import { StatusChip } from './FinanceComponents';
import { RISK_COLOR, STATUS_COLOR } from '../data/financeMockData';
import { AlertTriangle, Check, CheckCircle2, Download, Eye, Flag, Lock, Send, X } from 'lucide-react';

const STATUS_HISTORY_DEPOSIT = [
  { status: 'CREATED', by: 'system', time: '2024-01-15 09:12' },
  { status: 'REVIEWING', by: 'auto-aml', time: '2024-01-15 09:12' },
  { status: 'PENDING', by: 'james.risk', time: '2024-01-15 09:14' },
];

const STATUS_HISTORY_WDR = [
  { status: 'CREATED', by: 'user', time: '2024-01-15 08:11' },
  { status: 'REVIEWING', by: 'auto-aml', time: '2024-01-15 08:12' },
  { status: 'PENDING', by: 'james.risk', time: '2024-01-15 08:15' },
];


export function FinanceDetailDrawer({ open, row, slug, onClose }) {
  const [note, setNote] = useState('');
  const [actionDone, setActionDone] = useState(null);
  const isDeposit = slug === 'deposits';
  const isWithdrawal = slug === 'withdrawals';

  const history = isDeposit ? STATUS_HISTORY_DEPOSIT : STATUS_HISTORY_WDR;

  const riskFlags = [
    row?.risk === 'ELEVATED' && 'Elevated risk — requiring compliance review',
    row?.risk === 'WATCHLIST' && 'Subject is on internal watchlist',
    row?.status === 'FLAGGED' && 'Automatic flag triggered by detection engine',
    (row?.amount?.replace(/[^0-9]/g, '') || 0) > 20000 && 'Large volume — manual authorization required',
  ].filter(Boolean);

  return (
    <AdminDrawer
      open={open}
      title={row?.id ?? 'Finance Record'}
      subtitle={row ? `${row.user} · ${row.uid} · ${row.createdAt}` : ''}
      eyebrow={isDeposit ? "Inbound Deposit" : isWithdrawal ? "Outbound Withdrawal" : "Ledger Entry"}
      width="max-w-[840px]"
      onClose={onClose}
      footer={(
        <div className="flex justify-between items-center w-full gap-2">
          <div className="flex gap-2">
            {row?.status && <StatusChip value={row.status} colorMap={STATUS_COLOR} />}
            {row?.risk && <StatusChip value={row.risk} colorMap={RISK_COLOR} />}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button variant="primary">View User</Button>
          </div>
        </div>
      )}
    >
      {row ? (
        <div className="space-y-6">
          <DrawerSection title="Transaction Summary">
            <DrawerGrid>
              <DrawerField label="Record ID" value={row.id} mono />
              <DrawerField label="Amount" value={row.amount} accent={isWithdrawal ? 'var(--negative)' : 'var(--brand)'} mono />
              <DrawerField label="Method" value={row.method} />
              <DrawerField label="Rail / Network" value={row.rail} mono />
              <DrawerField label="Created At" value={row.createdAt} mono />
              <DrawerField label="Reviewed By" value={row.reviewedBy || 'UNASSIGNED'} />
            </DrawerGrid>
          </DrawerSection>

          <DrawerSection title="User Context">
            <DrawerGrid>
              <DrawerField label="Full Name" value={row.user} />
              <DrawerField label="UID" value={row.uid} mono />
              <DrawerField label="Email" value={row.email} className="col-span-2" />
            </DrawerGrid>
          </DrawerSection>

          {row.hash && (
            <DrawerSection title="Payment Execution">
              <DrawerGrid cols={1}>
                <DrawerField label="Tx Hash / Reference" value={row.hash} mono />
                {isWithdrawal && <DrawerField label="Destination Account" value={row.destAcct} mono />}
              </DrawerGrid>
            </DrawerSection>
          )}

          <DrawerSection title="Risk Analysis">
            <div className="space-y-3">
              <DrawerGrid>
                <DrawerField label="Risk Level" value={row.risk} accent={RISK_COLOR[row.risk]?.c} />
                <DrawerField label="Security Scan" value="PASSED" accent="var(--positive)" />
              </DrawerGrid>
              
              {riskFlags.length > 0 ? (
                <div className="space-y-1.5 px-0.5">
                  {riskFlags.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-[10px] border border-warning/25 bg-warning/5 px-3.5 py-3 shadow-sm">
                      <AlertTriangle size={13} className="mt-0.5 flex-shrink-0 text-warning" />
                      <span className="text-[12px] leading-relaxed text-warning/90 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2.5 rounded-[10px] border border-positive/25 bg-positive/5 px-3.5 py-3 shadow-sm">
                  <CheckCircle2 size={13} className="text-positive" />
                  <span className="text-[12px] text-positive/80 font-medium">No record-level flags or sanctions detected.</span>
                </div>
              )}
            </div>
          </DrawerSection>

          <DrawerSection title="Internal Notes" collapsible>
            <div className="space-y-3">
              {row.note && (
                <div className="rounded-[10px] border border-border/15 bg-bg/40 p-4 shadow-inner">
                  <p className="text-[12.5px] leading-relaxed text-text-muted/70 italic">"{row.note}"</p>
                </div>
              )}
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add an operator investigation note…"
                rows={4}
                className="w-full rounded-[10px] border border-border/25 bg-bg/60 px-4 py-3 text-[12.5px] text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 resize-none shadow-sm"
              />
              <div className="flex justify-start">
                <Button 
                  icon={Send} 
                  disabled={!note.trim()} 
                  className="h-9 px-5 shadow-button-glow"
                  onClick={() => { setNote(''); setActionDone('Note saved successfully'); }}
                >
                  Save Note
                </Button>
              </div>
            </div>
          </DrawerSection>

          <DrawerSection title="Record Actions">
            <div className="grid grid-cols-2 gap-2 mt-1">
              {[
                { label: 'Approve Record', color: 'var(--positive)', action: 'approved', Icon: Check },
                { label: 'Reject / Flag', color: 'var(--negative)', action: 'rejected', Icon: X },
                { label: 'Compliance Lock', color: '#a78bfa', action: 'frozen', Icon: Lock },
                { label: 'Download Audit', color: 'var(--text-muted)', action: null, Icon: Download },
              ].map(({ label, color, action, Icon: Ic }) => (
                <button
                  key={label}
                  onClick={() => action && setActionDone(label)}
                  className="flex items-center justify-center gap-2.5 rounded-[10px] border py-3 text-[11px] font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.98] group"
                  style={{ 
                    color, 
                    background: `color-mix(in srgb, ${color} 10%, transparent)`, 
                    borderColor: `color-mix(in srgb, ${color} 25%, transparent)` 
                  }}
                >
                  <Ic size={13} className="group-hover:scale-110 transition-transform" />
                  {label}
                </button>
              ))}
            </div>
            {actionDone && (
              <div className="flex items-center gap-2.5 rounded-[10px] border border-positive/30 bg-positive/10 px-4 py-3 mt-3 shadow-sm animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 size={13} strokeWidth={3} className="text-positive" />
                <span className="text-[12px] font-bold text-positive/90">System: {actionDone}</span>
              </div>
            )}
          </DrawerSection>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center py-20 px-10 text-center">
          <div className="h-10 w-10 animate-pulse rounded-full border-2 border-primary/20 bg-primary/10 mb-4" />
          <div className="text-[14px] font-semibold text-text/40 tracking-tight">Accessing Ledger Record...</div>
          <div className="mt-2 text-[11px] text-text-muted/30 uppercase tracking-widest leading-relaxed">
            Please wait while we retrieve the <br /> secure transaction details.
          </div>
        </div>
      )}
    </AdminDrawer>
  );
}
