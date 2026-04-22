import React, { useState, useMemo } from 'react';
import { Users, UserCheck, Lock, Clock, Fingerprint, ShieldOff, UserPlus, Download, Edit2, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { Toolbar, Badge, TwoFABadge, RolePill, AdminAvatar } from '../components/RolesPermissionsShared';
import { AdminUserDrawer } from '../components/RoleDrawers';
import { adminUsers } from '../data/workspaces/admin-mgmt.workspace';

import { KpiCard } from '../../../components/cards/KpiCard';
import { FeatureTable } from '../../../components/tables/FeatureTable';
import { Card } from '../../../components/ui/Card';

export function AdminUsersScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);
  const act = (msg, id) => { setToast(`${msg}: ${id}`); setTimeout(() => setToast(null), 3000); };

  const filtered = useMemo(() => {
    let rows = adminUsers;
    if (filter !== 'ALL') {
      if (['ACTIVE', 'INACTIVE', 'LOCKED', 'PENDING'].includes(filter)) rows = rows.filter(r => r.status === filter);
      else if (filter === '2FA') rows = rows.filter(r => r.twoFA);
      else if (filter === 'NO_2FA') rows = rows.filter(r => !r.twoFA);
      else rows = rows.filter(r => r.role === filter);
    }
    if (search) rows = rows.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search)
    );
    return rows;
  }, [search, filter]);

  const kpis = [
    { label: 'Total Admins', value: adminUsers.length, Icon: Users, accent: 'var(--cyan)', sub: 'All admin accounts' },
    { label: 'Active', value: adminUsers.filter(r => r.status === 'ACTIVE').length, Icon: UserCheck, accent: 'var(--positive)', sub: 'Currently active' },
    { label: 'Locked', value: adminUsers.filter(r => r.locked).length, Icon: Lock, accent: 'var(--negative)', sub: 'Require unlock' },
    { label: 'Pending Access', value: adminUsers.filter(r => r.status === 'PENDING').length, Icon: Clock, accent: 'var(--warning)', sub: 'Awaiting onboard' },
    { label: '2FA Enabled', value: adminUsers.filter(r => r.twoFA).length, Icon: Fingerprint, accent: 'var(--positive)', sub: `${Math.round(adminUsers.filter(r => r.twoFA).length / adminUsers.length * 100)}% coverage` },
    { label: 'Without 2FA', value: adminUsers.filter(r => !r.twoFA).length, Icon: ShieldOff, accent: 'var(--negative)', sub: 'Security risk' },
  ];

  const cols = [
    {
      key: 'name', label: 'Admin', render: (v, r) => (
        <div className="flex items-center gap-2.5">
          <AdminAvatar name={v} role={r.role} />
          <div>
            <div className="text-[12px] font-semibold font-heading text-text/85">{v}</div>
            <div className="text-[10px] font-mono text-text-muted/35">{r.email}</div>
          </div>
        </div>
      )
    },
    { key: 'role', label: 'Role', render: v => <RolePill value={v} /> },
    { key: 'status', label: 'Status', render: v => <Badge value={v} /> },
    { key: 'twoFA', label: '2FA', render: v => <TwoFABadge enabled={v} /> },
    { key: 'lastLogin', label: 'Last Login', render: v => <span className="font-mono text-text-muted/50 text-[10.5px]">{v}</span> },
    { key: 'created', label: 'Created', render: v => <span className="font-mono text-text-muted/35 text-[10.5px]">{v}</span> },
    {
      key: '_act', label: '', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end pr-2">
          <button onClick={e => { e.stopPropagation(); act('Edit', r.id); }} className="w-6 h-6 rounded-[5px] border border-white/[0.08] flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer"><Edit2 size={10} /></button>
          {r.locked
            ? <button onClick={e => { e.stopPropagation(); act('Unlocked', r.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 flex items-center justify-center text-positive/60 hover:text-positive cursor-pointer"><ShieldCheck size={10} /></button>
            : <button onClick={e => { e.stopPropagation(); act('Locked', r.id); }} className="w-6 h-6 rounded-[5px] border border-negative/20 flex items-center justify-center text-negative/50 hover:text-negative cursor-pointer"><Lock size={10} /></button>
          }
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      {/* 2FA alert */}
      {adminUsers.filter(r => !r.twoFA && r.status === 'ACTIVE').length > 0 && (
        <div className="flex items-start gap-3 rounded-[10px] border border-warning/20 bg-warning/[0.05] px-4 py-3">
          <ShieldOff size={14} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[12px] font-bold text-warning font-heading">2FA Not Enabled on {adminUsers.filter(r => !r.twoFA && r.status === 'ACTIVE').length} Active Admin{adminUsers.filter(r => !r.twoFA && r.status === 'ACTIVE').length > 1 ? 's' : ''}</div>
            <div className="text-[11px] text-warning/70 font-heading mt-0.5">Enforce 2FA for all admin accounts to comply with security policy.</div>
          </div>
          <button onClick={() => act('2FA enforced', 'all')} className="ml-auto flex-shrink-0 flex items-center gap-1.5 h-7 px-3 rounded-[7px] text-[10.5px] font-bold font-heading border border-warning/25 bg-warning/[0.08] text-warning cursor-pointer hover:brightness-110">
            <Zap size={10} /> Enforce All
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading">
          <CheckCircle2 size={13} />{toast}
        </div>
      )}

      <Card padding={false}>
        <div className="px-5 py-4 border-b border-border/15">
          <Toolbar
            search={search} setSearch={setSearch}
            filters={['ALL', 'ACTIVE', 'INACTIVE', 'LOCKED', 'PENDING', '2FA', 'NO_2FA']}
            activeFilter={filter} setFilter={setFilter}
            actions={[
              { label: 'Add Admin', Icon: UserPlus, primary: true, onClick: () => act('New admin form', 'opened') },
              { label: 'Export', Icon: Download, onClick: () => act('Exported', 'admin list') },
            ]}
          />
        </div>
        <FeatureTable cols={cols} rows={filtered} onRow={r => setDrawer(r)} />
      </Card>

      <AdminUserDrawer row={drawer} open={!!drawer} onClose={() => setDrawer(null)} onAction={act} />
    </div>
  );
}
