import React from 'react';
import { CircleDollarSign, ShieldAlert, Download, AlertTriangle, Lock } from 'lucide-react';
import { fundedRows } from '../data/workspaces/funded.workspace';
import { StatusChip as Badge, RiskChip as RiskBadge, ActionToast } from '../../../components/ui';
import { PropToolbar } from '../components/PropToolbar';
import { FeatureTable } from '../../../components/tables/FeatureTable';
import { FundedDrawer } from '../components/PropDrawer';
import { MetricGrid } from '../../../components/cards/MetricGrid';
import { Card } from '../../../components/ui/Card';
import { usePropWorkspace } from '../hooks/usePropWorkspace';
import { exportRows } from '../../../utils/exporters';

// Summary metrics derived from source data
const totalFunded = fundedRows.reduce((s, r) => s + parseInt(r.funded.replace(/\D/g, '')), 0);
const metrics = [
  { label: 'Total Funded',    value: `$${totalFunded.toLocaleString()}`,                              accent: 'var(--brand)'    },
  { label: 'Total PnL',       value: '+$30,687',                                                       accent: 'var(--positive)' },
  { label: 'Payout Eligible', value: `${fundedRows.filter((r) => r.payoutReady).length} accounts`,    accent: 'var(--brand)'    },
  { label: 'Risk Flags',      value: `${fundedRows.filter((r) => r.risk === 'HIGH').length} HIGH`,     accent: 'var(--negative)' },
];

export function FundedAccountsScreen() {
  const ws = usePropWorkspace({
    rows:      fundedRows,
    statusKey: 'status',
    searchKey:  'trader',
    searchKey2: 'id',
    customFilter: (r, filter) => r.status === filter || (filter === 'PAYOUT' && r.payoutReady),
  });

  const cols = [
    { key: 'id',       label: 'Account', render: (v)    => <span className="font-mono text-text-muted/60 text-[10.5px]">{v}</span> },
    { key: 'trader',   label: 'Trader',  render: (v, r) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-[5px] bg-primary/[0.1] border border-primary/[0.15] flex items-center justify-center text-[9px] font-bold text-primary font-heading flex-shrink-0">
          {v.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <div className="text-[12px] font-semibold font-heading text-text/80">{v}</div>
          <div className="text-[10px] font-mono text-text-muted/35">{r.uid}</div>
        </div>
      </div>
    )},
    { key: 'funded',   label: 'Funded',    render: (v) => <span className="font-mono font-bold text-brand text-[11px]">{v}</span> },
    { key: 'pnl',      label: 'PnL',       render: (v, r) => (
      <div>
        <span className="font-mono font-bold text-[11.5px]" style={{ color: v?.startsWith('+') ? 'var(--positive)' : 'var(--negative)' }}>{v}</span>
        <div className="text-[10px] font-mono" style={{ color: r.pnlPct?.startsWith('+') ? 'var(--positive)' : 'var(--negative)', opacity: 0.6 }}>{r.pnlPct}</div>
      </div>
    )},
    { key: 'drawdown', label: 'Drawdown',  render: (v, r) => {
        const pct   = parseFloat(v?.replace('-', '').replace('%', '')) || 0;
        const limit = parseFloat(r.maxDD?.replace('%', '')) || 10;
        const ratio = Math.min(pct / limit, 1);
        return (
          <div className="w-20">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="font-mono text-negative">{v}</span>
              <span className="text-text-muted/30 font-mono">{r.maxDD}</span>
            </div>
            <div className="h-1 rounded-full bg-white/[0.05]">
              <div className="h-full rounded-full" style={{ width: `${ratio * 100}%`, background: ratio > 0.8 ? 'var(--negative)' : ratio > 0.5 ? 'var(--warning)' : 'var(--positive)' }} />
            </div>
          </div>
        );
    }},
    { key: 'payout',   label: 'Payout',    render: (v, r) => r.payoutReady ? <span className="font-mono font-bold text-brand text-[11px]">{v}</span> : <span className="text-text-muted/30 text-[10.5px] font-heading">Not eligible</span> },
    { key: 'risk',     label: 'Risk',      render: (v) => <RiskBadge value={v} /> },
    { key: 'status',   label: 'Status',    render: (v) => <Badge value={v} /> },
    { key: '_actions', label: '',          render: (_, r) => (
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {r.payoutReady && (
          <button onClick={(e) => { e.stopPropagation(); ws.onAction('Payout approved', r.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/[0.07] text-positive flex items-center justify-center cursor-pointer hover:brightness-110">
            <CircleDollarSign size={10} />
          </button>
        )}
        <button onClick={(e) => { e.stopPropagation(); ws.onAction('Warning sent', r.id); }} className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/[0.07] text-warning flex items-center justify-center cursor-pointer hover:brightness-110"><AlertTriangle size={10} /></button>
        <button onClick={(e) => { e.stopPropagation(); ws.onAction('Account suspended', r.id); }} className="w-6 h-6 rounded-[5px] border border-negative/20 bg-negative/[0.07] text-negative flex items-center justify-center cursor-pointer hover:brightness-110"><Lock size={10} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-5">
      <PropToolbar
        search={ws.search} setSearch={ws.setSearch}
        filters={['ALL', 'ACTIVE', 'WARNED', 'BREACHED', 'PAYOUT']}
        activeFilter={ws.filter} setFilter={ws.setFilter}
        actions={[
          { label: 'Batch Payout', Icon: CircleDollarSign, primary: true, onClick: () => ws.onAction('Batch payout initiated', '') },
          { label: 'Risk Export',  Icon: ShieldAlert,                      onClick: () => exportRows(ws.filtered, 'funded-risk.csv') },
          { label: 'Export',       Icon: Download,                         onClick: () => exportRows(ws.filtered, 'funded-accounts.csv') },
        ]}
      />

      <ActionToast msg={ws.toast} />

      {/* Summary metrics strip — replaces inline grid */}
      <MetricGrid metrics={metrics} />

      <Card title="Funded Accounts" subtitle={`${ws.filtered.length} record${ws.filtered.length !== 1 ? 's' : ''} matched · click row to open`} padding={false}>
        <FeatureTable cols={cols} rows={ws.filtered} onRow={ws.openDrawer} />
      </Card>

      <FundedDrawer row={ws.drawer} open={!!ws.drawer} onClose={ws.closeDrawer} onAction={ws.onAction} />
    </div>
  );
}
