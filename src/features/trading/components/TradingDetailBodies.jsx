import React from 'react';
import { Lock, RefreshCw, BarChart2, Activity, X, XCircle, Shield, Flag, Check, Eye } from 'lucide-react';
import { DrawerSection, DrawerField, DrawerGrid } from '../../../components/overlays/DrawerUI';
import { TradingQuickActions } from './TradingDrawer';

/**
 * AccountDetailsDrawer: Specialized body for Account records.
 */
export function AccountDetailsDrawer({ row, onAction }) {
  const actions = [
    { label: 'Block Account', color: 'var(--negative)', icon: Lock, onClick: () => onAction('Block Account') },
    { label: 'Force Sync', color: 'var(--cyan)', icon: RefreshCw, onClick: () => onAction('Force Sync') },
    { label: 'View Positions', color: 'var(--brand)', icon: BarChart2, onClick: () => onAction('View Positions') },
    { label: 'Audit Trail', color: 'var(--text-muted)', icon: Activity, onClick: () => onAction('Audit Trail') },
  ];

  return (
    <div className="space-y-6">
      <DrawerSection title="Account Summary">
        <DrawerGrid>
          <DrawerField label="Group" value={row.group} mono />
          <DrawerField label="Currency" value={row.currency} />
          <DrawerField label="Leverage" value={row.leverage} />
          <DrawerField label="Status" value={row.status} />
        </DrawerGrid>
      </DrawerSection>

      <DrawerSection title="Financials">
        <DrawerGrid>
          <DrawerField label="Balance" value={row.balance} mono accent="var(--brand)" />
          <DrawerField label="Equity" value={row.equity} mono accent="var(--positive)" />
          <DrawerField label="Margin" value={row.margin} mono accent="var(--warning)" />
          <DrawerField label="Free Margin" value={row.freeMargin} mono accent="var(--cyan)" />
          <DrawerField label="Margin Level" value={row.marginLvl} mono />
          <DrawerField label="Last Sync" value={row.lastSync} mono />
        </DrawerGrid>
      </DrawerSection>

      <DrawerSection title="User Association">
        <DrawerGrid>
          <DrawerField label="Full Name" value={row.user} />
          <DrawerField label="Account UID" value={row.uid} mono />
        </DrawerGrid>
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
    { label: 'Cancel Order', color: 'var(--negative)', icon: X, onClick: () => onAction('Cancel Order') },
    { label: 'Acknowledge', color: 'var(--cyan)', icon: Check, onClick: () => onAction('Acknowledge') },
    { label: 'Audit Trail', color: 'var(--text-muted)', icon: Activity, onClick: () => onAction('Audit Trail') },
    { label: 'Flag Order', color: 'var(--warning)', icon: Flag, onClick: () => onAction('Flag Order') },
  ];

  return (
    <div className="space-y-6">
      <DrawerSection title="Order Details">
        <DrawerGrid>
          <DrawerField label="Ticket" value={row.ticket} mono />
          <DrawerField label="Symbol" value={row.symbol} mono />
          <DrawerField label="Side" value={row.side} accent={row.side === 'BUY' ? 'var(--positive)' : 'var(--negative)'} />
          <DrawerField label="Type" value={row.orderType} />
          <DrawerField label="Volume" value={`${row.volume} lots`} mono />
          <DrawerField label="Price" value={row.price} mono />
          <DrawerField label="Stop Loss" value={row.sl} mono accent="var(--negative)" />
          <DrawerField label="Take Profit" value={row.tp} mono accent="var(--positive)" />
        </DrawerGrid>
      </DrawerSection>

      <DrawerSection title="Execution">
        <DrawerGrid>
          <DrawerField label="Status" value={row.status} />
          <DrawerField label="Source" value={row.source} />
          <DrawerField label="Time" value={row.time} mono />
          <DrawerField label="User" value={row.user} />
          <DrawerField label="UID" value={row.uid} mono />
        </DrawerGrid>
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
    { label: 'Close Position', color: 'var(--negative)', icon: XCircle, onClick: () => onAction('Close Position') },
    { label: 'Monitor', color: 'var(--positive)', icon: Eye, onClick: () => onAction('Monitor') },
    { label: 'Set SL/TP', color: 'var(--warning)', icon: Shield, onClick: () => onAction('Set SL/TP') },
    { label: 'Audit Trail', color: 'var(--text-muted)', icon: Activity, onClick: () => onAction('Audit Trail') },
  ];

  return (
    <div className="space-y-6">
      <DrawerSection title="Position Summary">
        <DrawerGrid>
          <DrawerField label="Ticket" value={row.ticket} mono />
          <DrawerField label="Symbol" value={row.symbol} mono />
          <DrawerField label="Side" value={row.side} accent={row.side === 'BUY' ? 'var(--positive)' : 'var(--negative)'} />
          <DrawerField label="Size" value={`${row.size} lots`} mono />
          <DrawerField label="Open Price" value={row.openPrice} mono />
          <DrawerField label="Current Price" value={row.currPrice} mono />
          <DrawerField label="Floating P&L" value={row.pnl} mono accent={row.pnl.startsWith('+') ? 'var(--positive)' : 'var(--negative)'} className="col-span-2" />
          <DrawerField label="Swap" value={row.swap} mono />
          <DrawerField label="Margin" value={row.margin} mono accent="var(--warning)" />
          <DrawerField label="Duration" value={row.duration} />
        </DrawerGrid>
      </DrawerSection>

      <DrawerSection title="Account Link">
        <DrawerGrid>
          <DrawerField label="User" value={row.user} />
          <DrawerField label="UID" value={row.uid} mono />
        </DrawerGrid>
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
  return (
    <div className="space-y-6">
      <DrawerSection title="Trade Execution Result">
        <DrawerGrid>
          <DrawerField label="Ticket" value={row.ticket} mono />
          <DrawerField label="Symbol" value={row.symbol} mono />
          <DrawerField label="Side" value={row.side} accent={row.side === 'BUY' ? 'var(--positive)' : 'var(--negative)'} />
          <DrawerField label="Size" value={`${row.size} lots`} mono />
          <DrawerField label="Open Price" value={row.openPrice} mono />
          <DrawerField label="Close Price" value={row.closePrice} mono />
          <DrawerField label="Net P&L" value={row.pnl} mono accent={row.pnl.startsWith('+') ? 'var(--positive)' : 'var(--negative)'} className="col-span-2" />
          <DrawerField label="Result" value={row.status} accent={row.status === 'WIN' ? 'var(--positive)' : 'var(--negative)'} />
        </DrawerGrid>
      </DrawerSection>

      <DrawerSection title="Chronology">
        <DrawerGrid>
          <DrawerField label="Opened" value={row.openTime} mono />
          <DrawerField label="Closed" value={row.closeTime} mono />
          <DrawerField label="Account" value={row.account} mono />
          <DrawerField label="User" value={row.user} />
        </DrawerGrid>
      </DrawerSection>
    </div>
  );
}
