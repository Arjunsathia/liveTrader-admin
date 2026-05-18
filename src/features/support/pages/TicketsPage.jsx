import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon, AlertTriangle, ArrowUp, Check, CheckCircle2,
  Download, Eye, Inbox, MessageCircle, Clock, Plus, Search,
  Timer, UserPlus,
} from 'lucide-react';
import { Card } from '@components/ui/Card';
import { Pagination } from '@components/tables/Pagination';
import { PageToolbar } from '@components/common/PageToolbar';
import { ticketsData } from '@features/support/data/support.data';
import {
  PRIORITY_CLR, PRIORITY_ORDER,
  PriorityBadge, SupportStatusBadge, CatTag, SlaBar,
  UserAvatar, SupportStatCard, SupportToast,
} from '@features/support/components/SupportShared';

const PER_PAGE = 8;

export function TicketsPage() {
  const navigate = useNavigate();
  const [search,         setSearch]   = useState('');
  const [statusF,        setStatusF]  = useState('all');
  const [priorityF,      setPriorityF]= useState('all');
  const [catF,           setCatF]     = useState('all');
  const [sortBy,         setSortBy]   = useState('priority');
  const [page,           setPage]     = useState(1);
  const [toast,          setToast]    = useState(null);

  const act = (msg) => { setToast(msg); };

  /* ── unique category list ── */
  const cats = useMemo(() => ['all', ...new Set(ticketsData.map((t) => t.category))], []);

  /* ── filtered + sorted rows ── */
  const filtered = useMemo(() => {
    let rows = [...ticketsData];
    if (statusF   !== 'all') rows = rows.filter((r) => r.status   === statusF);
    if (priorityF !== 'all') rows = rows.filter((r) => r.priority === priorityF);
    if (catF      !== 'all') rows = rows.filter((r) => r.category === catF);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        r.subject.toLowerCase().includes(q) ||
        r.user.toLowerCase().includes(q)    ||
        r.id.includes(q)                    ||
        r.uid.includes(q)
      );
    }
    if (sortBy === 'priority') rows.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    if (sortBy === 'sla')      rows.sort((a, b) => (a.slaMins ?? 9999) - (b.slaMins ?? 9999));
    if (sortBy === 'updated')  rows.sort((a, b) => b.updated.localeCompare(a.updated));
    return rows;
  }, [search, statusF, priorityF, catF, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const breachedCount = ticketsData.filter((t) => t.slaMins != null && t.slaMins < 0).length;

  /* ── stat strip ── */
  const stats = [
    { label: 'Total',     val: ticketsData.length,                                              color: 'var(--text-muted)' },
    { label: 'Open',      val: ticketsData.filter((t) => t.status === 'OPEN').length,            color: 'var(--positive)'  },
    { label: 'Pending',   val: ticketsData.filter((t) => t.status === 'PENDING').length,         color: 'var(--warning)'   },
    { label: 'Escalated', val: ticketsData.filter((t) => t.status === 'ESCALATED').length,       color: 'var(--negative)',  urgent: true },
    { label: 'Resolved',  val: ticketsData.filter((t) => t.status === 'RESOLVED').length,        color: 'var(--positive)'  },
    { label: 'SLA Breach',val: breachedCount,                                                   color: 'var(--negative)',  urgent: breachedCount > 0 },
  ];

  return (
    <div className="space-y-5">

      {/* ── Stat strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((s) => (
          <SupportStatCard key={s.label} label={s.label} val={s.val} color={s.color} urgent={s.urgent} />
        ))}
      </div>

      {/* ── SLA breach alert ── */}
      {breachedCount > 0 && (
        <div className="flex items-start gap-3 rounded-[10px] border border-negative/20 bg-negative/[0.05] px-4 py-3">
          <AlertOctagon size={14} className="text-negative flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-[12px] font-bold text-negative font-heading">
              {breachedCount} Ticket{breachedCount > 1 ? 's' : ''} Breached SLA
            </div>
            <div className="text-[11px] text-negative/70 font-heading mt-0.5">
              Immediate attention required. These tickets are past their committed response time.
            </div>
          </div>
          <button
            onClick={() => { setSortBy('sla'); setStatusF('all'); setPage(1); }}
            className="flex-shrink-0 flex items-center gap-1.5 h-7 px-3 rounded-[7px] border border-negative/25 bg-negative/[0.08] text-negative text-[10.5px] font-bold font-heading cursor-pointer hover:brightness-110"
          >
            <Timer size={10} />View Breached
          </button>
        </div>
      )}

      {/* ── Primary toolbar (search + status chips + sort + actions) ── */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-[340px]">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/30 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by ID, user, subject…"
              className="w-full h-8 pl-8 pr-3 rounded-[8px] border border-border/30 bg-bg/40 text-[12px] text-text placeholder:text-text-muted/25 outline-none focus:border-primary/30 transition-colors font-heading"
            />
          </div>

          {/* Status chips */}
          <div className="flex gap-1 flex-wrap">
            {['all', 'OPEN', 'PENDING', 'ESCALATED', 'RESOLVED'].map((f) => (
              <button
                key={f}
                onClick={() => { setStatusF(f); setPage(1); }}
                className={[
                  'px-2.5 h-8 rounded-[7px] text-[11px] font-bold font-heading uppercase tracking-wide cursor-pointer transition-all border',
                  statusF === f
                    ? 'bg-primary/[0.12] text-primary border-primary/20'
                    : 'border-border/30 text-text-muted/40 hover:text-text-muted hover:border-border/50 bg-transparent',
                ].join(' ')}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => act('Exported tickets')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[11px] font-semibold font-heading border border-border/30 bg-bg/40 text-text-muted/70 hover:text-text hover:border-border/50 cursor-pointer transition-all"
            >
              <Download size={12} />Export
            </button>
            <button
              onClick={() => act('New ticket form opened')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[11px] font-semibold font-heading border border-brand/30 bg-brand/[0.1] text-brand hover:brightness-110 cursor-pointer transition-all"
            >
              <Plus size={12} />New Ticket
            </button>
          </div>
        </div>

        {/* Secondary filter row (Priority · Category · Sort) */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Priority */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9.5px] font-black uppercase tracking-[0.15em] text-text-muted/30 font-heading">Priority:</span>
            {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((f) => {
              const c      = PRIORITY_CLR[f] || 'var(--primary)';
              const active = priorityF === f;
              return (
                <button
                  key={f}
                  onClick={() => { setPriorityF(f); setPage(1); }}
                  className="px-2 h-7 rounded-[6px] text-[10.5px] font-bold font-heading cursor-pointer transition-all border"
                  style={active
                    ? { color: f === 'all' ? 'var(--primary)' : c, background: `color-mix(in srgb, ${f === 'all' ? 'var(--primary)' : c} 12%, transparent)`, borderColor: `color-mix(in srgb, ${f === 'all' ? 'var(--primary)' : c} 25%, transparent)` }
                    : { color: 'var(--text-muted)', opacity: 0.45, background: 'transparent', borderColor: 'var(--border)' }}
                >
                  {f === 'all' ? 'All' : f}
                </button>
              );
            })}
          </div>

          <div className="w-px h-4 bg-border/30 flex-shrink-0" />

          {/* Category */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9.5px] font-black uppercase tracking-[0.15em] text-text-muted/30 font-heading">Cat:</span>
            {cats.map((f) => (
              <button
                key={f}
                onClick={() => { setCatF(f); setPage(1); }}
                className={[
                  'px-2 h-7 rounded-[6px] text-[10.5px] font-bold font-heading cursor-pointer transition-all border',
                  catF === f
                    ? 'bg-primary/[0.1] text-primary border-primary/20'
                    : 'border-border/20 text-text-muted/35 hover:text-text-muted bg-transparent',
                ].join(' ')}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-border/30 flex-shrink-0" />

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9.5px] font-black uppercase tracking-[0.15em] text-text-muted/30 font-heading">Sort:</span>
            {[['priority', 'Priority'], ['sla', 'SLA'], ['updated', 'Updated']].map(([k, l]) => (
              <button
                key={k}
                onClick={() => setSortBy(k)}
                className={[
                  'px-2 h-7 rounded-[6px] text-[10.5px] font-bold font-heading cursor-pointer transition-all border',
                  sortBy === k
                    ? 'bg-cyan/[0.1] text-cyan border-cyan/20'
                    : 'border-border/20 text-text-muted/35 hover:text-text-muted bg-transparent',
                ].join(' ')}
              >
                {l}
              </button>
            ))}
          </div>

          <span className="ml-auto text-[10.5px] text-text-muted/35 font-heading">{filtered.length} tickets</span>
        </div>
      </div>

      <SupportToast msg={toast} onDone={() => setToast(null)} />

      {/* ── Table ── */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border/20 bg-bg/20">
                {['Ticket ID', 'User', 'Subject', 'Priority', 'Status', 'Category', 'Owner', 'Updated', 'SLA', ''].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[9.5px] font-black uppercase tracking-[0.12em] text-text-muted/35 font-heading whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-text-muted/30 font-heading">
                    No tickets match your filters
                  </td>
                </tr>
              )}
              {paginated.map((row) => {
                const isCritical = row.priority === 'CRITICAL';
                const isBreached = row.slaMins != null && row.slaMins < 0;
                return (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/support/tickets/${row.id}`)}
                    className={[
                      'border-b border-border/10 cursor-pointer transition-all duration-150 group',
                      isCritical || isBreached ? 'bg-negative/[0.03] hover:bg-negative/[0.05]' : 'hover:bg-bg/40',
                    ].join(' ')}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-text-muted/55 text-[10.5px]">{row.id}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={row.user} />
                        <div>
                          <div className="text-[12px] font-semibold font-heading text-text/85">{row.user}</div>
                          <div className="text-[9.5px] font-mono text-text-muted/35">{row.uid}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[260px]">
                      <div className="truncate text-[12px] font-heading text-text/75 font-medium">{row.subject}</div>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {row.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[8.5px] font-mono px-1 py-px rounded-[3px] border border-border/20 text-text-muted/35">
                            #{tag}
                          </span>
                        ))}
                        {row.replies > 0 && (
                          <span className="text-[8.5px] font-heading text-text-muted/30 flex items-center gap-0.5">
                            <MessageCircle size={8} />{row.replies}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap"><PriorityBadge value={row.priority} /></td>
                    <td className="px-4 py-3 whitespace-nowrap"><SupportStatusBadge value={row.status} /></td>
                    <td className="px-4 py-3 whitespace-nowrap"><CatTag value={row.category} /></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[11px] font-heading ${row.owner === 'Unassigned' ? 'text-negative/70 font-bold' : 'text-text-muted/55'}`}>
                        {row.owner}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-text-muted/40 text-[10.5px]">{row.updated}</span>
                    </td>
                    <td className="px-4 py-3">
                      <SlaBar pct={row.sla} slaMins={row.slaMins} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/support/tickets/${row.id}`); }}
                          className="w-6 h-6 rounded-[5px] border border-border/30 flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer transition-colors"
                          title="Open"
                        >
                          <Eye size={10} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); act(`Reassigned: ${row.id}`); }}
                          className="w-6 h-6 rounded-[5px] border border-cyan/20 flex items-center justify-center text-cyan/50 hover:text-cyan cursor-pointer transition-colors"
                          title="Reassign"
                        >
                          <UserPlus size={10} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); act(`Escalated: ${row.id}`); }}
                          className="w-6 h-6 rounded-[5px] border border-orange-500/20 flex items-center justify-center text-orange-400/60 hover:text-orange-400 cursor-pointer transition-colors"
                          title="Escalate"
                        >
                          <ArrowUp size={10} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); act(`Closed: ${row.id}`); }}
                          className="w-6 h-6 rounded-[5px] border border-positive/20 flex items-center justify-center text-positive/50 hover:text-positive cursor-pointer transition-colors"
                          title="Close"
                        >
                          <Check size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border/15">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={PER_PAGE}
            onPageSizeChange={() => {}}
          />
        </div>
      </Card>
    </div>
  );
}
