import React, { useState, useMemo } from 'react';
import { ArrowDownLeft, CheckCircle2, Clock, Download, Plus, ShieldAlert, TrendingUp, XCircle, Search } from 'lucide-react';
import { PageShell } from '../../../components/layout/PageShell';
import { depositsData } from '../data/mockData';
import { KpiCard, StatusBadge, RiskBadge, MethodBadge, AmountCell, SummaryPills, Toast } from '../components/FinanceComponents';
import { FinanceToolbar, FilterRow, UserCell, QuickActions, FinanceRecordDrawer, Pagination } from '../components/FinanceDrawer';

const PAGE = {
  accent: 'var(--cyan)',
  eyebrow: 'Finance Operations',
  title: 'Deposits Queue',
  description: 'Real-time deposits — compliance hold, gateway status, and manual verification.',
};

export function DepositsPage() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('ALL');
  const [methodF, setMethodF] = useState('ALL');
  const [riskF, setRiskF] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);
  
  const PER = 7;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  const filtered = useMemo(() => {
    let r = [...depositsData];
    if (statusF !== 'ALL') r = r.filter(x => x.status === statusF);
    if (methodF !== 'ALL') r = r.filter(x => x.method === methodF);
    if (riskF !== 'ALL') r = r.filter(x => x.risk === riskF);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(x => 
        x.id.toLowerCase().includes(q) || 
        x.user.name.toLowerCase().includes(q) || 
        x.user.uid.toLowerCase().includes(q) || 
        x.user.email.toLowerCase().includes(q)
      );
    }
    return r;
  }, [search, statusF, methodF, riskF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);
  const vol24 = depositsData.filter(d => d.status !== 'FAILED').reduce((s, d) => s + d.amtRaw, 0);

  const kpis = [
    { label: 'Total Deposits', value: depositsData.length, Icon: ArrowDownLeft, accent: 'var(--cyan)', sub: 'All time' },
    { label: 'Pending Review', value: depositsData.filter(d => d.status === 'PENDING').length, Icon: Clock, accent: 'var(--warning)', sub: 'Awaiting action' },
    { label: 'Approved Today', value: depositsData.filter(d => d.status === 'APPROVED').length, Icon: CheckCircle2, accent: 'var(--positive)', sub: 'Processed successfully' },
    { label: 'Failed', value: depositsData.filter(d => d.status === 'FAILED').length, Icon: XCircle, accent: 'var(--negative)', sub: 'Payment errors' },
    { label: 'Flagged', value: depositsData.filter(d => d.status === 'FLAGGED').length, Icon: ShieldAlert, accent: 'var(--negative)', sub: 'AML / compliance hold', urgent: true },
    { label: '24h Volume', value: `$${(vol24 / 1000).toFixed(1)}K`, Icon: TrendingUp, accent: 'var(--brand)', sub: 'Gross deposit volume' },
  ];

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
              onClick={() => act('Exported', 'deposits')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export
            </button>
            <button
              type="button"
              onClick={() => act('Manual deposit', 'form opened')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              <Plus size={12} /> New Deposit
            </button>
          </div>
        </header>

        {/* ── KPI Grid ── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </section>

        {/* Flagged Warn Banner */}
        {depositsData.filter(d => d.status === 'FLAGGED').length > 0 && (
          <div className="flex items-start gap-3 rounded-[12px] border border-negative/20 bg-negative/[0.04] px-4 py-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="relative mt-0.5 shrink-0 flex items-center justify-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-negative" />
              <ShieldAlert size={14} className="text-negative relative z-10" />
            </div>
            <div className="flex-1">
              <h4 className="text-[12px] font-bold text-negative font-heading">
                {depositsData.filter(d => d.status === 'FLAGGED').length} Deposits Flagged for AML / Compliance Review
              </h4>
              <p className="text-[11px] text-negative/70 font-heading mt-0.5 leading-relaxed">
                Requires compliance team action before funds can be credited to user accounts.
              </p>
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
                Deposit Registry
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
                  placeholder="Search deposits…"
                  className="h-7 pl-7 pr-3 w-36 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text placeholder:text-text-muted/35 outline-none focus:border-brand/40 focus:w-48 transition-all"
                />
              </div>

              {/* Status Select Filter */}
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Status:</span>
                <select
                  value={statusF}
                  onChange={(e) => { setStatusF(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  {['ALL', 'PENDING', 'APPROVED', 'FLAGGED', 'FAILED'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Method Select Filter */}
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Method:</span>
                <select
                  value={methodF}
                  onChange={(e) => { setMethodF(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  {['ALL', 'Bank Wire', 'Card', 'Crypto', 'E-Wallet'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Risk Select Filter */}
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
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[9.5px] uppercase font-black text-text-muted/50 tracking-[0.12em] border-b border-border/10 bg-bg/20">
                  <th className="px-4 py-3">Deposit ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Reviewed By</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/8">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-5 py-10 text-center text-[12px] text-text-muted/40 italic">
                      No deposits found matching filters.
                    </td>
                  </tr>
                ) : (
                  paged.map((row) => {
                    const isFlagged = row.status === 'FLAGGED' || row.status === 'FAILED';
                    const isPending = row.status === 'PENDING';

                    return (
                      <tr
                        key={row.id}
                        onClick={() => setDrawer(row)}
                        className={`group cursor-pointer transition-colors border-l-2 border-transparent ${
                          isFlagged
                            ? 'hover:bg-negative/5 hover:border-l-negative'
                            : isPending
                            ? 'hover:bg-warning/5 hover:border-l-warning'
                            : 'hover:bg-positive/5 hover:border-l-positive'
                        }`}
                      >
                        <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-brand">{row.id}</td>
                        <td className="px-4 py-3.5"><UserCell u={row.user} /></td>
                        <td className="px-4 py-3.5"><AmountCell value={row.amount} type="DEPOSIT" /></td>
                        <td className="px-4 py-3.5"><MethodBadge value={row.method} /></td>
                        <td className="px-4 py-3.5">
                          <span className="text-[10px] font-bold border border-border/25 rounded-[4px] px-1.5 py-0.5 text-text-muted font-mono bg-surface-elevated/40">
                            {row.rail}
                          </span>
                        </td>
                        <td className="px-4 py-3.5"><StatusBadge value={row.status} /></td>
                        <td className="px-4 py-3.5"><RiskBadge value={row.risk} /></td>
                        <td className="px-4 py-3.5 font-mono text-[11px] text-text-muted/50">{row.created}</td>
                        <td className="px-4 py-3.5 text-[11px] font-semibold text-text-muted/70">{row.reviewedBy}</td>
                        <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <QuickActions
                            row={row}
                            onApprove={() => act('Approved', row.id)}
                            onReject={() => act('Rejected', row.id)}
                            onFlag={() => act('Flagged', row.id)}
                          />
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

      <FinanceRecordDrawer
        row={drawer}
        open={!!drawer}
        onClose={() => setDrawer(null)}
        type="Deposit"
        onAction={act}
      />
    </PageShell>
  );
}

export default DepositsPage;
