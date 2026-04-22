import React, { useState } from 'react';
import { Shield, Check, CheckCircle2, XCircle, X } from 'lucide-react';
import { IconBtn, ROLE_CLR } from '../components/RolesPermissionsShared';
import { rolesData, PERM_MODULES, PERM_ACTIONS, buildInitialMatrix } from '../data/workspaces/admin-mgmt.workspace';
import { Card } from '../../../components/ui/Card';

export function PermissionsScreen() {
  const [matrix, setMatrix] = useState(buildInitialMatrix);
  const [activeRole, setActiveRole] = useState(rolesData[0].name);
  const [toast, setToast] = useState(null);
  const act = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const togglePerm = (role, mod, action) => {
    setMatrix(prev => ({
      ...prev,
      [role]: { ...prev[role], [mod]: { ...prev[role][mod], [action]: !prev[role][mod][action] } },
    }));
  };

  const toggleRow = (mod) => {
    const allOn = PERM_ACTIONS.every(a => matrix[activeRole][mod][a]);
    setMatrix(prev => ({
      ...prev,
      [activeRole]: { ...prev[activeRole], [mod]: Object.fromEntries(PERM_ACTIONS.map(a => [a, !allOn])) },
    }));
  };

  const toggleCol = (action) => {
    const allOn = PERM_MODULES.every(m => matrix[activeRole][m.id][action]);
    setMatrix(prev => {
      const mods = {};
      PERM_MODULES.forEach(m => { mods[m.id] = { ...prev[activeRole][m.id], [action]: !allOn }; });
      return { ...prev, [activeRole]: { ...prev[activeRole], ...mods } };
    });
  };

  const toggleAll = (val) => {
    setMatrix(prev => {
      const mods = {};
      PERM_MODULES.forEach(m => {
        mods[m.id] = Object.fromEntries(PERM_ACTIONS.map(a => [a, val]));
      });
      return { ...prev, [activeRole]: { ...prev[activeRole], ...mods } };
    });
  };

  const roleObj = rolesData.find(r => r.name === activeRole);
  const roleColor = ROLE_CLR[activeRole] || 'rgba(255,255,255,0.3)';

  const PermCheck = ({ active, onClick }) => (
    <button onClick={onClick}
      className={`w-6 h-6 rounded-[5px] flex items-center justify-center border transition-all duration-150 cursor-pointer hover:scale-110 active:scale-95 ${active
        ? 'border-positive/30 bg-positive/[0.15] text-positive shadow-[0_0_6px_rgba(74,225,118,0.2)]'
        : 'border-white/[0.08] bg-transparent text-transparent hover:border-white/[0.16]'}`}>
      <Check size={11} strokeWidth={3} />
    </button>
  );

  const countActive = () => PERM_MODULES.reduce((s, m) =>
    s + PERM_ACTIONS.filter(a => matrix[activeRole][m.id][a]).length, 0);

  return (
    <div className="space-y-4">
      {/* Role selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-text-muted/35 font-heading flex-shrink-0">Editing Role:</span>
        <div className="flex gap-1.5 flex-wrap">
          {rolesData.map(r => {
            const c = ROLE_CLR[r.name] || 'rgba(255,255,255,0.3)';
            const isActive = activeRole === r.name;
            return (
              <button key={r.name} onClick={() => setActiveRole(r.name)}
                className="flex items-center gap-2 px-3 h-8 rounded-[8px] text-[11.5px] font-bold font-heading cursor-pointer transition-all border"
                style={isActive
                  ? { color: c, background: `color-mix(in srgb, ${c} 12%, transparent)`, borderColor: `color-mix(in srgb, ${c} 30%, transparent)` }
                  : { color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <Shield size={11} />
                {r.label}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex gap-2">
          <IconBtn label="Grant All" Icon={CheckCircle2} variant="success" small onClick={() => { toggleAll(true); act('All permissions granted for ' + activeRole); }} />
          <IconBtn label="Revoke All" Icon={XCircle} variant="danger" small onClick={() => { toggleAll(false); act('All permissions revoked for ' + activeRole); }} />
          <IconBtn label="Save Changes" Icon={Check} variant="brand" small onClick={() => act('Permissions saved for ' + activeRole)} />
        </div>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading">
          <CheckCircle2 size={13} />{toast}
        </div>
      )}

      {/* Active role summary */}
      <Card padding={false} className="border-cyan/20" style={{ background: `color-mix(in srgb, ${roleColor} 3%, transparent)` }}>
        <div className="flex items-center gap-4 px-5 py-4">
          <Shield size={18} className="flex-shrink-0" style={{ color: roleColor }} />
          <div className="flex-1 min-w-0">
            <span className="text-[14px] font-bold font-heading text-text">{roleObj?.label}</span>
            <span className="text-[12px] text-text-muted/50 font-heading ml-3">{roleObj?.desc}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[12px] font-mono font-bold" style={{ color: roleColor }}>{countActive()}</span>
            <span className="text-[11px] text-text-muted/40 font-heading">/ {PERM_MODULES.length * PERM_ACTIONS.length} permissions active</span>
          </div>
        </div>

        {/* MATRIX */}
        <div className="overflow-x-auto custom-scrollbar border-t border-border/15">
          <table className="w-full min-w-[820px] text-left border-collapse">
            <thead>
              <tr className="bg-surface-elevated/30 border-b border-border/20">
                {/* Module header */}
                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/60 font-heading w-[200px]">
                  Module
                </th>
                {/* Row toggle */}
                <th className="px-3 py-4 text-center text-[9px] font-semibold uppercase tracking-[0.1em] text-text-muted/50 font-heading w-[50px]">All</th>
                {/* Action columns */}
                {PERM_ACTIONS.map(action => {
                  const allOn = PERM_MODULES.every(m => matrix[activeRole]?.[m.id]?.[action]);
                  return (
                    <th key={action} className="px-2 py-4 text-center w-[80px]">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted/60 font-heading">{action}</span>
                        {/* Column toggle */}
                        <button onClick={() => toggleCol(action)}
                          className={`w-5 h-5 rounded-[4px] flex items-center justify-center border transition-all cursor-pointer hover:scale-110
                            ${allOn ? 'border-cyan/30 bg-cyan/[0.12] text-cyan' : 'border-border/30 text-transparent hover:border-border/60'}`}>
                          <Check size={9} strokeWidth={3} />
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {PERM_MODULES.map((mod, mi) => {
                const rowPerms = matrix[activeRole]?.[mod.id] || {};
                const allRowOn = PERM_ACTIONS.every(a => rowPerms[a]);
                const someRowOn = PERM_ACTIONS.some(a => rowPerms[a]);
                const IconComp = mod.Icon;
                return (
                  <tr key={mod.id} className="group border-b border-border/10 transition-colors hover:bg-surface-bright/20 last:border-0">
                    {/* Module label */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-[8px] bg-surface-elevated shadow-card-subtle flex items-center justify-center flex-shrink-0">
                          <IconComp size={13} className="text-text-muted/50 group-hover:text-primary/70 transition-colors" />
                        </div>
                        <span className="text-[13px] font-semibold font-heading text-text/80">{mod.label}</span>
                      </div>
                    </td>
                    {/* Row toggle */}
                    <td className="px-3 py-3 text-center">
                      <button onClick={() => toggleRow(mod.id)}
                        className={`w-5 h-5 rounded-[4px] mx-auto flex items-center justify-center border transition-all cursor-pointer hover:scale-110
                          ${allRowOn ? 'border-brand/40 bg-brand/[0.12]' : someRowOn ? 'border-warning/40 bg-warning/[0.08]' : 'border-border/30 hover:border-border/60'}`}>
                        {allRowOn ? <Check size={9} strokeWidth={3} className="text-brand" />
                          : someRowOn ? <span className="w-2 h-0.5 bg-warning rounded-full" />
                            : null}
                      </button>
                    </td>
                    {/* Permission cells */}
                    {PERM_ACTIONS.map(action => (
                      <td key={action} className="px-2 py-3 text-center">
                        <div className="flex justify-center">
                          <PermCheck
                            active={rowPerms[action] || false}
                            onClick={() => togglePerm(activeRole, mod.id, action)}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-6 text-[10.5px] font-heading text-text-muted/40 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[4px] border border-positive/30 bg-positive/[0.15] flex items-center justify-center"><Check size={9} strokeWidth={3} className="text-positive" /></div>
          Permission granted
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[4px] border border-white/[0.08] bg-transparent" />
          Permission denied
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[4px] border border-cyan/25 bg-cyan/[0.1] flex items-center justify-center"><Check size={9} strokeWidth={3} className="text-cyan" /></div>
          Column header — toggles entire column
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[4px] border border-brand/25 bg-brand/[0.1]" />
          Row header — toggles entire row
        </div>
      </div>
    </div>
  );
}
