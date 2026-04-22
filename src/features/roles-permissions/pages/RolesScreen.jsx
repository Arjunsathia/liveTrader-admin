import React, { useState } from 'react';
import { Shield, ShieldCheck, Users, Sliders, Plus, Download, CheckCircle2, ChevronRight, Edit2, Copy, ClipboardList } from 'lucide-react';
import { SectionHead, IconBtn, ROLE_CLR, Badge } from '../components/RolesPermissionsShared';
import { RoleDrawer } from '../components/RoleDrawers';
import { rolesData } from '../data/workspaces/admin-mgmt.workspace';

import { KpiCard } from '../../../components/cards/KpiCard';
import { FeatureTable } from '../../../components/tables/FeatureTable';
import { Card } from '../../../components/ui/Card';

export function RolesScreen() {
  const [drawer, setDrawer] = useState(null);
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
            <div className="text-[12px] font-semibold font-heading text-text/85">{v}</div>
            <div className="text-[10px] text-text-muted/35 font-heading truncate max-w-[200px]">{r.desc}</div>
          </div>
        </div>
      )
    },
    { key: 'userCount', label: 'Admins', render: v => <span className="font-mono font-bold text-brand">{v}</span> },
    { key: 'scope', label: 'Scope', render: v => <span className="text-[10px] font-heading border border-white/[0.06] px-1.5 py-0.5 rounded-[4px] text-text-muted/50">{v}</span> },
    {
      key: 'actions', label: 'Actions', render: v => (
        <div className="flex gap-1 flex-wrap max-w-[200px]">
          {v.map(a => <span key={a} className="text-[9px] font-mono px-1 py-0.5 rounded-[3px] bg-primary/[0.06] border border-primary/[0.12] text-primary">{a}</span>)}
        </div>
      )
    },
    { key: 'status', label: 'Status', render: v => <Badge value={v} /> },
    { key: 'updated', label: 'Updated', render: v => <span className="font-mono text-text-muted/40 text-[10.5px]">{v}</span> },
    {
      key: '_act', label: '', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={e => { e.stopPropagation(); act('Edit', r.id); }} className="w-6 h-6 rounded-[5px] border border-white/[0.08] flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer"><Edit2 size={10} /></button>
          <button onClick={e => { e.stopPropagation(); act('Duplicated', r.id); }} className="w-6 h-6 rounded-[5px] border border-cyan/[0.15] flex items-center justify-center text-cyan/60 hover:text-cyan cursor-pointer"><Copy size={10} /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
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
            <Card key={role.id} onClick={() => setDrawer(role)} padding={false}
              className="text-left group cursor-pointer hover:border-white/[0.1] hover:bg-white/[0.03] p-4 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[8px] flex items-center justify-center border flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, borderColor: `color-mix(in srgb, ${color} 24%, transparent)` }}>
                    <Shield size={15} style={{ color }} />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold font-heading text-text tracking-[-0.01em]">{role.label}</div>
                    <div className="text-[10px] font-mono text-text-muted/35">{role.userCount} admin{role.userCount !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <Badge value={role.status} />
              </div>
              <div className="text-[11px] text-text-muted/45 font-heading leading-snug mb-3 line-clamp-2">{role.desc}</div>
              <div className="flex flex-wrap gap-1 pt-2 border-t border-white/[0.04]">
                {role.actions.map(a => (
                  <span key={a} className="text-[9.5px] font-mono px-1.5 py-0.5 rounded-[4px]"
                    style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 15%, transparent)` }}>
                    {a}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-[10px] text-text-muted/25 font-heading">{role.modules.length} modules</span>
                <ChevronRight size={12} className="text-text-muted/25 group-hover:text-primary transition-colors" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Also show as table */}
      <Card padding={false}>
        <div className="px-5 py-4 border-b border-border/15">
          <SectionHead title="Role Table View" Icon={ClipboardList} />
        </div>
        <FeatureTable cols={cols} rows={rolesData} onRow={r => setDrawer(r)} />
      </Card>
      <RoleDrawer row={drawer} open={!!drawer} onClose={() => setDrawer(null)} onAction={act} />
    </div>
  );
}
