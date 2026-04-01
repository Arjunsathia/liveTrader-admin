import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function RightPanel({ user }) {
  const recentAlerts = user.risk.alerts.slice(0, 2);

  return (
    <div className="flex flex-col gap-4">
      {/* Live positions */}
      <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-text-muted/55">
            Open Positions
          </span>
          <span
            className="flex items-center gap-1 text-[10px] font-semibold"
            style={{ color: '#4ae176' }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ae176] animate-pulse" />
            LIVE
          </span>
        </div>
        <div className="space-y-2">
          {user.openTrades.map((t) => (
            <div
              key={t.ticket}
              className="rounded-[8px] border border-border/30 bg-bg/50 px-3 py-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[12px] text-text">{t.symbol}</span>
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded-[3px]"
                    style={{
                      color: t.side === 'BUY' ? '#4ae176' : '#ef4444',
                      background: t.side === 'BUY' ? '#4ae17618' : '#ef444418',
                    }}
                  >
                    {t.side}
                  </span>
                  <span className="font-mono text-[10px] text-text-muted/50">{t.lots}L</span>
                </div>
                <span
                  className="font-mono text-[12px] font-semibold"
                  style={{ color: t.pnl.startsWith('+') ? '#4ae176' : '#ef4444' }}
                >
                  {t.pnl}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-text-muted/45 font-mono">
                <span>{t.open} → {t.current}</span>
                <span>swap {t.swap}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border/15 flex justify-between">
          <span className="text-[11px] text-text-muted/55">Total floating P&L</span>
          <span className="font-mono text-[12px] font-semibold text-[#4ae176]">+{user.pnl30d}</span>
        </div>
      </div>

      {/* Risk snapshot */}
      <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle p-4">
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-text-muted/55 block mb-3">
          Risk Snapshot
        </span>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { l: 'Score', v: user.risk.score, c: user.risk.level === 'LOW' ? '#4ae176' : '#f59e0b' },
            { l: 'Exposure', v: user.risk.exposure, c: 'var(--text)' },
            { l: 'Drawdown', v: user.risk.drawdown, c: '#ef4444' },
            { l: 'Margin Lvl', v: user.marginLevel, c: '#22d3ee' },
          ].map(({ l, v, c }) => (
            <div key={l} className="rounded-[7px] border border-border/20 bg-bg/40 px-2.5 py-2">
              <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-text-muted/45 mb-0.5">{l}</div>
              <div className="font-mono text-[12px] font-semibold" style={{ color: c }}>{v}</div>
            </div>
          ))}
        </div>
        {recentAlerts.length > 0 && (
          <div className="space-y-1.5">
            {recentAlerts.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-[6px] border border-[#f59e0b]/20 bg-[#f59e0b]/06 px-2.5 py-2"
              >
                <AlertTriangle size={11} className="mt-0.5 flex-shrink-0 text-[#f59e0b]" />
                <span className="text-[11px] leading-4 text-[#f59e0b]/80">{a}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MT5 quick status */}
      <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle p-4">
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-text-muted/55 block mb-3">
          MT5 Accounts
        </span>
        <div className="space-y-2">
          {user.mt5.map((a) => (
            <div
              key={a.login}
              className="flex items-center gap-2.5 rounded-[8px] border border-border/20 bg-bg/40 px-3 py-2"
            >
              <div
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ background: a.status === 'CONNECTED' ? '#4ae176' : '#f59e0b' }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[12px] font-semibold text-text">#{a.login}</div>
                <div className="text-[10px] text-text-muted/50 truncate">{a.server} · {a.leverage}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[11px] font-semibold text-text">{a.equity}</div>
                <div className="text-[10px] text-text-muted/50">ML {a.marginLevel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity mini */}
      <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle p-4">
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-text-muted/55 block mb-3">
          Recent Events
        </span>
        <div className="space-y-2">
          {user.activity.slice(0, 4).map((a, i) => {
            const typeColor = { auth: '#22d3ee', finance: '#f59e0b', kyc: '#a78bfa', mt5: '#4ae176', admin: 'var(--brand)' }[a.type] ?? '#888';
            return (
              <div key={i} className="flex items-start gap-2">
                <div
                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ background: typeColor }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-text leading-snug truncate">{a.action}</div>
                  <div className="font-mono text-[10px] text-text-muted/45">{a.time} · {a.ip}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
