import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Download, Eye,
  ArrowUpRight, ArrowDownRight, AlertTriangle
} from 'lucide-react';
import { PageToolbar } from '../../../components/common/PageToolbar';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../components/common/PageShell';
import { Pagination } from '../../../components/tables/Pagination';
import { DataTable } from '../../../components/tables/DataTable';
import { useTableState } from '../../../hooks/useTableState';
import { exportRows } from '../../../utils/exporters';

import { WORKSPACE } from '../data/financeMockData';
import { RISK_COLOR, STATUS_COLOR } from '../data/financeConstants';
import { StatusChip, KpiCard, SectionSwitcher } from '../components/FinanceShared';
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
export function FinanceScreen() {
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


  return (
    <PageShell>
      {/* ── SECTION SWITCHER (Deposits / Withdrawals) ── */}
      <SectionSwitcher slug={slug} navigate={navigate} />

      {/* ── KPI CARDS ───────────────────────────────── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6 mb-6">
        {ws.kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </section>

      {/* ── TOOLBAR ─────────────────────────────────── */}
      <PageToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder={`Search ${ws.title.toLowerCase()} — ID, user, UID, hash…`}
        filterSets={[
          ...(ws.statusOptions?.length > 0
            ? [{ label: 'Status', get: statusF, set: setStatusF, opts: ws.statusOptions }]
            : []),
          ...(ws.methodOptions?.length > 0
            ? [{ label: 'Method', get: methodF, set: setMethodF, opts: ws.methodOptions }]
            : []),
          ...(ws.railOptions?.length > 0
            ? [{ label: 'Rail', get: railF, set: setRailF, opts: ws.railOptions }]
            : []),
          ...(ws.riskOptions?.length > 0
            ? [{ label: 'Risk', get: riskF, set: setRiskF, opts: ws.riskOptions }]
            : []),
        ]}
        actions={[
          { label: 'Export',      icon: Download, variant: 'secondary', onClick: () => exportRows(filtered, `finance-${slug}.csv`) },
          { label: 'Audit Trail', icon: Eye,      variant: 'primary',   onClick: () => {} },
        ]}
        className="mb-6"
      />

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
