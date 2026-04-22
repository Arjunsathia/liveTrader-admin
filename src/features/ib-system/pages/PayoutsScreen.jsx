import React, { useState, useMemo } from 'react';
import { AlertOctagon, Check, CheckCircle2, Download, Flag, ShieldAlert, X } from 'lucide-react';
import { PageToolbar } from '../../../components/common/PageToolbar';
import { Card } from '../../../components/ui/Card';
import { FeatureTable } from '../../../components/tables/FeatureTable';
import { IBBadge, IBRiskBadge, TraderAvatar, IBToast, TableActionBtn } from '../components/IBSystemShared';
import { PayoutDrawer } from '../components/IBDrawer';
import { payoutsRows, PAYOUT_FILTERS } from '../data/workspaces/payouts.workspace';

export function PayoutsScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast]   = useState(null);
  const act = (msg, id) => { setToast(`${msg}: ${id}`); setTimeout(() => setToast(null), 3000); };

  const filtered = useMemo(() => {
    let rows = payoutsRows;
    if (filter !== 'ALL') rows = rows.filter(r => r.status === filter || (filter === 'HIGH_RISK' && r.risk === 'HIGH'));
    if (search) rows = rows.filter(r => r.partner.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search));
    return rows;
  }, [search, filter]);

  const totalPending = payoutsRows
    .filter(r => r.status === 'PENDING' || r.status === 'REVIEW')
    .reduce((s, r) => s + parseFloat(r.amount.replace(/[$,]/g, '')), 0);

  const cols = [
    { key: 'id',          label: 'Payout ID', render: v => <span className="font-mono text-text-muted/55 text-[10.5px]">{v}</span> },
    { key: 'partner',     label: 'Partner',   render: v => <div className="flex items-center gap-2"><TraderAvatar name={v} /><span className={`text-[12px] font-semibold font-heading ${v.startsWith('unknown') ? 'text-negative' : 'text-text/82'}`}>{v}</span></div> },
    { key: 'amount',      label: 'Amount',    render: v => <span className="font-mono font-bold text-brand text-[12.5px]">{v}</span> },
    { key: 'method',      label: 'Method',    render: v => <span className="text-[10.5px] font-heading border border-border/30 px-1.5 py-0.5 rounded-[4px] text-text-muted/55">{v}</span> },
    { key: 'status',      label: 'Status',    render: v => <IBBadge value={v} /> },
    { key: 'risk',        label: 'Risk',      render: v => <IBRiskBadge value={v} /> },
    { key: 'requestedAt', label: 'Requested', render: v => <span className="font-mono text-text-muted/40 text-[10.5px]">{v}</span> },
    { key: 'processedBy', label: 'Processed', render: v => <span className="font-heading text-text-muted/50">{v}</span> },
    { key: '_a', label: '', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {(r.status === 'PENDING' || r.status === 'REVIEW') && (
            <TableActionBtn variant="success" Icon={Check} onClick={e => { e.stopPropagation(); act('Approved', r.id); }} />
          )}
          <TableActionBtn variant="danger" Icon={X} onClick={e => { e.stopPropagation(); act('Rejected', r.id); }} />
          <TableActionBtn variant="warning" Icon={Flag} onClick={e => { e.stopPropagation(); act('Flagged', r.id); }} />
        </div>
    )},
  ];

  return (
    <div className="space-y-4">
      <PageToolbar
        search={search} onSearchChange={setSearch} placeholder="Search partner, payout ID…"
        filterSets={[{ label: 'Status', get: filter === 'ALL' ? 'all' : filter, set: v => setFilter(v === 'all' ? 'ALL' : v), opts: PAYOUT_FILTERS.map(f => ({ value: f, label: f })) }]}
        actions={[
          { label: 'Batch Approve', icon: CheckCircle2, variant: 'primary', onClick: () => act('Batch approved', 'PENDING') },
          { label: 'Risk Export',   icon: ShieldAlert,                      onClick: () => act('Exported', 'risk report') },
          { label: 'Export CSV',    icon: Download,                         onClick: () => act('Exported', 'payouts CSV') },
        ]}
      />
      <IBToast msg={toast} />
      {payoutsRows.filter(r => r.risk === 'HIGH' && ['PENDING','REVIEW','FROZEN'].includes(r.status)).length > 0 && (
        <div className="flex items-start gap-3 rounded-[10px] border border-negative/20 bg-negative/[0.05] px-4 py-3">
          <AlertOctagon size={14} className="text-negative flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[12px] font-bold text-negative font-heading">High-Risk Payouts Require Manual Review</div>
            <div className="text-[11px] text-negative/70 font-heading mt-0.5">{payoutsRows.filter(r => r.risk === 'HIGH' && ['PENDING','REVIEW','FROZEN'].includes(r.status)).length} payout(s) flagged — verify partner identity and fund source before processing.</div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending Value',   val: `$${totalPending.toLocaleString()}`,                            color: 'var(--warning)'  },
          { label: 'Pending Count',   val: payoutsRows.filter(r => r.status === 'PENDING').length,         color: 'var(--warning)'  },
          { label: 'High Risk',       val: payoutsRows.filter(r => r.risk === 'HIGH').length + ' items',   color: 'var(--negative)' },
          { label: 'Paid This Month', val: payoutsRows.filter(r => r.status === 'PAID').length + ' items', color: 'var(--positive)' },
        ].map(s => (
          <div key={s.label} className="rounded-[10px] border border-border/30 bg-surface-elevated shadow-card-subtle px-4 py-3">
            <div className="text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading mb-1.5">{s.label}</div>
            <div className="text-[18px] font-bold font-heading tracking-[-0.02em]" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>
      <Card title="Payout Requests" subtitle={`${filtered.length} record${filtered.length !== 1 ? 's' : ''} matched · click row to open`} padding={false}>
        <FeatureTable cols={cols} rows={filtered} onRow={r => setDrawer(r)} />
      </Card>
      <PayoutDrawer row={drawer} open={!!drawer} onClose={() => setDrawer(null)} onAction={act} />
    </div>
  );
}
