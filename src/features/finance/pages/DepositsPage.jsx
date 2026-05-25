import React, { useState, useMemo } from 'react';
import { ArrowDownLeft, CheckCircle2, Clock, Download, Plus, ShieldAlert, TrendingUp, XCircle, Search } from 'lucide-react';
import { PageShell } from '../../../components/layout/PageShell';
import { depositsData } from '@/config/constants/finance/mockData';
import { KpiCard, StatusBadge, RiskBadge, MethodBadge, AmountCell, SummaryPills, Toast } from '../components/FinanceComponents';
import { UserCell, QuickActions, FinanceRecordDrawer } from '../components/FinanceDrawer';
import { MainTable, TableToolbar } from '../../../components/common/table';
import { useDrawerState } from '@/hooks/useDrawerState';

const PAGE = {
  accent: 'var(--cyan)',
  eyebrow: 'Finance Operations',
  title: 'Deposits Queue',
  description: 'Real-time deposits — compliance hold, gateway status, and manual verification.',
};

function DepositsPage() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('ALL');
  const [methodF, setMethodF] = useState('ALL');
  const [riskF, setRiskF] = useState('ALL');
  const [page, setPage] = useState(1);
  const drawerState = useDrawerState(null);
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

  const columns = [
    { key: 'id', label: 'Deposit ID', render: (val) => <span className="font-mono text-[11px] font-bold text-brand">{val}</span> },
    { key: 'user', label: 'User', render: (_, row) => <UserCell u={row.user} /> },
    { key: 'amount', label: 'Amount', render: (_, row) => <AmountCell value={row.amount} type="DEPOSIT" /> },
    { key: 'method', label: 'Method', render: (val) => <MethodBadge value={val} /> },
    { key: 'rail', label: 'Provider', render: (val) => <span className="text-[10px] font-bold border border-border/25 rounded-[4px] px-1.5 py-0.5 text-text-muted font-mono bg-surface-elevated/40">{val}</span> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge value={val} /> },
    { key: 'risk', label: 'Risk', render: (val) => <RiskBadge value={val} /> },
    { key: 'created', label: 'Created', render: (val) => <span className="font-mono text-[11px] text-text-muted/50">{val}</span> },
    { key: 'reviewedBy', label: 'Reviewed By', render: (val) => <span className="text-[11px] font-semibold text-text-muted/70">{val}</span> },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <QuickActions
            row={row}
            onApprove={() => act('Approved', row.id)}
            onReject={() => act('Rejected', row.id)}
            onFlag={() => act('Flagged', row.id)}
          />
        </div>
      ),
    },
  ];

  const tableState = {
    page,
    pageSize: PER,
    setPage,
    setPageSize: () => {},
    totalPages: Math.ceil(filtered.length / PER)
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
          <TableToolbar
            title="Deposit Registry"
            count={filtered.length}
            accentColor={PAGE.accent}
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search deposits…"
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
                    {['ALL', 'PENDING', 'APPROVED', 'FLAGGED', 'FAILED'].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

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
              </>
            }
          />

          <MainTable
            columns={columns}
            data={paged}
            onRowClick={(row) => drawerState.open(row)}
            emptyTitle="No deposits found matching filters."
            pagination={tableState}
            rowClassName={(row) => {
              const isFlagged = row.status === 'FLAGGED' || row.status === 'FAILED';
              const isPending = row.status === 'PENDING';
              if (isFlagged) return 'hover:bg-negative/5 hover:border-l-negative';
              if (isPending) return 'hover:bg-warning/5 hover:border-l-warning';
              return 'hover:bg-positive/5 hover:border-l-positive';
            }}
          />
        </section>
      </div>

      <FinanceRecordDrawer
        row={drawerState.value}
        open={drawerState.isOpen}
        onClose={() => drawerState.close()}
        type="Deposit"
        onAction={act}
      />
    </PageShell>
  );
}

export default DepositsPage;
