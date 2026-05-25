import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon, ArrowUp, Check, CheckCircle2, Download, Eye, MessageCircle, Plus,
  Search, Timer, UserPlus,
} from 'lucide-react';
import { MainTable, TableToolbar } from '../../../components/common/table';
import { ticketsData } from '@/config/constants/support/mockData';
import {
  PRIORITY_CLR, PRIORITY_ORDER,
  PriorityBadge, SupportStatusBadge, CatTag, SlaBar,
  UserAvatar, SupportStatCard, SupportToast,
} from '@/features/support/components/SupportComponents';

const PER_PAGE = 8;

function TicketsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [priorityF, setPriorityF] = useState('all');
  const [catF, setCatF] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  const act = (msg) => { setToast(msg); };
  const cats = useMemo(() => ['all', ...new Set(ticketsData.map((ticket) => ticket.category))], []);

  const filtered = useMemo(() => {
    let rows = [...ticketsData];
    if (statusF !== 'all') rows = rows.filter((row) => row.status === statusF);
    if (priorityF !== 'all') rows = rows.filter((row) => row.priority === priorityF);
    if (catF !== 'all') rows = rows.filter((row) => row.category === catF);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((row) =>
        row.subject.toLowerCase().includes(q) ||
        row.user.toLowerCase().includes(q) ||
        row.id.includes(q) ||
        row.uid.includes(q)
      );
    }
    if (sortBy === 'priority') rows.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    if (sortBy === 'sla') rows.sort((a, b) => (a.slaMins ?? 9999) - (b.slaMins ?? 9999));
    if (sortBy === 'updated') rows.sort((a, b) => b.updated.localeCompare(a.updated));
    return rows;
  }, [search, statusF, priorityF, catF, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const breachedCount = ticketsData.filter((ticket) => ticket.slaMins != null && ticket.slaMins < 0).length;

  const stats = [
    { label: 'Total', val: ticketsData.length, color: 'var(--text-muted)' },
    { label: 'Open', val: ticketsData.filter((ticket) => ticket.status === 'OPEN').length, color: 'var(--positive)' },
    { label: 'Pending', val: ticketsData.filter((ticket) => ticket.status === 'PENDING').length, color: 'var(--warning)' },
    { label: 'Escalated', val: ticketsData.filter((ticket) => ticket.status === 'ESCALATED').length, color: 'var(--negative)', urgent: true },
    { label: 'Resolved', val: ticketsData.filter((ticket) => ticket.status === 'RESOLVED').length, color: 'var(--positive)' },
    { label: 'SLA Breach', val: breachedCount, color: 'var(--negative)', urgent: breachedCount > 0 },
  ];

  const columns = [
    { key: 'id', label: 'Ticket ID', render: (val) => <span className="font-mono text-[11px] font-bold text-brand">{val}</span> },
    {
      key: 'user',
      label: 'User',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <UserAvatar name={row.user} />
          <div>
            <div className="text-[12px] font-semibold text-text/85">{row.user}</div>
            <div className="font-mono text-[9.5px] text-text-muted/35">{row.uid}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (value, row) => (
        <div className="max-w-[260px]">
          <div className="truncate text-[12px] font-medium text-text/75">{value}</div>
          <div className="mt-0.5 flex flex-wrap gap-1">
            {row.tags.slice(0, 2).map((tag) => (
               <span key={tag} className="rounded-[3px] border border-border/20 px-1 py-px font-mono text-[8.5px] text-text-muted/35">#{tag}</span>
            ))}
            {row.replies > 0 && <span className="flex items-center gap-0.5 text-[8.5px] text-text-muted/30"><MessageCircle size={8} />{row.replies}</span>}
          </div>
        </div>
      ),
    },
    { key: 'priority', label: 'Priority', render: (value) => <PriorityBadge value={value} /> },
    { key: 'status', label: 'Status', render: (value) => <SupportStatusBadge value={value} /> },
    { key: 'category', label: 'Category', render: (value) => <CatTag value={value} /> },
    { key: 'owner', label: 'Owner', render: (value) => <span className={`text-[11px] ${value === 'Unassigned' ? 'font-bold text-negative/70' : 'text-text-muted/55'}`}>{value}</span> },
    { key: 'updated', label: 'Updated', render: (value) => <span className="font-mono text-[10.5px] text-text-muted/40">{value}</span> },
    { key: 'sla', label: 'SLA', render: (_, row) => <SlaBar pct={row.sla} slaMins={row.slaMins} /> },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={(event) => { event.stopPropagation(); navigate(`/support/tickets/${row.id}`); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-border/30 text-text-muted/40 transition-colors hover:text-text" title="Open"><Eye size={10} /></button>
          <button type="button" onClick={(event) => { event.stopPropagation(); act(`Reassigned: ${row.id}`); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-cyan/20 text-cyan/50 transition-colors hover:text-cyan" title="Reassign"><UserPlus size={10} /></button>
          <button type="button" onClick={(event) => { event.stopPropagation(); act(`Escalated: ${row.id}`); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-orange-500/20 text-orange-400/60 transition-colors hover:text-orange-400" title="Escalate"><ArrowUp size={10} /></button>
          <button type="button" onClick={(event) => { event.stopPropagation(); act(`Closed: ${row.id}`); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-positive/20 text-positive/50 transition-colors hover:text-positive" title="Close"><Check size={10} /></button>
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
            Helpdesk Tickets
          </h2>
          <p className="text-[12px] text-text-muted/55 mt-1.5 leading-snug max-w-lg">
            Manage user inquiries, technical support requests, and service issues.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => act('Exported tickets')}
            className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
          >
            <Download size={12} /> Export
          </button>
          <button
            type="button"
            onClick={() => act('New ticket form opened')}
            className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
          >
            <Plus size={12} /> New Ticket
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => <SupportStatCard key={stat.label} {...stat} />)}
      </div>

      {breachedCount > 0 && (
        <div className="flex items-start gap-3 rounded-[10px] border border-negative/20 bg-negative/[0.05] px-4 py-3">
          <AlertOctagon size={14} className="mt-0.5 flex-shrink-0 text-negative" />
          <div className="flex-1">
            <div className="text-[12px] font-bold text-negative">
              {breachedCount} Tickets Breached SLA
            </div>
            <div className="mt-0.5 text-[11px] text-negative/70">
              Immediate attention required. These tickets are past their committed response time.
            </div>
          </div>
          <button type="button" onClick={() => { setSortBy('sla'); setStatusF('all'); setPage(1); }} className="flex h-7 flex-shrink-0 items-center gap-1.5 rounded-[7px] border border-negative/25 bg-negative/[0.08] px-3 text-[10.5px] font-bold text-negative">
            <Timer size={10} />View Breached
          </button>
        </div>
      )}

      <SupportToast msg={toast} onDone={() => setToast(null)} />

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="Ticket Queue"
          count={filtered.length}
          accentColor="var(--brand)"
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder="Search by ID, user, subject…"
          filters={
            <>
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Status:</span>
                <select
                  value={statusF}
                  onChange={(e) => { setStatusF(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  <option value="all">ALL</option>
                  <option value="OPEN">OPEN</option>
                  <option value="PENDING">PENDING</option>
                  <option value="ESCALATED">ESCALATED</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Priority:</span>
                <select
                  value={priorityF}
                  onChange={(e) => { setPriorityF(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  <option value="all">ALL</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
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
                  {cats.map((c) => (
                    <option key={c} value={c}>{c.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  <option value="priority">Priority</option>
                  <option value="sla">SLA</option>
                  <option value="updated">Updated</option>
                </select>
              </div>
            </>
          }
        />

        <MainTable
          columns={columns}
          data={paginated}
          onRowClick={(row) => navigate(`/support/tickets/${row.id}`)}
          emptyTitle="No tickets match your filters"
          pagination={tableState}
          rowClassName={(row) => {
            const isBreached = row.slaMins != null && row.slaMins < 0;
            if (isBreached) return 'hover:bg-negative/5 hover:border-l-negative';
            if (row.priority === 'CRITICAL' || row.priority === 'HIGH') return 'hover:bg-warning/5 hover:border-l-warning';
            return 'hover:bg-brand/5 hover:border-l-brand';
          }}
        />
      </section>
    </div>
  );
}

export default TicketsPage;
