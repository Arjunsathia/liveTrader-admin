import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle, AlertOctagon, Check, CreditCard, Download, Eye,
  Flag, ShieldAlert, Timer, UserPlus,
} from 'lucide-react';
import { Card } from '@components/ui/Card';
import { FeatureTable } from '@components/tables/FeatureTable';
import { Pagination } from '@components/tables/Pagination';
import { escalatedData } from '@features/support/data/support.data';
import {
  PRIORITY_CLR,
  PriorityBadge, SupportStatusBadge, CatTag, SlaBar,
  UserAvatar, SupportStatCard, SupportIconBtn, SupportToast,
} from '@features/support/components/SupportShared';

const PER_PAGE = 10;

export function EscalatedPage() {
  const navigate      = useNavigate();
  const [search]  = useState('');
  const [priorityF, setPriority] = useState('all');
  const [catF,    setCatF]    = useState('all');
  const [page,    setPage]    = useState(1);
  const [toast,   setToast]   = useState(null);

  const act = (msg) => { setToast(msg); };

  const filtered = useMemo(() => {
    let rows = [...escalatedData];
    if (priorityF !== 'all') rows = rows.filter((r) => r.priority === priorityF);
    if (catF      !== 'all') rows = rows.filter((r) => r.category === catF);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        r.subject.toLowerCase().includes(q) ||
        r.user.toLowerCase().includes(q)    ||
        r.id.includes(q)
      );
    }
    return rows.sort((a, b) => (a.slaMins ?? 9999) - (b.slaMins ?? 9999));
  }, [search, priorityF, catF]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = [
    { label: 'Total Escalated',   val: escalatedData.length,                                                      color: 'var(--negative)', urgent: true },
    { label: 'Critical Priority', val: escalatedData.filter((t) => t.priority === 'CRITICAL').length,             color: 'var(--negative)', urgent: true },
    { label: 'SLA Breached',      val: escalatedData.filter((t) => t.slaMins != null && t.slaMins < 0).length,    color: 'var(--negative)', urgent: true },
    { label: 'Compliance',        val: escalatedData.filter((t) => t.category === 'Compliance').length,           color: 'var(--warning)' },
    { label: 'Financial',         val: escalatedData.filter((t) => ['Finance', 'Prop'].includes(t.category)).length, color: 'var(--warning)' },
    { label: 'Unassigned',        val: escalatedData.filter((t) => t.owner === 'Unassigned').length,              color: 'var(--negative)', urgent: true },
  ];

  const columns = [
    {
      key: 'id',
      label: 'Ticket ID',
      render: (value, row) => (
        <div className="flex items-center gap-1.5">
          {row.priority === 'CRITICAL' && <AlertOctagon size={11} className="flex-shrink-0 animate-pulse text-negative" />}
          <span className="font-mono text-[10.5px] text-text-muted/55">{value}</span>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'User',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <UserAvatar name={row.user} />
          <div>
            <div className="text-[12px] font-semibold text-text/85">{row.user}</div>
            <div className="font-mono text-[9.5px] text-text-muted/35">{row.uid} · {row.region}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Issue',
      render: (value, row) => (
        <div className="max-w-[220px]">
          <div className="truncate text-[11.5px] font-medium text-text/75">{value}</div>
          <CatTag value={row.category} />
        </div>
      ),
    },
    { key: 'priority', label: 'Priority', render: (value) => <PriorityBadge value={value} /> },
    { key: 'escalationReason', label: 'Escalation Reason', render: (value) => <span className="line-clamp-1 text-[11px] text-warning/80">{value ?? 'Senior review required'}</span> },
    {
      key: 'owner',
      label: 'Owner',
      render: (value) => (
        <span className={`text-[11px] font-semibold ${value === 'Unassigned' ? 'text-negative' : 'text-text-muted/55'}`}>
          {value === 'Unassigned' && <AlertCircle size={10} className="mr-1 inline" />}
          {value}
        </span>
      ),
    },
    { key: 'sla', label: 'SLA Time Left', render: (_, row) => <SlaBar pct={row.sla} slaMins={row.slaMins} /> },
    { key: 'status', label: 'Status', render: (value) => <SupportStatusBadge value={value} /> },
    {
      key: '_actions',
      label: '',
      align: 'right',
      render: (_, row) => (
        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button type="button" onClick={(e) => { e.stopPropagation(); navigate(`/support/tickets/${row.id}`); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-border/25 text-text-muted/40 hover:text-text"><Eye size={10} /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); act(`Assigned: ${row.id}`); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-cyan/20 text-cyan/50 hover:text-cyan"><UserPlus size={10} /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); act(`Resolved: ${row.id}`); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-positive/20 text-positive/50 hover:text-positive"><Check size={10} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">

      {/* ── Critical alert banner ── */}
      <div
        className="flex items-start gap-3 rounded-[12px] border border-negative/25 bg-negative/[0.06] px-5 py-4"
        style={{ boxShadow: '0 0 24px rgba(239,68,68,0.07)' }}
      >
        <AlertOctagon size={16} className="text-negative flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="flex-1">
          <div className="text-[13px] font-bold text-negative font-heading tracking-[-0.01em]">
            {escalatedData.length} Escalated Ticket{escalatedData.length > 1 ? 's' : ''} Require Immediate Attention
          </div>
          <div className="text-[11.5px] text-negative/70 font-heading mt-1">
            {escalatedData.filter((t) => t.priority === 'CRITICAL').length} critical ·{' '}
            {escalatedData.filter((t) => t.slaMins != null && t.slaMins < 0).length} SLA breached ·{' '}
            {escalatedData.filter((t) => t.owner === 'Unassigned').length} unassigned. Senior review required.
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <SupportIconBtn label="Bulk Assign"        Icon={UserPlus}  variant="warning" small onClick={() => act('Bulk assign modal opened')} />
          <SupportIconBtn label="Escalation Report"  Icon={Download}  variant="default" small onClick={() => act('Report exported')} />
        </div>
      </div>

      {/* ── Stat strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((s) => (
          <SupportStatCard key={s.label} label={s.label} val={s.val} color={s.color} urgent={s.urgent} />
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Priority */}
        <div className="flex gap-1">
          {['all', 'CRITICAL', 'HIGH'].map((f) => {
            const c      = PRIORITY_CLR[f] || 'var(--primary)';
            const active = priorityF === f;
            return (
              <button
                key={f}
                onClick={() => { setPriority(f); setPage(1); }}
                className="px-2.5 h-8 rounded-[7px] text-[11px] font-bold font-heading cursor-pointer transition-all border"
                style={active
                  ? { color: f === 'all' ? 'var(--primary)' : c, background: `color-mix(in srgb, ${f === 'all' ? 'var(--primary)' : c} 14%, transparent)`, borderColor: `color-mix(in srgb, ${f === 'all' ? 'var(--primary)' : c} 28%, transparent)` }
                  : { color: 'var(--text-muted)', opacity: 0.45, background: 'transparent', borderColor: 'var(--border)' }}
              >
                {f === 'all' ? 'All' : f}
              </button>
            );
          })}
        </div>
        {/* Category */}
        <div className="flex gap-1 flex-wrap">
          {['all', 'Finance', 'Compliance', 'Account', 'Prop'].map((f) => (
            <button
              key={f}
              onClick={() => { setCatF(f); setPage(1); }}
              className={[
                'px-2.5 h-8 rounded-[7px] text-[11px] font-bold font-heading cursor-pointer transition-all border',
                catF === f
                  ? 'bg-primary/[0.1] text-primary border-primary/20'
                  : 'border-border/25 text-text-muted/40 hover:text-text-muted bg-transparent',
              ].join(' ')}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <SupportIconBtn label="Export" Icon={Download} variant="default" small onClick={() => act('Escalated report exported')} />
        </div>
      </div>

      <SupportToast msg={toast} onDone={() => setToast(null)} />

      {/* Escalated table */}
      <Card padding={false}>
        <FeatureTable
          columns={columns}
          data={paginated}
          onRowClick={(row) => navigate(`/support/tickets/${row.id}`)}
          emptyMsg="No escalated tickets match filters"
          footer={totalPages > 1 ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              pageSize={PER_PAGE}
              onPageSizeChange={() => {}}
            />
          ) : null}
        />
      </Card>
    </div>
  );
}
