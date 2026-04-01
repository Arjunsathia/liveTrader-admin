import React, { useState } from 'react';
import {
  AlertTriangle, Check, CheckCircle2, Copy, Download, Edit2, Eye, FileText,
  Flag, MessageSquare, Monitor, Plus, Send, Shield, ShieldCheck, Terminal, X, XCircle, BarChart2
} from 'lucide-react';
import { Field, SectionLabel, ActionBtn } from '../shared/UserDetailShared';

export function TabOverview({ user }) {
  return (
    <div className="space-y-4">
      <SectionLabel>Account Details</SectionLabel>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Segment" value={user.segment} />
        <Field label="Tier" value={user.tier} />
        <Field label="Country" value={user.country} />
        <Field label="Source" value={user.source} />
        <Field label="Registered" value={user.registered} mono />
        <Field label="Last Seen" value={user.lastSeen} />
        <Field label="Funding State" value={user.fundingState} />
        <Field label="Referral / IB" value={user.referral} mono />
      </div>

      <SectionLabel>Wallet Snapshot</SectionLabel>
      <div className="grid grid-cols-3 gap-2.5">
        <Field label="Balance" value={user.walletBalance} accent="var(--brand)" mono />
        <Field label="Equity" value={user.equity} accent="var(--positive)" mono />
        <Field label="Free Margin" value={user.freeMargin} accent="var(--cyan)" mono />
      </div>

      <SectionLabel>Operator Notes</SectionLabel>
      <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle p-3.5">
        <p className="text-[12px] leading-5 text-text-muted/80">{user.notesSummary}</p>
      </div>
      {user.risk.alerts.length > 0 && (
        <div className="space-y-2">
          {user.risk.alerts.map((alert, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-[8px] border border-[var(--warning)]/25 bg-[var(--warning)]/06 px-3 py-2.5"
            >
              <AlertTriangle size={12} className="mt-0.5 flex-shrink-0 text-[var(--warning)]" />
              <span className="text-[12px] leading-5 text-[var(--warning)]/85">{alert}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TabProfile({ user }) {
  return (
    <div className="space-y-4">
      <SectionLabel>Personal Information</SectionLabel>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Full Name" value={user.name} wide />
        <Field label="Email" value={user.email} wide />
        <Field label="Phone" value={user.phone} />
        <Field label="Country" value={user.country} />
        <Field label="Address" value={user.address} wide />
        <Field label="Timezone" value={user.timezone} />
        <Field label="Referral" value={user.referral} mono />
      </div>

      <SectionLabel>Account Classification</SectionLabel>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Segment" value={user.segment} />
        <Field label="Tier" value={user.tier} />
        <Field label="Source" value={user.source} />
        <Field label="Registered" value={user.registered} mono />
        <Field label="Funding State" value={user.fundingState} />
        <Field label="UID" value={user.uid} mono />
      </div>

      <SectionLabel>Actions</SectionLabel>
      <div className="flex flex-wrap gap-2">
        <ActionBtn label="Edit Profile" Icon={Edit2} variant="primary" />
        <ActionBtn label="Reset Password" Icon={Send} />
        <ActionBtn label="Send Email" Icon={Send} />
        <ActionBtn label="Copy UID" Icon={Copy} />
      </div>
    </div>
  );
}

export function TabKyc({ user }) {
  const { kyc } = user;
  const statusColor = {
    VERIFIED: 'var(--positive)', PENDING: 'var(--warning)', REJECTED: 'var(--negative)', UNDER_REVIEW: 'var(--cyan)',
  }[kyc.status] ?? '#888';

  return (
    <div className="space-y-4">
      <div
        className="flex items-center justify-between gap-3 rounded-[10px] border px-4 py-3"
        style={{ borderColor: `${statusColor}30`, background: `${statusColor}0c` }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: `${statusColor}20` }}
          >
            {kyc.status === 'VERIFIED'
              ? <CheckCircle2 size={16} style={{ color: statusColor }} />
              : kyc.status === 'REJECTED'
                ? <XCircle size={16} style={{ color: statusColor }} />
                : <ShieldCheck size={16} style={{ color: statusColor }} />}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text">KYC Status: {kyc.status}</div>
            <div className="text-[11px] text-text-muted/60">Level {kyc.level} verification · Submitted {kyc.submittedAt}</div>
          </div>
        </div>
        <div className="flex gap-2">
          {kyc.status !== 'VERIFIED' && <ActionBtn label="Approve" Icon={Check} variant="success" />}
          {kyc.status !== 'REJECTED' && <ActionBtn label="Reject" Icon={X} variant="danger" />}
        </div>
      </div>

      <SectionLabel>Review Details</SectionLabel>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Review Level" value={`Level ${kyc.level}`} />
        <Field label="Submitted" value={kyc.submittedAt} mono />
        <Field label="Reviewer" value={kyc.reviewer} />
        <Field label="Current Status" value={kyc.status} />
      </div>

      <SectionLabel>Documents</SectionLabel>
      <div className="space-y-2">
        {kyc.documents.map((doc) => (
          <div
            key={doc}
            className="flex items-center justify-between gap-3 rounded-[8px] border border-border/40 bg-surface-elevated shadow-card-subtle px-3.5 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <FileText size={13} className="text-text-muted/50" />
              <span className="text-[12px] font-medium text-text">{doc}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px]"
                style={{ color: 'var(--positive)', background: 'var(--positive)18' }}
              >
                RECEIVED
              </span>
              <button className="text-[11px] text-text-muted/50 hover:text-text transition-colors">
                <Eye size={12} />
              </button>
              <button className="text-[11px] text-text-muted/50 hover:text-text transition-colors">
                <Download size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <SectionLabel>AML / Compliance Notes</SectionLabel>
      <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle p-3.5">
        <p className="text-[12px] leading-5 text-text-muted/80">{kyc.aml}</p>
      </div>
    </div>
  );
}

export function TabWallet({ user }) {
  return (
    <div className="space-y-4">
      <SectionLabel>Balances</SectionLabel>
      <div className="grid grid-cols-3 gap-2.5">
        <Field label="Total Balance" value={user.walletBalance} accent="var(--brand)" mono />
        <Field label="Equity" value={user.equity} accent="var(--positive)" mono />
        <Field label="Margin Used" value={user.margin} accent="var(--warning)" mono />
        <Field label="Free Margin" value={user.freeMargin} accent="var(--cyan)" mono />
        <Field label="Margin Level" value={user.marginLevel} mono />
        <Field label="Funding State" value={user.fundingState} />
      </div>

      <SectionLabel>Asset Breakdown</SectionLabel>
      <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/20 bg-surface-elevated/50">
              {['Asset', 'Balance', 'Available', 'On Hold'].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/45">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {user.wallet.map((row) => (
              <tr key={row.asset} className="border-b border-border/10 hover:bg-surface-elevated/30 transition-colors">
                <td className="px-4 py-2.5 font-mono text-[12px] font-semibold text-text">{row.asset}</td>
                <td className="px-4 py-2.5 font-mono text-[12px] text-text">{row.balance}</td>
                <td className="px-4 py-2.5 font-mono text-[12px] text-[var(--positive)]">{row.available}</td>
                <td className="px-4 py-2.5 font-mono text-[12px] text-[var(--warning)]">{row.hold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionLabel>Transaction History</SectionLabel>
      <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/20 bg-surface-elevated/50">
              {['ID', 'Type', 'Method', 'Amount', 'Status', 'Date'].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/45">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {user.transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-border/10 hover:bg-surface-elevated/30 transition-colors">
                <td className="px-4 py-2.5 font-mono text-[11px] text-text-muted/60">{tx.id}</td>
                <td className="px-4 py-2.5 text-[12px] font-medium text-text">{tx.type}</td>
                <td className="px-4 py-2.5 text-[11px] text-text-muted/70">{tx.method}</td>
                <td
                  className="px-4 py-2.5 font-mono text-[12px] font-semibold"
                  style={{ color: tx.amount.startsWith('+') ? 'var(--positive)' : 'var(--negative)' }}
                >
                  {tx.amount}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px]"
                    style={{
                      color: tx.status === 'confirmed' || tx.status === 'approved' ? 'var(--positive)' : 'var(--warning)',
                      background: tx.status === 'confirmed' || tx.status === 'approved' ? 'var(--positive)18' : 'var(--warning)18',
                    }}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-text-muted/55">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionLabel>Wallet Actions</SectionLabel>
      <div className="flex flex-wrap gap-2">
        <ActionBtn label="Manual Deposit" variant="success" />
        <ActionBtn label="Manual Withdrawal" variant="danger" />
        <ActionBtn label="Export Statement" Icon={Download} />
      </div>
    </div>
  );
}

export function TabMt5({ user }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionLabel>Live Accounts</SectionLabel>
        <ActionBtn label="Create MT5 Account" Icon={Plus} variant="primary" />
      </div>

      {user.mt5.map((a) => (
        <div key={a.login} className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle p-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-border/25"
                style={{ background: 'var(--positive)1a' }}
              >
                <Monitor size={16} style={{ color: 'var(--positive)' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[14px] font-semibold text-text">#{a.login}</span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px]"
                    style={{ color: 'var(--positive)', background: 'var(--positive)18' }}
                  >
                    {a.status}
                  </span>
                </div>
                <div className="text-[11px] text-text-muted/60">{a.server} · {a.group}</div>
              </div>
            </div>
            <div className="flex gap-1.5">
              <ActionBtn label="Terminal" Icon={Terminal} />
              <ActionBtn label="Positions" Icon={BarChart2} />
              <ActionBtn label="Modify" Icon={Edit2} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <Field label="Leverage" value={a.leverage} />
            <Field label="Equity" value={a.equity} accent="var(--positive)" mono />
            <Field label="Margin Level" value={a.marginLevel} accent="var(--cyan)" mono />
            <Field label="Last Sync" value={a.lastSync} mono />
            <Field label="Server" value={a.server} />
            <Field label="Group" value={a.group} mono />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TabTrading({ user }) {
  return (
    <div className="space-y-4">
      <SectionLabel>Open Positions ({user.openTrades.length})</SectionLabel>
      <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/20 bg-surface-elevated/50">
              {['Ticket', 'Symbol', 'Dir', 'Lots', 'Open Price', 'Current', 'Floating P&L', 'Swap', 'Opened'].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted/45">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {user.openTrades.map((t) => (
              <tr key={t.ticket} className="border-b border-border/10 hover:bg-surface-elevated/30 transition-colors">
                <td className="px-3 py-2.5 font-mono text-[11px] text-text-muted/55">{t.ticket}</td>
                <td className="px-3 py-2.5 font-mono text-[12px] font-semibold text-text">{t.symbol}</td>
                <td className="px-3 py-2.5">
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-[3px]" style={{ color: t.side === 'BUY' ? 'var(--positive)' : 'var(--negative)', background: t.side === 'BUY' ? 'var(--positive)18' : 'var(--negative)18' }}>
                    {t.side}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-mono text-[12px] text-text-muted">{t.lots}</td>
                <td className="px-3 py-2.5 font-mono text-[12px] text-text-muted">{t.open}</td>
                <td className="px-3 py-2.5 font-mono text-[12px] text-text">{t.current}</td>
                <td className="px-3 py-2.5 font-mono text-[12px] font-semibold" style={{ color: t.pnl.startsWith('+') ? 'var(--positive)' : 'var(--negative)' }}>{t.pnl}</td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-text-muted/55">{t.swap}</td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-text-muted/55">{t.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionLabel>Closed Trades</SectionLabel>
      <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/20 bg-surface-elevated/50">
              {['Ticket', 'Symbol', 'Dir', 'Lots', 'Open', 'Close', 'P&L', 'Date'].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted/45">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {user.tradingHistory.map((t) => (
              <tr key={t.ticket} className="border-b border-border/10 hover:bg-surface-elevated/30 transition-colors">
                <td className="px-3 py-2.5 font-mono text-[11px] text-text-muted/55">{t.ticket}</td>
                <td className="px-3 py-2.5 font-mono text-[12px] font-semibold text-text">{t.symbol}</td>
                <td className="px-3 py-2.5">
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-[3px]" style={{ color: t.side === 'BUY' ? 'var(--positive)' : 'var(--negative)', background: t.side === 'BUY' ? 'var(--positive)18' : 'var(--negative)18' }}>
                    {t.side}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-mono text-[12px] text-text-muted">{t.lots}</td>
                <td className="px-3 py-2.5 font-mono text-[12px] text-text-muted">{t.open}</td>
                <td className="px-3 py-2.5 font-mono text-[12px] text-text-muted">{t.close}</td>
                <td className="px-3 py-2.5 font-mono text-[12px] font-semibold" style={{ color: t.pnl.startsWith('+') ? 'var(--positive)' : 'var(--negative)' }}>{t.pnl}</td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-text-muted/55">{t.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TabActivity({ user }) {
  const typeConfig = {
    auth: { color: 'var(--cyan)', label: 'AUTH' },
    finance: { color: 'var(--warning)', label: 'FINANCE' },
    kyc: { color: 'var(--purple)', label: 'KYC' },
    mt5: { color: 'var(--positive)', label: 'MT5' },
    admin: { color: 'var(--brand)', label: 'ADMIN' },
  };

  return (
    <div className="space-y-4">
      <SectionLabel>System & Operator Events</SectionLabel>
      <div className="space-y-2">
        {user.activity.map((a, i) => {
          const cfg = typeConfig[a.type] ?? { color: '#888', label: a.type.toUpperCase() };
          return (
            <div
              key={i}
              className="flex items-start gap-3 rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle px-4 py-3"
            >
              <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                <div className="h-2 w-2 rounded-full" style={{ background: cfg.color }} />
                {i < user.activity.length - 1 && (
                  <div className="w-px flex-1 bg-border/20 mt-1" style={{ height: '24px' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-[3px]"
                      style={{ color: cfg.color, background: `${cfg.color}18` }}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-[13px] font-medium text-text">{a.action}</span>
                  </div>
                  <span className="font-mono text-[11px] text-text-muted/45 flex-shrink-0">{a.time}</span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-text-muted/55">
                  <span>{a.channel}</span>
                  <span>·</span>
                  <span className="font-mono">{a.ip}</span>
                  <span>·</span>
                  <span>by {a.actor}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TabRisk({ user }) {
  const { risk } = user;
  const riskColor = { LOW: 'var(--positive)', WATCHLIST: 'var(--warning)', ELEVATED: 'var(--negative)', FLAGGED: 'var(--negative)' }[risk.level] ?? '#888';

  return (
    <div className="space-y-4">
      <div
        className="flex items-center gap-4 rounded-[10px] border px-4 py-3.5"
        style={{ borderColor: `${riskColor}30`, background: `${riskColor}0a` }}
      >
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
          style={{ background: `${riskColor}1a` }}
        >
          <Shield size={18} style={{ color: riskColor }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-text">Risk Level: {risk.level}</span>
            <span
              className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-[5px]"
              style={{ color: riskColor, background: `${riskColor}18` }}
            >
              Score {risk.score}
            </span>
          </div>
          <div className="text-[11px] text-text-muted/60 mt-0.5">
            Last assessed: 1 week ago · Next review: quarterly
          </div>
        </div>
        <ActionBtn label="Escalate" Icon={Flag} variant="danger" />
      </div>

      <SectionLabel>Risk Metrics</SectionLabel>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Risk Score" value={risk.score} />
        <Field label="Risk Level" value={risk.level} accent={riskColor} />
        <Field label="Exposure" value={risk.exposure} mono />
        <Field label="Concentration" value={risk.concentration} />
        <Field label="Max Drawdown" value={risk.drawdown} accent="var(--negative)" mono />
        <Field label="Margin Level" value={user.marginLevel} accent="var(--cyan)" mono />
      </div>

      <SectionLabel>Active Alerts</SectionLabel>
      {risk.alerts.length > 0 ? (
        <div className="space-y-2">
          {risk.alerts.map((alert, i) => (
            <div key={i} className="flex items-start justify-between gap-3 rounded-[9px] border border-[var(--warning)]/25 bg-[var(--warning)]/06 px-3.5 py-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={13} className="mt-0.5 flex-shrink-0 text-[var(--warning)]" />
                <span className="text-[12px] leading-5 text-[var(--warning)]/85">{alert}</span>
              </div>
              <button className="flex-shrink-0 rounded-[5px] border border-border/30 px-2 py-0.5 text-[10px] font-semibold text-text-muted hover:text-text transition-colors">
                Dismiss
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[9px] border border-[var(--positive)]/20 bg-[var(--positive)]/06 px-4 py-3 flex items-center gap-2.5">
          <CheckCircle2 size={14} className="text-[var(--positive)]" />
          <span className="text-[12px] text-[var(--positive)]/80">No active risk alerts.</span>
        </div>
      )}

      <SectionLabel>Compliance Notes</SectionLabel>
      <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle p-3.5">
        <p className="text-[12px] leading-5 text-text-muted/80">{risk.compliance}</p>
      </div>

      <SectionLabel>Risk Actions</SectionLabel>
      <div className="flex flex-wrap gap-2">
        <ActionBtn label="Flag for Review" Icon={Flag} variant="danger" />
        <ActionBtn label="Watchlist" Icon={Eye} variant="primary" />
        <ActionBtn label="Add Note" Icon={MessageSquare} />
        <ActionBtn label="Export Report" Icon={Download} />
      </div>
    </div>
  );
}

export function TabNotes({ user }) {
  const [newNote, setNewNote] = useState('');

  return (
    <div className="space-y-4">
      <SectionLabel>Internal CRM Notes</SectionLabel>
      <div className="space-y-3">
        {user.notes.map((note, i) => (
          <div key={i} className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold"
                  style={{ background: 'var(--brand)', color: '#000' }}
                >
                  {note.author[0].toUpperCase()}
                </div>
                <span className="text-[12px] font-semibold text-text">{note.author}</span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-[3px]" style={{ color: 'var(--purple)', background: 'var(--purple)18' }}>
                  INTERNAL
                </span>
              </div>
              <span className="font-mono text-[11px] text-text-muted/45">{note.time}</span>
            </div>
            <p className="text-[12px] leading-5 text-text-muted/80">{note.text}</p>
          </div>
        ))}
      </div>

      <SectionLabel>Add Note</SectionLabel>
      <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle p-4 space-y-3">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Type an internal note, support remark, or investigation comment…"
          rows={4}
          className="w-full rounded-[8px] border border-border/40 bg-bg px-3 py-2.5 text-[12px] text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-border/60 resize-none"
        />
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-text-muted/45">Note will be tagged with your operator ID and timestamp.</span>
          <button
            onClick={() => setNewNote('')}
            disabled={!newNote.trim()}
            className="flex h-8 items-center gap-1.5 rounded-[7px] px-4 text-[12px] font-semibold transition-all disabled:opacity-35"
            style={{ background: 'var(--brand)', color: '#000' }}
          >
            <Send size={12} />
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
