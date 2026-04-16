import React from 'react';
import {
  AlertOctagon, BarChart2, CheckCircle2, CircleDollarSign,
  Edit2, Flag, GitBranch, Link, Lock, PauseCircle,
  RefreshCw, User, UserCheck, Users, Wallet, XCircle,
} from 'lucide-react';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { STATUS_CLR, TIER_CLR } from '../configs/shared.config';
import { SectionHead, IBDrawerField as DF, IBDrawerGrid as DGrid, IBIconBtn as IconBtn } from './IBShared';
import { Copy } from 'lucide-react';

/* ─── Referral Drawer ────────────────────────────────────────── */
export function ReferralDrawer({ row, open, onClose, onAction }) {
  if (!row) return null;
  const conv = row.active && row.referred ? ((row.active / row.referred) * 100).toFixed(1) : '—';
  return (
    <AdminDrawer open={open} onClose={onClose} title={row.id} subtitle={`${row.name} · ${row.region}`} eyebrow="IB Partner" width="max-w-[500px]">
      <div className="space-y-5">
        <div>
          <SectionHead title="Partner Identity" Icon={UserCheck} />
          <DGrid>
            <DF label="Partner Name"  value={row.name}         wide copyable />
            <DF label="Partner ID"    value={row.id}           mono copyable />
            <DF label="Referral Code" value={row.code}         mono copyable />
            <DF label="Region"        value={row.region} />
            <DF label="Tier"          value={row.tier}         accent={TIER_CLR[row.tier]} />
            <DF label="Revenue Share" value={row.share}        mono accent="var(--brand)" />
            <DF label="Last Activity" value={row.lastActivity} />
            <DF label="Status"        value={row.status}       accent={STATUS_CLR[row.status]} />
          </DGrid>
        </div>
        <div>
          <SectionHead title="Referral Stats" Icon={Users} />
          <DGrid>
            <DF label="Total Referred"  value={row.referred?.toLocaleString()}               mono />
            <DF label="Active Users"    value={row.active?.toLocaleString()}                 mono accent="var(--positive)" />
            <DF label="Conversion Rate" value={`${conv}%`}                                   mono accent="var(--cyan)" />
            <DF label="Inactive"        value={(row.referred - row.active)?.toLocaleString()} mono accent="var(--negative)" />
          </DGrid>
        </div>
        <div>
          <SectionHead title="Referral Link" Icon={Link} />
          <div className="flex items-center gap-2 rounded-[9px] border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
            <code className="flex-1 text-[11px] font-mono text-cyan truncate">https://live-trader.com/ref/{row.code?.toLowerCase()}</code>
            <button className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer"><Copy size={11} /></button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <IconBtn label="Edit Partner"     Icon={Edit2}     variant="default" onClick={() => { onAction('Edit opened', row.id); onClose(); }} />
          <IconBtn label="Suspend"          Icon={Lock}      variant="danger"  onClick={() => { onAction('Suspended', row.id); onClose(); }} />
          <IconBtn label="View Tree"        Icon={GitBranch} variant="cyan"    onClick={() => { onAction('Tree opened', row.id); onClose(); }} />
          <IconBtn label="Commission Hist." Icon={BarChart2} variant="brand"   onClick={() => { onAction('History', row.id); onClose(); }} />
        </div>
      </div>
    </AdminDrawer>
  );
}

/* ─── Commission Drawer ──────────────────────────────────────── */
export function CommissionDrawer({ row, open, onClose, onAction }) {
  if (!row) return null;
  return (
    <AdminDrawer open={open} onClose={onClose} title={row.id} subtitle={`${row.partner} · ${row.source}`} eyebrow="Commission Record" width="max-w-[500px]">
      <div className="space-y-5">
        <div>
          <SectionHead title="Commission Details" Icon={CircleDollarSign} />
          <DGrid>
            <DF label="Commission ID" value={row.id}       mono copyable />
            <DF label="Partner"       value={row.partner}  copyable />
            <DF label="Referred User" value={row.user} />
            <DF label="Source"        value={row.source} />
            <DF label="Amount"        value={row.amount}   mono accent="var(--brand)" />
            <DF label="Tier"          value={row.tier}     accent={TIER_CLR[row.tier]} />
            <DF label="Created"       value={row.date}     mono />
            <DF label="Payout State"  value={row.payout}   accent={STATUS_CLR[row.payout]} />
            <DF label="Approval"      value={row.approval} accent={STATUS_CLR[row.approval]} wide />
          </DGrid>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {row.approval === 'REVIEW' && <>
            <IconBtn label="Approve"      Icon={CheckCircle2} variant="success" onClick={() => { onAction('Approved', row.id); onClose(); }} />
            <IconBtn label="Reject"       Icon={XCircle}      variant="danger"  onClick={() => { onAction('Rejected', row.id); onClose(); }} />
          </>}
          <IconBtn label="Hold Payment" Icon={PauseCircle} variant="warning" onClick={() => { onAction('Held', row.id); onClose(); }} />
          <IconBtn label="View Partner" Icon={User}        variant="default" onClick={onClose} />
        </div>
      </div>
    </AdminDrawer>
  );
}

/* ─── Payout Drawer ──────────────────────────────────────────── */
export function PayoutDrawer({ row, open, onClose, onAction }) {
  if (!row) return null;
  const riskColor = row.risk === 'HIGH' ? 'var(--negative)' : row.risk === 'MEDIUM' ? 'var(--warning)' : 'var(--positive)';
  return (
    <AdminDrawer open={open} onClose={onClose} title={row.id} subtitle={`${row.partner} · ${row.amount}`} eyebrow="IB Payout Request" width="max-w-[500px]">
      <div className="space-y-5">
        <div>
          <SectionHead title="Payout Details" Icon={Wallet} />
          <DGrid>
            <DF label="Payout ID"    value={row.id}          mono copyable />
            <DF label="Partner"      value={row.partner}     copyable />
            <DF label="Amount"       value={row.amount}      mono accent="var(--brand)" />
            <DF label="Method"       value={row.method} />
            <DF label="Status"       value={row.status}      accent={STATUS_CLR[row.status]} />
            <DF label="Risk Check"   value={row.risk}        accent={riskColor} />
            <DF label="Requested"    value={row.requestedAt} mono wide />
            <DF label="Processed By" value={row.processedBy} />
          </DGrid>
        </div>
        {row.risk === 'HIGH' && (
          <div className="flex items-start gap-2.5 rounded-[9px] border border-negative/20 bg-negative/[0.06] px-3.5 py-3">
            <AlertOctagon size={13} className="text-negative flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[11.5px] font-bold text-negative font-heading">High Risk Detected</div>
              <div className="text-[11px] text-negative/70 font-heading mt-0.5">Flagged for manual review. Verify partner identity and source of funds before processing.</div>
            </div>
          </div>
        )}
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
      </div>
    </AdminDrawer>
  );
}
