import React, { useState, useMemo } from 'react';
import { MainTable, TableToolbar } from '../../../components/common/table';
import { useTableState } from '../../../hooks/useTableState';
import { CheckCircle2, Download, Plus, RefreshCw } from 'lucide-react';
import { userRows } from '@/config/constants/reports/mockData';
import { FormatBadge, StatusBadge } from '../components/ReportsComponents';
import { ReportDetailDrawer } from '../components/ReportDetailDrawer';
import { useDrawerState } from '@/hooks/useDrawerState';

function UserReportsPage() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [riskF, setRiskF] = useState('all');
  const drawerRowState = useDrawerState(null);
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
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-text-muted/50 text-[10.5px]">{val}</span> },
    { key: 'name', label: 'Report Name', render: (val) => <span className="text-[12px] font-semibold font-heading text-text/85">{val}</span> },
    { key: 'segment', label: 'Segment', render: (val) => <span className="text-[10.5px] font-heading border border-border/30 bg-bg/40 px-1.5 py-0.5 rounded-[4px] text-text-muted/55">{val}</span> },
    { key: 'kyc', label: 'KYC', render: (val) => <StatusBadge value={val} /> },
    { key: 'wallet', label: 'Wallet', render: (val) => <span className="text-[11px] font-heading font-semibold" style={{ color: val === 'ACTIVE' ? 'var(--positive)' : val === 'INACTIVE' ? 'var(--text-muted)' : 'var(--warning)' }}>{val}</span> },
    { key: 'trading', label: 'Trading', render: (val) => <span className="text-[11px] font-heading font-semibold" style={{ color: val === 'ACTIVE' ? 'var(--positive)' : val === 'NONE' ? 'var(--text-muted)' : 'var(--warning)' }}>{val}</span> },
    {
      key: 'risk', label: 'Risk', render: (val) => {
        const c = val === 'HIGH' ? 'var(--negative)' : val === 'MEDIUM' ? 'var(--warning)' : 'var(--positive)';
        return <span className="text-[9.5px] font-black uppercase tracking-[0.09em] font-heading rounded-[5px] px-2 py-[3px]" style={{ color: c, background: `color-mix(in srgb, ${c} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${c} 20%, transparent)` }}>{val}</span>;
      }
    },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge value={val} /> },
    { key: 'format', label: 'Format', render: (val) => <FormatBadge value={val} /> },
    { key: 'generated', label: 'Generated', render: (val) => <span className="font-mono text-text-muted/40 text-[10px]">{val}</span> },
    {
      key: 'actions', label: 'Actions', align: 'right', render: (_, row) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end" onClick={(e) => e.stopPropagation()}>
          {row.status === 'READY' && <button onClick={e => { e.stopPropagation(); act('Downloaded', row.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/10 text-positive flex items-center justify-center cursor-pointer hover:bg-positive/20"><Download size={10} /></button>}
          {row.status === 'FAILED' && <button onClick={e => { e.stopPropagation(); act('Retried', row.id); }} className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/10 text-warning flex items-center justify-center cursor-pointer hover:bg-warning/20"><RefreshCw size={10} /></button>}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-black tracking-[-0.04em] text-text">User Reports</h2>
          <p className="text-[12px] text-text-muted/60 mt-0.5">Custom and automated reports regarding users.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => act('Exported', 'user reports')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
            <Download size={12} /> Export
          </button>
          <button onClick={() => act('Generate', 'user report')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]">
            <Plus size={12} /> Generate User Report
          </button>
        </div>
      </div>

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

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="User Report List"
          count={filtered.length}
          accentColor="var(--brand)"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search user reports…"
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
                  {[{value: 'all', label: 'All Status'}, {value: 'READY', label: 'Ready'}, {value: 'SCHEDULED', label: 'Scheduled'}, {value: 'FAILED', label: 'Failed'}].map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] text-text-muted/40 font-bold uppercase tracking-wider shrink-0">Risk:</span>
                <select
                  value={riskF}
                  onChange={(e) => setRiskF(e.target.value)}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text-muted px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  {[{value: 'all', label: 'All Risk'}, {value: 'LOW', label: 'Low'}, {value: 'MEDIUM', label: 'Medium'}, {value: 'HIGH', label: 'High'}].map(opt => (
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
          emptyTitle="No reports found"
          pagination={table}
          rowClassName={(row) => {
            const isCritical = row.risk === 'HIGH' || row.status === 'FAILED';
            if (isCritical) return 'hover:bg-negative/5 hover:border-l-negative';
            if (row.status === 'SCHEDULED') return 'hover:bg-warning/5 hover:border-l-warning';
            return 'hover:bg-brand/5 hover:border-l-brand';
          }}
        />
      </section>

      <ReportDetailDrawer open={drawerRowState.isOpen} row={drawerRowState.value} onClose={() => drawerRowState.close()} onAction={act} />
    </div>
  );
}

export default UserReportsPage;
