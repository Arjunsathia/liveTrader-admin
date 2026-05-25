import React, { useState, useMemo } from 'react';
import { MainTable, TableToolbar } from '../../../components/common/table';
import { useTableState } from '../../../hooks/useTableState';
import { CheckCircle2, Download, Eye, PlayCircle, RefreshCw, AlertOctagon } from 'lucide-react';
import { systemRows } from '@/config/constants/reports/mockData';
import { FormatBadge, SEV_CLR, StatusBadge } from '../components/ReportsComponents';
import { ReportDetailDrawer } from '../components/ReportDetailDrawer';
import { useDrawerState } from '@/hooks/useDrawerState';

function SevBadge({ value }) {
  const color = SEV_CLR[value] || 'var(--text-muted)';
  return (
    <span className="inline-flex items-center rounded-[5px] px-2 py-[3px] text-[9.5px] font-black uppercase tracking-[0.09em] whitespace-nowrap font-heading"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}>
      {value}
    </span>
  );
}

function SystemReportsPage() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [sevF, setSevF] = useState('all');
  const drawerRowState = useDrawerState(null);
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
    { key: 'id', label: 'Job ID', render: (val) => <span className="font-mono text-text-muted/50 text-[10.5px]">{val}</span> },
    { key: 'name', label: 'Report / Job Name', render: (val) => <span className="text-[12px] font-semibold font-heading text-text/85 max-w-[240px] block truncate">{val}</span> },
    { key: 'service', label: 'Service', render: (val) => <code className="font-mono text-[10.5px] text-cyan bg-cyan/10 border border-cyan/20 px-1.5 py-0.5 rounded-[4px]">{val}</code> },
    { key: 'severity', label: 'Severity', render: (val) => <SevBadge value={val} /> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge value={val} /> },
    { key: 'generated', label: 'Generated', render: (val) => <span className="font-mono text-text-muted/40 text-[10.5px]">{val}</span> },
    {
      key: 'retries', label: 'Retries', render: (val) => (
        <span className={`font-mono font-bold text-[11.5px] ${val > 0 ? 'text-warning' : 'text-text-muted/40'}`}>
          {val > 0 ? `${val}×` : '—'}
        </span>
      )
    },
    { key: 'size', label: 'Size', render: (val) => <span className="font-mono text-text-muted/40 text-[10.5px]">{val}</span> },
    {
      key: 'actions', label: 'Actions', align: 'right', render: (_, row) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end" onClick={(e) => e.stopPropagation()}>
          {row.status === 'SUCCESS' && <button onClick={e => { e.stopPropagation(); act('Downloaded', row.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/10 text-positive flex items-center justify-center cursor-pointer hover:bg-positive/20"><Download size={10} /></button>}
          {row.status === 'FAILED' && <button onClick={e => { e.stopPropagation(); act('Retried', row.id); }} className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/10 text-warning flex items-center justify-center cursor-pointer hover:bg-warning/20"><RefreshCw size={10} /></button>}
          <button onClick={e => { e.stopPropagation(); act('Viewed', row.id); }} className="w-6 h-6 rounded-[5px] border border-border/40 flex items-center justify-center text-text-muted/50 hover:text-text cursor-pointer hover:bg-bg/60"><Eye size={10} /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-black tracking-[-0.04em] text-text">System Reports</h2>
          <p className="text-[12px] text-text-muted/60 mt-0.5">Automated jobs, exports, and system-generated reports.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => act('Exported', 'system logs')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
            <Download size={12} /> Export Logs
          </button>
          <button onClick={() => act('Job triggered', 'manual')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]">
            <PlayCircle size={12} /> Trigger Job
          </button>
        </div>
      </div>

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

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="Job Execution History"
          count={filtered.length}
          accentColor="var(--cyan)"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search system logs…"
          filters={
            <>
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Status:</span>
                <select
                  value={statusF}
                  onChange={(e) => setStatusF(e.target.value)}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  {[{value: 'all', label: 'All Status'}, {value: 'SUCCESS', label: 'Success'}, {value: 'FAILED', label: 'Failed'}].map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Severity:</span>
                <select
                  value={sevF}
                  onChange={(e) => setSevF(e.target.value)}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  {[{value: 'all', label: 'All Sev'}, {value: 'INFO', label: 'Info'}, {value: 'WARNING', label: 'Warning'}, {value: 'ERROR', label: 'Error'}, {value: 'CRITICAL', label: 'Critical'}].map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </>
          }
        />

        <MainTable
          columns={columns}
          data={table.items}
          onRowClick={(row) => drawerRowState.open(row)}
          emptyTitle="No jobs found"
          pagination={table}
          rowClassName={(row) => {
            const isCritical = row.severity === 'CRITICAL' || row.status === 'FAILED';
            if (isCritical) return 'hover:bg-negative/5 hover:border-l-negative';
            if (row.severity === 'WARNING') return 'hover:bg-warning/5 hover:border-l-warning';
            return 'hover:bg-cyan/5 hover:border-l-cyan';
          }}
        />
      </section>

      <ReportDetailDrawer open={drawerRowState.isOpen} row={drawerRowState.value} onClose={() => drawerRowState.close()} onAction={act} />
    </div>
  );
}

export default SystemReportsPage;
