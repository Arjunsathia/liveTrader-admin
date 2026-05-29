import React, { useState } from 'react';
import { Shield, ShieldCheck, Users, Sliders, Plus, Download, CheckCircle2, ChevronRight, Edit2, Copy, ClipboardList } from 'lucide-react';
import { SectionHead, IconBtn, ROLE_CLR, Badge } from '../components/RolesComponents';
import { RoleDrawer } from '../components/RoleDrawers';
import { rolesData } from '@/config/constants/roles-permissions/workspaces/admin-mgmt.workspace';

import { KpiCard } from '../../../components/cards';
import { MainTable, TableToolbar } from '../../../components/common/table';
import { Card } from '../../../components/ui/Card';
import { useDrawerState } from '@/hooks/useDrawerState';

function RolesPage() {
  const drawerState = useDrawerState(null);
  const [toast, setToast] = useState(null);
  const act = (msg, id) => { setToast(`${msg}: ${id}`); setTimeout(() => setToast(null), 3000); };

  const kpis = [
    { label: 'Total Roles', value: rolesData.length, Icon: Shield, accent: 'var(--cyan)', sub: 'Defined roles' },
    { label: 'Active Roles', value: rolesData.filter(r => r.status === 'ACTIVE').length, Icon: ShieldCheck, accent: 'var(--positive)', sub: 'Currently applied' },
    { label: 'Total Admins', value: rolesData.reduce((s, r) => s + r.userCount, 0), Icon: Users, accent: 'var(--brand)', sub: 'Across all roles' },
    { label: 'Custom Roles', value: rolesData.filter(r => !['SUPER_ADMIN', 'READ_ONLY'].includes(r.name)).length, Icon: Sliders, accent: 'var(--warning)', sub: 'Non-default roles' },
  ];

  const cols = [
    {
      key: 'label', label: 'Role', render: (v, r) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[7px] flex items-center justify-center border flex-shrink-0"
            style={{ background: `color-mix(in srgb, ${ROLE_CLR[r.name] || '#fff'} 14%, transparent)`, borderColor: `color-mix(in srgb, ${ROLE_CLR[r.name] || '#fff'} 22%, transparent)` }}>
            <Shield size={13} style={{ color: ROLE_CLR[r.name] || 'rgba(255,255,255,0.3)' }} />
          </div>
          <div>
            <div className="text-[13px] font-semibold font-heading text-text/90">{v}</div>
            <div className="text-[11.5px] text-text-muted/75 font-heading truncate max-w-[200px]">{r.desc}</div>
          </div>
        </div>
      )
    },
    { key: 'userCount', label: 'Admins', render: v => <span className="font-mono font-semibold text-[12.5px] text-brand">{v}</span> },
    { key: 'scope', label: 'Scope', render: v => <span className="text-[11px] font-semibold border border-white/[0.06] px-2 py-0.5 rounded-[4px] text-text-muted/75">{v}</span> },
    {
      key: 'perms', label: 'Permissions', render: (_, r) => (
        <div className="flex gap-1 flex-wrap max-w-[200px]">
          {r.actions.map(a => <span key={a} className="text-[10px] font-mono px-1.5 py-0.5 rounded-[3px] bg-primary/[0.08] border border-primary/[0.15] text-primary">{a}</span>)}
        </div>
      )
    },
    { key: 'status', label: 'Status', render: v => <Badge value={v} /> },
    { key: 'updated', label: 'Updated', render: v => <span className="font-mono text-text-muted/70 text-[11px]">{v}</span> },
    {
      key: 'actions', label: 'Actions', align: 'right', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end" onClick={(e) => e.stopPropagation()}>
          <button onClick={e => { e.stopPropagation(); act('Edit', r.id); }} className="w-6 h-6 rounded-[5px] border border-white/[0.08] flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer"><Edit2 size={10} /></button>
          <button onClick={e => { e.stopPropagation(); act('Duplicated', r.id); }} className="w-6 h-6 rounded-[5px] border border-cyan/[0.15] flex items-center justify-center text-cyan/60 hover:text-cyan cursor-pointer"><Copy size={10} /></button>
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
            Roles
          </h2>
          <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-lg">
            Manage system roles, permissions scope, and assigned users.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="flex items-center justify-between mb-4">
        <SectionHead title="All Roles" Icon={Shield} />
        <div className="flex gap-2">
          <IconBtn label="New Role" Icon={Plus} variant="brand" onClick={() => act('New role', 'form opened')} />
          <IconBtn label="Export" Icon={Download} variant="default" onClick={() => act('Exported', 'roles')} />
        </div>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading">
          <CheckCircle2 size={13} />{toast}
        </div>
      )}

      {/* Role cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-4">
        {rolesData.map(role => {
          const color = ROLE_CLR[role.name] || 'rgba(255,255,255,0.3)';
          return (
            <Card key={role.id} onClick={() => drawerState.open(role)} padding={false}
              className="text-left group cursor-pointer hover:border-white/[0.1] hover:bg-white/[0.03] p-4 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[8px] flex items-center justify-center border flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, borderColor: `color-mix(in srgb, ${color} 24%, transparent)` }}>
                    <Shield size={15} style={{ color }} />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold font-heading text-text tracking-[-0.01em]">{role.label}</div>
                    <div className="text-[11px] font-mono text-text-muted/70">{role.userCount} admin{role.userCount !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <Badge value={role.status} />
              </div>
              <div className="text-[12.5px] text-text-muted/75 font-heading leading-snug mb-3 line-clamp-2">{role.desc}</div>
              <div className="flex flex-wrap gap-1 pt-2 border-t border-white/[0.04]">
                {role.actions.map(a => (
                  <span key={a} className="text-[10px] font-mono px-1.5 py-0.5 rounded-[4px]"
                    style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)` }}>
                    {a}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-[11px] text-text-muted/70 font-heading">{role.modules.length} modules</span>
                <ChevronRight size={12} className="text-text-muted/50 group-hover:text-primary transition-colors" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Also show as table */}
      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar title="Role Table View" count={rolesData.length} accentColor="var(--primary)" />
        <MainTable 
          columns={cols} 
          data={rolesData} 
          onRowClick={r => drawerState.open(r)}
          rowClassName={() => `hover:bg-primary/5 hover:border-l-primary cursor-pointer`}
        />
      </section>
      
      <RoleDrawer row={drawerState.value} open={drawerState.isOpen} onClose={() => drawerState.close()} onAction={act} />
    </div>
  );
}

export default RolesPage;
