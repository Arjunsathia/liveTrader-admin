import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Download, Eye, Search, SlidersHorizontal, CreditCard, Hash, ShieldAlert, X,
  ArrowUpRight, ArrowDownRight, AlertTriangle
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../layout/PageShell';
import { Button } from '../../../components/ui/Button';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Pagination } from '../../../components/tables/Pagination';
import { DataTable } from '../../../components/tables/DataTable';
import { useTableState } from '../../../hooks/useTableState';
import { exportRows } from '../../../utils/exporters';

import { WORKSPACE } from '../data/financeMockData';
import { RISK_COLOR, STATUS_COLOR } from '../data/financeConstants';
import { StatusChip, KpiCard, FilterDropdown, SectionSwitcher } from '../components/FinanceComponents';
import { FinanceDetailDrawer } from '../components/FinanceDetailDrawer';

/* ─────────────────────────────────────────────
   CELL RENDERER (Helper for DataTable)
───────────────────────────────────────────── */
function RenderFinanceCell(row, col) {
  switch (col.type) {
    case 'mono':
      return <span className="font-mono text-[11px] text-text-muted/70">{row[col.key] || '—'}</span>;

    case 'user':
      return (
        <div>
          <div className="text-[12px] font-medium text-text">{row[col.key]}</div>
          <div className="font-mono text-[10px] text-text-muted/50">{row.uid}</div>
        </div>
      );

    case 'amount':
      return (
        <span className="font-mono text-[13px] font-semibold" style={{ color: 'var(--brand)' }}>
          {row[col.key]}
        </span>
      );

    case 'flow': {
      const v = row[col.key] ?? '';
      const pos = v.startsWith('+');
      return (
        <span
          className="font-mono text-[12px] font-semibold"
          style={{ color: pos ? 'var(--positive)' : 'var(--negative)' }}
        >
          {v}
        </span>
      );
    }

    case 'status':
      return <StatusChip value={row[col.key]} colorMap={STATUS_COLOR} />;

    case 'risk':
      return row[col.key]
        ? <StatusChip value={row[col.key]} colorMap={RISK_COLOR} />
        : <span className="text-text-muted/30 text-[11px]">—</span>;

    case 'type': {
      const isIn = row[col.key] === 'Deposit';
      return (
        <span
          className="inline-flex items-center gap-1 rounded-[5px] px-2 py-0.5 text-[10px] font-semibold"
          style={{
            color: isIn ? 'var(--positive)' : 'var(--negative)',
            background: isIn ? 'color-mix(in srgb, var(--positive) 10%, transparent)' : 'color-mix(in srgb, var(--negative) 10%, transparent)',
          }}
        >
          {isIn ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {row[col.key]}
        </span>
      );
    }

    case 'priority': {
      const pc = RISK_COLOR[row[col.key]] ?? { c: 'var(--text-muted)', bg: 'var(--bg)' };
      return (
        <span
          className="rounded-[5px] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
          style={{ color: pc.c, background: pc.bg }}
        >
          {row[col.key]}
        </span>
      );
    }

    case 'warn':
      return (
        <span className="flex items-center gap-1.5 text-[11px] text-warning">
          <AlertTriangle size={11} className="flex-shrink-0" />
          {row[col.key]}
        </span>
      );

    default:
      return <span className="text-[12px] text-text">{row[col.key] || '—'}</span>;
  }
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export function FinancePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const slug = location.pathname.split('/')[2] || 'deposits';
  const ws = WORKSPACE[slug] ?? WORKSPACE.deposits;

  /* Filter state */
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [methodF, setMethodF] = useState('all');
  const [railF, setRailF] = useState('all');
  const [riskF, setRiskF] = useState('all');

  /* Drawer state */
  const [drawerRow, setDrawerRow] = useState(null);

  /* Derived rows */
  const filtered = useMemo(() => {
    let rows = ws.rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        ws.searchFields.some((f) => String(r[f] ?? '').toLowerCase().includes(q))
      );
    }
    if (statusF !== 'all') rows = rows.filter((r) => r.status === statusF);
    if (methodF !== 'all') rows = rows.filter((r) => r.method === methodF);
    if (railF !== 'all') rows = rows.filter((r) => r.rail === railF);
    if (riskF !== 'all') rows = rows.filter((r) => r.risk === riskF || r.priority === riskF);
    return rows;
  }, [ws, search, statusF, methodF, railF, riskF]);

  const table = useTableState(filtered, { searchFields: [], initialPageSize: 10 });

  /* DataTable Columns */
  const columns = useMemo(() => [
    ...ws.columns.map(col => ({
      ...col,
      render: (row) => RenderFinanceCell(row, col)
    })),
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); setDrawerRow(row); }}
          className="inline-flex items-center gap-1.5 h-7 rounded-[6px] border border-border/25 bg-bg/60 px-3 text-[11px] font-semibold text-text-muted transition-all duration-300 hover:border-primary/40 hover:text-primary hover:bg-primary/5 hover:shadow-sm"
        >
          <Eye size={12} className="group-hover:scale-110 transition-transform" />
          Inspect
        </button>
      )
    }
  ], [ws.columns, slug]);

  /* Reset filters on slug change */
  useEffect(() => {
    setSearch(''); setStatusF('all'); setMethodF('all'); setRailF('all'); setRiskF('all');
    setDrawerRow(null);
  }, [slug]);

  /* Active chips */
  const chips = [
    statusF !== 'all' && { key: 'status', label: `Status: ${statusF}`, clear: () => setStatusF('all') },
    methodF !== 'all' && { key: 'method', label: `Method: ${methodF}`, clear: () => setMethodF('all') },
    railF !== 'all' && { key: 'rail', label: `Rail: ${railF}`, clear: () => setRailF('all') },
    riskF !== 'all' && { key: 'risk', label: `Risk: ${riskF}`, clear: () => setRiskF('all') },
  ].filter(Boolean);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Financial Operations"
        title="Transaction Ledger"
        description={`Manage all ${slug} records, KYC funding states, and risk-adjusted payment approvals.`}
        actions={(
          <Button variant="primary" icon={Download} onClick={() => exportRows(filtered, `finance-${slug}.csv`)}>
            Bulk Export
          </Button>
        )}
      />

      {/* ── SECTION SWITCHER (Deposits / Withdrawals) ── */}
      <SectionSwitcher slug={slug} navigate={navigate} />

      {/* ── KPI CARDS ───────────────────────────────── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6 mb-6">
        {ws.kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </section>

      {/* ── TOOLBAR ─────────────────────────────────── */}
      <section className="relative z-20 rounded-[16px] border border-border/35 bg-surface-elevated/75 p-5 shadow-card-subtle backdrop-blur-sm mb-6">
        <div className="flex flex-col gap-5">
          {/* Row 1: search + actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1">
              <Search size={14} strokeWidth={2.5} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${ws.title.toLowerCase()} — ID, user, UID, hash…`}
                className="h-11 w-full rounded-[10px] border border-border/25 bg-bg/40 pl-11 pr-4 text-[13px] font-medium text-text placeholder:text-text-muted/25 outline-none transition-all focus:border-primary/30 focus:bg-bg/60 focus:ring-4 focus:ring-primary/5 shadow-inner"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/40 hover:text-text transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 ml-auto flex-wrap">
              <Button
                variant="secondary"
                onClick={() => exportRows(filtered, `finance-${slug}.csv`)}
                icon={Download}
                className="h-11 border-border/25 text-[11.5px] font-bold"
              >
                Export
              </Button>
              <Button
                variant="primary"
                icon={Eye}
                className="h-11 shadow-[0_8px_20px_-6px_rgba(var(--primary-rgb),0.3)]"
              >
                Audit Trail
              </Button>
            </div>
          </div>

          {/* Row 2: filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/35 mr-1 pr-3 border-r border-border/10">
              <SlidersHorizontal size={10} strokeWidth={3} />
              Filters
            </div>

            {ws.statusOptions?.length > 0 && (
              <FilterDropdown
                label="Status" value={statusF} onChange={setStatusF}
                options={ws.statusOptions}
              />
            )}
            {ws.methodOptions?.length > 0 && (
              <FilterDropdown
                label="Method" value={methodF} onChange={setMethodF}
                options={ws.methodOptions} Icon={CreditCard}
              />
            )}
            {ws.railOptions?.length > 0 && (
              <FilterDropdown
                label="Rail" value={railF} onChange={setRailF}
                options={ws.railOptions} Icon={Hash}
              />
            )}
            {ws.riskOptions?.length > 0 && (
              <FilterDropdown
                label="Risk" value={riskF} onChange={setRiskF}
                options={ws.riskOptions} Icon={ShieldAlert}
              />
            )}

            {chips.length > 0 && (
              <button
                type="button"
                onClick={() => { setStatusF('all'); setMethodF('all'); setRailF('all'); setRiskF('all'); }}
                className="ml-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-text-muted/45 transition-colors hover:text-negative"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Active chips */}
          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/5">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted/30 mr-1">Active:</span>
              {chips.map(({ key, label, clear }) => (
                <button
                  key={key}
                  type="button"
                  onClick={clear}
                  className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-primary transition-all hover:bg-primary/20"
                >
                  {label}
                  <X size={10} className="ml-1.5 inline-block opacity-60" strokeWidth={3} />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TABLE ───────────────────────────────────── */}
      <Card
        title={ws.tableTitle}
        subtitle={`${filtered.length} record${filtered.length !== 1 ? 's' : ''} matched · click row to inspect`}
        padding={false}
      >
        <DataTable
          columns={columns}
          data={table.items}
          onRowClick={(row) => setDrawerRow(row)}
          emptyTitle="No records found"
          emptyDescription="No records matched the current filters."
        />

        <div className="border-t border-border/15">
          <Pagination
            page={table.page}
            totalPages={table.totalPages}
            onPageChange={table.setPage}
            pageSize={table.pageSize}
            onPageSizeChange={table.setPageSize}
          />
        </div>
      </Card>


      <FinanceDetailDrawer 
        open={!!drawerRow} 
        row={drawerRow} 
        slug={slug} 
        onClose={() => setDrawerRow(null)} 
      />

    </PageShell>
  );
}
