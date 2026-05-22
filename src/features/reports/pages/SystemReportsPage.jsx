import React, { useState, useMemo } from 'react';
import { PageToolbar } from '../../../components/layout/PageToolbar';
import { Card } from '../../../components/ui/Card';
import { DataTable } from '../../../components/tables/DataTable';
import { Pagination } from '../../../components/tables/Pagination';
import { useTableState } from '../../../hooks/useTableState';
import { Badge } from '../../../components/ui/Badge';
import { CheckCircle2, Download, Eye, PlayCircle, RefreshCw, AlertOctagon } from 'lucide-react';
import { systemRows } from '../data/mockData';
import { FormatBadge, SEV_CLR, StatusBadge } from '../components/ReportsComponents';
import { ReportDetailDrawer } from '../components/ReportDetailDrawer';

function SevBadge({ value }) {
  const color = SEV_CLR[value] || 'var(--text-muted)';
  return (
    <span className="inline-flex items-center rounded-[5px] px-2 py-[3px] text-[9.5px] font-black uppercase tracking-[0.09em] whitespace-nowrap font-heading"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}>
      {value}
    </span>
  );
}

export function SystemReportsPage() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [sevF, setSevF] = useState('all');
  const [drawerRow, setDrawerRow] = useState(null);
  const [toast, setToast] = useState(null);

  const act = (msg, id) => { setToast(`${msg}: ${id}`); setTimeout(() => setToast(null), 3000); };

  const filtered = useMemo(() => {
    let rows = systemRows;
    if (statusF !== 'all') rows = rows.filter(r => r.status === statusF);
    if (sevF !== 'all') rows = rows.filter(r => r.severity === sevF);
    if (search) rows = rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.service.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search));
    return rows;
  }, [search, statusF, sevF]);

  const table = useTableState(filtered, { searchFields: [], initialPageSize: 10 });

  const columns = [
    { key: 'id', label: 'Job ID', render: (row) => <span className="font-mono text-text-muted/50 text-[10.5px]">{row.id}</span> },
    { key: 'name', label: 'Report / Job Name', render: (row) => <span className="text-[12px] font-semibold font-heading text-text/85 max-w-[240px] block truncate">{row.name}</span> },
    { key: 'service', label: 'Service', render: (row) => <code className="font-mono text-[10.5px] text-cyan bg-cyan/10 border border-cyan/20 px-1.5 py-0.5 rounded-[4px]">{row.service}</code> },
    { key: 'severity', label: 'Severity', render: (row) => <SevBadge value={row.severity} /> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'generated', label: 'Generated', render: (row) => <span className="font-mono text-text-muted/40 text-[10.5px]">{row.generated}</span> },
    {
      key: 'retries', label: 'Retries', render: (row) => (
        <span className={`font-mono font-bold text-[11.5px] ${row.retries > 0 ? 'text-warning' : 'text-text-muted/40'}`}>
          {row.retries > 0 ? `${row.retries}×` : '—'}
        </span>
      )
    },
    { key: 'size', label: 'Size', render: (row) => <span className="font-mono text-text-muted/40 text-[10.5px]">{row.size}</span> },
    {
      key: '_act', label: '', className: 'w-16', render: (row) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
          {row.status === 'SUCCESS' && <button onClick={e => { e.stopPropagation(); act('Downloaded', row.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/10 text-positive flex items-center justify-center cursor-pointer hover:bg-positive/20"><Download size={10} /></button>}
          {row.status === 'FAILED' && <button onClick={e => { e.stopPropagation(); act('Retried', row.id); }} className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/10 text-warning flex items-center justify-center cursor-pointer hover:bg-warning/20"><RefreshCw size={10} /></button>}
          <button onClick={e => { e.stopPropagation(); act('Viewed', row.id); }} className="w-6 h-6 rounded-[5px] border border-border/40 flex items-center justify-center text-text-muted/50 hover:text-text cursor-pointer hover:bg-bg/60"><Eye size={10} /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-4">
      {systemRows.filter(r => r.status === 'FAILED').length > 0 && (
        <div className="flex items-start gap-3 rounded-[10px] border border-negative/20 bg-negative/5 px-4 py-3">
          <AlertOctagon size={14} className="text-negative flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-[12px] font-bold text-negative font-heading">
              {systemRows.filter(r => r.status === 'FAILED').length} System Job{systemRows.filter(r => r.status === 'FAILED').length > 1 ? 's' : ''} Failed
            </div>
            <div className="text-[11px] text-negative/70 font-heading mt-0.5">
              {systemRows.filter(r => r.severity === 'CRITICAL' && r.status === 'FAILED').length} critical — manual review required.
            </div>
          </div>
          <button onClick={() => act('Bulk retry', 'failed jobs')} className="flex-shrink-0 flex items-center gap-1.5 h-7 px-3 rounded-[7px] border border-negative/25 bg-negative/10 text-negative text-[10.5px] font-bold font-heading cursor-pointer hover:brightness-110">
            <RefreshCw size={10} /> Retry All
          </button>
        </div>
      )}

      <PageToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search system logs…"
        filterSets={[
          { label: 'Status', get: statusF, set: setStatusF, opts: [{value: 'all', label: 'All Status'}, {value: 'SUCCESS', label: 'Success'}, {value: 'FAILED', label: 'Failed'}] },
          { label: 'Severity', get: sevF, set: setSevF, opts: [{value: 'all', label: 'All Sev'}, {value: 'INFO', label: 'Info'}, {value: 'WARNING', label: 'Warning'}, {value: 'ERROR', label: 'Error'}, {value: 'CRITICAL', label: 'Critical'}] },
        ]}
        actions={[
          { label: 'Export Logs', icon: Download, variant: 'secondary', onClick: () => act('Exported', 'system logs') },
          { label: 'Trigger Job', icon: PlayCircle, variant: 'primary', onClick: () => act('Job triggered', 'manual') },
        ]}
      />

      {toast && <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/10 px-4 py-2.5 text-[12px] font-semibold text-positive font-heading"><CheckCircle2 size={13} />{toast}</div>}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Jobs', val: systemRows.length, color: 'var(--text-muted)' },
          { label: 'Success', val: systemRows.filter(r => r.status === 'SUCCESS').length, color: 'var(--positive)' },
          { label: 'Failed', val: systemRows.filter(r => r.status === 'FAILED').length, color: 'var(--negative)' },
          { label: 'With Retries', val: systemRows.filter(r => r.retries > 0).length, color: 'var(--warning)' },
          { label: 'Critical', val: systemRows.filter(r => r.severity === 'CRITICAL').length, color: 'var(--negative)' },
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
          emptyTitle="No jobs found"
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
