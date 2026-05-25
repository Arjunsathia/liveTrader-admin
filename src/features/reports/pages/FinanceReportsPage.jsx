import React, { useState, useMemo } from 'react';
import { useTableState } from '../../../hooks/useTableState';
import { CheckCircle2, Download, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { financeRows } from '@/config/constants/reports/mockData';
import { FormatBadge, StatusBadge } from '../components/ReportsComponents';
import { ReportDetailDrawer } from '../components/ReportDetailDrawer';
import { MainTable, TableToolbar } from '../../../components/common/table';
import { useDrawerState } from '@/hooks/useDrawerState';

function FinanceReportsPage() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [fmtF, setFmtF] = useState('all');
  const drawerRowState = useDrawerState(null);
  const [toast, setToast] = useState(null);

  const act = (msg, id) => { setToast(`${msg}: ${id}`); setTimeout(() => setToast(null), 3000); };

  const filtered = useMemo(() => {
    let rows = financeRows;
    if (statusF !== 'all') rows = rows.filter(r => r.status === statusF);
    if (fmtF !== 'all') rows = rows.filter(r => r.format === fmtF);
    if (search) rows = rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search) || r.owner.toLowerCase().includes(search.toLowerCase()));
    return rows;
  }, [search, statusF, fmtF]);

  const table = useTableState(filtered, { searchFields: [], initialPageSize: 10 });

  const columns = [
    { key: 'id', label: 'Report ID', render: (v) => <span className="font-mono text-text-muted/50 text-[10.5px]">{v}</span> },
    { key: 'name', label: 'Report Name', render: (v) => <span className="text-[12px] font-semibold font-heading text-text/85">{v}</span> },
    { key: 'period', label: 'Period', render: (v) => <span className="text-text-muted/55 font-heading text-[11px]">{v}</span> },
    { key: 'owner', label: 'Owner', render: (v) => <span className="text-text/65 font-heading text-[11px]">{v}</span> },
    { key: 'source', label: 'Source', render: (v) => <span className="text-[10px] font-heading border border-border/30 bg-bg/40 px-1.5 py-0.5 rounded-[4px] text-text-muted/50">{v}</span> },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge value={v} /> },
    { key: 'format', label: 'Format', render: (v) => <FormatBadge value={v} /> },
    { key: 'generated', label: 'Generated', render: (v) => <span className="font-mono text-text-muted/40 text-[10.5px]">{v}</span> },
    {
      key: 'actions', label: 'Actions', align: 'right', render: (_, row) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end" onClick={(e) => e.stopPropagation()}>
          {row.status === 'READY' && <button onClick={e => { e.stopPropagation(); act('Downloaded', row.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/10 text-positive flex items-center justify-center cursor-pointer hover:bg-positive/20"><Download size={10} /></button>}
          {row.status === 'FAILED' && <button onClick={e => { e.stopPropagation(); act('Retried', row.id); }} className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/10 text-warning flex items-center justify-center cursor-pointer hover:bg-warning/20"><RefreshCw size={10} /></button>}
          <button onClick={e => { e.stopPropagation(); act('Deleted', row.id); }} className="w-6 h-6 rounded-[5px] border border-negative/15 text-negative/50 hover:text-negative flex items-center justify-center cursor-pointer hover:bg-negative/10"><Trash2 size={10} /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/45 mb-1">
            Reports
          </p>
          <h2 className="text-[22px] font-black tracking-[-0.04em] text-text leading-none">
            Finance Reports
          </h2>
          <p className="text-[12px] text-text-muted/55 mt-1.5 leading-snug max-w-lg">
            Manage scheduled and generated financial reports.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => act('Exported', 'finance reports')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
            <Download size={12} /> Export All
          </button>
          <button onClick={() => act('Generate', 'form opened')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]">
            <Plus size={12} /> Generate Report
          </button>
        </div>
      </header>

      {toast && <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/10 px-4 py-2.5 text-[12px] font-semibold text-positive font-heading"><CheckCircle2 size={13} />{toast}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Reports', val: financeRows.length, color: 'var(--text-muted)' },
          { label: 'Ready', val: financeRows.filter(r => r.status === 'READY').length, color: 'var(--positive)' },
          { label: 'Scheduled', val: financeRows.filter(r => r.status === 'SCHEDULED').length, color: 'var(--warning)' },
          { label: 'Failed', val: financeRows.filter(r => r.status === 'FAILED').length, color: 'var(--negative)' },
        ].map(s => (
          <div key={s.label} className="rounded-[10px] border border-border/30 bg-surface-elevated shadow-card-subtle px-4 py-3">
            <div className="text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading mb-1.5">{s.label}</div>
            <div className="text-[17px] font-bold font-heading tracking-[-0.02em]" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="Generated Reports"
          count={filtered.length}
          accentColor="var(--brand)"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search finance reports…"
          filters={
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1">
                  <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Status:</span>
                  <select
                     value={statusF}
                     onChange={(e) => setStatusF(e.target.value)}
                     className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  >
                     <option value="all">All Status</option>
                     <option value="READY">Ready</option>
                     <option value="SCHEDULED">Scheduled</option>
                     <option value="FAILED">Failed</option>
                  </select>
               </div>
               <div className="flex items-center gap-1">
                  <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Format:</span>
                  <select
                     value={fmtF}
                     onChange={(e) => setFmtF(e.target.value)}
                     className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  >
                     <option value="all">All Formats</option>
                     <option value="PDF">PDF</option>
                     <option value="XLSX">XLSX</option>
                     <option value="CSV">CSV</option>
                     <option value="JSON">JSON</option>
                  </select>
               </div>
            </div>
          }
        />
        <MainTable
          columns={columns}
          data={table.items}
          onRowClick={(row) => drawerRowState.open(row)}
          emptyTitle="No reports found"
          emptyDescription="Try adjusting your search or filters."
          pagination={{
            page: table.page,
            totalPages: table.totalPages,
            setPage: table.setPage,
            pageSize: table.pageSize,
            setPageSize: table.setPageSize,
          }}
          rowClassName={() => "hover:bg-brand/5 hover:border-l-brand cursor-pointer"}
        />
      </section>

      <ReportDetailDrawer open={drawerRowState.isOpen} row={drawerRowState.value} onClose={() => drawerRowState.close()} onAction={act} />
    </div>
  );
}

export default FinanceReportsPage;
