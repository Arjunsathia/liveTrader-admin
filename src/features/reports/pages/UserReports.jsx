import React, { useState, useMemo } from 'react';
import { PageToolbar } from '../../../components/common/PageToolbar';
import { Card } from '../../../components/ui/Card';
import { DataTable } from '../../../components/tables/DataTable';
import { Pagination } from '../../../components/tables/Pagination';
import { useTableState } from '../../../hooks/useTableState';
import { Badge } from '../../../components/ui/Badge';
import { CheckCircle2, Download, Plus, RefreshCw } from 'lucide-react';
import { userRows } from '../data/reportsMockData';
import { FormatBadge, StatusBadge } from '../components/ReportsShared';
import { ReportDetailDrawer } from '../components/ReportDetailDrawer';

export function UserReportsScreen() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [riskF, setRiskF] = useState('all');
  const [drawerRow, setDrawerRow] = useState(null);
  const [toast, setToast] = useState(null);

  const act = (msg, id) => { setToast(`${msg}: ${id}`); setTimeout(() => setToast(null), 3000); };

  const filtered = useMemo(() => {
    let rows = userRows;
    if (statusF !== 'all') rows = rows.filter(r => r.status === statusF);
    if (riskF !== 'all') rows = rows.filter(r => r.risk === riskF);
    if (search) rows = rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search) || r.segment.toLowerCase().includes(search.toLowerCase()));
    return rows;
  }, [search, statusF, riskF]);

  const table = useTableState(filtered, { searchFields: [], initialPageSize: 10 });

  const columns = [
    { key: 'id', label: 'ID', render: (row) => <span className="font-mono text-text-muted/50 text-[10.5px]">{row.id}</span> },
    { key: 'name', label: 'Report Name', render: (row) => <span className="text-[12px] font-semibold font-heading text-text/85">{row.name}</span> },
    { key: 'segment', label: 'Segment', render: (row) => <span className="text-[10.5px] font-heading border border-border/30 bg-bg/40 px-1.5 py-0.5 rounded-[4px] text-text-muted/55">{row.segment}</span> },
    { key: 'kyc', label: 'KYC', render: (row) => <StatusBadge value={row.kyc} /> },
    { key: 'wallet', label: 'Wallet', render: (row) => <span className="text-[11px] font-heading font-semibold" style={{ color: row.wallet === 'ACTIVE' ? 'var(--positive)' : row.wallet === 'INACTIVE' ? 'var(--text-muted)' : 'var(--warning)' }}>{row.wallet}</span> },
    { key: 'trading', label: 'Trading', render: (row) => <span className="text-[11px] font-heading font-semibold" style={{ color: row.trading === 'ACTIVE' ? 'var(--positive)' : row.trading === 'NONE' ? 'var(--text-muted)' : 'var(--warning)' }}>{row.trading}</span> },
    {
      key: 'risk', label: 'Risk', render: (row) => {
        const c = row.risk === 'HIGH' ? 'var(--negative)' : row.risk === 'MEDIUM' ? 'var(--warning)' : 'var(--positive)';
        return <span className="text-[9.5px] font-black uppercase tracking-[0.09em] font-heading rounded-[5px] px-2 py-[3px]" style={{ color: c, background: `color-mix(in srgb, ${c} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${c} 20%, transparent)` }}>{row.risk}</span>;
      }
    },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'format', label: 'Format', render: (row) => <FormatBadge value={row.format} /> },
    { key: 'generated', label: 'Generated', render: (row) => <span className="font-mono text-text-muted/40 text-[10px]">{row.generated}</span> },
    {
      key: '_act', label: '', className: 'w-16', render: (row) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
          {row.status === 'READY' && <button onClick={e => { e.stopPropagation(); act('Downloaded', row.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/10 text-positive flex items-center justify-center cursor-pointer hover:bg-positive/20"><Download size={10} /></button>}
          {row.status === 'FAILED' && <button onClick={e => { e.stopPropagation(); act('Retried', row.id); }} className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/10 text-warning flex items-center justify-center cursor-pointer hover:bg-warning/20"><RefreshCw size={10} /></button>}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-4">
      <PageToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search user reports…"
        filterSets={[
          { label: 'Status', get: statusF, set: setStatusF, opts: [{value: 'all', label: 'All Status'}, {value: 'READY', label: 'Ready'}, {value: 'SCHEDULED', label: 'Scheduled'}, {value: 'FAILED', label: 'Failed'}] },
          { label: 'Risk', get: riskF, set: setRiskF, opts: [{value: 'all', label: 'All Risk'}, {value: 'LOW', label: 'Low'}, {value: 'MEDIUM', label: 'Medium'}, {value: 'HIGH', label: 'High'}] },
        ]}
        actions={[
          { label: 'Export', icon: Download, variant: 'secondary', onClick: () => act('Exported', 'user reports') },
          { label: 'Generate User Report', icon: Plus, variant: 'primary', onClick: () => act('Generate', 'user report') },
        ]}
      />

      {toast && <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/10 px-4 py-2.5 text-[12px] font-semibold text-positive font-heading"><CheckCircle2 size={13} />{toast}</div>}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Reports', val: userRows.length, color: 'var(--text-muted)' },
          { label: 'Ready', val: userRows.filter(r => r.status === 'READY').length, color: 'var(--positive)' },
          { label: 'Scheduled', val: userRows.filter(r => r.status === 'SCHEDULED').length, color: 'var(--warning)' },
          { label: 'Failed', val: userRows.filter(r => r.status === 'FAILED').length, color: 'var(--negative)' },
          { label: 'High Risk', val: userRows.filter(r => r.risk === 'HIGH').length, color: 'var(--negative)' },
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
