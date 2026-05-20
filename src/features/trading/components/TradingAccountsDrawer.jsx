import React, { useState } from 'react';
import { KeyRound, RefreshCw, Check, History } from 'lucide-react';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { DrawerField, DrawerGrid, DrawerSection, SelectField } from '../../../components/overlays/DrawerUI';
import { Button } from '../../../components/ui/Button';
import { InlineAlert } from '../../../components/common/feedback/InlineAlert';
import { StatusChip } from '../../../components/ui/StatusChip';

export function TradingAccountsDrawer({ open, row, onClose, onSave, onSync, onResetPassword }) {
  const [leverage, setLeverage] = useState('');
  const [status, setStatus] = useState('');
  const [showStatusSuccess, setShowStatusSuccess] = useState(false);
  const [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    setPrevRow(row);
    if (row) {
      setLeverage(row.leverage || '1:100');
      setStatus(row.status || 'ACTIVE');
      setShowStatusSuccess(false);
    }
  }

  if (!row) return null;

  const handleSave = () => {
    onSave?.({ ...row, leverage, status });
    setShowStatusSuccess(true);
    setTimeout(() => {
      setShowStatusSuccess(false);
      onClose();
    }, 1200);
  };

  const isBlocked = status === 'BLOCKED' || status === 'SUSPENDED';
  const statusAccent = isBlocked ? 'var(--negative)' : 'var(--positive)';
  const equity = parseFloat((row.equity || '$0').replace(/[$,]/g, ''));
  const balance = parseFloat((row.balance || '$0').replace(/[$,]/g, ''));
  const delta = equity - balance;

  return (
    <AdminDrawer
      open={open}
      title={`MT5 Account — #${row.login}`}
      subtitle="Inspect credentials, balance metrics, and adjust operational settings."
      eyebrow="MT5 Account Review"
      width="max-w-[720px]"
      onClose={onClose}
      footer={(
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="text-[10px] text-text-muted/55 max-w-[280px] leading-snug">
            Leverage adjustments push directly to the MT5 dealing gateway cluster.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center h-9 px-4 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={showStatusSuccess}
              className="flex items-center justify-center h-9 px-4 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[12px] font-bold disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              {showStatusSuccess ? (
                <span className="flex items-center gap-1.5">
                  <Check size={12} /> Pushed to MT5
                </span>
              ) : 'Push Changes'}
            </button>
          </div>
        </div>
      )}
    >
      <div className="space-y-6">

        {/* Connection Status Card */}
        <div
          className="rounded-[12px] border overflow-hidden p-4"
          style={{ borderColor: `color-mix(in srgb, ${statusAccent} 22%, var(--border))`, background: `color-mix(in srgb, ${statusAccent} 4%, transparent)` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-[15px] font-black text-text">{row.user}</div>
              <div className="text-[10px] font-mono text-text-muted/50 mt-0.5">UID: {row.uid || 'U-499201'}</div>
            </div>
            <StatusChip value={status} size="lg" />
          </div>

          {/* Equity / Balance Scoreboard */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/10">
            <div className="text-center">
              <div className="text-[9.5px] uppercase tracking-wider text-text-muted/50 mb-1">Balance</div>
              <div className="font-mono text-[13px] font-bold text-text">{row.balance}</div>
            </div>
            <div className="text-center">
              <div className="text-[9.5px] uppercase tracking-wider text-text-muted/50 mb-1">Equity</div>
              <div className="font-mono text-[13px] font-bold text-brand">{row.equity}</div>
            </div>
            <div className="text-center">
              <div className="text-[9.5px] uppercase tracking-wider text-text-muted/50 mb-1">Float</div>
              <div
                className="font-mono text-[13px] font-bold"
                style={{ color: delta >= 0 ? 'var(--positive)' : 'var(--negative)' }}
              >
                {delta >= 0 ? '+' : ''}{delta.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-text-muted/55 flex items-center gap-1.5 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
            Active cluster connection · Latency stable
          </div>
        </div>

        {showStatusSuccess && (
          <InlineAlert tone="success" title="MT5 Sync Complete">
            Leverage changed to {leverage} and status synchronized with MT5 Node.
          </InlineAlert>
        )}

        {/* Account Snapshot */}
        <DrawerSection title="Account Snapshot">
          <DrawerGrid>
            <DrawerField label="Login" value={row.login} mono copyable />
            <DrawerField label="Server" value={row.server} mono />
            <DrawerField label="Group" value={row.group || 'retail_usd_std'} mono copyable />
            <DrawerField label="Account Type" value={row.type || 'Live'} />
            <DrawerField label="Currency" value={row.currency || 'USD'} />
            <DrawerField label="Last Synced" value={row.lastSync} mono />
          </DrawerGrid>
        </DrawerSection>

        {/* Balance Metrics */}
        <DrawerSection title="Balance & Capital Metrics">
          <DrawerGrid>
            <DrawerField label="Balance" value={row.balance} mono accent="var(--cyan)" />
            <DrawerField label="Equity" value={row.equity} mono accent="var(--brand)" />
            <DrawerField label="Margin Used" value={row.margin || '$0'} mono accent="var(--warning)" />
            <DrawerField label="Free Margin" value={row.freeMargin || row.balance} mono accent="var(--positive)" />
            <DrawerField
              label="Margin Level"
              value={row.marginLvl || '—'}
              mono
              accent={
                row.marginLvl && row.marginLvl.includes('%') && parseInt(row.marginLvl) < 150
                  ? 'var(--negative)'
                  : 'var(--text)'
              }
            />
          </DrawerGrid>
        </DrawerSection>

        {/* Dealing Desk Controls */}
        <DrawerSection title="Dealing Desk Controls">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Adjust Account Leverage"
              value={leverage}
              onChange={setLeverage}
              options={['1:50', '1:100', '1:200', '1:500']}
            />
            <SelectField
              label="Operational Status"
              value={status}
              onChange={setStatus}
              options={['ACTIVE', 'BLOCKED', 'READONLY', 'SUSPENDED']}
            />
          </div>
        </DrawerSection>

        {/* Quick Actions */}
        <DrawerSection title="Quick Actions" collapsible>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => {
                onSync?.(row);
                setShowStatusSuccess(true);
                setTimeout(() => setShowStatusSuccess(false), 1500);
              }}
              className="flex items-center justify-center gap-1.5 h-9 rounded-[8px] border border-brand/20 bg-brand/5 hover:bg-brand/15 text-brand text-[11px] font-bold transition-all cursor-pointer"
            >
              <RefreshCw size={12} className="animate-spin-slow" /> Force Sync
            </button>
            <button
              type="button"
              onClick={() => onResetPassword?.(row)}
              className="flex items-center justify-center gap-1.5 h-9 rounded-[8px] border border-negative/20 bg-negative/5 hover:bg-negative/15 text-negative text-[11px] font-bold transition-all cursor-pointer"
            >
              <KeyRound size={12} /> Reset Password
            </button>
            <button
              type="button"
              disabled
              className="flex items-center justify-center gap-1.5 h-9 rounded-[8px] border border-border/15 bg-surface-elevated text-text-muted/40 text-[11px] font-bold cursor-not-allowed opacity-50"
              title="Coming soon"
            >
              <History size={12} /> Trade History
            </button>
          </div>
        </DrawerSection>
      </div>
    </AdminDrawer>
  );
}
