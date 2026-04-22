import React, { useState } from 'react';
import { CheckCircle2, XCircle, Flag, ShieldCheck, CircleDollarSign, AlertTriangle, Lock, Eye } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { StatusChip } from '../../../components/ui';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { DrawerSection, DrawerField, DrawerGrid, TextareaField } from '../../../components/overlays/DrawerUI';
import { Button } from '../../../components/ui/Button';
import { STATUS_COLOR } from './PropTradingShared';

/* ─── Evaluation Drawer ──────────────────────────────────────── */
export function EvaluationDrawer({ row, open, onClose, onAction }) {
  const [note, setNote] = useState('');

  if (!row) return null;
  return (
    <AdminDrawer
      open={open}
      onClose={onClose}
      title={row.id}
      subtitle={`${row.trader} · ${row.challenge}`}
      eyebrow="Evaluation Request"
      width="max-w-[520px]"
      footer={(
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="success"
              onClick={() => { onAction('Approved', row.id); onClose(); }}
              className="flex-1"
            >
              Approve
            </Button>
            <Button
              variant="danger"
              onClick={() => { onAction('Rejected', row.id); onClose(); }}
              className="flex-1"
            >
              Reject
            </Button>
            <Button
              variant="warning"
              onClick={() => { onAction('Flagged', row.id); onClose(); }}
              className="flex-1"
            >
              Flag Review
            </Button>
            <Button
              variant="secondary"
              onClick={() => { onAction('KYC Sent', row.id); onClose(); }}
              className="flex-1"
            >
              Request KYC
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2">
            <StatusChip value={row.status} colorMap={STATUS_COLOR} />
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={onClose}>Close</Button>
              <Button variant="primary" onClick={() => { onAction('Review Complete', row.id); onClose(); }}>
                Finish Review
              </Button>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-5">
        <DrawerSection title="Applicant">
          <DrawerGrid>
            <DrawerField label="Trader"      value={row.trader}   />
            <DrawerField label="UID"         value={row.uid}      mono />
            <DrawerField label="Challenge"   value={row.challenge} />
            <DrawerField label="Phase"       value={row.phase} />
            <DrawerField label="Applied"     value={row.ts}       mono />
            <DrawerField label="Days Active" value={`${row.days} days`} mono />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Performance">
          <DrawerGrid>
            <DrawerField label="Profit"     value={row.profit}    mono accent={row.profit?.startsWith('+') ? 'var(--positive)' : 'var(--negative)'} />
            <DrawerField label="Drawdown"   value={row.drawdown}  mono accent="var(--negative)" />
            <DrawerField label="Daily Loss" value={row.dailyLoss} accent={row.dailyLoss === 'OK' ? 'var(--positive)' : 'var(--negative)'} />
            <DrawerField label="Risk"       value={row.risk}      accent={STATUS_COLOR[row.risk] ?? 'var(--text-muted)'} />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Compliance">
          <DrawerGrid>
            <DrawerField label="KYC Status"     value={row.kyc}          accent={STATUS_COLOR[row.kyc]} />
            <DrawerField label="Reviewed By"    value={row.reviewedBy} />
            <DrawerField label="Current Status" value={row.status}       accent={STATUS_COLOR[row.status]} className="col-span-2" />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="PnL Trend (Simulated)" collapsible>
          <div className="rounded-[10px] border border-border/20 bg-bg/60 p-3 h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{d:1,v:0},{d:2,v:1.2},{d:3,v:0.8},{d:4,v:2.1},{d:5,v:1.9},{d:6,v:3.4},{d:7,v:row.profit?.startsWith('+') ? parseFloat(row.profit) : -1}]}>
                <defs>
                  <linearGradient id="evGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--brand)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="var(--brand)" strokeWidth={1.5} fill="url(#evGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DrawerSection>

        <DrawerSection title="Internal Notes" collapsible>
          <TextareaField
            label="Operator Investigation Note"
            value={note}
            onChange={setNote}
            placeholder="Add evaluation remarks or compliance exceptions..."
            rows={4}
          />
        </DrawerSection>
      </div>
    </AdminDrawer>
  );
}

/* ─── Funded Account Drawer ──────────────────────────────────── */
export function FundedDrawer({ row, open, onClose, onAction }) {
  const [note, setNote] = useState('');

  if (!row) return null;
  const pnlPos = row.pnl?.startsWith('+');
  return (
    <AdminDrawer
      open={open}
      onClose={onClose}
      title={row.id}
      subtitle={`${row.trader} · ${row.uid}`}
      eyebrow="Funded Account"
      width="max-w-[520px]"
      footer={(
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {row.payoutReady && (
              <Button
                variant="success"
                onClick={() => { onAction('Payout Approved', row.id); onClose(); }}
                className="flex-1"
              >
                Approve Payout
              </Button>
            )}
            <Button
              variant="warning"
              onClick={() => { onAction('Warning Sent', row.id); onClose(); }}
              className="flex-1"
            >
              Warn Trader
            </Button>
            <Button
              variant="danger"
              onClick={() => { onAction('Account Suspended', row.id); onClose(); }}
              className="flex-1"
            >
              Suspend Account
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2">
            <StatusChip value={row.risk} colorMap={STATUS_COLOR} />
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={onClose}>Close</Button>
              <Button variant="primary">Access Platform</Button>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-5">
        <DrawerSection title="Account Identity">
          <DrawerGrid>
            <DrawerField label="Account ID"    value={row.id}     mono />
            <DrawerField label="Trader"        value={row.trader} />
            <DrawerField label="UID"           value={row.uid}    mono />
            <DrawerField label="Funded Since"  value={row.since}  mono />
            <DrawerField label="Funded Amount" value={row.funded} mono accent="var(--brand)" />
            <DrawerField label="Max DD Limit"  value={row.maxDD}  mono />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Performance">
          <DrawerGrid>
            <DrawerField label="Current PnL" value={row.pnl}      mono accent={pnlPos ? 'var(--positive)' : 'var(--negative)'} />
            <DrawerField label="PnL %"       value={row.pnlPct}   mono accent={pnlPos ? 'var(--positive)' : 'var(--negative)'} />
            <DrawerField label="Drawdown"    value={row.drawdown} mono accent="var(--negative)" />
            <DrawerField label="Risk Level"  value={row.risk}          accent={STATUS_COLOR[row.risk] ?? 'var(--text-muted)'} />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Payout">
          <DrawerGrid>
            <DrawerField label="Payout Amount"   value={row.payout ?? 'N/A'} mono accent="var(--brand)" />
            <DrawerField label="Payout Eligible" value={row.payoutReady ? 'YES' : 'NO'} accent={row.payoutReady ? 'var(--positive)' : 'var(--negative)'} />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Internal Notes" collapsible>
          <TextareaField
            label="Account Monitoring Notes"
            value={note}
            onChange={setNote}
            placeholder="Record any warnings, communication, or notes..."
            rows={4}
          />
        </DrawerSection>
      </div>
    </AdminDrawer>
  );
}
