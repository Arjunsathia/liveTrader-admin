import React, { useState, useMemo } from 'react';
import { Users, UserCheck, Lock, Clock, Fingerprint, ShieldOff, UserPlus, Download, Edit2, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { Badge, TwoFABadge, RolePill, AdminAvatar } from '../components/RolesComponents';
import { AdminUserDrawer } from '../components/RoleDrawers';
import { adminUsers } from '@/config/constants/roles-permissions/workspaces/admin-mgmt.workspace';

import { KpiCard } from '../../../components/cards';
import { MainTable, TableToolbar } from '../../../components/common/table';
import { useDrawerState } from '@/hooks/useDrawerState';

function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const drawerState = useDrawerState(null);
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
      key: 'actions', label: 'Actions', align: 'right', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end pr-2" onClick={(e) => e.stopPropagation()}>
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
    <div className="space-y-5 animate-fade-up">

      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">
            Access Management
          </p>
          <h2 className="text-[26px] font-semibold tracking-[-0.03em] leading-tight text-text">
            Admin Users
          </h2>
          <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-lg">
            Manage admin accounts, their roles, and system access.
          </p>
        </div>
      </header>

      {/* 2FA alert */}
      {adminUsers.filter(r => !r.twoFA && r.status === 'ACTIVE').length > 0 && (
        <div className="flex items-start gap-3 rounded-[12px] border border-warning/20 bg-warning/[0.05] px-4 py-3 shadow-sm">
          <ShieldOff size={14} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[13px] font-bold text-warning font-heading">2FA Not Enabled on {adminUsers.filter(r => !r.twoFA && r.status === 'ACTIVE').length} Active Admin{adminUsers.filter(r => !r.twoFA && r.status === 'ACTIVE').length > 1 ? 's' : ''}</div>
            <div className="text-[12px] text-warning/80 font-heading mt-1">Enforce 2FA for all admin accounts to comply with security policy.</div>
          </div>
          <button onClick={() => act('2FA enforced', 'all')} className="ml-auto flex-shrink-0 flex items-center gap-1.5 h-7 px-3 rounded-[7px] text-[11.5px] font-semibold font-heading border border-warning/25 bg-warning/[0.08] text-warning cursor-pointer hover:brightness-110">
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

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="Admin Directory"
          count={filtered.length}
          accentColor="var(--cyan)"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search admins…"
          filters={
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                style={{ minWidth: '70px' }}
              >
                {['ALL', 'ACTIVE', 'INACTIVE', 'LOCKED', 'PENDING', '2FA', 'NO_2FA'].map(opt => (
                  <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          }
          actions={
            <div className="flex gap-2">
              <button onClick={() => act('Exported', 'admin list')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
                <Download size={12} /> Export
              </button>
              <button onClick={() => act('New admin form', 'opened')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]">
                <UserPlus size={12} /> Add Admin
              </button>
            </div>
          }
        />
        <MainTable 
          columns={cols} 
          data={filtered} 
          onRowClick={r => drawerState.open(r)}
          rowClassName={(r) => {
            if (r.locked) return 'hover:bg-negative/5 hover:border-l-negative cursor-pointer';
            if (r.status === 'PENDING') return 'hover:bg-warning/5 hover:border-l-warning cursor-pointer';
            return 'hover:bg-cyan/5 hover:border-l-cyan cursor-pointer';
          }}
        />
      </section>

      <AdminUserDrawer row={drawerState.value} open={drawerState.isOpen} onClose={() => drawerState.close()} onAction={act} />
    </div>
  );
}

export default AdminUsersPage;
