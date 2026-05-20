import React, { useState, useMemo } from 'react';
import { Activity, ArrowDownLeft, ArrowLeftRight, ArrowUpRight, BarChart2, CircleDollarSign, Copy, Download, Eye, FileText, Flag, RefreshCw, RotateCcw, Settings, Star, User, Search } from 'lucide-react';
import { PageShell } from '../../../components/common/PageShell';
import { transactionsData, TXN_TYPE_CLR, STATUS_CLR } from '../data/financeMockData';
import { KpiCard, StatusBadge, MethodBadge, AmountCell, Toast } from '../components/FinanceShared';
import { UserCell, FinanceRecordDrawer, Pagination } from '../components/FinanceDrawer';

const PAGE = {
  accent: 'var(--brand)',
  eyebrow: 'Finance Operations',
  title: 'Transaction Stream',
  description: 'Unified financial ledger movement across user wallets, internal systems, and external gateways.',
};

export function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [typeF, setTypeF] = useState('ALL');
  const [statusF, setStatusF] = useState('ALL');
  const [methodF, setMethodF] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);
  
  const PER = 8;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  const filtered = useMemo(() => {
    let r = [...transactionsData];
    if (typeF !== 'ALL') r = r.filter(x => x.type === typeF);
    if (statusF !== 'ALL') r = r.filter(x => x.status === statusF);
    if (methodF !== 'ALL') r = r.filter(x => x.method === methodF);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(x => 
        x.id.toLowerCase().includes(q) || 
        x.reference.toLowerCase().includes(q) || 
        x.user.name.toLowerCase().includes(q) || 
        x.user.uid.toLowerCase().includes(q)
      );
    }
    return r;
  }, [search, typeF, statusF, methodF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);
  const credits = transactionsData.filter(t => t.amtRaw > 0).reduce((s, t) => s + t.amtRaw, 0);
  const debits = transactionsData.filter(t => t.amtRaw < 0).reduce((s, t) => s + Math.abs(t.amtRaw), 0);
  const reversals = transactionsData.filter(t => t.type === 'REVERSAL').length;

  const kpis = [
    { label: 'Total Transactions', value: transactionsData.length, Icon: ArrowLeftRight, accent: 'var(--cyan)', sub: 'All ledger entries' },
    { label: 'Credits', value: `$${(credits / 1000).toFixed(1)}K`, Icon: ArrowDownLeft, accent: 'var(--positive)', sub: 'Total inflow' },
    { label: 'Debits', value: `$${(debits / 1000).toFixed(1)}K`, Icon: ArrowUpRight, accent: 'var(--negative)', sub: 'Total outflow' },
    { label: 'Reversals', value: reversals, Icon: RotateCcw, accent: 'var(--warning)', sub: 'Chargebacks & reversals' },
    { label: 'Flagged', value: transactionsData.filter(t => t.status === 'FLAGGED').length, Icon: Flag, accent: 'var(--negative)', sub: 'Under investigation', urgent: true },
    { label: 'Net Volume', value: `$${((credits - debits) / 1000).toFixed(1)}K`, Icon: BarChart2, accent: 'var(--brand)', sub: 'Net ledger movement' },
  ];

  const TXN_ICONS = { 
    DEPOSIT: ArrowDownLeft, 
    WITHDRAWAL: ArrowUpRight, 
    FEE: CircleDollarSign, 
    REVERSAL: RotateCcw, 
    COMMISSION: Star, 
    ADJUSTMENT: Settings 
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
              onClick={() => act('Exported', 'ledger')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export Ledger
            </button>
          </div>
        </header>

        {/* ── KPI Grid ── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </section>

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
                Ledger Log
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
                  placeholder="Search ledger…"
                  className="h-7 pl-7 pr-3 w-36 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text placeholder:text-text-muted/35 outline-none focus:border-brand/40 focus:w-48 transition-all"
                />
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
                  {['ALL', 'DEPOSIT', 'WITHDRAWAL', 'FEE', 'REVERSAL', 'COMMISSION', 'ADJUSTMENT'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
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
                  {['ALL', 'SETTLED', 'PENDING', 'FLAGGED', 'FROZEN'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Method Select */}
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Method:</span>
                <select
                  value={methodF}
                  onChange={(e) => { setMethodF(e.target.value); setPage(1); }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  {['ALL', 'Bank Wire', 'Card', 'Crypto', 'E-Wallet', 'Internal'].map((opt) => (
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
                  <th className="px-4 py-3">TXN ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/8">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-10 text-center text-[12px] text-text-muted/40 italic">
                      No transactions found matching filters.
                    </td>
                  </tr>
                ) : (
                  paged.map((row) => {
                    const isGreen = row.type === 'DEPOSIT' || row.type === 'COMMISSION';
                    const isRed = row.type === 'WITHDRAWAL' || row.type === 'FEE';

                    return (
                      <tr
                        key={row.id}
                        onClick={() => setDrawer(row)}
                        className={`group cursor-pointer transition-colors border-l-2 border-transparent ${
                          isGreen
                            ? 'hover:bg-positive/5 hover:border-l-positive'
                            : isRed
                            ? 'hover:bg-negative/5 hover:border-l-negative'
                            : 'hover:bg-warning/5 hover:border-l-warning'
                        }`}
                      >
                        <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-brand">{row.id}</td>
                        <td className="px-4 py-3.5"><UserCell u={row.user} /></td>
                        <td className="px-4 py-3.5">
                          {(() => {
                            const Ic = TXN_ICONS[row.type] || ArrowLeftRight;
                            const c = TXN_TYPE_CLR[row.type] || 'var(--text-muted)';
                            return (
                              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-[0.05em] font-heading" style={{ color: c }}>
                                <Ic size={11} className="flex-shrink-0" />
                                {row.type}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-3.5"><AmountCell value={row.amount} type={row.type} /></td>
                        <td className="px-4 py-3.5"><MethodBadge value={row.method} /></td>
                        <td className="px-4 py-3.5 font-mono text-[11px] text-cyan hover:underline">{row.reference}</td>
                        <td className="px-4 py-3.5"><StatusBadge value={row.status} /></td>
                        <td className="px-4 py-3.5 font-mono text-[11px] text-text-muted/50">{row.ts}</td>
                        <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); act('Exported', row.id); }}
                              className="w-6 h-6 rounded-[5px] border border-border/20 bg-bg text-text-muted/60 hover:text-text cursor-pointer flex items-center justify-center transition-colors"
                            >
                              <Download size={10} />
                            </button>
                            {row.status === 'FLAGGED' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); act('Reviewed', row.id); }}
                                className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/[0.07] text-warning cursor-pointer flex items-center justify-center transition-colors"
                              >
                                <Eye size={10} />
                              </button>
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

      {/* Transactions Drawer */}
      <FinanceRecordDrawer
        row={drawer}
        open={!!drawer}
        onClose={() => setDrawer(null)}
        type="Transaction"
        onAction={act}
      />
    </PageShell>
  );
}

export default TransactionsPage;
