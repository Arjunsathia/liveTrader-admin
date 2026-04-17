import React, { useState, useMemo } from 'react';
import { Check, CheckCircle2, Download, PauseCircle, X } from 'lucide-react';
import { PageToolbar } from '../../../components/toolbar/PageToolbar';
import { Card } from '../../../components/ui/Card';
import { FeatureTable } from '../../../components/tables/FeatureTable';
import { IBBadge, IBTierBadge, TraderAvatar, IBToast, TableActionBtn } from '../components/IBSystemShared';
import { CommissionDrawer } from '../components/IBDrawer';
import { commissionsRows, COMMISSION_FILTERS } from '../configs/commissions.config';

export function CommissionsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast]   = useState(null);
  const act = (msg, id) => { setToast(`${msg}: ${id}`); setTimeout(() => setToast(null), 3000); };

  const filtered = useMemo(() => {
    let rows = commissionsRows;
    if (filter !== 'ALL') rows = rows.filter(r => r.payout === filter || r.approval === filter);
    if (search) rows = rows.filter(r =>
      r.partner.toLowerCase().includes(search.toLowerCase()) ||
      r.id.includes(search) || r.user.toLowerCase().includes(search.toLowerCase())
    );
    return rows;
  }, [search, filter]);

  const totalAmt = commissionsRows.reduce((s, r) => s + parseFloat(r.amount.replace(/[$,]/g, '')), 0);

  const cols = [
    { key: 'id',      label: 'ID',           render: v => <span className="font-mono text-text-muted/55 text-[10.5px]">{v}</span> },
    { key: 'partner', label: 'Partner',       render: v => <div className="flex items-center gap-2"><TraderAvatar name={v} /><span className="text-[12px] font-semibold font-heading text-text/82">{v}</span></div> },
    { key: 'user',    label: 'Referred User', render: v => <span className="text-text-muted/60 font-heading">{v}</span> },
    { key: 'source',  label: 'Source',        render: v => <span className="text-[10.5px] text-text-muted/55 font-heading border border-border/30 px-1.5 py-0.5 rounded-[4px]">{v}</span> },
    { key: 'amount',  label: 'Amount',        render: v => <span className="font-mono font-bold text-brand">{v}</span> },
    { key: 'tier',    label: 'Tier',          render: v => <IBTierBadge value={v} /> },
    { key: 'payout',  label: 'Payout State',  render: v => <IBBadge value={v} /> },
    { key: 'approval',label: 'Approval',      render: v => <IBBadge value={v} /> },
    { key: 'date',    label: 'Date',          render: v => <span className="font-mono text-text-muted/40 text-[10.5px]">{v}</span> },
    { key: '_a', label: '', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {r.approval === 'REVIEW' && <>
            <TableActionBtn variant="success" Icon={Check} onClick={e => { e.stopPropagation(); act('Approved', r.id); }} />
            <TableActionBtn variant="danger" Icon={X} onClick={e => { e.stopPropagation(); act('Rejected', r.id); }} />
          </>}
          <TableActionBtn variant="default" Icon={PauseCircle} onClick={e => { e.stopPropagation(); act('Held', r.id); }} />
        </div>
    )},
  ];

  return (
    <div className="space-y-4">
      <PageToolbar
        search={search} onSearchChange={setSearch} placeholder="Search partner, user, commission ID…"
        filterSets={[{ label: 'State', get: filter === 'ALL' ? 'all' : filter, set: v => setFilter(v === 'all' ? 'ALL' : v), opts: COMMISSION_FILTERS.map(f => ({ value: f, label: f })) }]}
        actions={[
          { label: 'Bulk Approve', icon: CheckCircle2, variant: 'primary', onClick: () => act('Bulk approved', 'REVIEW items') },
          { label: 'Export',       icon: Download,                         onClick: () => act('Exported', 'commissions CSV') },
        ]}
      />
      <IBToast msg={toast} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Commission', val: `$${totalAmt.toLocaleString()}`,                                             color: 'var(--brand)'    },
          { label: 'Approved',         val: commissionsRows.filter(r => r.approval === 'APPROVED').length + ' records', color: 'var(--positive)' },
          { label: 'Under Review',     val: commissionsRows.filter(r => r.approval === 'REVIEW').length   + ' records', color: 'var(--warning)'  },
          { label: 'Held',             val: commissionsRows.filter(r => r.payout   === 'HELD').length     + ' records', color: 'var(--negative)' },
        ].map(s => (
          <div key={s.label} className="rounded-[10px] border border-border/30 bg-surface-elevated shadow-card-subtle px-4 py-3">
            <div className="text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading mb-1.5">{s.label}</div>
            <div className="text-[17px] font-bold font-heading tracking-[-0.02em]" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>
      <Card title="Commission Records" subtitle={`${filtered.length} record${filtered.length !== 1 ? 's' : ''} matched · click row to open`} padding={false}>
        <FeatureTable cols={cols} rows={filtered} onRow={r => setDrawer(r)} />
      </Card>
      <CommissionDrawer row={drawer} open={!!drawer} onClose={() => setDrawer(null)} onAction={act} />
    </div>
  );
}
