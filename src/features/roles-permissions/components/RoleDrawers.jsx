import React, { useState } from 'react';
import { Shield, ShieldCheck, Lock, Edit2, Key, Fingerprint, LogOut, Check, Copy, User, MessageSquare, Send, BookOpen, Layers, EyeOff, Sliders, AlertOctagon, Terminal, Monitor, ShieldAlert, ShieldX, Download, X, Flag } from 'lucide-react';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { DrawerGrid, DrawerField } from '../../../components/overlays/DrawerUI';
import { AdminAvatar, Badge, RolePill, TwoFABadge, SectionHead, IconBtn, SevBadge } from './RolesPermissionsShared';
import { adminNotes, rolesData, PERM_ACTIONS } from '../data/workspaces/admin-mgmt.workspace';

// Local enhanced DrawerField for copyable support
function DF({ label, value, mono, accent, wide, copyable }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={`group relative rounded-[9px] border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 ${wide ? 'col-span-2' : ''}`}>
      <div className="text-[9.5px] font-black uppercase tracking-[0.15em] text-text-muted/35 mb-1 font-heading">{label}</div>
      <div className={`text-[12.5px] truncate ${mono ? 'font-mono' : 'font-semibold font-heading'}`} style={{ color: accent ?? 'var(--text)' }}>{value ?? '—'}</div>
      {copyable && value && (
        <button onClick={() => { navigator.clipboard.writeText(String(value)); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted/30 hover:text-text-muted cursor-pointer">
          {copied ? <Check size={11} /> : <Copy size={11} />}
        </button>
      )}
    </div>
  );
}

const ROLE_CLR = {
  SUPER_ADMIN: '#e5c07b', RISK_OFFICER: '#ef4444', COMPLIANCE: '#a78bfa',
  FINANCE: 'var(--brand)', SUPPORT: 'var(--cyan)', READ_ONLY: 'rgba(255,255,255,0.35)',
};
const SEV_CLR = {
  INFO: 'var(--cyan)', WARNING: 'var(--warning)', ERROR: 'var(--negative)', CRITICAL: 'var(--negative)',
};
const STATUS_CLR = {
  ACTIVE: 'var(--positive)', INACTIVE: 'var(--text-muted)', LOCKED: 'var(--negative)',
  PENDING: 'var(--warning)', DRAFT: 'var(--warning)', SUCCESS: 'var(--positive)',
  FAILED: 'var(--negative)', BLOCKED: 'var(--negative)', LOCKED_OUT: 'var(--negative)',
};

export function AdminUserDrawer({ row, open, onClose, onAction }) {
  const [noteText, setNoteText] = useState(row ? (adminNotes[row.id] || '') : '');
  if (!row) return null;
  const roleData = rolesData.find(r => r.name === row.role);

  return (
    <AdminDrawer open={open} onClose={onClose} title={row.name} subtitle={row.email} eyebrow="Admin Profile">
      <div className="space-y-5">
        {/* Header card */}
        <div className="rounded-[12px] border border-white/[0.07] overflow-hidden mt-2">
          <div className="px-4 py-4 flex items-center gap-3.5"
            style={{ background: `color-mix(in srgb, ${ROLE_CLR[row.role] || '#fff'} 6%, transparent)`, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <AdminAvatar name={row.name} role={row.role} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-bold tracking-[-0.02em] text-text font-heading">{row.name}</div>
              <div className="text-[11px] font-mono text-text-muted/45 mt-0.5">{row.email}</div>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <Badge value={row.status} />
              <TwoFABadge enabled={row.twoFA} />
            </div>
          </div>
          <div className="px-4 py-3 flex items-center gap-3">
            <RolePill value={row.role} />
            <span className="text-[10px] font-mono text-text-muted/35">{row.id} · {row.region}</span>
          </div>
        </div>

        {/* Identity */}
        <div>
          <SectionHead title="Account Details" Icon={User} />
          <DrawerGrid cols={2} gap={2}>
            <DF label="Admin ID" value={row.id} mono copyable />
            <DF label="Region" value={row.region} />
            <DF label="Created" value={row.created} mono />
            <DF label="Last Login" value={row.lastLogin} />
            <DF label="Total Logins" value={row.logins?.toLocaleString()} mono />
            <DF label="Total Actions" value={row.actions?.toLocaleString()} mono />
          </DrawerGrid>
        </div>

        {/* Role & Permissions */}
        <div>
          <SectionHead title="Role & Permission Scope" Icon={Shield} />
          <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.025] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <RolePill value={row.role} />
              <span className="text-[10px] font-mono text-text-muted/40">{roleData?.scope}</span>
            </div>
            {roleData?.modules && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {roleData.modules.map(m => (
                  <span key={m} className="text-[10px] font-heading font-semibold px-2 py-0.5 rounded-[5px] border border-white/[0.06] bg-white/[0.03] text-text-muted/55">{m}</span>
                ))}
              </div>
            )}
            {roleData?.actions && (
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/[0.04]">
                {roleData.actions.map(a => (
                  <span key={a} className="text-[10px] font-mono px-2 py-0.5 rounded-[5px] border border-primary/[0.15] bg-primary/[0.06] text-primary">{a}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Security status */}
        <div>
          <SectionHead title="Security Status" Icon={ShieldCheck} />
          <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.025] px-4 py-1">
            {[
              { label: '2FA Authentication', val: row.twoFA, yes: 'Enabled', no: 'Not enabled' },
              { label: 'Account Locked', val: row.locked, yes: 'LOCKED', no: 'Not locked', invert: true },
              { label: 'Active Session', val: row.status === 'ACTIVE' && row.lastLogin !== 'Never', yes: 'Online', no: 'Offline' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                <span className="text-[12px] font-heading font-semibold text-text/65">{s.label}</span>
                <span className="text-[11px] font-bold font-heading"
                  style={{ color: (s.invert ? !s.val : s.val) ? 'var(--positive)' : 'var(--negative)' }}>
                  {s.val ? s.yes : s.no}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Internal note */}
        <div>
          <SectionHead title="Internal Note" Icon={MessageSquare} />
          <div className="space-y-2.5">
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3}
              placeholder="Add internal note about this admin…"
              className="w-full rounded-[9px] border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-[12px] text-text font-heading outline-none placeholder:text-text-muted/25 focus:border-primary/30 resize-none transition-colors" />
            <button onClick={() => onAction('Note saved', row.id)}
              className="flex items-center gap-1.5 h-7 px-3 rounded-[7px] text-[10.5px] font-bold font-heading border border-primary/20 bg-primary/[0.07] text-primary cursor-pointer hover:brightness-110 transition-all">
              <Send size={10} /> Save Note
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pb-4">
          <IconBtn label="Edit Profile" Icon={Edit2} variant="default" onClick={() => { onAction('Edit opened', row.id); onClose(); }} />
          <IconBtn label="Change Role" Icon={Shield} variant="cyan" onClick={() => { onAction('Role change', row.id); onClose(); }} />
          <IconBtn label="Reset Password" Icon={Key} variant="warning" onClick={() => { onAction('Password reset', row.id); onClose(); }} />
          <IconBtn label="Force 2FA" Icon={Fingerprint} variant="brand" onClick={() => { onAction('2FA enforced', row.id); onClose(); }} />
          {row.locked
            ? <IconBtn label="Unlock Account" Icon={ShieldCheck} variant="success" onClick={() => { onAction('Unlocked', row.id); onClose(); }} />
            : <IconBtn label="Lock Account" Icon={Lock} variant="danger" onClick={() => { onAction('Locked', row.id); onClose(); }} />
          }
          <IconBtn label="Revoke Sessions" Icon={LogOut} variant="danger" onClick={() => { onAction('Sessions revoked', row.id); onClose(); }} />
        </div>
      </div>
    </AdminDrawer>
  );
}

export function RoleDrawer({ row, open, onClose, onAction }) {
  if (!row) return null;
  const color = ROLE_CLR[row.name] || 'rgba(255,255,255,0.3)';
  return (
    <AdminDrawer open={open} onClose={onClose} title={row.label} subtitle={row.desc} eyebrow="Role Info">
      <div className="space-y-5">
        <div className="rounded-[12px] border overflow-hidden mt-2"
          style={{ borderColor: `color-mix(in srgb, ${color} 25%, transparent)`, background: `color-mix(in srgb, ${color} 5%, transparent)` }}>
          <div className="px-4 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 border"
              style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, borderColor: `color-mix(in srgb, ${color} 25%, transparent)` }}>
              <Shield size={18} style={{ color }} />
            </div>
            <div>
              <div className="text-[15px] font-bold font-heading text-text tracking-[-0.02em]">{row.label}</div>
              <div className="text-[11px] text-text-muted/45 font-heading mt-0.5">{row.desc}</div>
            </div>
          </div>
        </div>

        <div>
          <SectionHead title="Role Info" Icon={BookOpen} />
          <DrawerGrid cols={2} gap={2}>
            <DF label="Role ID" value={row.id} mono />
            <DF label="User Count" value={row.userCount} mono accent="var(--brand)" />
            <DF label="Scope" value={row.scope} />
            <DF label="Status" value={row.status} accent={STATUS_CLR[row.status]} />
            <DF label="Last Updated" value={row.updated} mono wide />
          </DrawerGrid>
        </div>

        <div>
          <SectionHead title="Allowed Modules" Icon={Layers} />
          <div className="flex flex-wrap gap-1.5">
            {row.modules.map(m => (
              <span key={m} className="text-[10.5px] font-heading font-semibold px-2.5 py-1 rounded-[6px] border border-white/[0.07] bg-white/[0.03] text-text-muted/60">{m}</span>
            ))}
          </div>
        </div>

        <div>
          <SectionHead title="Allowed Actions" Icon={Check} />
          <div className="flex flex-wrap gap-1.5">
            {PERM_ACTIONS.map(a => {
              const allowed = row.actions.includes(a);
              return (
                <span key={a} className="inline-flex items-center gap-1 text-[10.5px] font-mono px-2 py-1 rounded-[6px] border"
                  style={allowed
                    ? { color, background: `color-mix(in srgb, ${color} 10%, transparent)`, borderColor: `color-mix(in srgb, ${color} 20%, transparent)` }
                    : { color: 'rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
                  {allowed ? <Check size={9} /> : <X size={9} />} {a}
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pb-4">
          <IconBtn label="Edit Role" Icon={Edit2} variant="default" onClick={() => { onAction('Edit opened', row.id); onClose(); }} />
          <IconBtn label="Duplicate" Icon={Copy} variant="cyan" onClick={() => { onAction('Duplicated', row.id); onClose(); }} />
          <IconBtn label="View Matrix" Icon={Sliders} variant="brand" onClick={() => { onAction('Matrix opened', row.id); onClose(); }} />
          <IconBtn label="Disable Role" Icon={EyeOff} variant="danger" onClick={() => { onAction('Disabled', row.id); onClose(); }} />
        </div>
      </div>
    </AdminDrawer>
  );
}

export function AccessLogDrawer({ row, open, onClose }) {
  if (!row) return null;
  const sevColor = SEV_CLR[row.severity] || 'var(--text-muted)';
  const isCritical = row.severity === 'CRITICAL' || row.severity === 'ERROR';
  return (
    <AdminDrawer open={open} onClose={onClose} title={row.id} subtitle={row.action.replace(/_/g, ' ')} eyebrow="Event">
      <div className="space-y-5">
        {isCritical && (
          <div className="flex items-start gap-2.5 rounded-[9px] border border-negative/20 bg-negative/[0.06] px-3.5 py-3 mt-2">
            <AlertOctagon size={13} className="text-negative flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[11.5px] font-bold text-negative font-heading">High Severity Event</div>
              <div className="text-[11px] text-negative/70 font-heading mt-0.5">This event requires immediate review. Check IP, device, and context.</div>
            </div>
          </div>
        )}
        <div>
          <SectionHead title="Event Details" Icon={Terminal} />
          <DrawerGrid cols={2} gap={2}>
            <DF label="Event ID" value={row.id} mono copyable />
            <DF label="Admin" value={row.admin} />
            <DF label="Action" value={row.action.replace(/_/g, ' ')} />
            <DF label="Module" value={row.module} />
            <DF label="Status" value={row.status} accent={STATUS_CLR[row.status]} />
            <DF label="Severity" value={row.severity} accent={sevColor} />
            <DF label="Timestamp" value={row.ts} mono wide />
          </DrawerGrid>
        </div>
        <div>
          <SectionHead title="Device & Location" Icon={Monitor} />
          <DrawerGrid cols={2} gap={2}>
            <DF label="IP Address" value={row.ip} mono copyable />
            <DF label="Device" value={row.device} />
            <DF label="Browser" value={row.browser} />
            <DF label="Location" value={row.location} />
          </DrawerGrid>
        </div>
        <div>
          <SectionHead title="Risk Assessment" Icon={ShieldAlert} />
          <div className="rounded-[10px] border px-4 py-3 space-y-1.5"
            style={{ borderColor: `color-mix(in srgb, ${sevColor} 20%, transparent)`, background: `color-mix(in srgb, ${sevColor} 5%, transparent)` }}>
            <div className="text-[11px] font-heading font-semibold" style={{ color: sevColor }}>
              {row.severity === 'CRITICAL' ? 'Critical: Requires immediate investigation'
                : row.severity === 'ERROR' ? 'Error: Event resulted in failed or blocked action'
                  : row.severity === 'WARNING' ? 'Warning: Elevated risk — monitor closely'
                    : 'Informational: Normal admin activity'}
            </div>
            {row.action.includes('BRUTE') && (
              <div className="text-[10.5px] text-text-muted/55 font-heading">IP has been automatically blocked. No further action needed unless manual unblock is requested.</div>
            )}
            {row.action.includes('FAILED') && (
              <div className="text-[10.5px] text-text-muted/55 font-heading">Repeated login failures from this IP. Consider geofencing or account suspension.</div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pb-4">
          <IconBtn label="Flag Event" Icon={Flag} variant="warning" />
          <IconBtn label="Block IP" Icon={ShieldX} variant="danger" />
          <IconBtn label="Export Event" Icon={Download} variant="default" />
          <IconBtn label="View Admin" Icon={User} variant="default" onClick={onClose} />
        </div>
      </div>
    </AdminDrawer>
  );
}
