import React, { useState, useMemo } from 'react';
import { Check, Download, Edit2, Lock, UserPlus, X } from 'lucide-react';
import { PageToolbar } from '../../../components/shared/PageToolbar';
import { Card } from '../../../components/ui/Card';
import { IBTable } from '../components/IBTable';
import { IBBadge, IBTierBadge, TraderAvatar, IBToast } from '../components/IBShared';
import { ReferralDrawer } from '../components/IBDrawer';
import { referralsRows, REFERRAL_FILTERS } from '../configs/referrals.config';

export function ReferralsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast]   = useState(null);
  const act = (msg, id) => { setToast(`${msg}: ${id}`); setTimeout(() => setToast(null), 3000); };

  const filtered = useMemo(() => {
    let rows = referralsRows;
    if (filter !== 'ALL') rows = rows.filter(r => r.status === filter || r.tier === filter);
    if (search) rows = rows.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.id.includes(search)
    );
    return rows;
  }, [search, filter]);

  const cols = [
    { key: 'id',   label: 'ID',       render: v => <span className="font-mono text-text-muted/55 text-[10.5px]">{v}</span> },
    { key: 'name', label: 'Partner',  render: (v, r) => (
        <div className="flex items-center gap-2.5">
          <TraderAvatar name={v} />
          <div>
            <div className="text-[12px] font-semibold font-heading text-text/82">{v}</div>
            <div className="text-[10px] font-mono text-text-muted/40">{r.code}</div>
          </div>
        </div>
    )},
    { key: 'region',       label: 'Region',     render: v => <span className="text-text-muted/55 font-heading font-semibold text-[11px]">{v}</span> },
    { key: 'referred',     label: 'Referred',   render: v => <span className="font-mono font-bold text-brand">{v?.toLocaleString()}</span> },
    { key: 'active',       label: 'Active',     render: v => <span className="font-mono text-positive font-semibold">{v?.toLocaleString()}</span> },
    { key: 'share',        label: 'Rev. Share', render: v => <span className="font-mono font-bold text-warning">{v}</span> },
    { key: 'tier',         label: 'Tier',       render: v => <IBTierBadge value={v} /> },
    { key: 'status',       label: 'Status',     render: v => <IBBadge value={v} /> },
    { key: 'lastActivity', label: 'Last Active',render: v => <span className="font-mono text-text-muted/40 text-[10.5px]">{v}</span> },
    { key: '_a', label: '', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={e => { e.stopPropagation(); act('Edited', r.id); }} className="w-6 h-6 rounded-[5px] border border-border/30 flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer"><Edit2 size={10} /></button>
          <button onClick={e => { e.stopPropagation(); act('Suspended', r.id); }} className="w-6 h-6 rounded-[5px] border border-negative/20 flex items-center justify-center text-negative/50 hover:text-negative cursor-pointer"><Lock size={10} /></button>
        </div>
    )},
  ];

  return (
    <div className="space-y-4">
      <PageToolbar
        search={search} onSearchChange={setSearch} placeholder="Search partners, codes, IDs…"
        filterSets={[{ label: 'Status / Tier', get: filter === 'ALL' ? 'all' : filter, set: v => setFilter(v === 'all' ? 'ALL' : v), opts: REFERRAL_FILTERS.map(f => ({ value: f, label: f })) }]}
        actions={[
          { label: 'Add IB Partner', icon: UserPlus, variant: 'primary', onClick: () => act('Add IB', 'form opened') },
          { label: 'Export',         icon: Download,                     onClick: () => act('Exported', 'referrals CSV') },
        ]}
      />
      <IBToast msg={toast} />
      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'Total IBs',  val: referralsRows.length,                                             color: 'var(--text-muted)' },
          { label: 'Active',     val: referralsRows.filter(r => r.status === 'ACTIVE').length,          color: 'var(--positive)'   },
          { label: 'Paused',     val: referralsRows.filter(r => r.status === 'PAUSED').length,          color: 'var(--warning)'    },
          { label: 'Suspended',  val: referralsRows.filter(r => r.status === 'SUSPENDED').length,       color: 'var(--negative)'   },
          { label: 'Total Refs', val: referralsRows.reduce((s, r) => s + r.referred, 0).toLocaleString(),color: 'var(--brand)'     },
        ].map(p => (
          <div key={p.label} className="flex items-center gap-2 rounded-[8px] border border-border/30 bg-bg/60 px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-[11px] text-text-muted/50 font-heading">{p.label}</span>
            <span className="text-[11px] font-mono font-bold" style={{ color: p.color }}>{p.val}</span>
          </div>
        ))}
      </div>
      <Card title="IB Partners" subtitle={`${filtered.length} record${filtered.length !== 1 ? 's' : ''} matched · click row to open`} padding={false}>
        <IBTable cols={cols} rows={filtered} onRow={r => setDrawer(r)} />
      </Card>
      <ReferralDrawer row={drawer} open={!!drawer} onClose={() => setDrawer(null)} onAction={act} />
    </div>
  );
}
