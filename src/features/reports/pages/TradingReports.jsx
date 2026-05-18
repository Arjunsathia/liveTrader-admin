import React, { useState, useMemo } from 'react';
import { PageToolbar } from '../../../components/common/PageToolbar';
import { Card } from '../../../components/ui/Card';
import { DataTable } from '../../../components/tables/DataTable';
import { Pagination } from '../../../components/tables/Pagination';
import { useTableState } from '../../../hooks/useTableState';
import { Badge } from '../../../components/ui/Badge';
import { CheckCircle2, Download, Plus, RefreshCw, Activity } from 'lucide-react';
import { tradingRows } from '../data/reportsMockData';
import { FormatBadge, StatusBadge } from '../components/ReportsShared';
import { ReportDetailDrawer } from '../components/ReportDetailDrawer';

export function TradingReportsScreen() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [drawerRow, setDrawerRow] = useState(null);
  const [toast, setToast] = useState(null);

  const act = (msg, id) => { setToast(`${msg}: ${id}`); setTimeout(() => setToast(null), 3000); };

  const filtered = useMemo(() => {
    let rows = tradingRows;
    if (statusF !== 'all') rows = rows.filter(r => r.status === statusF);
    if (search) rows = rows.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search) || r.symbols.toLowerCase().includes(search.toLowerCase()));
    return rows;
  }, [search, statusF]);

  const table = useTableState(filtered, { searchFields: [], initialPageSize: 10 });

  const columns = [
    { key: 'id', label: 'ID', render: (row) => <span className="font-mono text-text-muted/50 text-[10.5px]">{row.id}</span> },
    { key: 'title', label: 'Report Title', render: (row) => <span className="text-[12px] font-semibold font-heading text-text/85 max-w-[220px] block truncate">{row.title}</span> },
    { key: 'scope', label: 'Scope', render: (row) => <span className="text-[10.5px] font-heading border border-border/30 bg-bg/40 px-1.5 py-0.5 rounded-[4px] text-text-muted/50">{row.scope}</span> },
    { key: 'symbols', label: 'Symbols', render: (row) => <span className="font-mono text-cyan text-[10.5px]">{row.symbols}</span> },
    { key: 'pnl', label: 'P&L', render: (row) => row.pnl !== '—' ? <span className="font-mono font-bold text-[11.5px]" style={{ color: row.pnl?.startsWith('+') ? 'var(--positive)' : 'var(--negative)' }}>{row.pnl}</span> : <span className="text-text-muted/30">—</span> },
    { key: 'winRate', label: 'Win Rate', render: (row) => row.winRate !== '—' ? <span className="font-mono text-text/65">{row.winRate}</span> : <span className="text-text-muted/30">—</span> },
    { key: 'drawdown', label: 'Drawdown', render: (row) => row.drawdown !== '—' ? <span className="font-mono text-negative">{row.drawdown}</span> : <span className="text-text-muted/30">—</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'format', label: 'Format', render: (row) => <FormatBadge value={row.format} /> },
    { key: 'generated', label: 'Generated', render: (row) => <span className="font-mono text-text-muted/40 text-[10px]">{row.generated}</span> },
    {
      key: '_act', label: '', className: 'w-16', render: (row) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
          {row.status === 'READY' && <button onClick={e => { e.stopPropagation(); act('Downloaded', row.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/10 text-positive flex items-center justify-center cursor-pointer hover:bg-positive/20"><Download size={10} /></button>}
          {row.status === 'FAILED' && <button onClick={e => { e.stopPropagation(); act('Retried', row.id); }} className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/10 text-warning flex items-center justify-center cursor-pointer hover:bg-warning/20"><RefreshCw size={10} /></button>}
          {row.status === 'PROCESSING' && <button onClick={e => { e.stopPropagation(); }} className="w-6 h-6 rounded-[5px] border border-cyan/20 bg-cyan/5 text-cyan/60 flex items-center justify-center cursor-default"><Activity size={10} /></button>}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-4">
      <PageToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search trading reports…"
        filterSets={[
          { label: 'Status', get: statusF, set: setStatusF, opts: [{value: 'all', label: 'All Status'}, {value: 'READY', label: 'Ready'}, {value: 'PROCESSING', label: 'Processing'}, {value: 'FAILED', label: 'Failed'}] },
        ]}
        actions={[
          { label: 'Export', icon: Download, variant: 'secondary', onClick: () => act('Exported', 'trading reports') },
          { label: 'Generate Trading Report', icon: Plus, variant: 'primary', onClick: () => act('Generate', 'trading report') },
        ]}
      />

      {toast && <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/10 px-4 py-2.5 text-[12px] font-semibold text-positive font-heading"><CheckCircle2 size={13} />{toast}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Reports', val: tradingRows.length, color: 'var(--text-muted)' },
          { label: 'Ready', val: tradingRows.filter(r => r.status === 'READY').length, color: 'var(--positive)' },
          { label: 'Processing', val: tradingRows.filter(r => r.status === 'PROCESSING').length, color: 'var(--cyan)' },
          { label: 'Failed', val: tradingRows.filter(r => r.status === 'FAILED').length, color: 'var(--negative)' },
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
