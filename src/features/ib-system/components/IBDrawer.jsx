import React, { useState } from 'react';
import {
  AlertOctagon, BarChart2, CheckCircle2, CircleDollarSign,
  Edit2, Flag, GitBranch, Link, Lock, PauseCircle,
  RefreshCw, User, UserCheck, Users, Wallet, XCircle, Copy, Send
} from 'lucide-react';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { DrawerSection, DrawerField, DrawerGrid, TextareaField } from '../../../components/overlays/DrawerUI';
import { STATUS_CLR, TIER_CLR } from '../data/workspaces/shared.workspace';
import { ActionBtn as IconBtn, StatusChip } from '../../../components/ui';
import { Button } from '../../../components/ui/Button';

/* ─── Referral Drawer ────────────────────────────────────────── */
export function ReferralDrawer({ row, open, onClose, onAction }) {
  const [note, setNote] = useState('');

  if (!row) return null;
  const conv = row.active && row.referred ? ((row.active / row.referred) * 100).toFixed(1) : '—';
  return (
    <AdminDrawer 
      open={open} 
      onClose={onClose} 
      title={row.id} 
      subtitle={`${row.name} · ${row.region}`} 
      eyebrow="IB Partner" 
      width="max-w-[520px]"
      footer={(
        <div className="flex items-center justify-between gap-2">
          <StatusChip value={row.status} colorMap={STATUS_CLR} />
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button variant="primary">View Profile</Button>
          </div>
        </div>
      )}
    >
      <div className="space-y-5">
        <DrawerSection title="Partner Identity">
          <DrawerGrid>
            <DrawerField label="Partner Name"  value={row.name}         className="col-span-2" />
            <DrawerField label="Partner ID"    value={row.id}           mono />
            <DrawerField label="Referral Code" value={row.code}         mono />
            <DrawerField label="Region"        value={row.region} />
            <DrawerField label="Tier"          value={row.tier}         accent={TIER_CLR[row.tier]} />
            <DrawerField label="Revenue Share" value={row.share}        mono accent="var(--brand)" />
            <DrawerField label="Last Activity" value={row.lastActivity} mono />
            <DrawerField label="Status"        value={row.status}       accent={STATUS_CLR[row.status]} />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Referral Stats">
          <DrawerGrid>
            <DrawerField label="Total Referred"  value={row.referred?.toLocaleString()}               mono />
            <DrawerField label="Active Users"    value={row.active?.toLocaleString()}                 mono accent="var(--positive)" />
            <DrawerField label="Conversion Rate" value={`${conv}%`}                                   mono accent="var(--cyan)" />
            <DrawerField label="Inactive"        value={(row.referred - row.active)?.toLocaleString()} mono accent="var(--negative)" />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Referral Link">
          <div className="flex items-center gap-2 rounded-[10px] border border-border/25 bg-bg/50 px-3 h-10">
            <code className="flex-1 text-[11px] font-mono text-cyan truncate">https://live-trader.com/ref/{row.code?.toLowerCase()}</code>
            <button className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer"><Copy size={11} /></button>
          </div>
        </DrawerSection>

        <DrawerSection title="Internal Notes" collapsible>
          <TextareaField
            label="Manager Internal Note"
            value={note}
            onChange={setNote}
            placeholder="Add relationship management notes..."
            rows={4}
          />
        </DrawerSection>

        <DrawerSection title="Actions">
          <div className="grid grid-cols-2 gap-2">
            <IconBtn label="Edit Partner"     Icon={Edit2}     variant="default" onClick={() => { onAction('Edit opened', row.id); onClose(); }} />
            <IconBtn label="Suspend"          Icon={Lock}      variant="danger"  onClick={() => { onAction('Suspended', row.id); onClose(); }} />
            <IconBtn label="View Tree"        Icon={GitBranch} variant="cyan"    onClick={() => { onAction('Tree opened', row.id); onClose(); }} />
            <IconBtn label="Commission Hist." Icon={BarChart2} variant="brand"   onClick={() => { onAction('History', row.id); onClose(); }} />
          </div>
        </DrawerSection>
      </div>
    </AdminDrawer>
  );
}

/* ─── Commission Drawer ──────────────────────────────────────── */
export function CommissionDrawer({ row, open, onClose, onAction }) {
  const [note, setNote] = useState('');

  if (!row) return null;
  return (
    <AdminDrawer 
      open={open} 
      onClose={onClose} 
      title={row.id} 
      subtitle={`${row.partner} · ${row.source}`} 
      eyebrow="Commission Record" 
      width="max-w-[520px]"
      footer={(
        <div className="flex items-center justify-between gap-2">
          <StatusChip value={row.approval} colorMap={STATUS_CLR} />
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button variant="primary">View Source</Button>
          </div>
        </div>
      )}
    >
      <div className="space-y-5">
        <DrawerSection title="Commission Details">
          <DrawerGrid>
            <DrawerField label="Commission ID" value={row.id}       mono />
            <DrawerField label="Partner"       value={row.partner} />
            <DrawerField label="Referred User" value={row.user} />
            <DrawerField label="Source"        value={row.source} />
            <DrawerField label="Amount"        value={row.amount}   mono accent="var(--brand)" />
            <DrawerField label="Tier"          value={row.tier}     accent={TIER_CLR[row.tier]} />
            <DrawerField label="Created"       value={row.date}     mono />
            <DrawerField label="Payout State"  value={row.payout}   accent={STATUS_CLR[row.payout]} />
            <DrawerField label="Approval"      value={row.approval} accent={STATUS_CLR[row.approval]} className="col-span-2" />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Internal Notes" collapsible>
          <TextareaField
            label="Manager Internal Note"
            value={note}
            onChange={setNote}
            placeholder="Add audit or review notes for this commission..."
            rows={4}
          />
        </DrawerSection>

        <DrawerSection title="Actions">
          <div className="grid grid-cols-2 gap-2">
            {row.approval === 'REVIEW' && <>
              <IconBtn label="Approve"      Icon={CheckCircle2} variant="success" onClick={() => { onAction('Approved', row.id); onClose(); }} />
              <IconBtn label="Reject"       Icon={XCircle}      variant="danger"  onClick={() => { onAction('Rejected', row.id); onClose(); }} />
            </>}
            <IconBtn label="Hold Payment" Icon={PauseCircle} variant="warning" onClick={() => { onAction('Held', row.id); onClose(); }} />
            <IconBtn label="View Partner" Icon={User}        variant="default" onClick={onClose} />
          </div>
        </DrawerSection>
      </div>
    </AdminDrawer>
  );
}

/* ─── Payout Drawer ──────────────────────────────────────────── */
export function PayoutDrawer({ row, open, onClose, onAction }) {
  const [note, setNote] = useState('');

  if (!row) return null;
  const riskColor = row.risk === 'HIGH' ? 'var(--negative)' : row.risk === 'MEDIUM' ? 'var(--warning)' : 'var(--positive)';
  
  return (
    <AdminDrawer 
      open={open} 
      onClose={onClose} 
      title={row.id} 
      subtitle={`${row.partner} · ${row.amount}`} 
      eyebrow="IB Payout Request" 
      width="max-w-[520px]"
      footer={(
        <div className="flex items-center justify-between gap-2">
          <StatusChip value={row.risk} colorMap={{HIGH:'var(--negative)', MEDIUM:'var(--warning)', LOW:'var(--positive)'}} />
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button variant="primary">Verify Payout</Button>
          </div>
        </div>
      )}
    >
      <div className="space-y-5">
        <DrawerSection title="Payout Details">
          <DrawerGrid>
            <DrawerField label="Payout ID"    value={row.id}          mono />
            <DrawerField label="Partner"      value={row.partner} />
            <DrawerField label="Amount"       value={row.amount}      mono accent="var(--brand)" />
            <DrawerField label="Method"       value={row.method} />
            <DrawerField label="Status"       value={row.status}      accent={STATUS_CLR[row.status]} />
            <DrawerField label="Risk Check"   value={row.risk}        accent={riskColor} />
            <DrawerField label="Requested"    value={row.requestedAt} mono className="col-span-2" />
            <DrawerField label="Processed By" value={row.processedBy} />
          </DrawerGrid>
        </DrawerSection>

        {row.risk === 'HIGH' && (
          <div className="flex items-start gap-2.5 rounded-[10px] border border-negative/25 bg-negative/5 px-3.5 py-3 shadow-sm">
            <AlertOctagon size={13} className="text-negative flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[11.5px] font-bold text-negative">High Risk Detected</div>
              <div className="text-[11px] text-negative/70 mt-0.5">Flagged for manual review. Verify partner identity and source of funds before processing.</div>
            </div>
          </div>
        )}

        <DrawerSection title="Internal Notes" collapsible>
          <TextareaField
            label="Manager Internal Note"
            value={note}
            onChange={setNote}
            placeholder="Add payment processing or exception handling notes..."
            rows={4}
          />
        </DrawerSection>

        <DrawerSection title="Actions">
          <div className="grid grid-cols-2 gap-2">
            {(row.status === 'PENDING' || row.status === 'REVIEW') && <>
              <IconBtn label="Approve Payout" Icon={CheckCircle2} variant="success" onClick={() => { onAction('Payout Approved', row.id); onClose(); }} />
              <IconBtn label="Reject"         Icon={XCircle}      variant="danger"  onClick={() => { onAction('Payout Rejected', row.id); onClose(); }} />
            </>}
            {row.status === 'FROZEN' && (
              <IconBtn label="Unfreeze" Icon={RefreshCw} variant="cyan" onClick={() => { onAction('Unfrozen', row.id); onClose(); }} />
            )}
            <IconBtn label="Flag for Review" Icon={Flag} variant="warning" onClick={() => { onAction('Flagged', row.id); onClose(); }} />
            <IconBtn label="View Partner"    Icon={User} variant="default" onClick={onClose} />
          </div>
        </DrawerSection>
      </div>
    </AdminDrawer>
  );
}
