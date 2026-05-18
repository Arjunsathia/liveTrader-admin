import React, { useState, useMemo } from 'react';
import { PageToolbar } from '../../../components/common/PageToolbar';
import { Card } from '../../../components/ui/Card';
import { DataTable } from '../../../components/tables/DataTable';
import { Pagination } from '../../../components/tables/Pagination';
import { useTableState } from '../../../hooks/useTableState';
import { Badge } from '../../../components/ui/Badge';
import { CheckCircle2, Download, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { financeRows } from '../data/reportsMockData';
import { FormatBadge, StatusBadge } from '../components/ReportsShared';
import { ReportDetailDrawer } from '../components/ReportDetailDrawer';

export function FinanceReportsScreen() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [fmtF, setFmtF] = useState('all');
  const [drawerRow, setDrawerRow] = useState(null);
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
    { key: 'id', label: 'Report ID', render: (row) => <span className="font-mono text-text-muted/50 text-[10.5px]">{row.id}</span> },
    { key: 'name', label: 'Report Name', render: (row) => <span className="text-[12px] font-semibold font-heading text-text/85">{row.name}</span> },
    { key: 'period', label: 'Period', render: (row) => <span className="text-text-muted/55 font-heading text-[11px]">{row.period}</span> },
    { key: 'owner', label: 'Owner', render: (row) => <span className="text-text/65 font-heading text-[11px]">{row.owner}</span> },
    { key: 'source', label: 'Source', render: (row) => <span className="text-[10px] font-heading border border-border/30 bg-bg/40 px-1.5 py-0.5 rounded-[4px] text-text-muted/50">{row.source}</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'format', label: 'Format', render: (row) => <FormatBadge value={row.format} /> },
    { key: 'generated', label: 'Generated', render: (row) => <span className="font-mono text-text-muted/40 text-[10.5px]">{row.generated}</span> },
    {
      key: '_act', label: '', className: 'w-16', render: (row) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
          {row.status === 'READY' && <button onClick={e => { e.stopPropagation(); act('Downloaded', row.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/10 text-positive flex items-center justify-center cursor-pointer hover:bg-positive/20"><Download size={10} /></button>}
          {row.status === 'FAILED' && <button onClick={e => { e.stopPropagation(); act('Retried', row.id); }} className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/10 text-warning flex items-center justify-center cursor-pointer hover:bg-warning/20"><RefreshCw size={10} /></button>}
          <button onClick={e => { e.stopPropagation(); act('Deleted', row.id); }} className="w-6 h-6 rounded-[5px] border border-negative/15 text-negative/50 hover:text-negative flex items-center justify-center cursor-pointer hover:bg-negative/10"><Trash2 size={10} /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-4">
      <PageToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search finance reports…"
        filterSets={[
          { label: 'Status', get: statusF, set: setStatusF, opts: [{value: 'all', label: 'All Status'}, {value: 'READY', label: 'Ready'}, {value: 'SCHEDULED', label: 'Scheduled'}, {value: 'FAILED', label: 'Failed'}] },
          { label: 'Format', get: fmtF, set: setFmtF, opts: [{value: 'all', label: 'All Formats'}, {value: 'PDF', label: 'PDF'}, {value: 'XLSX', label: 'XLSX'}, {value: 'CSV', label: 'CSV'}, {value: 'JSON', label: 'JSON'}] }
        ]}
        actions={[
          { label: 'Export All', icon: Download, variant: 'secondary', onClick: () => act('Exported', 'finance reports') },
          { label: 'Generate Report', icon: Plus, variant: 'primary', onClick: () => act('Generate', 'form opened') },
        ]}
      />

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

      <Card padding={false}>
        <DataTable
          columns={columns}
          data={table.items}
          onRowClick={(row) => setDrawerRow(row)}
          emptyTitle="No reports found"
          emptyDescription="Try adjusting your search or filters."
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

      <ReportDetailDrawer open={!!drawerRow} row={drawerRow} onClose={() => setDrawerRow(null)} onAction={act} />
    </div>
  );
}
