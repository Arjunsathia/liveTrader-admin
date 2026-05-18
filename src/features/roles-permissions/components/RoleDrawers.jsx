import React, { useState } from 'react';
import {
  AlertOctagon,
  Check,
  Copy,
  Download,
  Edit2,
  EyeOff,
  Fingerprint,
  Flag,
  Key,
  Lock,
  LogOut,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sliders,
  User,
  X,
} from 'lucide-react';
import { AdminDrawer } from '../../../components/overlays/AdminDrawer';
import { DrawerField, DrawerGrid, DrawerSection, TextareaField } from '../../../components/overlays/DrawerUI';
import { ActionBtn, Button } from '../../../components/ui';
import {
  AdminAvatar,
  Badge,
  ROLE_CLR,
  RolePill,
  SEV_CLR,
  STATUS_CLR,
  TwoFABadge,
} from './RolesPermissionsShared';
import { adminNotes, PERM_ACTIONS, rolesData } from '../data/workspaces/admin-mgmt.workspace';

function InlinePill({ children, active = true, color = 'var(--text-muted)', icon: Icon }) {
  return (
    <span
      className="inline-flex min-h-8 items-center gap-1.5 rounded-[10px] border px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em]"
      style={active
        ? {
          color,
          background: `color-mix(in srgb, ${color} 10%, transparent)`,
          borderColor: `color-mix(in srgb, ${color} 22%, transparent)`,
        }
        : {
          color: 'rgba(255,255,255,0.24)',
          background: 'rgba(255,255,255,0.025)',
          borderColor: 'rgba(255,255,255,0.07)',
        }}
    >
      {Icon && <Icon size={10} />}
      {children}
    </span>
  );
}

export function AdminUserDrawer({ row, open, onClose, onAction }) {
  const [noteText, setNoteText] = useState(row ? (adminNotes[row.id] || '') : '');
  if (!row) return null;

  const roleData = rolesData.find((role) => role.name === row.role);
  const roleColor = ROLE_CLR[row.role] || 'rgba(255,255,255,0.35)';

  return (
    <AdminDrawer
      open={open}
      onClose={onClose}
      title={row.name}
      subtitle={row.email}
      eyebrow="Admin Profile"
      width="max-w-[720px]"
      footer={(
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge value={row.status} />
            <RolePill value={row.role} />
            <TwoFABadge enabled={row.twoFA} />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button variant="primary" icon={Edit2} onClick={() => { onAction?.('Edit opened', row.id); onClose(); }}>
              Edit Profile
            </Button>
          </div>
        </div>
      )}
    >
      <div className="space-y-5">
        <div className="rounded-[10px] border border-border/20 bg-bg/50 p-4 shadow-card-subtle">
          <div className="flex flex-wrap items-center gap-3.5">
            <AdminAvatar name={row.name} role={row.role} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-bold tracking-[-0.02em] text-text">{row.name}</div>
              <div className="mt-0.5 truncate font-mono text-[11px] text-text-muted/45">{row.email}</div>
            </div>
            <div className="flex flex-wrap justify-end gap-1.5">
              <Badge value={row.status} />
              <TwoFABadge enabled={row.twoFA} />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/15 pt-3">
            <RolePill value={row.role} />
            <span className="font-mono text-[10px] text-text-muted/45">{row.id} / {row.region}</span>
          </div>
        </div>

        <DrawerSection title="Account Details">
          <DrawerGrid>
            <DrawerField label="Admin ID" value={row.id} mono copyable />
            <DrawerField label="Region" value={row.region} />
            <DrawerField label="Created" value={row.created} mono />
            <DrawerField label="Last Login" value={row.lastLogin} />
            <DrawerField label="Total Logins" value={row.logins?.toLocaleString()} mono />
            <DrawerField label="Total Actions" value={row.actions?.toLocaleString()} mono />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Role & Permission Scope">
          <div className="space-y-3 rounded-[10px] border border-border/20 bg-bg/50 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <RolePill value={row.role} />
              <span className="font-mono text-[10px] text-text-muted/45">{roleData?.scope}</span>
            </div>
            {roleData?.modules && (
              <div className="flex flex-wrap gap-1.5">
                {roleData.modules.map((moduleName) => (
                  <InlinePill key={moduleName} color={roleColor}>{moduleName}</InlinePill>
                ))}
              </div>
            )}
            {roleData?.actions && (
              <div className="flex flex-wrap gap-1.5 border-t border-border/15 pt-3">
                {roleData.actions.map((action) => (
                  <InlinePill key={action} color="var(--brand)">{action}</InlinePill>
                ))}
              </div>
            )}
          </div>
        </DrawerSection>

        <DrawerSection title="Security Status">
          <DrawerGrid>
            <DrawerField
              label="2FA Authentication"
              value={row.twoFA ? 'Enabled' : 'Not enabled'}
              accent={row.twoFA ? 'var(--positive)' : 'var(--negative)'}
            />
            <DrawerField
              label="Account Locked"
              value={row.locked ? 'LOCKED' : 'Not locked'}
              accent={row.locked ? 'var(--negative)' : 'var(--positive)'}
            />
            <DrawerField
              label="Active Session"
              value={row.status === 'ACTIVE' && row.lastLogin !== 'Never' ? 'Online' : 'Offline'}
              accent={row.status === 'ACTIVE' && row.lastLogin !== 'Never' ? 'var(--positive)' : 'var(--negative)'}
              className="sm:col-span-2"
            />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Internal Note" collapsible>
          <div className="space-y-2.5">
            <TextareaField
              label="Admin Note"
              value={noteText}
              onChange={setNoteText}
              placeholder="Add internal note about this admin..."
              rows={3}
            />
            <Button
              variant="primary"
              size="sm"
              icon={Fingerprint}
              onClick={() => onAction?.('Note saved', row.id)}
            >
              Save Note
            </Button>
          </div>
        </DrawerSection>

        <DrawerSection title="Actions">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <ActionBtn label="Change Role" Icon={Shield} variant="cyan" onClick={() => { onAction?.('Role change', row.id); onClose(); }} />
            <ActionBtn label="Reset Password" Icon={Key} variant="warning" onClick={() => { onAction?.('Password reset', row.id); onClose(); }} />
            <ActionBtn label="Force 2FA" Icon={Fingerprint} variant="brand" onClick={() => { onAction?.('2FA enforced', row.id); onClose(); }} />
            {row.locked
              ? <ActionBtn label="Unlock Account" Icon={ShieldCheck} variant="success" onClick={() => { onAction?.('Unlocked', row.id); onClose(); }} />
              : <ActionBtn label="Lock Account" Icon={Lock} variant="danger" onClick={() => { onAction?.('Locked', row.id); onClose(); }} />
            }
            <ActionBtn label="Revoke Sessions" Icon={LogOut} variant="danger" onClick={() => { onAction?.('Sessions revoked', row.id); onClose(); }} />
          </div>
        </DrawerSection>
      </div>
    </AdminDrawer>
  );
}

export function RoleDrawer({ row, open, onClose, onAction }) {
  if (!row) return null;
  const color = ROLE_CLR[row.name] || 'rgba(255,255,255,0.35)';

  return (
    <AdminDrawer
      open={open}
      onClose={onClose}
      title={row.label}
      subtitle={row.desc}
      eyebrow="Role Info"
      width="max-w-[720px]"
      footer={(
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <RolePill value={row.name} />
            <Badge value={row.status} />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button variant="primary" icon={Edit2} onClick={() => { onAction?.('Edit opened', row.id); onClose(); }}>
              Edit Role
            </Button>
          </div>
        </div>
      )}
    >
      <div className="space-y-5">
        <div
          className="rounded-[10px] border p-4 shadow-card-subtle"
          style={{
            borderColor: `color-mix(in srgb, ${color} 25%, transparent)`,
            background: `color-mix(in srgb, ${color} 5%, transparent)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border"
              style={{
                background: `color-mix(in srgb, ${color} 15%, transparent)`,
                borderColor: `color-mix(in srgb, ${color} 25%, transparent)`,
              }}
            >
              <Shield size={18} style={{ color }} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[15px] font-bold tracking-[-0.02em] text-text">{row.label}</div>
              <div className="mt-0.5 text-[11px] text-text-muted/55">{row.desc}</div>
            </div>
          </div>
        </div>

        <DrawerSection title="Role Info">
          <DrawerGrid>
            <DrawerField label="Role ID" value={row.id} mono copyable />
            <DrawerField label="User Count" value={row.userCount} mono accent="var(--brand)" />
            <DrawerField label="Scope" value={row.scope} />
            <DrawerField label="Status" value={row.status} accent={STATUS_CLR[row.status]} />
            <DrawerField label="Last Updated" value={row.updated} mono className="sm:col-span-2" />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Allowed Modules">
          <div className="flex flex-wrap gap-1.5">
            {row.modules.map((moduleName) => (
              <InlinePill key={moduleName} color={color}>{moduleName}</InlinePill>
            ))}
          </div>
        </DrawerSection>

        <DrawerSection title="Allowed Actions">
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
        </DrawerSection>

        <DrawerSection title="Actions">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <ActionBtn label="Duplicate" Icon={Copy} variant="cyan" onClick={() => { onAction?.('Duplicated', row.id); onClose(); }} />
            <ActionBtn label="View Matrix" Icon={Sliders} variant="brand" onClick={() => { onAction?.('Matrix opened', row.id); onClose(); }} />
            <ActionBtn label="Disable Role" Icon={EyeOff} variant="danger" onClick={() => { onAction?.('Disabled', row.id); onClose(); }} />
          </div>
        </DrawerSection>
      </div>
    </AdminDrawer>
  );
}

export function AccessLogDrawer({ row, open, onClose }) {
  if (!row) return null;
  const sevColor = SEV_CLR[row.severity] || 'var(--text-muted)';
  const isCritical = row.severity === 'CRITICAL' || row.severity === 'ERROR';

  return (
    <AdminDrawer
      open={open}
      onClose={onClose}
      title={row.id}
      subtitle={row.action.replace(/_/g, ' ')}
      eyebrow="Event"
      width="max-w-[720px]"
      footer={(
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge value={row.status} />
            <InlinePill color={sevColor}>{row.severity}</InlinePill>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button variant="primary" icon={User} onClick={onClose}>View Admin</Button>
          </div>
        </div>
      )}
    >
      <div className="space-y-5">
        {isCritical && (
          <div className="flex items-start gap-2.5 rounded-[10px] border border-negative/20 bg-negative/[0.06] px-3.5 py-3">
            <AlertOctagon size={13} className="mt-0.5 shrink-0 text-negative" />
            <div>
              <div className="text-[11.5px] font-bold text-negative">High Severity Event</div>
              <div className="mt-0.5 text-[11px] text-negative/70">This event requires immediate review. Check IP, device, and context.</div>
            </div>
          </div>
        )}

        <DrawerSection title="Event Details">
          <DrawerGrid>
            <DrawerField label="Event ID" value={row.id} mono copyable />
            <DrawerField label="Admin" value={row.admin} />
            <DrawerField label="Action" value={row.action.replace(/_/g, ' ')} />
            <DrawerField label="Module" value={row.module} />
            <DrawerField label="Status" value={row.status} accent={STATUS_CLR[row.status]} />
            <DrawerField label="Severity" value={row.severity} accent={sevColor} />
            <DrawerField label="Timestamp" value={row.ts} mono className="sm:col-span-2" />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Device & Location">
          <DrawerGrid>
            <DrawerField label="IP Address" value={row.ip} mono copyable />
            <DrawerField label="Device" value={row.device} />
            <DrawerField label="Browser" value={row.browser} />
            <DrawerField label="Location" value={row.location} />
          </DrawerGrid>
        </DrawerSection>

        <DrawerSection title="Risk Assessment">
          <div
            className="space-y-1.5 rounded-[10px] border px-4 py-3"
            style={{
              borderColor: `color-mix(in srgb, ${sevColor} 20%, transparent)`,
              background: `color-mix(in srgb, ${sevColor} 5%, transparent)`,
            }}
          >
            <div className="text-[11px] font-semibold" style={{ color: sevColor }}>
              {row.severity === 'CRITICAL' ? 'Critical: Requires immediate investigation'
                : row.severity === 'ERROR' ? 'Error: Event resulted in failed or blocked action'
                  : row.severity === 'WARNING' ? 'Warning: Elevated risk - monitor closely'
                    : 'Informational: Normal admin activity'}
            </div>
            {row.action.includes('BRUTE') && (
              <div className="text-[10.5px] text-text-muted/55">IP has been automatically blocked. No further action needed unless manual unblock is requested.</div>
            )}
            {row.action.includes('FAILED') && (
              <div className="text-[10.5px] text-text-muted/55">Repeated login failures from this IP. Consider geofencing or account suspension.</div>
            )}
          </div>
        </DrawerSection>

        <DrawerSection title="Actions">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <ActionBtn label="Flag Event" Icon={Flag} variant="warning" />
            <ActionBtn label="Block IP" Icon={ShieldX} variant="danger" />
            <ActionBtn label="Export Event" Icon={Download} variant="default" />
            <ActionBtn label="Escalate" Icon={ShieldAlert} variant="cyan" />
          </div>
        </DrawerSection>
      </div>
    </AdminDrawer>
  );
}
