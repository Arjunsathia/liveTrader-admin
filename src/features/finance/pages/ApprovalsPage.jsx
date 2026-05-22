import React, { useState, useMemo } from 'react';
import { ArrowUpRight, Check, CheckCircle2, Clock, Copy, Download, Eye, FileText, Lock, MessageSquare, ShieldAlert, Timer, User, X, XCircle, Zap, Search } from 'lucide-react';
import { PageShell } from '../../../components/layout/PageShell';
import { approvalsData, RISK_CLR } from '../data/mockData';
import { KpiCard, StatusBadge, RiskBadge, PriorityBadge, Toast, IconBtn } from '../components/FinanceComponents';
import { UserCell, FinanceDrawer, DrawerSection, DF, DGrid, DrawerNoteEditor, RiskPanel, Pagination } from '../components/FinanceDrawer';

const PAGE = {
  accent: 'var(--warning)',
  eyebrow: 'Finance Operations',
  title: 'Manual Approvals',
  description: 'AML thresholds, high-risk flags, and daily limit compliance audits requiring reviewer sign-off.',
};

export function ApprovalsPage() {
  const [search, setSearch] = useState('');
  const [typeF, setTypeF] = useState('ALL');
  const [riskF, setRiskF] = useState('ALL');
  const [priorityF, setPriorityF] = useState('ALL');
  const [statusF, setStatusF] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);
  
  const PER = 7;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  const filtered = useMemo(() => {
    let r = [...approvalsData];
    if (typeF !== 'ALL') r = r.filter(x => x.type === typeF);
    if (riskF !== 'ALL') r = r.filter(x => x.risk === riskF);
    if (priorityF !== 'ALL') r = r.filter(x => x.priority === priorityF);
    if (statusF !== 'ALL') r = r.filter(x => x.status === statusF);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(x => 
        x.id.toLowerCase().includes(q) || 
        x.user.name.toLowerCase().includes(q) || 
        x.rule.toLowerCase().includes(q)
      );
    }
    return r;
  }, [search, typeF, riskF, priorityF, statusF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);

  const kpis = [
    { label: 'Pending Approvals', value: approvalsData.filter(a => a.status === 'PENDING').length, Icon: Clock, accent: 'var(--warning)', sub: 'Awaiting decision' },
    { label: 'SLA Breaches', value: approvalsData.filter(a => a.sla < 20 && a.status === 'PENDING').length, Icon: Timer, accent: 'var(--negative)', sub: 'Past SLA threshold', urgent: true },
    { label: 'High Risk', value: approvalsData.filter(a => a.risk === 'HIGH').length, Icon: ShieldAlert, accent: 'var(--negative)', sub: 'Need compliance sign-off', urgent: true },
    { label: 'Auto-Approved', value: 0, Icon: Zap, accent: 'var(--positive)', sub: 'By rules engine' },
    { label: 'Rejected', value: approvalsData.filter(a => a.status === 'REJECTED').length, Icon: XCircle, accent: 'var(--negative)', sub: 'Declined by reviewer' },
    { label: 'Escalated', value: approvalsData.filter(a => a.status === 'ESCALATED').length, Icon: ArrowUpRight, accent: 'var(--warning)', sub: 'Senior review needed', urgent: true },
  ];

  const SlaBar = ({ pct }) => {
    const color = pct === 0 ? 'var(--negative)' : pct < 30 ? 'var(--warning)' : 'var(--positive)';
    return (
      <div className="flex items-center gap-2 min-w-[85px]">
        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(0, pct)}%`, background: color }} />
        </div>
        <span className="text-[10px] font-mono font-bold flex-shrink-0" style={{ color }}>{pct}%</span>
      </div>
    );
  };

  return (
    <PageShell>
      <div className="space-y-5 animate-fade-up">

        {/* ── Page Header ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/45 mb-1">
              {PAGE.eyebrow}
            </p>
            <h2 className="text-[22px] font-black tracking-[-0.04em] text-text leading-none">
              {PAGE.title}
            </h2>
            <p className="text-[12px] text-text-muted/55 mt-1.5 leading-snug max-w-lg">
              {PAGE.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => act('Bulk approved', 'eligible items')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              <CheckCircle2 size={12} /> Bulk Approve
            </button>
            <button
              type="button"
              onClick={() => act('Exported', 'approvals queue')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export Approvals
            </button>
          </div>
        </header>

        {/* ── KPI Grid ── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </section>

        {/* SLA Breaches alert */}
        {approvalsData.filter(a => a.status === 'PENDING' && a.sla < 20).length > 0 && (
          <div className="flex items-start gap-3 rounded-[12px] border border-negative/20 bg-negative/[0.04] px-4 py-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="relative mt-0.5 shrink-0 flex items-center justify-center">
              <span className="absolute h-2 w-2 animate-pulse rounded-full bg-negative" />
              <Timer size={14} className="text-negative relative z-10" />
            </div>
            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h4 className="text-[12px] font-bold text-negative font-heading">
                  {approvalsData.filter(a => a.status === 'PENDING' && a.sla < 20).length} Approval{approvalsData.filter(a => a.status === 'PENDING' && a.sla < 20).length > 1 ? 's' : ''} Approaching SLA Breach
                </h4>
                <p className="text-[11px] text-negative/70 font-heading mt-0.5 leading-relaxed">
                  Critical and high-risk items require immediate review to maintain SLA compliance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setPriorityF('CRITICAL'); setStatusF('PENDING'); }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-[6px] border border-negative bg-negative/10 text-negative hover:bg-negative/20 text-[10px] font-bold font-heading uppercase tracking-wide transition-all cursor-pointer self-start md:self-auto"
              >
                <Eye size={11} /> Review Critical
              </button>
            </div>
          </div>
        )}

        <Toast msg={toast} onDone={() => setToast(null)} />

        {/* ── Table Card ── */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">

          {/* Table Header */}
          <div className="px-5 py-3.5 border-b border-border/12 flex items-center justify-between gap-3 bg-surface-elevated flex-wrap">
            <div className="flex items-center gap-2.5">
              <div
                className="w-1 h-5 rounded-full"
                style={{ background: PAGE.accent }}
              />
              <h3 className="font-black text-[12px] tracking-widest uppercase text-text/80">
                Approvals Registry
              </h3>
              <span
                className="px-1.5 py-0.5 rounded-[5px] text-[10px] font-black border font-mono"
                style={{ color: PAGE.accent, background: `color-mix(in srgb, ${PAGE.accent} 10%, transparent)`, borderColor: `color-mix(in srgb, ${PAGE.accent} 22%, transparent)` }}
              >
                {filtered.length}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search approvals…"
                  className="h-7 pl-7 pr-3 w-36 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text placeholder:text-text-muted/35 outline-none focus:border-brand/40 focus:w-48 transition-all"
                />
              </div>

              {/* Status Select */}
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Status:</span>
                <select
                  value={statusF}
                  onChange={(e) => { setStatusF(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'ESCALATED'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Type Select */}
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Type:</span>
                <select
                  value={typeF}
                  onChange={(e) => { setTypeF(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  {['ALL', 'DEPOSIT', 'WITHDRAWAL'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Risk Select */}
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Risk:</span>
                <select
                  value={riskF}
                  onChange={(e) => { setRiskF(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Priority Select */}
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Priority:</span>
                <select
                  value={priorityF}
                  onChange={(e) => { setPriorityF(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[9.5px] uppercase font-black text-text-muted/50 tracking-[0.12em] border-b border-border/10 bg-bg/20">
                  <th className="px-4 py-3">Record ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Rule Triggered</th>
                  <th className="px-4 py-3">Reviewer</th>
                  <th className="px-4 py-3">SLA</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/8">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-5 py-10 text-center text-[12px] text-text-muted/40 italic">
                      No approvals found matching filters.
                    </td>
                  </tr>
                ) : (
                  paged.map((row) => {
                    const isCritical = row.priority === 'CRITICAL' || row.priority === 'HIGH';
                    const isPending = row.status === 'PENDING';

                    return (
                      <tr
                        key={row.id}
                        onClick={() => setDrawer(row)}
                        className={`group cursor-pointer transition-colors border-l-2 border-transparent ${
                          isCritical
                            ? 'hover:bg-negative/5 hover:border-l-negative'
                            : isPending
                            ? 'hover:bg-warning/5 hover:border-l-warning'
                            : 'hover:bg-positive/5 hover:border-l-positive'
                        }`}
                      >
                        <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-brand">{row.id}</td>
                        <td className="px-4 py-3.5"><UserCell u={row.user} /></td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono font-bold text-[12.5px] text-brand">
                            {row.amount}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-[10px] font-black uppercase tracking-[0.05em] font-heading px-1.5 py-0.5 rounded-[5px]"
                            style={{ 
                              color: row.type === 'DEPOSIT' ? 'var(--positive)' : 'var(--negative)', 
                              background: `color-mix(in srgb, ${row.type === 'DEPOSIT' ? 'var(--positive)' : 'var(--negative)'} 10%, transparent)` 
                            }}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td className="px-4 py-3.5"><RiskBadge value={row.risk} /></td>
                        <td className="px-4 py-3.5"><PriorityBadge value={row.priority} /></td>
                        <td className="px-4 py-3.5">
                          <span className="text-[11px] font-mono text-text-muted/60" title={row.rule}>
                            {row.rule.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[11px] font-semibold ${row.reviewer === 'Unassigned' ? 'text-negative' : 'text-text-muted/70'}`}>
                            {row.reviewer}
                          </span>
                        </td>
                        <td className="px-4 py-3.5"><SlaBar pct={row.sla} /></td>
                        <td className="px-4 py-3.5"><StatusBadge value={row.status} /></td>
                        <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            {row.status === 'PENDING' && (
                              <>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); act('Approved', row.id); }} 
                                  className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/[0.07] text-positive flex items-center justify-center cursor-pointer hover:brightness-110 transition-colors" 
                                  title="Approve"
                                >
                                  <Check size={10} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); act('Rejected', row.id); }} 
                                  className="w-6 h-6 rounded-[5px] border border-negative/20 bg-negative/[0.07] text-negative flex items-center justify-center cursor-pointer hover:brightness-110 transition-colors" 
                                  title="Reject"
                                >
                                  <X size={10} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); act('Escalated', row.id); }} 
                                  className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/[0.07] text-warning flex items-center justify-center cursor-pointer hover:brightness-110 transition-colors" 
                                  title="Escalate"
                                >
                                  <ArrowUpRight size={10} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-border/10">
            <Pagination
              total={filtered.length}
              page={page}
              perPage={PER}
              setPage={setPage}
            />
          </div>
        </section>
      </div>

      {/* Approvals Drawer */}
      <FinanceDrawer open={!!drawer} onClose={() => setDrawer(null)} title={`Approval — ${drawer?.id}`} subtitle="Review rule triggers, SLA status, and approve or reject the request." footer={
        drawer ? (
          <div className="flex flex-col gap-2 w-full">
            {drawer.status === 'PENDING' && (
              <div className="grid grid-cols-2 gap-2">
                <IconBtn label="Approve" Icon={CheckCircle2} variant="success" onClick={() => { act('Approved', drawer.id); setDrawer(null); }} />
                <IconBtn label="Reject" Icon={XCircle} variant="danger" onClick={() => { act('Rejected', drawer.id); setDrawer(null); }} />
                <IconBtn label="Request Info" Icon={MessageSquare} variant="cyan" onClick={() => act('Info requested', drawer.id)} />
                <IconBtn label="Escalate" Icon={ArrowUpRight} variant="orange" onClick={() => { act('Escalated', drawer.id); setDrawer(null); }} />
                <IconBtn label="Lock Record" Icon={Lock} variant="danger" onClick={() => act('Locked', drawer.id)} />
                <IconBtn label="Export" Icon={Download} variant="default" onClick={() => act('Exported', drawer.id)} />
              </div>
            )}
            {drawer.status !== 'PENDING' && (
              <div className="grid grid-cols-2 gap-2">
                <IconBtn label="Copy ID" Icon={Copy} variant="default" onClick={() => { navigator.clipboard.writeText(drawer.id); act('Copied', drawer.id); }} />
                <IconBtn label="Export" Icon={Download} variant="default" onClick={() => act('Exported', drawer.id)} />
              </div>
            )}
          </div>
        ) : null
      }>
        {drawer && (
          <>
            {/* Header Banner inside drawer */}
            <div className="rounded-[12px] border border-white/[0.07] overflow-hidden">
              <div className="px-4 py-3.5 flex items-center justify-between"
                style={{ background: `color-mix(in srgb, ${RISK_CLR[drawer.risk] || 'rgba(255,255,255,0.1)'} 6%, transparent)`, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div className="text-[17px] font-black font-heading text-text">{drawer.amount}</div>
                  <div className="text-[10px] font-mono text-text-muted/40 mt-0.5">{drawer.type} · {drawer.id}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <PriorityBadge value={drawer.priority} />
                  <RiskBadge value={drawer.risk} />
                  <StatusBadge value={drawer.status} />
                </div>
              </div>
            </div>

            <DrawerSection title="Approval Details">
              <DGrid>
                <DF label="Record ID" value={drawer.id} mono copyable />
                <DF label="Type" value={drawer.type} accent={drawer.type === 'DEPOSIT' ? 'var(--positive)' : 'var(--negative)'} />
                <DF label="Amount" value={drawer.amount} mono accent="var(--brand)" />
                <DF label="Reviewer" value={drawer.reviewer} accent={drawer.reviewer === 'Unassigned' ? 'var(--negative)' : undefined} />
                <DF label="Rule" value={drawer.rule.replace(/_/g, ' ')} wide />
                <DF label="Created" value={drawer.created} mono />
                <DF label="SLA" value={`${drawer.sla}% remaining`} mono />
              </DGrid>
            </DrawerSection>

            <DrawerSection title="User Context">
              <DGrid>
                <DF label="User" value={drawer.user.name} copyable />
                <DF label="UID" value={drawer.user.uid} mono copyable />
                <DF label="Email" value={drawer.user.email} mono wide />
              </DGrid>
            </DrawerSection>

            <DrawerSection title="Risk Analysis">
              <RiskPanel risk={drawer.risk} />
              <div className="mt-2 rounded-[9px] border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
                <div className="text-[9.5px] font-black uppercase tracking-[0.15em] text-text-muted/35 mb-1.5 font-heading">Rule Triggered</div>
                <div className="text-[12px] font-mono text-text/70">{drawer.rule.replace(/_/g, ' ')}</div>
              </div>
            </DrawerSection>

            <DrawerSection title="Notes" collapsible>
              <DrawerNoteEditor onSave={() => act('Note saved', drawer.id)} />
            </DrawerSection>
          </>
        )}
      </FinanceDrawer>
    </PageShell>
  );
}

export default ApprovalsPage;
