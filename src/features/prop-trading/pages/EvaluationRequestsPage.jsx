import React, { useState, useMemo } from 'react';
import { CheckCircle2, Download, Check, X } from 'lucide-react';
import { evaluationRows } from '../configs/evaluation.config';
import { Badge, RiskBadge } from '../components/PropShared';
import { PropToolbar } from '../components/PropToolbar';
import { PropTable } from '../components/PropTable';
import { EvaluationDrawer } from '../components/PropDrawer';
import { Card } from '../../../components/ui/Card';

export function EvaluationRequestsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);

  const onAction = (msg, id) => { setToast(`${msg}: ${id}`); setTimeout(() => setToast(null), 3000); };

  const filtered = useMemo(() => {
    let rows = evaluationRows;
    if (filter !== 'ALL') rows = rows.filter(r => r.status === filter);
    if (search) rows = rows.filter(r => r.trader.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search));
    return rows;
  }, [search, filter]);

  const cols = [
    { key: 'id', label: 'ID', render: v => <span className="font-mono text-text-muted/60 text-[11px]">{v}</span> },
    {
      key: 'trader', label: 'Trader', render: (v, r) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[8px] bg-primary/[0.1] border border-primary/[0.15] flex items-center justify-center text-[9px] font-bold text-primary font-heading flex-shrink-0">
            {v.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="text-[12px] font-semibold font-heading text-text">{v}</div>
            <div className="text-[10px] font-mono text-text-muted/50">{r.uid}</div>
          </div>
        </div>
      )
    },
    { key: 'challenge', label: 'Challenge', render: v => <span className="text-text/70 font-heading text-[12px]">{v}</span> },
    { key: 'phase', label: 'Phase', render: v => <span className="text-cyan font-heading text-[11px] font-semibold">{v}</span> },
    { key: 'profit', label: 'Profit', render: v => <span className="font-mono font-bold text-[12px]" style={{ color: v?.startsWith('+') ? 'var(--positive)' : 'var(--negative)' }}>{v}</span> },
    { key: 'drawdown', label: 'Drawdown', render: v => <span className="font-mono text-negative text-[12px]">{v}</span> },
    { key: 'dailyLoss', label: 'Daily', render: v => <span className="font-heading font-bold text-[11px]" style={{ color: v === 'OK' ? 'var(--positive)' : v === 'WARN' ? 'var(--warning)' : 'var(--negative)' }}>{v}</span> },
    { key: 'kyc', label: 'KYC', render: v => <Badge value={v} /> },
    { key: 'risk', label: 'Risk', render: v => <RiskBadge value={v} /> },
    { key: 'status', label: 'Status', render: v => <Badge value={v} /> },
    {
      key: '_actions', label: '', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={e => { e.stopPropagation(); onAction('Approved', r.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/[0.07] text-positive flex items-center justify-center cursor-pointer hover:brightness-110"><Check size={10} /></button>
          <button onClick={e => { e.stopPropagation(); onAction('Rejected', r.id); }} className="w-6 h-6 rounded-[5px] border border-negative/20 bg-negative/[0.07] text-negative flex items-center justify-center cursor-pointer hover:brightness-110"><X size={10} /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <PropToolbar
        search={search} setSearch={setSearch}
        filters={['ALL', 'PENDING', 'REVIEW', 'APPROVED', 'REJECTED']}
        activeFilter={filter} setFilter={setFilter}
        actions={[
          { label: 'Bulk Approve', Icon: CheckCircle2, variant: 'success', onClick: () => onAction('Bulk approved', `${filtered.filter(r => r.status === 'PENDING').length} items`) },
          { label: 'Export', Icon: Download, onClick: () => onAction('Exported', 'eval list') },
        ]}
      />

      {toast && (
        <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading">
          <CheckCircle2 size={13} />{toast}
        </div>
      )}

      {/* Summary pills */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'Total', val: evaluationRows.length, color: 'var(--text-muted)' },
          { label: 'Pending', val: evaluationRows.filter(r => r.status === 'PENDING').length, color: 'var(--warning)' },
          { label: 'In Review', val: evaluationRows.filter(r => r.status === 'REVIEW').length, color: 'var(--cyan)' },
          { label: 'Approved', val: evaluationRows.filter(r => r.status === 'APPROVED').length, color: 'var(--positive)' },
          { label: 'Rejected', val: evaluationRows.filter(r => r.status === 'REJECTED').length, color: 'var(--negative)' },
        ].map(p => (
          <div key={p.label} className="flex items-center gap-2 rounded-[8px] border border-border/30 bg-surface-elevated px-3 py-1.5 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-text-muted/60 font-heading">{p.label}</span>
            <span className="font-mono font-bold" style={{ color: p.color }}>{p.val}</span>
          </div>
        ))}
      </div>

      <Card
        title="Evaluation Requests"
        subtitle={`${filtered.length} record${filtered.length !== 1 ? 's' : ''} matched · click row to open`}
        padding={false}
      >
        <PropTable cols={cols} rows={filtered} onRow={r => setDrawer(r)} />
      </Card>

      <EvaluationDrawer row={drawer} open={!!drawer} onClose={() => setDrawer(null)} onAction={onAction} />
    </div>
  );
}
