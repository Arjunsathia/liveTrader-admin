import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon, ArrowUp, Check, CheckCircle2, Download, Eye, MessageCircle, Plus,
  Search, Timer, UserPlus,
} from 'lucide-react';
import { Card } from '@components/ui/Card';
import { FeatureTable } from '@components/tables/FeatureTable';
import { Pagination } from '@components/tables/Pagination';
import { ticketsData } from '@features/support/data/support.data';
import {
  PRIORITY_CLR, PRIORITY_ORDER,
  PriorityBadge, SupportStatusBadge, CatTag, SlaBar,
  UserAvatar, SupportStatCard, SupportToast,
} from '@features/support/components/SupportShared';

const PER_PAGE = 8;

export function TicketsPage() {
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
    { key: 'id', label: 'Ticket ID', type: 'mono' },
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
      key: '_actions',
      label: '',
      align: 'right',
      render: (_, row) => (
        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button type="button" onClick={(event) => { event.stopPropagation(); navigate(`/support/tickets/${row.id}`); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-border/30 text-text-muted/40 transition-colors hover:text-text" title="Open"><Eye size={10} /></button>
          <button type="button" onClick={(event) => { event.stopPropagation(); act(`Reassigned: ${row.id}`); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-cyan/20 text-cyan/50 transition-colors hover:text-cyan" title="Reassign"><UserPlus size={10} /></button>
          <button type="button" onClick={(event) => { event.stopPropagation(); act(`Escalated: ${row.id}`); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-orange-500/20 text-orange-400/60 transition-colors hover:text-orange-400" title="Escalate"><ArrowUp size={10} /></button>
          <button type="button" onClick={(event) => { event.stopPropagation(); act(`Closed: ${row.id}`); }} className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-positive/20 text-positive/50 transition-colors hover:text-positive" title="Close"><Check size={10} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => <SupportStatCard key={stat.label} {...stat} />)}
      </div>

      {breachedCount > 0 && (
        <div className="flex items-start gap-3 rounded-[10px] border border-negative/20 bg-negative/[0.05] px-4 py-3">
          <AlertOctagon size={14} className="mt-0.5 flex-shrink-0 text-negative" />
          <div className="flex-1">
            <div className="text-[12px] font-bold text-negative">{breachedCount} Tickets Breached SLA</div>
            <div className="mt-0.5 text-[11px] text-negative/70">Immediate attention required. These tickets are past their committed response time.</div>
          </div>
          <button type="button" onClick={() => { setSortBy('sla'); setStatusF('all'); setPage(1); }} className="flex h-7 flex-shrink-0 items-center gap-1.5 rounded-[7px] border border-negative/25 bg-negative/[0.08] px-3 text-[10.5px] font-bold text-negative">
            <Timer size={10} />View Breached
          </button>
        </div>
      )}

      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1 max-w-[340px]">
            <Search size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/30" />
            <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search by ID, user, subject..." className="h-8 w-full rounded-[8px] border border-border/30 bg-bg/40 pl-8 pr-3 text-[12px] text-text outline-none placeholder:text-text-muted/25 focus:border-primary/30" />
          </div>
          <div className="flex flex-wrap gap-1">
            {['all', 'OPEN', 'PENDING', 'ESCALATED', 'RESOLVED'].map((filter) => (
              <button key={filter} type="button" onClick={() => { setStatusF(filter); setPage(1); }} className={`h-8 rounded-[7px] border px-2.5 text-[11px] font-bold uppercase tracking-wide transition-all ${statusF === filter ? 'border-primary/20 bg-primary/[0.12] text-primary' : 'border-border/30 bg-transparent text-text-muted/40 hover:text-text-muted'}`}>
                {filter === 'all' ? 'All' : filter}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <button type="button" onClick={() => act('Exported tickets')} className="flex h-8 items-center gap-1.5 rounded-[8px] border border-border/30 bg-bg/40 px-3 text-[11px] font-semibold text-text-muted/70"><Download size={12} />Export</button>
            <button type="button" onClick={() => act('New ticket form opened')} className="flex h-8 items-center gap-1.5 rounded-[8px] border border-brand/30 bg-brand/[0.1] px-3 text-[11px] font-semibold text-brand"><Plus size={12} />New Ticket</button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[9.5px] font-black uppercase tracking-[0.15em] text-text-muted/30">Priority:</span>
          {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((filter) => (
            <button key={filter} type="button" onClick={() => { setPriorityF(filter); setPage(1); }} className={`h-7 rounded-[6px] border px-2 text-[10.5px] font-bold ${priorityF === filter ? 'border-primary/25 bg-primary/[0.1] text-primary' : 'border-border/20 bg-transparent text-text-muted/45'}`}>
              {filter === 'all' ? 'All' : filter}
            </button>
          ))}
          <span className="text-[9.5px] font-black uppercase tracking-[0.15em] text-text-muted/30">Cat:</span>
          {cats.map((filter) => (
            <button key={filter} type="button" onClick={() => { setCatF(filter); setPage(1); }} className={`h-7 rounded-[6px] border px-2 text-[10.5px] font-bold ${catF === filter ? 'border-primary/20 bg-primary/[0.1] text-primary' : 'border-border/20 bg-transparent text-text-muted/35'}`}>
              {filter === 'all' ? 'All' : filter}
            </button>
          ))}
          <span className="text-[9.5px] font-black uppercase tracking-[0.15em] text-text-muted/30">Sort:</span>
          {[
            ['priority', 'Priority'],
            ['sla', 'SLA'],
            ['updated', 'Updated'],
          ].map(([key, label]) => (
            <button key={key} type="button" onClick={() => setSortBy(key)} className={`h-7 rounded-[6px] border px-2 text-[10.5px] font-bold ${sortBy === key ? 'border-cyan/20 bg-cyan/[0.1] text-cyan' : 'border-border/20 bg-transparent text-text-muted/35'}`}>{label}</button>
          ))}
          <span className="ml-auto text-[10.5px] text-text-muted/35">{filtered.length} tickets</span>
        </div>
      </div>

      <SupportToast msg={toast} onDone={() => setToast(null)} />

      <Card padding={false}>
        <FeatureTable
          columns={columns}
          data={paginated}
          onRowClick={(row) => navigate(`/support/tickets/${row.id}`)}
          emptyMsg="No tickets match your filters"
          footer={(
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              pageSize={PER_PAGE}
              onPageSizeChange={() => {}}
            />
          )}
        />
      </Card>
    </div>
  );
}
