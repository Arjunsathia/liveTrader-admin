import React from 'react';
import {
  Lock, RefreshCw, BarChart2, Activity,
  X, XCircle, Shield, Flag, Check, Eye,
  TrendingUp, TrendingDown,
} from 'lucide-react';
import { DrawerSection, DrawerField, DrawerFormGrid } from '../../../components/common/drawer';
import { TradingQuickActions } from './TradingDrawer';

/**
 * AccountDetailsDrawer: Specialized body for Account records.
 */
export function AccountDetailsDrawer({ row, onAction }) {
  const actions = [
    { label: 'Block Account',   color: 'var(--negative)', icon: Lock,     onClick: () => onAction('Block Account') },
    { label: 'Force Sync',      color: 'var(--cyan)',     icon: RefreshCw, onClick: () => onAction('Force Sync') },
    { label: 'View Positions',  color: 'var(--brand)',    icon: BarChart2, onClick: () => onAction('View Positions') },
    { label: 'Audit Trail',     color: 'var(--text-muted)', icon: Activity, onClick: () => onAction('Audit Trail') },
  ];

  return (
    <div className="space-y-6">
      <DrawerSection title="Account Summary">
        <DrawerFormGrid>
          <DrawerField label="Group"    value={row.group}    mono />
          <DrawerField label="Currency" value={row.currency} />
          <DrawerField label="Leverage" value={row.leverage} />
          <DrawerField label="Status"   value={row.status}   />
        </DrawerFormGrid>
      </DrawerSection>

      <DrawerSection title="Financials">
        <DrawerFormGrid>
          <DrawerField label="Balance"     value={row.balance}    mono accent="var(--brand)" />
          <DrawerField label="Equity"      value={row.equity}     mono accent="var(--positive)" />
          <DrawerField label="Margin"      value={row.margin}     mono accent="var(--warning)" />
          <DrawerField label="Free Margin" value={row.freeMargin} mono accent="var(--cyan)" />
          <DrawerField label="Margin Level" value={row.marginLvl} mono />
          <DrawerField label="Last Sync"   value={row.lastSync}  mono />
        </DrawerFormGrid>
      </DrawerSection>

      <DrawerSection title="User Association">
        <DrawerFormGrid>
          <DrawerField label="Full Name"   value={row.user} />
          <DrawerField label="Account UID" value={row.uid}  mono />
        </DrawerFormGrid>
      </DrawerSection>

      <DrawerSection title="Actions">
        <TradingQuickActions actions={actions} />
      </DrawerSection>
    </div>
  );
}

/**
 * OrderDetailsDrawer: Specialized body for Order records.
 */
export function OrderDetailsDrawer({ row, onAction }) {
  const actions = [
    { label: 'Cancel Order', color: 'var(--negative)', icon: X,        onClick: () => onAction('Cancel Order') },
    { label: 'Acknowledge',  color: 'var(--cyan)',     icon: Check,     onClick: () => onAction('Acknowledge') },
    { label: 'Audit Trail',  color: 'var(--text-muted)', icon: Activity, onClick: () => onAction('Audit Trail') },
    { label: 'Flag Order',   color: 'var(--warning)',  icon: Flag,      onClick: () => onAction('Flag Order') },
  ];

  const statusColors = {
    PENDING: 'var(--warning)',
    FILLED: 'var(--positive)',
    CANCELED: 'var(--text-muted)',
    REJECTED: 'var(--negative)',
  };
  const statusColor = statusColors[row.status] || 'var(--text-muted)';

  return (
    <div className="space-y-6">
      {/* Order Status Banner */}
      <div
        className="rounded-[12px] border overflow-hidden"
        style={{
          borderColor: `color-mix(in srgb, ${statusColor} 25%, var(--border))`,
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: `color-mix(in srgb, ${statusColor} 10%, transparent)` }}
        >
          <div>
            <div className="text-[9.5px] uppercase tracking-wider text-text-muted/55 mb-0.5">Order Status</div>
            <div className="flex items-center gap-2">
              <span
                className="text-[18px] font-black uppercase tracking-wide"
                style={{ color: statusColor }}
              >
                {row.status}
              </span>
              <span className="text-[11px] font-semibold text-text-muted/70">
                · {row.side} {row.volume} Lots
              </span>
            </div>
          </div>
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: statusColor,
              boxShadow: `0 0 10px ${statusColor}`,
            }}
          />
        </div>
      </div>

      <DrawerSection title="Order Details">
        <DrawerFormGrid>
          <DrawerField label="Ticket"      value={row.ticket}    mono />
          <DrawerField label="Symbol"      value={row.symbol}    mono />
          <DrawerField label="Side"        value={row.side}      accent={row.side === 'BUY' ? 'var(--positive)' : 'var(--negative)'} />
          <DrawerField label="Type"        value={row.orderType} />
          <DrawerField label="Volume"      value={`${row.volume} lots`} mono />
          <DrawerField label="Price"       value={row.price}     mono />
          <DrawerField label="Stop Loss"   value={row.sl}        mono accent="var(--negative)" />
          <DrawerField label="Take Profit" value={row.tp}        mono accent="var(--positive)" />
        </DrawerFormGrid>
      </DrawerSection>

      <DrawerSection title="Execution">
        <DrawerFormGrid>
          <DrawerField label="Status" value={row.status} />
          <DrawerField label="Source" value={row.source} />
          <DrawerField label="Time"   value={row.time}   mono />
          <DrawerField label="User"   value={row.user}   />
          <DrawerField label="UID"    value={row.uid}    mono />
        </DrawerFormGrid>
      </DrawerSection>

      {row.status === 'REJECTED' && (
        <DrawerSection title="Rejection Reason" className="animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="rounded-[12px] border border-negative/25 bg-negative/5 px-4 py-3 text-[12px] text-negative/80 leading-relaxed font-medium">
            Order rejected — market was closed for the requested instrument. No position opened.
          </div>
        </DrawerSection>
      )}

      <DrawerSection title="Actions">
        <TradingQuickActions actions={actions} />
      </DrawerSection>
    </div>
  );
}

/**
 * PositionDetailsDrawer: Specialized body for Position records.
 */
export function PositionDetailsDrawer({ row, onAction }) {
  const actions = [
    { label: 'Close Position', color: 'var(--negative)', icon: XCircle,  onClick: () => onAction('Close Position') },
    { label: 'Monitor',        color: 'var(--positive)', icon: Eye,       onClick: () => onAction('Monitor') },
    { label: 'Set SL/TP',     color: 'var(--warning)',  icon: Shield,    onClick: () => onAction('Set SL/TP') },
    { label: 'Audit Trail',    color: 'var(--text-muted)', icon: Activity, onClick: () => onAction('Audit Trail') },
  ];

  const pnlPositive = String(row.pnl).startsWith('+');
  const PnlIcon = pnlPositive ? TrendingUp : TrendingDown;

  return (
    <div className="space-y-6">
      {/* PnL Banner */}
      <div
        className="rounded-[12px] border px-4 py-3 flex items-center justify-between"
        style={{
          borderColor: `color-mix(in srgb, ${pnlPositive ? 'var(--positive)' : 'var(--negative)'} 22%, var(--border))`,
          background: `color-mix(in srgb, ${pnlPositive ? 'var(--positive)' : 'var(--negative)'} 5%, transparent)`,
        }}
      >
        <div>
          <div className="text-[9.5px] uppercase tracking-wider text-text-muted/55 mb-1">Floating P&L</div>
          <div
            className="text-[22px] font-black font-mono tracking-[-0.03em]"
            style={{ color: pnlPositive ? 'var(--positive)' : 'var(--negative)' }}
          >
            {row.pnl}
          </div>
        </div>
        <PnlIcon
          size={32}
          style={{ color: pnlPositive ? 'var(--positive)' : 'var(--negative)', opacity: 0.3 }}
        />
      </div>

      <DrawerSection title="Position Summary">
        <DrawerFormGrid>
          <DrawerField label="Ticket"        value={row.ticket}    mono />
          <DrawerField label="Symbol"        value={row.symbol}    mono />
          <DrawerField label="Side"          value={row.side}      accent={row.side === 'BUY' ? 'var(--positive)' : 'var(--negative)'} />
          <DrawerField label="Size"          value={`${row.size} lots`} mono />
          <DrawerField label="Open Price"    value={row.openPrice} mono />
          <DrawerField label="Current Price" value={row.currPrice} mono />
          <DrawerField label="Swap"          value={row.swap}      mono />
          <DrawerField label="Margin"        value={row.margin}    mono accent="var(--warning)" />
          <DrawerField label="Duration"      value={row.duration}  />
        </DrawerFormGrid>
      </DrawerSection>

      <DrawerSection title="Account Link">
        <DrawerFormGrid>
          <DrawerField label="User" value={row.user} />
          <DrawerField label="UID"  value={row.uid}  mono />
        </DrawerFormGrid>
      </DrawerSection>

      <DrawerSection title="Actions">
        <TradingQuickActions actions={actions} />
      </DrawerSection>
    </div>
  );
}

/**
 * HistoryDetailsDrawer: Specialized body for Historical Trade records.
 */
export function HistoryDetailsDrawer({ row }) {
  const isWin = row.status === 'WIN';
  const statusColor = isWin ? 'var(--positive)' : 'var(--negative)';
  const StatusIcon = isWin ? TrendingUp : TrendingDown;

  return (
    <div className="space-y-6">
      {/* WIN / LOSS Result Banner */}
      <div
        className="rounded-[12px] border overflow-hidden"
        style={{
          borderColor: `color-mix(in srgb, ${statusColor} 25%, var(--border))`,
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: `color-mix(in srgb, ${statusColor} 10%, transparent)` }}
        >
          <div>
            <div className="text-[9.5px] uppercase tracking-wider text-text-muted/55 mb-0.5">Trade Result</div>
            <div className="flex items-center gap-2">
              <span
                className="text-[18px] font-black uppercase tracking-wide"
                style={{ color: statusColor }}
              >
                {isWin ? '✓ WIN' : '✗ LOSS'}
              </span>
              <span
                className="font-mono font-black text-[16px]"
                style={{ color: statusColor }}
              >
                {row.pnl}
              </span>
            </div>
          </div>
          <StatusIcon size={28} style={{ color: statusColor, opacity: 0.3 }} />
        </div>
      </div>

      <DrawerSection title="Trade Execution Result">
        <DrawerFormGrid>
          <DrawerField label="Ticket"      value={row.ticket}     mono />
          <DrawerField label="Symbol"      value={row.symbol}     mono />
          <DrawerField label="Side"        value={row.side}       accent={row.side === 'BUY' ? 'var(--positive)' : 'var(--negative)'} />
          <DrawerField label="Size"        value={`${row.size} lots`} mono />
          <DrawerField label="Open Price"  value={row.openPrice}  mono />
          <DrawerField label="Close Price" value={row.closePrice} mono />
          <DrawerField label="Net P&L"     value={row.pnl}        mono accent={String(row.pnl).startsWith('+') ? 'var(--positive)' : 'var(--negative)'} wide />
        </DrawerFormGrid>
      </DrawerSection>

      <DrawerSection title="Chronology">
        <DrawerFormGrid>
          <DrawerField label="Opened"  value={row.openTime}  mono />
          <DrawerField label="Closed"  value={row.closeTime} mono />
          <DrawerField label="Account" value={row.account}   mono />
          <DrawerField label="User"    value={row.user}      />
        </DrawerFormGrid>
      </DrawerSection>
    </div>
  );
}
