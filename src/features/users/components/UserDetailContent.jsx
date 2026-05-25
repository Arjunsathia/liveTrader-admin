import React from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Cpu, 
  Landmark, 
  Clock, 
  FileText, 
  ArrowDownRight, 
  ArrowUpRight, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { StatusBadge } from '../../../components/ui';
import { DrawerField, DrawerFormGrid, DrawerSection } from '../../../components/common/drawer';

export function UserDetailContent({ user, activeTab, onUpdateUser }) {
  
  // ── 1. OVERVIEW TAB ──
  if (activeTab === 'overview') {
    const isPnLNegative = String(user.pnl30d).startsWith('-');

    return (
      <div className="space-y-5 animate-fade-up">
        {user.suspended && (
          <div className="flex items-start gap-3 rounded-[10px] border border-negative/20 bg-negative/[0.04] p-3.5">
            <AlertCircle size={14} className="text-negative mt-0.5 shrink-0" />
            <div>
              <h4 className="text-[12px] font-bold text-negative">Administrative Suspension Active</h4>
              <p className="text-[11px] text-negative/70 mt-0.5 leading-relaxed">
                Trading capabilities, API access, and wallet withdrawals are locked until review completion.
              </p>
            </div>
          </div>
        )}

        <DrawerSection title="Financial Ledger Overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            
            {/* Wallet Balance Card */}
            <div className="rounded-[10px] border border-border/20 bg-bg/30 p-4 relative overflow-hidden group hover:border-brand/30 transition-all">
              <div className="absolute top-2 right-2 p-1.5 rounded-[5px] bg-brand/5 text-brand shrink-0">
                <Landmark size={12} />
              </div>
              <p className="text-[10px] font-bold text-text-muted/40 uppercase tracking-wider">Wallet Balance</p>
              <h3 className="text-[20px] font-black tracking-tight text-text mt-2 font-mono">{user.walletBalance}</h3>
              <p className="text-[10px] text-text-muted/65 mt-1">Total collateral asset holdings</p>
            </div>

            {/* Equity Card */}
            <div className="rounded-[10px] border border-border/20 bg-bg/30 p-4 relative overflow-hidden group hover:border-positive/30 transition-all">
              <div className="absolute top-2 right-2 p-1.5 rounded-[5px] bg-positive/5 text-positive shrink-0">
                <TrendingUp size={12} />
              </div>
              <p className="text-[10px] font-bold text-text-muted/40 uppercase tracking-wider">Net Equity</p>
              <h3 className="text-[20px] font-black tracking-tight text-positive mt-2 font-mono">{user.equity}</h3>
              <p className="text-[10px] text-text-muted/65 mt-1">Real-time valuation across terminals</p>
            </div>

            {/* 30d PnL Card */}
            <div className={`rounded-[10px] border border-border/20 bg-bg/30 p-4 relative overflow-hidden group transition-all
              ${isPnLNegative ? 'hover:border-negative/30' : 'hover:border-positive/30'}`}>
              <div className={`absolute top-2 right-2 p-1.5 rounded-[5px] shrink-0
                ${isPnLNegative ? 'bg-negative/5 text-negative' : 'bg-positive/5 text-positive'}`}>
                {isPnLNegative ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
              </div>
              <p className="text-[10px] font-bold text-text-muted/40 uppercase tracking-wider">30d Performance</p>
              <h3 className={`text-[20px] font-black tracking-tight mt-2 font-mono
                ${isPnLNegative ? 'text-negative' : 'text-positive'}`}>
                {user.pnl30d || '$0'}
              </h3>
              <p className="text-[10px] text-text-muted/65 mt-1">Accumulated rolling monthly yields</p>
            </div>

          </div>
        </DrawerSection>

        <DrawerSection title="Account Setup & Terminal Inventory">
          <DrawerFormGrid cols={2} className="mt-2">
            <DrawerField label="KYC Status Level" value={user.kycStatus} />
            <DrawerField label="Assigned Risk Status" value={user.riskStatus} />
            <DrawerField label="Segment Classification" value={user.segment} />
            <DrawerField label="Pricing Tier Level" value={user.tier} />
            <DrawerField label="Active MT5 Terminals" value={`${user.mt5Accounts} accounts`} />
            <DrawerField label="Open Position Count" value={`${user.openPositions} active trades`} />
          </DrawerFormGrid>
        </DrawerSection>

        {user.notesSummary && (
          <DrawerSection title="Compliance Operator Commentary">
            <div className="rounded-[10px] border border-brand/12 bg-brand/[0.02] p-4 text-[12px] leading-relaxed text-text-muted/80">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={12} className="text-brand shrink-0" />
                <span className="font-bold text-brand uppercase text-[10px] tracking-wider">Executive Overview</span>
              </div>
              {user.notesSummary}
            </div>
          </DrawerSection>
        )}
      </div>
    );
  }

  // ── 2. KYC SUBSECTION ──
  if (activeTab === 'kyc') {
    const isVerified = user.kycStatus === 'VERIFIED';
    const isRejected = user.kycStatus === 'REJECTED';

    const handleApprove = () => {
      if (onUpdateUser) {
        onUpdateUser({
          kycStatus: 'VERIFIED',
          kyc: {
            ...user.kyc,
            status: 'VERIFIED',
            reviewer: 'Compliance Officer',
            submittedAt: user.kyc?.submittedAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
          }
        });
      }
    };

    const handleReject = () => {
      if (onUpdateUser) {
        onUpdateUser({
          kycStatus: 'REJECTED',
          kyc: {
            ...user.kyc,
            status: 'REJECTED',
            reviewer: 'Compliance Officer',
            submittedAt: user.kyc?.submittedAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
          }
        });
      }
    };

    return (
      <div className="space-y-5 animate-fade-up">
        <div className={`flex items-start gap-3 rounded-[10px] border p-4 shadow-sm
          ${isVerified 
            ? 'border-positive/20 bg-positive/[0.04]' 
            : isRejected 
            ? 'border-negative/20 bg-negative/[0.04]' 
            : 'border-warning/20 bg-warning/[0.04]'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {isVerified ? (
              <CheckCircle size={14} className="text-positive" />
            ) : isRejected ? (
              <ShieldAlert size={14} className="text-negative" />
            ) : (
              <Clock size={14} className="text-warning" />
            )}
          </div>
          <div>
            <h4 className={`text-[12px] font-bold
              ${isVerified ? 'text-positive' : isRejected ? 'text-negative' : 'text-warning'}`}
            >
              Verification Registry Status: {user.kycStatus}
            </h4>
            <p className="text-[11px] text-text-muted/85 mt-1 leading-relaxed">
              {isVerified
                ? 'All mandatory identity documents and AML watchlist screenings have been verified and approved.'
                : isRejected
                ? 'This verification case has failed compliance criteria and requires operator review.'
                : 'Documents have been logged and are currently pending review in the compliance queue.'}
            </p>
          </div>
        </div>

        {user.kycStatus === 'PENDING' && (
          <div className="rounded-[12px] border border-brand/25 bg-brand/[0.02] p-5 shadow-card-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h4 className="text-[13.5px] font-black text-text tracking-tight">Compliance Action Center</h4>
              <p className="text-[11px] text-text-muted/65 mt-1 max-w-md leading-relaxed">
                Review the submitted documents below. As a compliance operator, you can verify and approve the credentials or reject the submission.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button 
                onClick={handleReject}
                className="flex items-center justify-center gap-1.5 px-4 h-9 rounded-[8px] border border-negative/20 bg-negative/5 hover:bg-negative/10 text-negative text-[11px] font-bold transition-all cursor-pointer hover:border-negative/30"
              >
                Reject Submission
              </button>
              <button 
                onClick={handleApprove}
                className="flex items-center justify-center gap-1.5 px-4 h-9 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 hover:bg-brand-hover text-[11px] font-bold transition-all duration-300 transform-gpu hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-sm"
              >
                Approve Documents
              </button>
            </div>
          </div>
        )}

        <DrawerSection title="KYC Audit Details">
          <DrawerFormGrid cols={2} className="mt-2">
            <DrawerField label="Compliance Level" value={user.kyc?.level || 'Level 1'} />
            <DrawerField label="Submission Date" value={user.kyc?.submittedAt || '—'} mono />
            <DrawerField label="Reviewed By" value={user.kyc?.reviewer || 'Compliance Queue'} />
            <DrawerField label="Verification Status" value={user.kyc?.status || 'PENDING'} />
          </DrawerFormGrid>
        </DrawerSection>

        <DrawerSection title="Submitted Identity Credentials">
          <div className="space-y-2 mt-2">
            {(user.kyc?.documents ?? []).length > 0 ? (
              user.kyc.documents.map((docName) => (
                <div key={docName} className="flex items-center justify-between rounded-[8px] border border-border/20 bg-bg/40 px-3.5 py-2.5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={12} className="text-text-muted/40 shrink-0" />
                    <span className="text-[12px] font-semibold text-text truncate">{docName}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-[4px] text-[9.5px] font-black border border-positive/20 bg-positive/[0.04] text-positive uppercase tracking-wider">
                    Received
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-[8px] border border-dashed border-border/25 p-5 text-center text-[12px] text-text-muted/40 italic">
                No credentials uploaded yet.
              </div>
            )}
          </div>
          {user.kyc?.aml && (
            <div className="mt-4 p-3 rounded-[8px] border border-border/12 bg-bg/25 flex items-start gap-2.5">
              <Cpu size={12} className="text-brand shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-brand">AML Watchlist Screening</h5>
                <p className="text-[11px] text-text-muted/75 mt-0.5 leading-relaxed">{user.kyc.aml}</p>
              </div>
            </div>
          )}
        </DrawerSection>
      </div>
    );
  }

  // ── 3. WALLET BALANCES SUBSECTION ──
  if (activeTab === 'wallet') {
    return (
      <div className="space-y-5 animate-fade-up">
        <DrawerSection title="Collateral Assets Summary">
          <div className="space-y-3 mt-2">
            {(user.wallet ?? []).length > 0 ? (
              user.wallet.map((w, idx) => (
                <div key={idx} className="rounded-[10px] border border-border/20 bg-bg/25 p-4 shadow-card-subtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-brand/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-[8px] border border-brand/20 bg-brand/[0.04] text-brand flex items-center justify-center font-black text-[13px] font-heading shrink-0 select-none">
                      {w.asset}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-black text-text">{w.asset} Wallet</h4>
                      <p className="text-[11px] text-text-muted/50 mt-0.5">Primary trading collateral</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6 sm:gap-12 shrink-0">
                    <div>
                      <p className="text-[9.5px] font-bold text-text-muted/45 uppercase tracking-wider">Balance</p>
                      <p className="text-[13px] font-black font-mono text-text mt-0.5">{w.balance}</p>
                    </div>
                    <div>
                      <p className="text-[9.5px] font-bold text-text-muted/45 uppercase tracking-wider">Available</p>
                      <p className="text-[13px] font-semibold font-mono text-positive mt-0.5">{w.available}</p>
                    </div>
                    <div>
                      <p className="text-[9.5px] font-bold text-text-muted/45 uppercase tracking-wider">Hold</p>
                      <p className="text-[13px] font-semibold font-mono text-text-muted/65 mt-0.5">{w.hold}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[10px] border border-dashed border-border/25 p-6 text-center text-[12px] text-text-muted/40 italic">
                No collateral balances registered.
              </div>
            )}
          </div>
        </DrawerSection>
      </div>
    );
  }

  // ── 4. MT5 TERMINALS SUBSECTION ──
  if (activeTab === 'mt5-accounts') {
    return (
      <div className="space-y-5 animate-fade-up">
        <DrawerSection title="Connected MetaTrader 5 Accounts">
          <div className="space-y-4 mt-2">
            {(user.mt5 ?? []).length > 0 ? (
              user.mt5.map((terminal) => {
                return (
                  <div key={terminal.login} className="rounded-[12px] border border-border/20 bg-bg/20 overflow-hidden shadow-card-subtle hover:border-white/10 transition-colors">
                    
                    {/* Header bar */}
                    <div className="px-4 py-3 border-b border-border/12 bg-bg/10 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[13px] font-black text-brand">{terminal.login}</span>
                        <span className="px-1.5 py-0.5 rounded-[4px] text-[9.5px] font-bold border border-border/25 text-text-muted font-mono bg-surface-elevated/40">
                          {terminal.server}
                        </span>
                      </div>
                      <StatusBadge status={terminal.status} />
                    </div>

                    {/* Content quick parameters */}
                    <div className="p-4">
                      <DrawerFormGrid cols={4}>
                        <DrawerField label="Leverage" value={terminal.leverage} />
                        <DrawerField label="Terminal Group" value={terminal.group} mono />
                        <DrawerField label="Net Equity" value={terminal.equity} mono accent="var(--brand)" />
                        <DrawerField label="Margin Level" value={terminal.marginLevel} mono />
                      </DrawerFormGrid>
                    </div>

                    {/* Timeline synchronization indicator */}
                    <div className="px-4 py-2 bg-bg/30 border-t border-border/8 flex justify-between items-center text-[10px] text-text-muted/40">
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> MT5 API Bridge Connected
                      </span>
                      <span className="font-mono">Last Synchronized: {terminal.lastSync}</span>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="rounded-[10px] border border-dashed border-border/25 p-6 text-center text-[12px] text-text-muted/40 italic">
                No active MetaTrader 5 accounts mapped.
              </div>
            )}
          </div>
        </DrawerSection>
      </div>
    );
  }

  // ── 5. EXECUTED TRADE LOG ──
  if (activeTab === 'trading-history') {
    return (
      <div className="space-y-5 animate-fade-up">
        <DrawerSection title="Executed Terminals Ledger">
          <div className="space-y-3.5 mt-2">
            {(user.tradingHistory ?? []).length > 0 ? (
              user.tradingHistory.map((trade) => {
                const isLoss = String(trade.pnl).startsWith('-');
                const isBuy = trade.side === 'BUY';

                return (
                  <div key={trade.ticket} className="rounded-[10px] border border-border/20 bg-bg/25 p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-card-subtle hover:border-white/10 transition-colors">
                    
                    {/* Instrument Side */}
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-12 rounded-[6px] text-[10px] font-black uppercase tracking-wider flex items-center justify-center font-heading shrink-0 select-none
                        ${isBuy 
                          ? 'border border-positive/20 bg-positive/10 text-positive' 
                          : 'border border-negative/20 bg-negative/10 text-negative'
                        }`}
                      >
                        {trade.side}
                      </div>
                      <div>
                        <h4 className="text-[13px] font-black text-text leading-tight">{trade.symbol}</h4>
                        <p className="font-mono text-[10px] text-text-muted/45 mt-1 leading-none">TICKET #{trade.ticket}</p>
                      </div>
                    </div>

                    {/* Parameters Grid */}
                    <div className="grid grid-cols-3 gap-6 sm:gap-10 shrink-0 text-[12px]">
                      <div>
                        <p className="text-[9.5px] font-bold text-text-muted/45 uppercase tracking-wider">Lot Size</p>
                        <p className="font-mono text-text font-bold mt-0.5">{trade.lots}</p>
                      </div>
                      <div>
                        <p className="text-[9.5px] font-bold text-text-muted/45 uppercase tracking-wider">Execution (O/C)</p>
                        <p className="font-mono text-text-muted mt-0.5 leading-tight">{trade.open}<br/>{trade.close}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9.5px] font-bold text-text-muted/45 uppercase tracking-wider">Net Profits</p>
                        <p className={`font-mono font-black mt-0.5 text-[13px]
                          ${isLoss ? 'text-negative' : 'text-positive'}`}
                        >
                          {trade.pnl}
                        </p>
                      </div>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="rounded-[10px] border border-dashed border-border/25 p-6 text-center text-[12px] text-text-muted/40 italic">
                No trading ledger recordings logged.
              </div>
            )}
          </div>
        </DrawerSection>
      </div>
    );
  }

  // ── 6. AUDIT STREAM ──
  if (activeTab === 'activity-logs') {
    return (
      <div className="space-y-5 animate-fade-up">
        <DrawerSection title="Compliance Activity Stream">
          <div className="space-y-2 mt-2">
            {(user.activity ?? []).length > 0 ? (
              user.activity.map((item, index) => (
                <div key={index} className="rounded-[8px] border border-border/20 bg-bg/25 px-4 py-3 flex items-start sm:items-center justify-between gap-4 shadow-card-subtle">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-1.5 rounded-[5px] bg-brand/5 text-brand mt-0.5 sm:mt-0 shrink-0">
                      <Activity size={12} />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold text-text leading-tight">{item.action}</h4>
                      <p className="text-[10px] text-text-muted/50 mt-0.5 font-medium leading-none">
                        By {item.actor} · via <span className="font-mono uppercase">{item.channel}</span>
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-text-muted/40 shrink-0 mt-0.5 sm:mt-0">{item.time}</span>
                </div>
              ))
            ) : (
              <div className="rounded-[10px] border border-dashed border-border/25 p-6 text-center text-[12px] text-text-muted/40 italic">
                No recent workspace events.
              </div>
            )}
          </div>
        </DrawerSection>
      </div>
    );
  }

  // ── 7. RISK ASSESSMENT ──
  if (activeTab === 'risk-view') {
    const isWatch = user.riskStatus === 'WATCHLIST';
    const isHigh = ['HIGH', 'ELEVATED'].includes(user.riskStatus);

    return (
      <div className="space-y-5 animate-fade-up">
        <div className={`flex items-start gap-3 rounded-[10px] border p-4 shadow-sm
          ${isHigh 
            ? 'border-negative/20 bg-negative/[0.04]' 
            : isWatch 
            ? 'border-warning/20 bg-warning/[0.04]' 
            : 'border-positive/20 bg-positive/[0.04]'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            <ShieldAlert size={14} className={isHigh ? 'text-negative' : isWatch ? 'text-warning' : 'text-positive'} />
          </div>
          <div>
            <h4 className={`text-[12px] font-bold
              ${isHigh ? 'text-negative' : isWatch ? 'text-warning' : 'text-positive'}`}
            >
              Risk Assessment Rating: {user.riskStatus}
            </h4>
            <p className="text-[11px] text-text-muted/85 mt-1 leading-relaxed">
              {isHigh
                ? 'High volatility / margin triggers active. Monitor open positions closely to prevent liquidations.'
                : isWatch
                ? 'Moderate concentration warning. Avoid increasing leverage multipliers.'
                : 'User risk levels are low. Operational thresholds are active and stable.'}
            </p>
          </div>
        </div>

        <DrawerSection title="Calculated Risk Parameters">
          <DrawerFormGrid cols={2} className="mt-2">
            <DrawerField label="Assigned Risk Score" value={user.risk?.score || '15 / 100'} />
            <DrawerField label="Active Exposure Value" value={user.risk?.exposure || '$0.00'} mono />
            <DrawerField label="Margin Drawdown" value={user.risk?.drawdown || '0%'} mono />
            <DrawerField label="Concentration Rate" value={user.risk?.concentration || '0%'} />
          </DrawerFormGrid>
        </DrawerSection>

        <DrawerSection title="Active Compliance Alerts">
          <div className="space-y-2 mt-2">
            {(user.risk?.alerts ?? []).length > 0 ? (
              user.risk.alerts.map((al, index) => (
                <div key={index} className="rounded-[8px] border border-negative/15 bg-negative/[0.03] px-3.5 py-2.5 flex items-start gap-2.5">
                  <AlertTriangle size={12} className="text-negative shrink-0 mt-0.5" />
                  <span className="text-[11.5px] text-text-muted font-medium leading-normal">{al}</span>
                </div>
              ))
            ) : (
              <div className="rounded-[10px] border border-dashed border-border/25 p-5 text-center text-[12px] text-text-muted/40 italic">
                No security warnings logged.
              </div>
            )}
          </div>
        </DrawerSection>
      </div>
    );
  }

  // ── 8. OPERATOR NOTES ──
  return (
    <div className="space-y-5 animate-fade-up">
      <DrawerSection title="Platform Internal Notes">
        <div className="space-y-3.5 mt-2">
          {(user.notes ?? []).length > 0 ? (
            user.notes.map((n) => (
              <div key={n.id} className="rounded-[10px] border border-border/20 bg-bg/25 p-4 shadow-card-subtle hover:border-white/5 transition-colors">
                <div className="flex items-center justify-between gap-3 border-b border-border/12 pb-2.5 mb-2.5 flex-wrap">
                  <span className="text-[12px] font-black text-text">{n.author}</span>
                  <span className="font-mono text-[10px] text-text-muted/40">{n.time}</span>
                </div>
                <p className="text-[12px] leading-relaxed text-text-muted/75 font-medium">{n.text}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[10px] border border-dashed border-border/25 p-6 text-center text-[12px] text-text-muted/40 italic">
              No internal operator logs registered.
            </div>
          )}
        </div>
      </DrawerSection>
    </div>
  );
}
