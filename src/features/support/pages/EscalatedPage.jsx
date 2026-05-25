import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle, AlertOctagon, Check, Download, Eye, UserPlus,
} from 'lucide-react';
import { MainTable, TableToolbar } from '../../../components/common/table';
import { escalatedData } from '@/config/constants/support/mockData';
import {
  PriorityBadge, SupportStatusBadge, CatTag, SlaBar,
  UserAvatar, SupportStatCard, SupportIconBtn, SupportToast,
} from '@/features/support/components/SupportComponents';

const PER_PAGE = 10;

function EscalatedPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [priorityF, setPriority] = useState('all');
  const [catF, setCatF] = useState('all');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  const act = (msg) => { setToast(msg); };

  const filtered = useMemo(() => {
    let rows = [...escalatedData];
    if (priorityF !== 'all') rows = rows.filter((r) => r.priority === priorityF);
    if (catF !== 'all') rows = rows.filter((r) => r.category === catF);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        r.subject.toLowerCase().includes(q) ||
        r.user.toLowerCase().includes(q) ||
        r.id.includes(q)
      );
    }
    return rows.sort((a, b) => (a.slaMins ?? 9999) - (b.slaMins ?? 9999));
  }, [search, priorityF, catF]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = [
    { label: 'Total Escalated', val: escalatedData.length, color: 'var(--negative)', urgent: true },
    { label: 'Critical Priority', val: escalatedData.filter((t) => t.priority === 'CRITICAL').length, color: 'var(--negative)', urgent: true },
    { label: 'SLA Breached', val: escalatedData.filter((t) => t.slaMins != null && t.slaMins < 0).length, color: 'var(--negative)', urgent: true },
    { label: 'Compliance', val: escalatedData.filter((t) => t.category === 'Compliance').length, color: 'var(--warning)' },
    { label: 'Financial', val: escalatedData.filter((t) => ['Finance', 'Prop'].includes(t.category)).length, color: 'var(--warning)' },
    { label: 'Unassigned', val: escalatedData.filter((t) => t.owner === 'Unassigned').length, color: 'var(--negative)', urgent: true },
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
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={(e) => { e.stopPropagation(); navigate(`/support/tickets/${row.id}`); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-border/25 text-text-muted/40 hover:text-text"><Eye size={10} /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); act(`Assigned: ${row.id}`); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-cyan/20 text-cyan/50 hover:text-cyan"><UserPlus size={10} /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); act(`Resolved: ${row.id}`); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-positive/20 text-positive/50 hover:text-positive"><Check size={10} /></button>
        </div>
      ),
    },
  ];

  const tableState = {
    page,
    pageSize: PER_PAGE,
    setPage,
    setPageSize: () => {},
    totalPages: totalPages
  };

  return (
    <div className="space-y-5 animate-fade-up">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/45 mb-1">
            Support Operations
          </p>
          <h2 className="text-[22px] font-black tracking-[-0.04em] text-text leading-none">
            Escalations
          </h2>
          <p className="text-[12px] text-text-muted/55 mt-1.5 leading-snug max-w-lg">
            High-priority issues requiring senior support review.
          </p>
        </div>
      </header>

      {/* ── Critical alert banner ── */}
      <div className="flex items-start gap-3 rounded-[12px] border border-negative/25 bg-negative/[0.06] px-5 py-4" style={{ boxShadow: '0 0 24px rgba(239,68,68,0.07)' }}>
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
          <SupportIconBtn label="Bulk Assign" Icon={UserPlus} variant="warning" small onClick={() => act('Bulk assign modal opened')} />
          <SupportIconBtn label="Escalation Report" Icon={Download} variant="default" small onClick={() => act('Report exported')} />
        </div>
      </div>

      {/* ── Stat strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((s) => (
          <SupportStatCard key={s.label} label={s.label} val={s.val} color={s.color} urgent={s.urgent} />
        ))}
      </div>

      <SupportToast msg={toast} onDone={() => setToast(null)} />

      {/* Escalated table */}
      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="Escalated Queue"
          count={filtered.length}
          accentColor="var(--negative)"
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder="Search escalated tickets…"
          filters={
            <>
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Priority:</span>
                <select
                  value={priorityF}
                  onChange={(e) => { setPriority(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  <option value="all">ALL</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Cat:</span>
                <select
                  value={catF}
                  onChange={(e) => { setCatF(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  <option value="all">ALL</option>
                  <option value="Finance">FINANCE</option>
                  <option value="Compliance">COMPLIANCE</option>
                  <option value="Account">ACCOUNT</option>
                  <option value="Prop">PROP</option>
                </select>
              </div>
            </>
          }
          actions={
            <SupportIconBtn label="Export" Icon={Download} variant="default" small onClick={() => act('Escalated report exported')} />
          }
        />

        <MainTable
          columns={columns}
          data={paginated}
          onRowClick={(row) => navigate(`/support/tickets/${row.id}`)}
          emptyTitle="No escalated tickets match filters"
          pagination={tableState}
          rowClassName={() => 'hover:bg-negative/5 hover:border-l-negative'}
        />
      </section>
    </div>
  );
}

export default EscalatedPage;
