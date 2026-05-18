import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle, AlertOctagon, Check, CreditCard, Download, Eye,
  Flag, ShieldAlert, Timer, UserPlus,
} from 'lucide-react';
import { Card } from '@components/ui/Card';
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
  const [search,  setSearch]  = useState('');
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

      {/* ── Escalated table ── */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-negative/[0.12]" style={{ background: 'color-mix(in srgb,var(--negative) 4%, transparent)' }}>
                {['Ticket ID', 'User', 'Issue', 'Priority', 'Escalation Reason', 'Owner', 'SLA Time Left', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[9.5px] font-black uppercase tracking-[0.12em] text-negative/40 font-heading whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-text-muted/30 font-heading">
                    No escalated tickets match filters
                  </td>
                </tr>
              )}
              {paginated.map((row) => {
                const isUnassigned = row.owner === 'Unassigned';
                return (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/support/tickets/${row.id}`)}
                    className={[
                      'border-b border-border/10 cursor-pointer transition-all duration-150 group',
                      row.priority === 'CRITICAL' ? 'bg-negative/[0.04] hover:bg-negative/[0.07]' : 'hover:bg-bg/40',
                    ].join(' ')}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {row.priority === 'CRITICAL' && (
                          <AlertOctagon size={11} className="text-negative animate-pulse flex-shrink-0" />
                        )}
                        <span className="font-mono text-text-muted/55 text-[10.5px]">{row.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={row.user} />
                        <div>
                          <div className="text-[12px] font-semibold font-heading text-text/85">{row.user}</div>
                          <div className="text-[9.5px] font-mono text-text-muted/35">{row.uid} · {row.region}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="truncate text-[11.5px] font-heading text-text/75 font-medium">{row.subject}</div>
                      <CatTag value={row.category} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap"><PriorityBadge value={row.priority} /></td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <span className="text-[11px] font-heading text-warning/80 line-clamp-1">
                        {row.escalationReason ?? 'Senior review required'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[11px] font-heading font-semibold ${isUnassigned ? 'text-negative' : 'text-text-muted/55'}`}>
                        {isUnassigned && <AlertCircle size={10} className="inline mr-1" />}
                        {row.owner}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <SlaBar pct={row.sla} slaMins={row.slaMins} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap"><SupportStatusBadge value={row.status} /></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/support/tickets/${row.id}`); }} className="w-6 h-6 rounded-[5px] border border-border/25 flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer"><Eye size={10} /></button>
                        <button onClick={(e) => { e.stopPropagation(); act(`Assigned: ${row.id}`); }} className="w-6 h-6 rounded-[5px] border border-cyan/20 flex items-center justify-center text-cyan/50 hover:text-cyan cursor-pointer"><UserPlus size={10} /></button>
                        <button onClick={(e) => { e.stopPropagation(); act(`Resolved: ${row.id}`); }} className="w-6 h-6 rounded-[5px] border border-positive/20 flex items-center justify-center text-positive/50 hover:text-positive cursor-pointer"><Check size={10} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="border-t border-border/15">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              pageSize={PER_PAGE}
              onPageSizeChange={() => {}}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
