import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { StatusBadge } from '../../../components/feedback/StatusBadge';
import { DrawerField, DrawerGrid, DrawerSection } from '../../../components/overlays/DrawerUI';


export function UserDetailContent({ user, activeTab }) {
  if (activeTab === 'overview') {
    return (
      <div className="space-y-4">
        {user.suspended && (
          <InlineAlert tone="warning" title="Account suspended">
            Trading and treasury actions should remain locked until an operator removes the suspension.
          </InlineAlert>
        )}
        <DrawerGrid cols={3}>
          <DrawerField label="Wallet Balance" value={user.walletBalance} mono />
          <DrawerField label="Equity" value={user.equity} mono />
          <DrawerField label="30d PnL" value={user.pnl30d || '$0'} mono />
        </DrawerGrid>
        <DrawerGrid>
          <DrawerField label="KYC Status" value={user.kycStatus} />
          <DrawerField label="Risk Level" value={user.riskStatus} />
          <DrawerField label="Segment" value={user.segment} />
          <DrawerField label="Tier" value={user.tier} />
          <DrawerField label="MT5 Accounts" value={`${user.mt5Accounts} accounts`} />
          <DrawerField label="Open Positions" value={`${user.openPositions} positions`} />
        </DrawerGrid>
        <InlineAlert tone="info" title="Operator Summary">
          {user.notesSummary}
        </InlineAlert>
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div className="space-y-4">
        <DrawerSection title="Profile" />
        <DrawerGrid>
          <DrawerField label="Full Name" value={user.name} />
          <DrawerField label="Email" value={user.email} />
          <DrawerField label="Phone" value={user.phone} />
          <DrawerField label="Country" value={user.country} mono />
          <DrawerField label="Source" value={user.source} />
          <DrawerField label="Registered" value={user.registered} mono />
          <DrawerField label="Last Seen" value={user.lastSeen} mono />
          <DrawerField label="Address" value={user.address} />
        </DrawerGrid>
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
        <DrawerGrid>
          <DrawerField label="Review Level" value={user.kyc?.level} />
          <DrawerField label="Submitted" value={user.kyc?.submittedAt} mono />
          <DrawerField label="Reviewer" value={user.kyc?.reviewer} />
          <DrawerField label="Status" value={user.kyc?.status} />
        </DrawerGrid>
        <div className="rounded-[12px] border border-border/25 bg-bg/50 shadow-card-subtle p-4">
          <DrawerSection title="Documents" />
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
        <DrawerSection title="Wallet" />
        <div className="space-y-2">
          {(user.wallet ?? []).length > 0 ? (
            user.wallet.map((asset) => (
              <DrawerGrid cols={4}>
                <DrawerField label="Asset" value={asset.asset} />
                <DrawerField label="Balance" value={asset.balance} mono />
                <DrawerField label="Available" value={asset.available} mono />
                <DrawerField label="Hold" value={asset.hold} mono />
              </DrawerGrid>
            ))
          ) : (
            <div className="rounded-[12px] border border-border/25 bg-bg/60 shadow-card-subtle p-4 text-[13px] text-text-muted">
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
        <DrawerSection title="MT5 Accounts" />
        <div className="space-y-3">
          {(user.mt5 ?? []).length > 0 ? (
            user.mt5.map((account) => (
              <div key={account.login} className="rounded-[12px] border border-border/25 bg-bg/60 shadow-card-subtle p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-[14px] font-semibold text-text">{account.login}</div>
                    <div className="mt-1 text-[12px] text-text-muted">{account.server}</div>
                  </div>
                  <StatusBadge status={account.status} />
                </div>
                <DrawerGrid>
                  <DrawerField label="Group" value={account.group} mono />
                  <DrawerField label="Leverage" value={account.leverage} />
                  <DrawerField label="Equity" value={account.equity} mono />
                  <DrawerField label="Margin Level" value={account.marginLevel} />
                  <DrawerField label="Last Sync" value={account.lastSync} mono className="col-span-2" />
                </DrawerGrid>
              </div>
            ))
          ) : (
            <div className="rounded-[12px] border border-border/25 bg-bg/60 shadow-card-subtle p-4 text-[13px] text-text-muted">
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
        <DrawerSection title="Trading History" />
        <div className="space-y-3">
          {(user.tradingHistory ?? []).length > 0 ? (
            user.tradingHistory.map((trade) => (
              <div key={trade.ticket} className="rounded-[12px] border border-border/25 bg-bg/60 shadow-card-subtle p-4">
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
                <DrawerGrid cols={4}>
                  <DrawerField label="Lots" value={trade.lots} mono />
                  <DrawerField label="Open" value={trade.open} mono />
                  <DrawerField label="Close" value={trade.close} mono />
                  <DrawerField label="Time" value={trade.time} mono />
                </DrawerGrid>
              </div>
            ))
          ) : (
            <div className="rounded-[12px] border border-border/25 bg-bg/60 shadow-card-subtle p-4 text-[13px] text-text-muted">
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
        <DrawerSection title="Activity Logs" />
        <div className="space-y-3">
          {(user.activity ?? []).length > 0 ? (
            user.activity.map((item, index) => (
              <div key={`${item.time}-${index}`} className="rounded-[12px] border border-border/25 bg-bg/60 shadow-card-subtle p-4">
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
            <div className="rounded-[12px] border border-border/25 bg-bg/60 shadow-card-subtle p-4 text-[13px] text-text-muted">
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
        <DrawerGrid>
          <DrawerField label="Risk Score" value={user.risk?.score} />
          <DrawerField label="Exposure" value={user.risk?.exposure} mono />
          <DrawerField label="Concentration" value={user.risk?.concentration} />
          <DrawerField label="Drawdown" value={user.risk?.drawdown} />
        </DrawerGrid>
        <div className="rounded-[12px] border border-border/25 bg-bg/50 shadow-card-subtle p-4">
          <DrawerSection title="Alerts" />
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
      <DrawerSection title="Internal Notes" />
      <div className="space-y-3">
        {(user.notes ?? []).length > 0 ? (
          user.notes.map((note) => (
            <div key={note.id} className="rounded-[12px] border border-border/25 bg-bg/60 shadow-card-subtle p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-[13px] font-semibold text-text">{note.author}</div>
                <span className="font-mono text-[11px] text-text-muted/75">{note.time}</span>
              </div>
              <p className="mt-3 text-[13px] leading-6 text-text-muted">{note.text}</p>
            </div>
          ))
        ) : (
          <div className="rounded-[12px] border border-border/25 bg-bg/60 shadow-card-subtle p-4 text-[13px] text-text-muted">
            No internal notes have been written for this user.
          </div>
        )}
      </div>
    </div>
  );
}
