import React, { useState } from 'react';
import {
  AlertOctagon,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Edit2,
  EyeOff,
  FileText,
  Fingerprint,
  Flag,
  Globe,
  Hash,
  Key,
  Layers,
  Lock,
  LogOut,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sliders,
  User,
  X,
  Zap,
} from 'lucide-react';
import {
  AdminAvatar,
  Badge,
  ROLE_CLR,
  RolePill,
  SEV_CLR,
  STATUS_CLR,
  TwoFABadge,
} from './RolesComponents';
import {
  adminNotes,
  PERM_ACTIONS,
  rolesData,
} from '@/config/constants/roles-permissions/workspaces/admin-mgmt.workspace';

import { MainDrawer } from '../../../components/common/drawer';

/* ══════════════════════════════════════════════════════════════
   SHARED DRAWER PRIMITIVES
══════════════════════════════════════════════════════════════ */

/* ── Backdrop + Sliding Panel Shell ── */
function DrawerShell({ open, onClose, children }) {
  return (
    <MainDrawer open={open} onClose={onClose} width="max-w-[720px]">
      {children}
    </MainDrawer>
  );
}

/* ── Drawer Header ── */
function DHeader({ eyebrow, title, subtitle, onClose, accentColor = 'var(--brand)' }) {
  return (
    <div className="flex-shrink-0 border-b border-border/15">
      {/* Color accent bar */}
      <div
        className="h-[2.5px] w-full"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, color-mix(in srgb, ${accentColor} 30%, transparent) 60%, transparent)`,
        }}
      />
      <div className="px-6 py-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className="text-[9.5px] font-black uppercase tracking-[0.22em] mb-2 leading-none"
            style={{ color: `color-mix(in srgb, ${accentColor} 65%, transparent)` }}
          >
            {eyebrow}
          </p>
          <h2 className="text-[20px] font-bold tracking-[-0.022em] text-text leading-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11.5px] font-mono text-text-muted/50 mt-1.5 truncate">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30 transition-all cursor-pointer mt-0.5"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

/* ── Scrollable Body ── */
function DBody({ children }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
      {children}
      <div className="h-2" />
    </div>
  );
}

/* ── Sticky Footer ── */
function DFooter({ children }) {
  return (
    <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated px-6 py-4">
      {children}
    </div>
  );
}

/* ── Collapsible Section Card ── */
function DSection({ icon: Icon, title, children, collapsible = false, accent = 'var(--brand)' }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-[12px] border border-border/15 bg-bg/20 overflow-hidden">
      {/* Section Header */}
      <div
        className={`flex items-center gap-3 px-4 py-3 ${isOpen ? 'border-b border-border/10' : ''} ${collapsible ? 'cursor-pointer hover:bg-bg/30' : 'cursor-default'
          } transition-colors select-none`}
        onClick={() => collapsible && setIsOpen((v) => !v)}
      >
        <div
          className="w-6 h-6 rounded-[6px] flex items-center justify-center flex-shrink-0"
          style={{
            background: `color-mix(in srgb, ${accent} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
          }}
        >
          <Icon size={12} style={{ color: accent }} />
        </div>
        <span className="flex-1 text-[10.5px] font-black uppercase tracking-[0.16em] text-text-muted/65">
          {title}
        </span>
        {collapsible && (
          isOpen
            ? <ChevronUp size={12} className="text-text-muted/30 flex-shrink-0" />
            : <ChevronDown size={12} className="text-text-muted/30 flex-shrink-0" />
        )}
      </div>
      {/* Section Body */}
      {isOpen && <div className="px-4 py-4 space-y-3">{children}</div>}
    </div>
  );
}

/* ── Read-only Field ── */
function DField({ label, value, mono = false, accent, copyable = false, className = '' }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={`space-y-1.5 ${className}`}>
      <span className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/42 select-none">
        {label}
      </span>
      <div
        className={`relative group flex h-9 items-center rounded-[8px] border border-border/12 bg-bg/50 px-3 text-[12.5px] ${mono ? 'font-mono' : 'font-medium'
          } ${copyable ? 'pr-9' : ''}`}
        style={{ color: accent ?? 'var(--text)' }}
      >
        <span className="truncate">{value || <span className="opacity-20">—</span>}</span>
        {copyable && value && (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(String(value));
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }}
            className="absolute right-2 flex h-5 w-5 items-center justify-center rounded-[5px] opacity-0 group-hover:opacity-100 text-text-muted/25 hover:text-brand hover:bg-brand/10 transition-all cursor-pointer"
          >
            {copied ? <Check size={9} /> : <Copy size={9} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Two-column Grid ── */
function DGrid({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {children}
    </div>
  );
}

/* ── Textarea ── */
function DTextarea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/42 select-none">
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-[8px] border border-border/18 bg-bg/60 px-3 py-2.5 text-[12.5px] text-text outline-none placeholder:text-text-muted/20 focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all leading-relaxed"
      />
    </div>
  );
}

/* ── Action Button ── */
const VARIANT_MAP = {
  brand: 'bg-brand text-bg hover:brightness-110',
  danger: 'border border-negative/25 bg-negative/10 text-negative hover:bg-negative/18',
  warning: 'border border-warning/25 bg-warning/10 text-warning hover:bg-warning/18',
  success: 'border border-positive/25 bg-positive/10 text-positive hover:bg-positive/18',
  cyan: 'border border-cyan-400/22 bg-cyan-400/8 text-cyan-400 hover:bg-cyan-400/14',
  default: 'border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30',
};

function ActionButton({ label, Icon, variant = 'default', onClick, className = '', disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 h-9 px-4 rounded-[9px] text-[11.5px] font-bold transition-all active:scale-[0.97] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${VARIANT_MAP[variant] || VARIANT_MAP.default
        } ${className}`}
    >
      {Icon && <Icon size={12} className="flex-shrink-0" />}
      {label}
    </button>
  );
}

/* ── Inline Pill Tag ── */
function InlinePill({ children, active = true, color = 'var(--text-muted)', icon: Icon }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.06em]"
      style={
        active
          ? {
            color,
            background: `color-mix(in srgb, ${color} 10%, transparent)`,
            borderColor: `color-mix(in srgb, ${color} 20%, transparent)`,
          }
          : {
            color: 'rgba(255,255,255,0.27)',
            background: 'rgba(255,255,255,0.02)',
            borderColor: 'rgba(255,255,255,0.06)',
          }
      }
    >
      {Icon && <Icon size={9} className="flex-shrink-0" />}
      {children}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   ADMIN USER DRAWER
══════════════════════════════════════════════════════════════ */
export function AdminUserDrawer({ row, open, onClose, onAction }) {
  const [noteText, setNoteText] = useState(row ? (adminNotes[row.id] || '') : '');
  if (!row) return null;

  const roleData = rolesData.find((r) => r.name === row.role);
  const roleColor = ROLE_CLR[row.role] || 'rgba(255,255,255,0.35)';

  return (
    <DrawerShell open={open} onClose={onClose}>
      <DHeader
        eyebrow="Admin Profile"
        title={row.name}
        subtitle={row.email}
        onClose={onClose}
        accentColor={roleColor}
      />

      <DBody>
        {/* ── Identity Hero ── */}
        <div className="rounded-[13px] border border-border/18 bg-bg/30 overflow-hidden">
          <div
            className="h-[2px] w-full"
            style={{ background: `linear-gradient(90deg, ${roleColor}, transparent)` }}
          />
          <div className="p-5">
            <div className="flex items-start gap-4">
              <AdminAvatar name={row.name} role={row.role} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-black text-text leading-tight truncate">{row.name}</h3>
                <p className="text-[11px] font-mono text-text-muted/50 mt-1 truncate">{row.email}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <Badge value={row.status} />
                  <TwoFABadge enabled={row.twoFA} />
                </div>
              </div>
            </div>
            {/* Bottom strip */}
            <div className="mt-4 pt-3.5 border-t border-border/10 flex items-center gap-2.5 flex-wrap">
              <RolePill value={row.role} />
              <span className="text-[11px] font-mono text-text-muted/50">{row.id}</span>
              <div className="h-3 w-px bg-border/20" />
              <span className="text-[11px] font-mono text-text-muted/50">{row.region}</span>
            </div>
          </div>
        </div>

        {/* ── Account Details ── */}
        <DSection icon={User} title="Account Details">
          <DGrid>
            <DField label="Admin ID" value={row.id} mono copyable />
            <DField label="Region" value={row.region} />
            <DField label="Created" value={row.created} mono />
            <DField label="Last Login" value={row.lastLogin} />
            <DField label="Total Logins" value={row.logins?.toLocaleString()} mono accent="var(--brand)" />
            <DField label="Total Actions" value={row.actions?.toLocaleString()} mono accent="var(--brand)" />
          </DGrid>
        </DSection>

        {/* ── Role & Permissions ── */}
        <DSection icon={Shield} title="Role & Permission Scope" accent={roleColor}>
          <div
            className="rounded-[10px] border p-3.5 space-y-3"
            style={{
              borderColor: `color-mix(in srgb, ${roleColor} 18%, transparent)`,
              background: `color-mix(in srgb, ${roleColor} 4%, transparent)`,
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <RolePill value={row.role} />
              <span className="text-[10.5px] font-mono text-text-muted/55">{roleData?.scope}</span>
            </div>
            {roleData?.modules && (
              <div className="flex flex-wrap gap-1.5">
                {roleData.modules.map((mod) => (
                  <InlinePill key={mod} color={roleColor}>{mod}</InlinePill>
                ))}
              </div>
            )}
            {roleData?.actions && (
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/10">
                {roleData.actions.map((action) => (
                  <InlinePill key={action} color="var(--brand)">{action}</InlinePill>
                ))}
              </div>
            )}
          </div>
        </DSection>

        {/* ── Security Status ── */}
        <DSection icon={ShieldAlert} title="Security Status">
          <DGrid>
            <DField
              label="2FA Authentication"
              value={row.twoFA ? 'Enabled' : 'Not enabled'}
              accent={row.twoFA ? 'var(--positive)' : 'var(--negative)'}
            />
            <DField
              label="Account Locked"
              value={row.locked ? 'LOCKED' : 'Not locked'}
              accent={row.locked ? 'var(--negative)' : 'var(--positive)'}
            />
            <DField
              label="Active Session"
              value={row.status === 'ACTIVE' && row.lastLogin !== 'Never' ? 'Online' : 'Offline'}
              accent={row.status === 'ACTIVE' && row.lastLogin !== 'Never' ? 'var(--positive)' : 'var(--negative)'}
              className="col-span-2"
            />
          </DGrid>
        </DSection>

        {/* ── Internal Note ── */}
        <DSection icon={FileText} title="Internal Note" collapsible>
          <div className="space-y-2.5">
            <DTextarea
              label="Admin Note"
              value={noteText}
              onChange={setNoteText}
              placeholder="Add internal note about this admin..."
              rows={3}
            />
            <ActionButton
              label="Save Note"
              Icon={Fingerprint}
              variant="brand"
              onClick={() => onAction?.('Note saved', row.id)}
            />
          </div>
        </DSection>

        {/* ── Quick Actions ── */}
        <DSection icon={Zap} title="Quick Actions">
          <div className="grid grid-cols-2 gap-2">
            <ActionButton label="Change Role" Icon={Shield} variant="cyan"
              onClick={() => { onAction?.('Role change', row.id); onClose(); }} />
            <ActionButton label="Reset Password" Icon={Key} variant="warning"
              onClick={() => { onAction?.('Password reset', row.id); onClose(); }} />
            <ActionButton label="Force 2FA" Icon={Fingerprint} variant="brand"
              onClick={() => { onAction?.('2FA enforced', row.id); onClose(); }} />
            {row.locked
              ? <ActionButton label="Unlock Account" Icon={ShieldCheck} variant="success"
                onClick={() => { onAction?.('Unlocked', row.id); onClose(); }} />
              : <ActionButton label="Lock Account" Icon={Lock} variant="danger"
                onClick={() => { onAction?.('Locked', row.id); onClose(); }} />
            }
            <ActionButton
              label="Revoke Sessions" Icon={LogOut} variant="danger"
              className="col-span-2"
              onClick={() => { onAction?.('Sessions revoked', row.id); onClose(); }}
            />
          </div>
        </DSection>
      </DBody>

      {/* ── Footer ── */}
      <DFooter>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge value={row.status} />
            <RolePill value={row.role} />
            <TwoFABadge enabled={row.twoFA} />
          </div>
          <div className="flex items-center gap-2">
            <ActionButton variant="default" onClick={onClose} label="Close" />
            <ActionButton
              variant="brand" Icon={Edit2}
              onClick={() => { onAction?.('Edit opened', row.id); onClose(); }}
              label="Edit Profile"
            />
          </div>
        </div>
      </DFooter>
    </DrawerShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROLE DRAWER
══════════════════════════════════════════════════════════════ */
export function RoleDrawer({ row, open, onClose, onAction }) {
  if (!row) return null;
  const color = ROLE_CLR[row.name] || 'rgba(255,255,255,0.35)';

  return (
    <DrawerShell open={open} onClose={onClose}>
      <DHeader
        eyebrow="Role Configuration"
        title={row.label}
        subtitle={row.desc}
        onClose={onClose}
        accentColor={color}
      />

      <DBody>
        {/* ── Role Hero ── */}
        <div
          className="rounded-[13px] border p-5 flex items-center gap-4"
          style={{
            borderColor: `color-mix(in srgb, ${color} 22%, transparent)`,
            background: `color-mix(in srgb, ${color} 5%, transparent)`,
          }}
        >
          <div
            className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0 border"
            style={{
              background: `color-mix(in srgb, ${color} 15%, transparent)`,
              borderColor: `color-mix(in srgb, ${color} 28%, transparent)`,
            }}
          >
            <Shield size={22} style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-black text-text leading-tight">{row.label}</h3>
            <p className="text-[11.5px] text-text-muted/55 mt-1 leading-snug">{row.desc}</p>
          </div>
          {/* Member count */}
          <div className="flex-shrink-0 flex flex-col items-end gap-1">
            <span className="text-[28px] font-mono font-black leading-none" style={{ color }}>
              {row.userCount}
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.14em] text-text-muted/40">
              Members
            </span>
          </div>
        </div>

        {/* ── Role Info ── */}
        <DSection icon={Hash} title="Role Info" accent={color}>
          <DGrid>
            <DField label="Role ID" value={row.id} mono copyable />
            <DField label="User Count" value={row.userCount} mono accent="var(--brand)" />
            <DField label="Scope" value={row.scope} />
            <DField label="Status" value={row.status} accent={STATUS_CLR[row.status]} />
            <DField label="Last Updated" value={row.updated} mono className="col-span-2" />
          </DGrid>
        </DSection>

        {/* ── Allowed Modules ── */}
        <DSection icon={Layers} title="Allowed Modules" accent={color}>
          <div className="flex flex-wrap gap-1.5">
            {row.modules.map((mod) => (
              <InlinePill key={mod} color={color}>{mod}</InlinePill>
            ))}
          </div>
        </DSection>

        {/* ── Permission Matrix ── */}
        <DSection icon={Key} title="Permission Matrix" accent={color}>
          <div className="flex flex-wrap gap-1.5">
            {PERM_ACTIONS.map((action) => {
              const allowed = row.actions.includes(action);
              return (
                <InlinePill key={action} active={allowed} color={color} icon={allowed ? Check : X}>
                  {action}
                </InlinePill>
              );
            })}
          </div>
        </DSection>

        {/* ── Quick Actions ── */}
        <DSection icon={Zap} title="Quick Actions">
          <div className="grid grid-cols-2 gap-2">
            <ActionButton label="Duplicate Role" Icon={Copy} variant="cyan"
              onClick={() => { onAction?.('Duplicated', row.id); onClose(); }} />
            <ActionButton label="View Matrix" Icon={Sliders} variant="brand"
              onClick={() => { onAction?.('Matrix opened', row.id); onClose(); }} />
            <ActionButton
              label="Disable Role" Icon={EyeOff} variant="danger"
              className="col-span-2"
              onClick={() => { onAction?.('Disabled', row.id); onClose(); }}
            />
          </div>
        </DSection>
      </DBody>

      {/* ── Footer ── */}
      <DFooter>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <RolePill value={row.name} />
            <Badge value={row.status} />
          </div>
          <div className="flex items-center gap-2">
            <ActionButton variant="default" onClick={onClose} label="Close" />
            <ActionButton
              variant="brand" Icon={Edit2}
              onClick={() => { onAction?.('Edit opened', row.id); onClose(); }}
              label="Edit Role"
            />
          </div>
        </div>
      </DFooter>
    </DrawerShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   ACCESS LOG DRAWER
══════════════════════════════════════════════════════════════ */
export function AccessLogDrawer({ row, open, onClose }) {
  if (!row) return null;
  const sevColor = SEV_CLR[row.severity] || 'var(--text-muted)';
  const isCritical = row.severity === 'CRITICAL' || row.severity === 'ERROR';

  return (
    <DrawerShell open={open} onClose={onClose}>
      <DHeader
        eyebrow="Audit Event"
        title={row.id}
        subtitle={row.action.replace(/_/g, ' ')}
        onClose={onClose}
        accentColor={sevColor}
      />

      <DBody>
        {/* ── Critical Alert Banner ── */}
        {isCritical && (
          <div className="flex items-start gap-3 rounded-[10px] border border-negative/22 bg-negative/6 p-3.5">
            <AlertOctagon size={14} className="mt-0.5 flex-shrink-0 text-negative animate-pulse" />
            <div>
              <p className="text-[12.5px] font-bold text-negative leading-tight">High Severity Event</p>
              <p className="mt-1 text-[11.5px] text-negative/75 leading-snug">
                This event requires immediate review. Check IP, device, and context before taking action.
              </p>
            </div>
          </div>
        )}

        {/* ── Event Hero ── */}
        <div
          className="rounded-[13px] border p-5"
          style={{
            borderColor: `color-mix(in srgb, ${sevColor} 20%, transparent)`,
            background: `color-mix(in srgb, ${sevColor} 5%, transparent)`,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[9.5px] font-black uppercase tracking-[0.2em] text-text-muted/40 mb-2 leading-none">
                Audit Event
              </p>
              <h3 className="text-[22px] font-mono font-bold text-text leading-none">{row.id}</h3>
              <p className="text-[13px] font-medium text-text-muted/65 mt-2 leading-tight">
                {row.action.replace(/_/g, ' ')}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <InlinePill color={sevColor}>{row.severity}</InlinePill>
              <span className="text-[10px] font-mono text-text-muted/40">{row.ts}</span>
            </div>
          </div>

          {/* Meta strip */}
          <div
            className="mt-4 pt-3.5 border-t flex items-center flex-wrap"
            style={{ borderColor: `color-mix(in srgb, ${sevColor} 12%, transparent)` }}
          >
            {[
              { label: 'Admin', val: row.admin },
              { label: 'Module', val: row.module },
              { label: 'Status', val: row.status },
            ].map((chip, i) => (
              <div key={i} className="flex items-center">
                <div className="flex items-center gap-1.5 px-3 first:pl-0">
                  <span className="text-[9.5px] font-black uppercase tracking-[0.12em] text-text-muted/35">
                    {chip.label}
                  </span>
                  <span className="text-[11px] font-mono text-text-muted/65">{chip.val}</span>
                </div>
                {i < 2 && <div className="h-3 w-px bg-border/15 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* ── Event Details ── */}
        <DSection icon={Hash} title="Event Details" accent={sevColor}>
          <DGrid>
            <DField label="Event ID" value={row.id} mono copyable />
            <DField label="Admin" value={row.admin} />
            <DField label="Action" value={row.action.replace(/_/g, ' ')} />
            <DField label="Module" value={row.module} />
            <DField label="Status" value={row.status} accent={STATUS_CLR[row.status]} />
            <DField label="Severity" value={row.severity} accent={sevColor} />
            <DField label="Timestamp" value={row.ts} mono className="col-span-2" />
          </DGrid>
        </DSection>

        {/* ── Device & Location ── */}
        <DSection icon={Globe} title="Device & Location">
          <DGrid>
            <DField label="IP Address" value={row.ip} mono copyable />
            <DField label="Device" value={row.device} />
            <DField label="Browser" value={row.browser} />
            <DField label="Location" value={row.location} />
          </DGrid>
        </DSection>

        {/* ── Risk Assessment ── */}
        <DSection icon={ShieldAlert} title="Risk Assessment" accent={sevColor}>
          <div
            className="rounded-[10px] border px-4 py-3.5 space-y-2"
            style={{
              borderColor: `color-mix(in srgb, ${sevColor} 20%, transparent)`,
              background: `color-mix(in srgb, ${sevColor} 5%, transparent)`,
            }}
          >
            <p className="text-[12px] font-bold leading-tight" style={{ color: sevColor }}>
              {row.severity === 'CRITICAL' ? 'Critical: Requires immediate investigation'
                : row.severity === 'ERROR' ? 'Error: Event resulted in failed or blocked action'
                  : row.severity === 'WARNING' ? 'Warning: Elevated risk — monitor closely'
                    : 'Informational: Normal admin activity'}
            </p>
            {row.action.includes('BRUTE') && (
              <p className="text-[11px] text-text-muted/55 leading-snug">
                IP has been automatically blocked. No further action needed unless manual unblock is requested.
              </p>
            )}
            {row.action.includes('FAILED') && (
              <p className="text-[11px] text-text-muted/55 leading-snug">
                Repeated login failures from this IP. Consider geofencing or account suspension.
              </p>
            )}
          </div>
        </DSection>

        {/* ── Quick Actions ── */}
        <DSection icon={Zap} title="Quick Actions">
          <div className="grid grid-cols-2 gap-2">
            <ActionButton label="Flag Event" Icon={Flag} variant="warning" />
            <ActionButton label="Block IP" Icon={ShieldX} variant="danger" />
            <ActionButton label="Export Event" Icon={Download} variant="default" />
            <ActionButton label="Escalate" Icon={ShieldAlert} variant="cyan" />
          </div>
        </DSection>
      </DBody>

      {/* ── Footer ── */}
      <DFooter>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge value={row.status} />
            <InlinePill color={sevColor}>{row.severity}</InlinePill>
          </div>
          <div className="flex items-center gap-2">
            <ActionButton variant="default" onClick={onClose} label="Close" />
            <ActionButton variant="brand" Icon={User} onClick={onClose} label="View Admin" />
          </div>
        </div>
      </DFooter>
    </DrawerShell>
  );
}