import React, { useState, useMemo } from 'react';
import { Search, Download, Activity, AlertTriangle, AlertOctagon, ShieldX } from 'lucide-react';
import { IconBtn, SevBadge, AdminAvatar, SEV_CLR } from '../components/RolesPermissionsShared';
import { activityLogsData } from '../data/workspaces/admin-mgmt.workspace';

import { KpiCard } from '../../../components/cards/KpiCard';
import { FeatureTable } from '../../../components/tables/FeatureTable';
import { Card } from '../../../components/ui/Card';

export function ActivityLogsScreen() {
  const [search, setSearch] = useState('');
  const [sevFilter, setSevFilter] = useState('ALL');
  const [modFilter, setModFilter] = useState('ALL');
  const [adminFilter, setAdminFilter] = useState('ALL');
  const [view, setView] = useState('TIMELINE');

  const allAdmins = ['ALL', ...new Set(activityLogsData.map(r => r.admin))];
  const allModules = ['ALL', ...new Set(activityLogsData.map(r => r.module))];

  const filtered = useMemo(() => {
    let rows = activityLogsData;
    if (sevFilter !== 'ALL') rows = rows.filter(r => r.severity === sevFilter);
    if (modFilter !== 'ALL') rows = rows.filter(r => r.module === modFilter);
    if (adminFilter !== 'ALL') rows = rows.filter(r => r.admin === adminFilter);
    if (search) rows = rows.filter(r =>
      r.detail.toLowerCase().includes(search.toLowerCase()) ||
      r.action.toLowerCase().includes(search.toLowerCase()) ||
      r.admin.toLowerCase().includes(search.toLowerCase())
    );
    return rows;
  }, [search, sevFilter, modFilter, adminFilter]);

  const SEV_ICON = { INFO: Activity, WARNING: AlertTriangle, ERROR: AlertOctagon, CRITICAL: ShieldX };
  const MODULE_CLR = {
    'Admin Mgmt': '#a78bfa', 'Finance': 'var(--brand)', 'Users': 'var(--cyan)',
    'Auth': 'var(--negative)', 'Settings': 'var(--warning)', 'Reports': 'var(--text-muted)',
    'Prop Trading': 'var(--positive)', 'IB System': 'var(--cyan)', 'Trading': 'var(--brand)',
  };

  const tablecols = [
    { key: 'id', label: 'ID', render: v => <span className="font-mono text-text-muted/45 text-[10px]">{v}</span> },
    {
      key: 'admin', label: 'Admin', render: v => (
        <div className="flex items-center gap-2">
          <AdminAvatar name={v === 'System' ? 'SY' : v} role="" />
          <span className="text-[12px] font-semibold font-heading text-text/82">{v}</span>
        </div>
      )
    },
    { key: 'module', label: 'Module', render: v => <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-[4px] border border-white/[0.06]" style={{ color: MODULE_CLR[v] || 'var(--text-muted)', background: `color-mix(in srgb, ${MODULE_CLR[v] || 'rgba(255,255,255,0.3)'} 8%, transparent)` }}>{v}</span> },
    { key: 'action', label: 'Action', render: v => <span className="text-[10.5px] font-mono text-text/55">{v.replace(/_/g, ' ')}</span> },
    { key: 'detail', label: 'Detail', render: v => <span className="text-[11px] font-heading text-text-muted/55 max-w-[280px] block truncate">{v}</span> },
    { key: 'severity', label: 'Severity', render: v => <SevBadge value={v} /> },
    { key: 'ts', label: 'Timestamp', render: v => <span className="font-mono text-text-muted/35 text-[10px]">{v}</span> },
  ];

  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Actions', value: activityLogsData.length, Icon: Activity, accent: 'var(--text)' },
          { label: 'Critical', value: activityLogsData.filter(r => r.severity === 'CRITICAL').length, Icon: ShieldX, accent: 'var(--negative)' },
          { label: 'Errors', value: activityLogsData.filter(r => r.severity === 'ERROR').length, Icon: AlertOctagon, accent: 'var(--negative)' },
          { label: 'Warnings', value: activityLogsData.filter(r => r.severity === 'WARNING').length, Icon: AlertTriangle, accent: 'var(--warning)' },
          { label: 'Info', value: activityLogsData.filter(r => r.severity === 'INFO').length, Icon: Activity, accent: 'var(--cyan)' },
        ].map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Filter and Content Card */}
      <Card padding={false}>
        <div className="px-5 py-4 border-b border-border/15">
          {/* Toolbar with multi-filter */}
          <div className="space-y-2.5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-[280px]">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/30 pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search actions, admins, details…"
              className="w-full h-8 pl-8 pr-3 rounded-[8px] border border-white/[0.07] bg-white/[0.03] text-[12px] text-text placeholder:text-text-muted/25 outline-none focus:border-primary/30 transition-colors font-heading" />
          </div>

          {/* Severity filter */}
          <div className="flex gap-1">
            {['ALL', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].map(f => (
              <button key={f} onClick={() => setSevFilter(f)}
                className={`px-2.5 h-8 rounded-[7px] text-[11px] font-bold font-heading uppercase tracking-wide cursor-pointer transition-all duration-150 border
                  ${sevFilter === f ? 'bg-primary/[0.12] text-primary border-primary/20' : 'border-white/[0.06] text-text-muted/40 hover:text-text-muted bg-transparent'}`}>
                {f}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-1 ml-auto">
            {['TIMELINE', 'TABLE'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 h-8 rounded-[7px] text-[11px] font-bold font-heading cursor-pointer transition-all border
                  ${view === v ? 'bg-primary/[0.12] text-primary border-primary/20' : 'border-white/[0.06] text-text-muted/40 hover:text-text-muted bg-transparent'}`}>
                {v === 'TIMELINE' ? '◎ Timeline' : '☰ Table'}
              </button>
            ))}
            <IconBtn label="Export" Icon={Download} variant="default" />
          </div>
        </div>

        {/* Admin + Module filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[9.5px] font-black uppercase tracking-[0.15em] text-text-muted/30 font-heading flex-shrink-0">Filter by:</span>
          <div className="flex gap-1 flex-wrap">
            {allAdmins.slice(0, 8).map(a => (
              <button key={a} onClick={() => setAdminFilter(a)}
                className={`px-2 h-7 rounded-[6px] text-[10.5px] font-semibold font-heading cursor-pointer transition-all border
                  ${adminFilter === a ? 'bg-brand/[0.12] text-brand border-brand/25' : 'border-white/[0.05] text-text-muted/35 hover:text-text-muted bg-transparent'}`}>
                {a}
              </button>
            ))}
          </div>
          <span className="w-px h-4 bg-white/[0.08]" />
          <div className="flex gap-1 flex-wrap">
            {allModules.slice(0, 7).map(m => (
              <button key={m} onClick={() => setModFilter(m)}
                className={`px-2 h-7 rounded-[6px] text-[10.5px] font-semibold font-heading cursor-pointer transition-all border
                  ${modFilter === m ? 'bg-cyan/[0.1] text-cyan border-cyan/25' : 'border-white/[0.05] text-text-muted/35 hover:text-text-muted bg-transparent'}`}>
                {m}
              </button>
            ))}
          </div>
          </div>
        </div>
      </div>
        {/* TIMELINE VIEW */}
        {view === 'TIMELINE' && (
          <div className="relative space-y-3 p-5">
          {/* Spine */}
          <div className="absolute left-[26px] top-6 bottom-4 w-px bg-border/40" />

          {filtered.map((log) => {
            const sevColor = SEV_CLR[log.severity] || 'var(--text-muted)';
            const modColor = MODULE_CLR[log.module] || 'rgba(255,255,255,0.3)';
            const SevIc = SEV_ICON[log.severity] || Activity;
            return (
              <div key={log.id} className="flex gap-4 group">
                {/* Node */}
                <div className="relative flex-shrink-0 mt-3 z-10 w-14 flex justify-center">
                  <div className="w-[18px] h-[18px] rounded-full border-[1.5px] bg-surface-elevated flex items-center justify-center shadow-card-subtle"
                    style={{ borderColor: sevColor }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: sevColor, boxShadow: `0 0 6px ${sevColor}50` }} />
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 rounded-[10px] border border-border/30 bg-surface-elevated/40 px-5 py-4 mb-2 hover:border-border/60 hover:bg-surface-elevated/60 transition-all duration-200 group">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <AdminAvatar name={log.admin === 'System' ? 'SY' : log.admin} role="" />
                      <span className="text-[12px] font-semibold text-text/80 font-heading">{log.admin}</span>
                      <span className="text-[10.5px] font-mono text-text-muted/40">→</span>
                      <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-[4px] border border-white/[0.06]"
                        style={{ color: modColor, background: `color-mix(in srgb, ${modColor} 8%, transparent)` }}>{log.module}</span>
                      <span className="text-[10px] font-mono text-text-muted/40">{log.action.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <SevBadge value={log.severity} />
                      <span className="text-[10px] font-mono text-text-muted/30">{log.ts.split(' ')[1]}</span>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-text/60 font-heading leading-snug">{log.detail}</p>
                  <div className="text-[10px] font-mono text-text-muted/25 mt-1.5">{log.ts} · {log.id}</div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-text-muted/30 font-heading">No matching activity logs</div>
          )}
        </div>
      )}

      {/* TABLE VIEW */}
      {view === 'TABLE' && (
        <FeatureTable cols={tablecols} rows={filtered} emptyMsg="No matching activity logs" />
      )}
      </Card>
    </div>
  );
}
