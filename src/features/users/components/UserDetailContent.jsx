import React from 'react';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { StatusBadge } from '../../../components/feedback/StatusBadge';

function InfoCell({ label, value, mono = false }) {
  return (
    <div className="rounded-[10px] border border-border/25 bg-bg/60 px-3 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/50">{label}</div>
      <div className={`mt-1 text-[13px] text-text ${mono ? 'font-mono' : ''}`}>{value || 'N/A'}</div>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="space-y-1">
      <h4 className="text-[14px] font-semibold text-text">{title}</h4>
      {subtitle && <p className="text-[12px] leading-6 text-text-muted">{subtitle}</p>}
    </div>
  );
}

export function UserDetailContent({ user, activeTab }) {
  if (activeTab === 'overview') {
    return (
      <div className="space-y-4">
        {user.suspended && (
          <InlineAlert tone="warning" title="Account suspended">
            Trading and treasury actions should remain locked until an operator removes the suspension.
          </InlineAlert>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <InfoCell label="Wallet Balance" value={user.walletBalance} mono />
          <InfoCell label="Equity" value={user.equity} mono />
          <InfoCell label="30d PnL" value={user.pnl30d || '$0'} mono />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoCell label="KYC Status" value={user.kycStatus} />
          <InfoCell label="Risk Level" value={user.riskStatus} />
          <InfoCell label="Segment" value={user.segment} />
          <InfoCell label="Tier" value={user.tier} />
          <InfoCell label="MT5 Accounts" value={`${user.mt5Accounts} accounts`} />
          <InfoCell label="Open Positions" value={`${user.openPositions} positions`} />
        </div>
        <InlineAlert tone="info" title="Operator Summary">
          {user.notesSummary}
        </InlineAlert>
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div className="space-y-4">
        <SectionTitle title="Profile" subtitle="Identity, contact, and origin data for this user." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoCell label="Full Name" value={user.name} />
          <InfoCell label="Email" value={user.email} />
          <InfoCell label="Phone" value={user.phone} />
          <InfoCell label="Country" value={user.country} mono />
          <InfoCell label="Source" value={user.source} />
          <InfoCell label="Registered" value={user.registered} mono />
          <InfoCell label="Last Seen" value={user.lastSeen} mono />
          <InfoCell label="Address" value={user.address} />
        </div>
      </div>
    );
  }

  if (activeTab === 'kyc') {
    return (
      <div className="space-y-4">
        <InlineAlert
          tone={user.kycStatus === 'VERIFIED' ? 'success' : user.kycStatus === 'REJECTED' ? 'danger' : 'warning'}
          title={`KYC ${user.kycStatus}`}
        >
          {user.kycStatus === 'VERIFIED'
            ? 'All required documents have been approved and the onboarding record is clear.'
            : user.kycStatus === 'REJECTED'
              ? 'The latest verification package failed review and needs a resubmission.'
              : 'The case is waiting for compliance action before user permissions can expand.'}
        </InlineAlert>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoCell label="Review Level" value={user.kyc?.level} />
          <InfoCell label="Submitted" value={user.kyc?.submittedAt} mono />
          <InfoCell label="Reviewer" value={user.kyc?.reviewer} />
          <InfoCell label="Status" value={user.kyc?.status} />
        </div>
        <div className="rounded-[12px] border border-border/25 bg-bg/50 p-4">
          <SectionTitle title="Documents" subtitle="Submitted evidence and AML notes." />
          <div className="mt-4 space-y-2">
            {(user.kyc?.documents ?? []).length > 0 ? (
              user.kyc.documents.map((documentName) => (
                <div key={documentName} className="flex items-center justify-between rounded-[10px] border border-border/20 bg-bg/70 px-3 py-2">
                  <span className="text-[13px] text-text">{documentName}</span>
                  <StatusBadge status="RECEIVED" />
                </div>
              ))
            ) : (
              <p className="text-[13px] text-text-muted">No documents have been attached yet.</p>
            )}
          </div>
          <p className="mt-4 text-[13px] leading-6 text-text-muted">{user.kyc?.aml}</p>
        </div>
      </div>
    );
  }

  if (activeTab === 'wallet') {
    return (
      <div className="space-y-4">
        <SectionTitle title="Wallet" subtitle="Balances, available funds, and holds across the user's assets." />
        <div className="space-y-2">
          {(user.wallet ?? []).length > 0 ? (
            user.wallet.map((asset) => (
              <div key={asset.asset} className="grid grid-cols-1 gap-3 rounded-[12px] border border-border/25 bg-bg/60 p-4 sm:grid-cols-4">
                <InfoCell label="Asset" value={asset.asset} />
                <InfoCell label="Balance" value={asset.balance} mono />
                <InfoCell label="Available" value={asset.available} mono />
                <InfoCell label="Hold" value={asset.hold} mono />
              </div>
            ))
          ) : (
            <div className="rounded-[12px] border border-border/25 bg-bg/60 p-4 text-[13px] text-text-muted">
              No wallet balances are available yet.
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'mt5-accounts') {
    return (
      <div className="space-y-4">
        <SectionTitle title="MT5 Accounts" subtitle="Linked accounts, server placement, and sync health." />
        <div className="space-y-3">
          {(user.mt5 ?? []).length > 0 ? (
            user.mt5.map((account) => (
              <div key={account.login} className="rounded-[12px] border border-border/25 bg-bg/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-[14px] font-semibold text-text">{account.login}</div>
                    <div className="mt-1 text-[12px] text-text-muted">{account.server}</div>
                  </div>
                  <StatusBadge status={account.status} />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InfoCell label="Group" value={account.group} mono />
                  <InfoCell label="Leverage" value={account.leverage} />
                  <InfoCell label="Equity" value={account.equity} mono />
                  <InfoCell label="Margin Level" value={account.marginLevel} />
                  <InfoCell label="Last Sync" value={account.lastSync} mono />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[12px] border border-border/25 bg-bg/60 p-4 text-[13px] text-text-muted">
              No MT5 accounts are linked yet.
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'trading-history') {
    return (
      <div className="space-y-4">
        <SectionTitle title="Trading History" subtitle="Most recent trades and settlement outcomes." />
        <div className="space-y-3">
          {(user.tradingHistory ?? []).length > 0 ? (
            user.tradingHistory.map((trade) => (
              <div key={trade.ticket} className="rounded-[12px] border border-border/25 bg-bg/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-[13px] text-text-muted">{trade.ticket}</div>
                    <div className="mt-1 text-[14px] font-semibold text-text">{trade.symbol}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={trade.side} dot={false} />
                    <span className={`font-mono text-[13px] font-semibold ${String(trade.pnl).startsWith('-') ? 'text-negative' : 'text-positive'}`}>
                      {trade.pnl}
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
                  <InfoCell label="Lots" value={trade.lots} mono />
                  <InfoCell label="Open" value={trade.open} mono />
                  <InfoCell label="Close" value={trade.close} mono />
                  <InfoCell label="Time" value={trade.time} mono />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[12px] border border-border/25 bg-bg/60 p-4 text-[13px] text-text-muted">
              No trade history is available for this user.
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'activity-logs') {
    return (
      <div className="space-y-4">
        <SectionTitle title="Activity Logs" subtitle="System and operator events tied to this record." />
        <div className="space-y-3">
          {(user.activity ?? []).length > 0 ? (
            user.activity.map((item, index) => (
              <div key={`${item.time}-${index}`} className="rounded-[12px] border border-border/25 bg-bg/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-semibold text-text">{item.action}</div>
                    <div className="mt-1 text-[12px] text-text-muted">{item.actor} via {item.channel}</div>
                  </div>
                  <span className="font-mono text-[11px] text-text-muted/75">{item.time}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[12px] border border-border/25 bg-bg/60 p-4 text-[13px] text-text-muted">
              No activity has been recorded yet.
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'risk-view') {
    return (
      <div className="space-y-4">
        <InlineAlert
          tone={user.riskStatus === 'LOW' ? 'info' : user.riskStatus === 'WATCHLIST' ? 'warning' : 'danger'}
          title={`Risk ${user.riskStatus}`}
        >
          Review concentration, drawdown, and operator notes before approving sensitive treasury or leverage changes.
        </InlineAlert>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoCell label="Risk Score" value={user.risk?.score} />
          <InfoCell label="Exposure" value={user.risk?.exposure} mono />
          <InfoCell label="Concentration" value={user.risk?.concentration} />
          <InfoCell label="Drawdown" value={user.risk?.drawdown} />
        </div>
        <div className="rounded-[12px] border border-border/25 bg-bg/50 p-4">
          <SectionTitle title="Alerts" subtitle="Flags that should remain visible to operators." />
          <div className="mt-4 space-y-2">
            {(user.risk?.alerts ?? []).length > 0 ? (
              user.risk.alerts.map((alert) => (
                <div key={alert} className="rounded-[10px] border border-negative/20 bg-negative/5 px-3 py-2 text-[13px] text-negative">
                  {alert}
                </div>
              ))
            ) : (
              <p className="text-[13px] text-text-muted">No active risk alerts.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SectionTitle title="Internal Notes" subtitle="Recent operator notes attached to the user record." />
      <div className="space-y-3">
        {(user.notes ?? []).length > 0 ? (
          user.notes.map((note) => (
            <div key={note.id} className="rounded-[12px] border border-border/25 bg-bg/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-[13px] font-semibold text-text">{note.author}</div>
                <span className="font-mono text-[11px] text-text-muted/75">{note.time}</span>
              </div>
              <p className="mt-3 text-[13px] leading-6 text-text-muted">{note.text}</p>
            </div>
          ))
        ) : (
          <div className="rounded-[12px] border border-border/25 bg-bg/60 p-4 text-[13px] text-text-muted">
            No internal notes have been written for this user.
          </div>
        )}
      </div>
    </div>
  );
}
