import React, { useState } from 'react';
import { Check, Copy, UserCheck, BarChart2, ShieldCheck, TrendingUp, CheckCircle2, XCircle, Flag, CircleDollarSign, AlertTriangle, Lock, Eye } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { SectionHead, IconBtn, Badge, RiskBadge, STATUS_COLOR } from './PropShared';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';

export function DrawerField({ label, value, mono, accent, copyable }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative rounded-[9px] border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
      <div className="text-[9.5px] font-black uppercase tracking-[0.15em] text-text-muted/35 mb-1 font-heading">{label}</div>
      <div className={`text-[12.5px] ${mono ? 'font-mono' : 'font-semibold font-heading'} truncate`} style={{ color: accent ?? 'var(--text)' }}>
        {value ?? '—'}
      </div>
      {copyable && value && (
        <button onClick={() => { navigator.clipboard.writeText(String(value)); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted/30 hover:text-text-muted cursor-pointer">
          {copied ? <Check size={11} /> : <Copy size={11} />}
        </button>
      )}
    </div>
  );
}

export function EvaluationDrawer({ row, open, onClose, onAction }) {
  if (!row) return null;
  return (
    <AdminDrawer 
      open={open} 
      onClose={onClose} 
      title={row.id}
      subtitle={`${row.trader} · ${row.challenge}`}
      eyebrow="Evaluation Request"
      width="max-w-[480px]"
    >
      <div>
        <SectionHead title="Applicant" Icon={UserCheck} />
        <div className="grid grid-cols-2 gap-2">
          <DrawerField label="Trader" value={row.trader} copyable />
          <DrawerField label="UID" value={row.uid} mono copyable />
          <DrawerField label="Challenge" value={row.challenge} />
          <DrawerField label="Phase" value={row.phase} />
          <DrawerField label="Applied" value={row.ts} mono />
          <DrawerField label="Days Active" value={`${row.days} days`} mono />
        </div>
      </div>
      <div>
        <SectionHead title="Performance" Icon={BarChart2} />
        <div className="grid grid-cols-2 gap-2">
          <DrawerField label="Profit" value={row.profit} mono accent={row.profit?.startsWith('+') ? 'var(--positive)' : 'var(--negative)'} />
          <DrawerField label="Drawdown" value={row.drawdown} mono accent="var(--negative)" />
          <DrawerField label="Daily Loss" value={row.dailyLoss} accent={row.dailyLoss === 'OK' ? 'var(--positive)' : 'var(--negative)'} />
          <DrawerField label="Risk" value={row.risk} accent={STATUS_COLOR[row.risk] ?? 'var(--text-muted)'} />
        </div>
      </div>
      <div>
        <SectionHead title="Compliance" Icon={ShieldCheck} />
        <div className="grid grid-cols-2 gap-2">
          <DrawerField label="KYC Status" value={row.kyc} accent={STATUS_COLOR[row.kyc]} />
          <DrawerField label="Reviewed By" value={row.reviewedBy} />
          <DrawerField label="Current Status" value={row.status} accent={STATUS_COLOR[row.status]} wide />
        </div>
      </div>
      <div>
        <SectionHead title="PnL Trend (Simulated)" Icon={TrendingUp} />
        <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.02] p-3 h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[{ d: 1, v: 0 }, { d: 2, v: 1.2 }, { d: 3, v: 0.8 }, { d: 4, v: 2.1 }, { d: 5, v: 1.9 }, { d: 6, v: 3.4 }, { d: 7, v: row.profit?.startsWith('+') ? parseFloat(row.profit) : -1 }]}>
              <defs>
                <linearGradient id="evGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="var(--brand)" strokeWidth={1.5} fill="url(#evGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <IconBtn label="Approve" Icon={CheckCircle2} variant="success" onClick={() => { onAction('Approved', row.id); onClose(); }} />
        <IconBtn label="Reject" Icon={XCircle} variant="danger" onClick={() => { onAction('Rejected', row.id); onClose(); }} />
        <IconBtn label="Flag Review" Icon={Flag} variant="warning" onClick={() => { onAction('Flagged', row.id); onClose(); }} />
        <IconBtn label="Request KYC" Icon={ShieldCheck} variant="cyan" onClick={() => { onAction('KYC Sent', row.id); onClose(); }} />
      </div>
    </AdminDrawer>
  );
}

export function FundedDrawer({ row, open, onClose, onAction }) {
  if (!row) return null;
  const pnlPos = row.pnl?.startsWith('+');
  return (
    <AdminDrawer 
      open={open} 
      onClose={onClose} 
      title={row.id}
      subtitle={`${row.trader} · ${row.uid}`}
      eyebrow="Funded Account"
      width="max-w-[480px]"
    >
      <div>
        <SectionHead title="Account Identity" Icon={UserCheck} />
        <div className="grid grid-cols-2 gap-2">
          <DrawerField label="Account ID" value={row.id} mono copyable />
          <DrawerField label="Trader" value={row.trader} copyable />
          <DrawerField label="UID" value={row.uid} mono copyable />
          <DrawerField label="Funded Since" value={row.since} mono />
          <DrawerField label="Funded Amount" value={row.funded} mono accent="var(--brand)" />
          <DrawerField label="Max DD Limit" value={row.maxDD} mono />
        </div>
      </div>
      <div>
        <SectionHead title="Performance" Icon={BarChart2} />
        <div className="grid grid-cols-2 gap-2">
          <DrawerField label="Current PnL" value={row.pnl} mono accent={pnlPos ? 'var(--positive)' : 'var(--negative)'} />
          <DrawerField label="PnL %" value={row.pnlPct} mono accent={pnlPos ? 'var(--positive)' : 'var(--negative)'} />
          <DrawerField label="Drawdown" value={row.drawdown} mono accent="var(--negative)" />
          <DrawerField label="Risk Level" value={row.risk} accent={STATUS_COLOR[row.risk] ?? 'var(--text-muted)'} />
        </div>
      </div>
      <div>
        <SectionHead title="Payout" Icon={CircleDollarSign} />
        <div className="grid grid-cols-2 gap-2">
          <DrawerField label="Payout Amount" value={row.payout ?? 'N/A'} mono accent="var(--brand)" />
          <DrawerField label="Payout Eligible" value={row.payoutReady ? 'YES' : 'NO'} accent={row.payoutReady ? 'var(--positive)' : 'var(--negative)'} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {row.payoutReady && <IconBtn label="Approve Payout" Icon={CircleDollarSign} variant="success" onClick={() => { onAction('Payout Approved', row.id); onClose(); }} />}
        <IconBtn label="Warn Trader" Icon={AlertTriangle} variant="warning" onClick={() => { onAction('Warning Sent', row.id); onClose(); }} />
        <IconBtn label="Suspend Account" Icon={Lock} variant="danger" onClick={() => { onAction('Account Suspended', row.id); onClose(); }} />
        <IconBtn label="View Full Profile" Icon={Eye} variant="default" onClick={onClose} />
      </div>
    </AdminDrawer>
  );
}
