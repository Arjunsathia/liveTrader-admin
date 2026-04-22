import React, { useState, useMemo } from 'react';
import { Activity, XCircle, LogOut, ShieldAlert, AlertOctagon, ShieldX, Eye, Download, RotateCcw, Monitor, Smartphone, Database, AlertCircle } from 'lucide-react';
import { Toolbar, SevBadge, Badge, AdminAvatar } from '../components/RolesPermissionsShared';
import { AccessLogDrawer } from '../components/RoleDrawers';
import { accessLogsData } from '../data/workspaces/admin-mgmt.workspace';

import { KpiCard } from '../../../components/cards/KpiCard';
import { FeatureTable } from '../../../components/tables/FeatureTable';
import { Card } from '../../../components/ui/Card';

export function AccessLogsScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [drawer, setDrawer] = useState(null);

  const filtered = useMemo(() => {
    let rows = accessLogsData;
    if (filter !== 'ALL') {
      if (['INFO', 'WARNING', 'ERROR', 'CRITICAL'].includes(filter)) rows = rows.filter(r => r.severity === filter);
      else if (['SUCCESS', 'FAILED', 'BLOCKED', 'LOCKED'].includes(filter)) rows = rows.filter(r => r.status === filter);
      else rows = rows;
    }
    if (search) rows = rows.filter(r =>
      r.admin.toLowerCase().includes(search.toLowerCase()) ||
      r.action.toLowerCase().includes(search.toLowerCase()) ||
      r.module.toLowerCase().includes(search.toLowerCase()) ||
      r.ip.includes(search) || r.id.includes(search)
    );
    return rows;
  }, [search, filter]);

  const kpis = [
    { label: 'Total Events', value: accessLogsData.length, Icon: Activity, accent: 'var(--cyan)', sub: 'Last 24h' },
    { label: 'Failed Logins', value: accessLogsData.filter(r => r.action.includes('FAILED')).length, Icon: XCircle, accent: 'var(--negative)', sub: 'Auth failures' },
    { label: 'Revoked Sessions', value: 3, Icon: LogOut, accent: 'var(--warning)', sub: 'Force-revoked' },
    { label: 'Privilege Changes', value: accessLogsData.filter(r => r.action.includes('PRIVILEGE') || r.action.includes('ROLE')).length, Icon: ShieldAlert, accent: 'var(--warning)', sub: 'Role/perm edits' },
    { label: 'Critical Events', value: accessLogsData.filter(r => r.severity === 'CRITICAL').length, Icon: AlertOctagon, accent: 'var(--negative)', sub: 'Require review' },
    { label: 'Suspicious Access', value: accessLogsData.filter(r => r.action.includes('BRUTE') || r.action.includes('LOCKED')).length, Icon: ShieldX, accent: 'var(--negative)', sub: 'Auto-blocked' },
  ];

  const cols = [
    { key: 'id', label: 'Event ID', render: v => <span className="font-mono text-text-muted/50 text-[10.5px]">{v}</span> },
    {
      key: 'admin', label: 'Admin', render: v => (
        <div className="flex items-center gap-2">
          <AdminAvatar name={v === 'System' || v === 'Unknown' ? 'SY' : v} role="" />
          <span className={`text-[12px] font-semibold font-heading ${v === 'Unknown' ? 'text-negative' : 'text-text/82'}`}>{v}</span>
        </div>
      )
    },
    { key: 'action', label: 'Action', render: v => <span className="text-[10.5px] font-mono text-text/60">{v.replace(/_/g, ' ')}</span> },
    { key: 'module', label: 'Module', render: v => <span className="text-[10.5px] font-heading border border-white/[0.06] px-1.5 py-0.5 rounded-[4px] text-text-muted/50">{v}</span> },
    { key: 'severity', label: 'Severity', render: v => <SevBadge value={v} /> },
    { key: 'ip', label: 'IP', render: v => <span className="font-mono text-text-muted/45 text-[10.5px]">{v}</span> },
    {
      key: 'device', label: 'Device', render: v => (
        <span className="flex items-center gap-1 text-text-muted/40">
          {v === 'Desktop' ? <Monitor size={11} /> : v === 'Mobile' ? <Smartphone size={11} /> : v === 'Bot' ? <AlertCircle size={11} className="text-negative" /> : <Database size={11} />}
          <span className="text-[10.5px] font-heading">{v}</span>
        </span>
      )
    },
    { key: 'status', label: 'Status', render: v => <Badge value={v} /> },
    { key: 'ts', label: 'Timestamp', render: v => <span className="font-mono text-text-muted/35 text-[10px]">{v}</span> },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Critical banner */}
      {accessLogsData.filter(r => r.severity === 'CRITICAL').length > 0 && (
        <div className="flex items-start gap-3 rounded-[10px] border border-negative/20 bg-negative/[0.05] px-4 py-3">
          <AlertOctagon size={14} className="text-negative flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-[12px] font-bold text-negative font-heading">
              {accessLogsData.filter(r => r.severity === 'CRITICAL').length} Critical Security Events Detected
            </div>
            <div className="text-[11px] text-negative/70 font-heading mt-0.5">Review brute force attempts and privilege changes immediately.</div>
          </div>
          <button className="flex-shrink-0 flex items-center gap-1.5 h-7 px-3 rounded-[7px] border border-negative/25 bg-negative/[0.08] text-negative text-[10.5px] font-bold font-heading cursor-pointer hover:brightness-110">
            <Eye size={10} /> Review All
          </button>
        </div>
      )}

      <Card padding={false}>
        <div className="px-5 py-4 border-b border-border/15">
          <Toolbar
            search={search} setSearch={setSearch}
            filters={['ALL', 'INFO', 'WARNING', 'ERROR', 'CRITICAL', 'SUCCESS', 'FAILED', 'BLOCKED']}
            activeFilter={filter} setFilter={setFilter}
            actions={[
              { label: 'Export Logs', Icon: Download, onClick: () => { } },
              { label: 'Clear Filters', Icon: RotateCcw, onClick: () => { setSearch(''); setFilter('ALL'); } },
            ]}
          />
        </div>
        <FeatureTable cols={cols} rows={filtered} onRow={r => setDrawer(r)} />
      </Card>
      <AccessLogDrawer row={drawer} open={!!drawer} onClose={() => setDrawer(null)} />
    </div>
  );
}
