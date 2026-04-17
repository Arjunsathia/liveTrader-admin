import React from 'react';
import { CheckCircle2, Download, Check, X } from 'lucide-react';
import { evaluationRows } from '../configs/evaluation.config';
import { StatusChip as Badge, RiskChip as RiskBadge, ActionToast } from '../../../components/ui/FeatureUI';
import { PropToolbar } from '../components/PropToolbar';
import { FeatureTable } from '../../../components/tables/FeatureTable';
import { EvaluationDrawer } from '../components/PropDrawer';
import { MetricGrid } from '../../../components/cards/MetricGrid';
import { Card } from '../../../components/ui/Card';
import { usePropWorkspace } from '../hooks/usePropWorkspace';
import { exportRows } from '../../../utils/exporters';

// Summary metrics derived from source data
const metrics = [
  { label: 'Total',     value: evaluationRows.length,                                              accent: 'var(--text-muted)' },
  { label: 'Pending',   value: evaluationRows.filter((r) => r.status === 'PENDING').length,        accent: 'var(--warning)'    },
  { label: 'In Review', value: evaluationRows.filter((r) => r.status === 'REVIEW').length,         accent: 'var(--cyan)'       },
  { label: 'Approved',  value: evaluationRows.filter((r) => r.status === 'APPROVED').length,       accent: 'var(--positive)'   },
  { label: 'Rejected',  value: evaluationRows.filter((r) => r.status === 'REJECTED').length,       accent: 'var(--negative)'   },
];

const cols = [
  { key: 'id',       label: 'ID',       render: (v)    => <span className="font-mono text-text-muted/60 text-[11px]">{v}</span> },
  { key: 'trader',   label: 'Trader',   render: (v, r) => (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-[8px] bg-primary/[0.1] border border-primary/[0.15] flex items-center justify-center text-[9px] font-bold text-primary font-heading flex-shrink-0">
        {v.split(' ').map((n) => n[0]).join('')}
      </div>
      <div>
        <div className="text-[12px] font-semibold font-heading text-text">{v}</div>
        <div className="text-[10px] font-mono text-text-muted/50">{r.uid}</div>
      </div>
    </div>
  )},
  { key: 'challenge', label: 'Challenge', render: (v) => <span className="text-text/70 font-heading text-[12px]">{v}</span> },
  { key: 'phase',     label: 'Phase',     render: (v) => <span className="text-cyan font-heading text-[11px] font-semibold">{v}</span> },
  { key: 'profit',    label: 'Profit',    render: (v) => <span className="font-mono font-bold text-[12px]" style={{ color: v?.startsWith('+') ? 'var(--positive)' : 'var(--negative)' }}>{v}</span> },
  { key: 'drawdown',  label: 'Drawdown',  render: (v) => <span className="font-mono text-negative text-[12px]">{v}</span> },
  { key: 'dailyLoss', label: 'Daily',     render: (v) => <span className="font-heading font-bold text-[11px]" style={{ color: v === 'OK' ? 'var(--positive)' : v === 'WARN' ? 'var(--warning)' : 'var(--negative)' }}>{v}</span> },
  { key: 'kyc',       label: 'KYC',       render: (v) => <Badge value={v} /> },
  { key: 'risk',      label: 'Risk',      render: (v) => <RiskBadge value={v} /> },
  { key: 'status',    label: 'Status',    render: (v) => <Badge value={v} /> },
  { key: '_actions',  label: '',          render: (_, r) => (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={(e) => { e.stopPropagation(); ws_onAction('Approved', r.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/[0.07] text-positive flex items-center justify-center cursor-pointer hover:brightness-110"><Check size={10} /></button>
      <button onClick={(e) => { e.stopPropagation(); ws_onAction('Rejected', r.id); }} className="w-6 h-6 rounded-[5px] border border-negative/20 bg-negative/[0.07] text-negative flex items-center justify-center cursor-pointer hover:brightness-110"><X size={10} /></button>
    </div>
  )},
];

// Note: action buttons in cols need ws.onAction — we'll pass it via closure below

export function EvaluationRequestsPage() {
  const ws = usePropWorkspace({
    rows:      evaluationRows,
    statusKey: 'status',
    searchKey:  'trader',
    searchKey2: 'id',
  });

  // Rebuild cols with ws.onAction bound (keeps cols definition clean outside)
  const tableCols = [
    ...cols.slice(0, -1), // all cols except _actions
    {
      key: '_actions', label: '', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); ws.onAction('Approved', r.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/[0.07] text-positive flex items-center justify-center cursor-pointer hover:brightness-110"><Check size={10} /></button>
          <button onClick={(e) => { e.stopPropagation(); ws.onAction('Rejected', r.id); }} className="w-6 h-6 rounded-[5px] border border-negative/20 bg-negative/[0.07] text-negative flex items-center justify-center cursor-pointer hover:brightness-110"><X size={10} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PropToolbar
        search={ws.search} setSearch={ws.setSearch}
        filters={['ALL', 'PENDING', 'REVIEW', 'APPROVED', 'REJECTED']}
        activeFilter={ws.filter} setFilter={ws.setFilter}
        actions={[
          { label: 'Bulk Approve', Icon: CheckCircle2, variant: 'success', onClick: () => ws.onAction('Bulk approved', `${ws.filtered.filter((r) => r.status === 'PENDING').length} items`) },
          { label: 'Export',       Icon: Download,                         onClick: () => exportRows(ws.filtered, 'evaluation-requests.csv') },
        ]}
      />

      <ActionToast msg={ws.toast} />

      {/* Summary metrics strip — replaces inline pills */}
      <MetricGrid metrics={metrics} />

      <Card title="Evaluation Requests" subtitle={`${ws.filtered.length} record${ws.filtered.length !== 1 ? 's' : ''} matched · click row to open`} padding={false}>
        <FeatureTable cols={tableCols} rows={ws.filtered} onRow={ws.openDrawer} />
      </Card>

      <EvaluationDrawer row={ws.drawer} open={!!ws.drawer} onClose={ws.closeDrawer} onAction={ws.onAction} />
    </div>
  );
}
