import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell, CheckCircle2, CreditCard, Eye, EyeOff,
  LineChart, Settings2, ShieldCheck, Zap,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';

/* ── Sub-nav ─────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'api',             path: '/settings/api',             label: 'API Config',       Icon: Zap         },
  { id: 'payment-gateway', path: '/settings/payment-gateway', label: 'Payment Gateway',  Icon: CreditCard  },
  { id: 'kyc',             path: '/settings/kyc',             label: 'KYC Settings',     Icon: ShieldCheck },
  { id: 'trading',         path: '/settings/trading',         label: 'Trading Settings', Icon: LineChart   },
  { id: 'notifications',   path: '/settings/notifications',   label: 'Notifications',    Icon: Bell        },
  { id: 'system',          path: '/settings/system',          label: 'System',           Icon: Settings2   },
];

/* ── Inline data (avoids HMR cache issues) ──────────────── */
const WORKSPACES = {
  api: {
    stats: [
      { label: 'API Uptime',  value: '99.98%', color: 'var(--positive)' },
      { label: 'Avg Latency', value: '14 ms',  color: 'var(--cyan)'     },
      { label: 'LP Bridges',  value: '3 Live', color: 'var(--positive)' },
      { label: 'Last Sync',   value: '2m ago', color: 'var(--text-muted)'},
    ],
    sections: [
      {
        title: 'Market Data',
        items: [
          { type: 'toggle', label: 'Market Data API',    hint: 'Live price feeds from primary LP bridge',           on: true  },
          { type: 'toggle', label: 'Websocket Streaming',hint: 'Real-time tick streaming for MT5 bridge',           on: true  },
          { type: 'toggle', label: 'Fallback Feed',      hint: 'Switch to secondary LP on primary failure',         on: false },
          { type: 'field',  label: 'API Base URL',       value: 'https://api.livetrade.pro/v3',    mono: true  },
          { type: 'field',  label: 'Primary LP',         value: 'LiquidityPro Bridge 1 · SG cluster', mono: false },
        ],
      },
      {
        title: 'Webhook & Security',
        items: [
          { type: 'toggle', label: 'Webhook Signing',   hint: 'HMAC-SHA256 signature on all outbound payloads',      on: true },
          { type: 'toggle', label: 'IP Allowlisting',   hint: 'Restrict inbound webhook sources to approved IPs',    on: true },
          { type: 'field',  label: 'Webhook Secret',    value: '••••••••••••••••••••••••••••••••', mono: true, masked: true },
          { type: 'field',  label: 'Signing Algorithm', value: 'HMAC-SHA256',                     mono: false },
          { type: 'button', label: 'Rotate Webhook Secret', variant: 'warning' },
          { type: 'button', label: 'Test Connection',       variant: 'default' },
        ],
      },
    ],
  },

  'payment-gateway': {
    stats: [
      { label: 'Active Gateways', value: '3',      color: 'var(--positive)' },
      { label: 'Pending Review',  value: '1',      color: 'var(--warning)'  },
      { label: 'Avg Settlement',  value: '4 min',  color: 'var(--cyan)'     },
      { label: '24h Volume',      value: '$284K',  color: 'var(--brand)'    },
    ],
    sections: [
      {
        title: 'Wire Transfer',
        items: [
          { type: 'toggle', label: 'Wire Gateway Active',     hint: 'Enable SWIFT / SEPA wire payout rail',               on: true  },
          { type: 'toggle', label: 'Manual Review Threshold', hint: 'Flag wires above limit for manual approval',          on: true  },
          { type: 'field',  label: 'Review Threshold',        value: '$10,000 USD',          mono: true  },
          { type: 'field',  label: 'Settlement SLA',          value: '1–3 business days',    mono: false },
          { type: 'button', label: 'Test Wire',               variant: 'default' },
        ],
      },
      {
        title: 'Binance Pay',
        items: [
          { type: 'toggle', label: 'Binance Pay Active', hint: 'Crypto settlement via Binance Pay API',                   on: true  },
          { type: 'toggle', label: 'Auto-conversion',    hint: 'Automatically convert USDT to USD on settlement',         on: false },
          { type: 'field',  label: 'Merchant ID',        value: 'BNB-8821-LT', mono: true  },
          { type: 'field',  label: 'Settlement Currency',value: 'USDT',         mono: false },
          { type: 'button', label: 'Test Binance Pay',   variant: 'default' },
        ],
      },
      {
        title: 'Card Processor',
        items: [
          { type: 'toggle', label: 'Card Processing Active',  hint: 'Visa / Mastercard deposit processing',               on: true },
          { type: 'toggle', label: 'Enhanced Fraud Checks',   hint: '3D Secure + velocity checks',                        on: true },
          { type: 'toggle', label: 'Chargeback Auto-flag',    hint: 'Auto-suspend accounts with active chargebacks',      on: true },
          { type: 'field',  label: 'Processor Provider',      value: 'Stripe · EU Region',          mono: false },
          { type: 'field',  label: 'Fraud Threshold',         value: '2% monthly chargeback rate',  mono: false },
          { type: 'button', label: 'Run Gateway Health Check',variant: 'default' },
          { type: 'button', label: 'View Fraud Report',       variant: 'default' },
        ],
      },
    ],
  },

  kyc: {
    stats: [
      { label: 'KYC Passed (30d)', value: '1,284', color: 'var(--positive)' },
      { label: 'Pending Review',   value: '47',    color: 'var(--warning)'  },
      { label: 'EDD Active',       value: '12',    color: 'var(--negative)' },
      { label: 'Avg Review Time',  value: '8h',    color: 'var(--cyan)'     },
    ],
    sections: [
      {
        title: 'Tier 1 — Basic Verification',
        items: [
          { type: 'toggle', label: 'Tier 1 Required',       hint: 'All users must complete Tier 1 before trading',     on: true  },
          { type: 'toggle', label: 'Selfie Check',           hint: 'Liveness detection via camera selfie',              on: true  },
          { type: 'toggle', label: 'Auto-Approve Low Risk',  hint: 'Auto-pass clean ID + selfie from low-risk regions', on: true  },
          { type: 'field',  label: 'Deposit Limit (Unverified)', value: '$500 USD', mono: true },
        ],
      },
      {
        title: 'Tier 2 — Enhanced Verification',
        items: [
          { type: 'toggle', label: 'Tier 2 for Withdrawals', hint: 'Block withdrawals until Tier 2 complete',           on: true  },
          { type: 'toggle', label: 'Source of Funds',        hint: 'Mandate SoF document for large deposits',           on: false },
          { type: 'field',  label: 'SoF Trigger Threshold',  value: '$5,000 cumulative deposit', mono: true  },
          { type: 'field',  label: 'POA Document Types',     value: 'Utility bill, Bank statement', mono: false },
        ],
      },
      {
        title: 'Enhanced Due Diligence (EDD)',
        items: [
          { type: 'toggle', label: 'EDD Auto-routing',     hint: 'Auto-escalate users from sanctioned countries',       on: true  },
          { type: 'toggle', label: 'PEP Screening',        hint: 'Politically Exposed Person checks on all users',      on: true  },
          { type: 'toggle', label: 'Adverse Media Check',  hint: 'Third-party adverse media screening on sign-up',      on: false },
          { type: 'field',  label: 'High-risk Country List', value: '25 countries (FATF + internal)', mono: false },
          { type: 'button', label: 'View Country List',    variant: 'default' },
          { type: 'button', label: 'Save KYC Settings',   variant: 'brand'   },
        ],
      },
    ],
  },

  trading: {
    stats: [
      { label: 'Live Accounts',    value: '3,841',  color: 'var(--positive)' },
      { label: 'Open Positions',   value: '12,408', color: 'var(--cyan)'     },
      { label: 'Max Leverage',     value: '1:300',  color: 'var(--warning)'  },
      { label: 'Restricted Pairs', value: '4',      color: 'var(--negative)' },
    ],
    sections: [
      {
        title: 'Leverage Caps',
        items: [
          { type: 'field',  label: 'Retail Accounts',        value: '1:300',  mono: true },
          { type: 'field',  label: 'Pro Accounts',           value: '1:500',  mono: true },
          { type: 'field',  label: 'Institutional Accounts', value: '1:1000', mono: true },
          { type: 'toggle', label: 'Dynamic Leverage',   hint: 'Automatically reduce leverage on large positions', on: true },
        ],
      },
      {
        title: 'Execution Safeguards',
        items: [
          { type: 'toggle', label: 'Slippage Limits',       hint: 'Reject orders exceeding max slippage tolerance',   on: true  },
          { type: 'toggle', label: 'Max Order Size Check',  hint: 'Block orders exceeding single-order size cap',     on: true  },
          { type: 'toggle', label: 'News Event Lock',       hint: 'Pause trading 2 min before major news events',     on: false },
          { type: 'field',  label: 'Max Slippage',          value: '3 pips (Forex) · 0.05% (Crypto)', mono: false },
          { type: 'field',  label: 'Max Single Order Size', value: '$500,000 notional',               mono: true  },
        ],
      },
      {
        title: 'Session Rules',
        items: [
          { type: 'toggle', label: 'Weekend Crypto Trading', hint: 'Allow crypto trading on Saturday & Sunday',        on: true  },
          { type: 'toggle', label: '24h Crypto Mode',        hint: 'Enable round-the-clock crypto execution',          on: true  },
          { type: 'toggle', label: 'Rollover Suspend',       hint: 'Suspend equity/FX orders during daily rollover',   on: true  },
          { type: 'field',  label: 'Rollover Window',        value: '21:55 – 22:05 UTC', mono: false },
          { type: 'button', label: 'Save Trading Settings',  variant: 'brand' },
        ],
      },
    ],
  },

  notifications: {
    stats: [
      { label: 'Sent (24h)',       value: '4,821', color: 'var(--positive)' },
      { label: 'Delivered',        value: '99.1%', color: 'var(--positive)' },
      { label: 'Failed',           value: '43',    color: 'var(--negative)' },
      { label: 'Active Templates', value: '18',    color: 'var(--cyan)'     },
    ],
    sections: [
      {
        title: 'Admin Alerts',
        items: [
          { type: 'toggle', label: 'Critical Alerts',  hint: 'System-down and payment failure alerts',     on: true  },
          { type: 'toggle', label: 'Warning Alerts',   hint: 'SLA breach, high-risk flagging alerts',      on: true  },
          { type: 'toggle', label: 'Info Alerts',      hint: 'Successful bulk operations, batch reports',  on: false },
          { type: 'field',  label: 'Alert Recipients', value: 'ops@livetrade.pro, risk@livetrade.pro', mono: false },
          { type: 'button', label: 'Send Test Alert',  variant: 'default' },
        ],
      },
      {
        title: 'Customer Notifications',
        items: [
          { type: 'toggle', label: 'Email Notifications', hint: 'Transactional emails via SendGrid',   on: true  },
          { type: 'toggle', label: 'Push Notifications',  hint: 'Mobile push via Firebase FCM',        on: true  },
          { type: 'toggle', label: 'SMS Notifications',   hint: 'OTP and critical alerts via Twilio',  on: false },
          { type: 'field',  label: 'Email Sender',        value: 'noreply@livetrade.pro', mono: false },
          { type: 'field',  label: 'SMS Sender ID',       value: 'LIVETRDR',             mono: true  },
        ],
      },
      {
        title: 'Escalation Broadcasts',
        items: [
          { type: 'toggle', label: 'Slack Integration',    hint: 'Post escalations to #ops-alerts Slack channel', on: true  },
          { type: 'toggle', label: 'PagerDuty Integration',hint: 'Trigger PagerDuty incident for P1 events',      on: false },
          { type: 'field',  label: 'Slack Webhook URL',    value: '••••••••••••••••••••••••••••', mono: true, masked: true },
          { type: 'field',  label: 'Escalation Recipients',value: 'Ops Managers + Risk team (5 users)', mono: false },
          { type: 'button', label: 'Save Notification Settings', variant: 'brand' },
        ],
      },
    ],
  },

  system: {
    stats: [
      { label: 'Environment', value: 'PROD',    color: 'var(--positive)' },
      { label: 'Uptime (30d)', value: '99.94%', color: 'var(--positive)' },
      { label: 'Last Backup',  value: '38m ago',color: 'var(--cyan)'     },
      { label: 'DB Replication',value: 'Healthy',color: 'var(--positive)'},
    ],
    sections: [
      {
        title: 'Maintenance',
        items: [
          { type: 'toggle', label: 'Maintenance Mode', hint: 'Take the platform offline for all users (admin access preserved)', on: false },
          { type: 'toggle', label: 'Read-Only Mode',   hint: 'Allow viewing but block all transactions and logins',              on: false },
          { type: 'field',  label: 'Scheduled Downtime', value: 'None scheduled', mono: false },
          { type: 'button', label: 'Schedule Maintenance', variant: 'default' },
        ],
      },
      {
        title: 'Backup & Recovery',
        items: [
          { type: 'toggle', label: 'Hourly Snapshots',   hint: 'Automated hourly database snapshots to S3',          on: true },
          { type: 'toggle', label: 'Cross-Region Backup', hint: 'Replicate backups to secondary AWS region',          on: true },
          { type: 'toggle', label: 'WAL Archiving',       hint: 'Write-ahead log continuous archiving',              on: true },
          { type: 'field',  label: 'Backup Retention',    value: '30 days', mono: false },
          { type: 'field',  label: 'Last Successful Backup', value: '2026-04-30 09:12 UTC', mono: false },
          { type: 'button', label: 'Run Backup Now',      variant: 'default' },
          { type: 'button', label: 'View Backup Log',     variant: 'default' },
        ],
      },
      {
        title: 'Environment & Security',
        items: [
          { type: 'field',  label: 'Environment',   value: 'PRODUCTION',                     mono: false },
          { type: 'field',  label: 'App Version',   value: 'v2.4.1 (build 1204)',            mono: false },
          { type: 'field',  label: 'Database',      value: 'PostgreSQL 16 · RDS Multi-AZ',  mono: false },
          { type: 'toggle', label: 'Rate Limiting', hint: 'API rate limiting on all public endpoints', on: true },
          { type: 'toggle', label: 'Audit Logging', hint: 'Full audit trail for all admin actions',    on: true },
          { type: 'button', label: 'Export System Report', variant: 'default' },
          { type: 'button', label: 'Save System Settings', variant: 'brand'   },
        ],
      },
    ],
  },
};

/* ── Stat strip ──────────────────────────────────────────── */
function StatStrip({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-[10px] border border-border/30 bg-surface-elevated shadow-card-subtle px-4 py-3">
          <div className="text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading mb-1.5">
            {s.label}
          </div>
          <div className="text-[20px] font-bold font-heading tracking-[-0.02em]" style={{ color: s.color }}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Toggle row ──────────────────────────────────────────── */
function ToggleRow({ label, hint, value, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-border/[0.1] last:border-0">
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-text/80 font-heading leading-snug">{label}</div>
        {hint && <div className="text-[11px] text-text-muted/40 font-heading mt-0.5 leading-snug">{hint}</div>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative flex-shrink-0 mt-0.5 w-10 h-5 rounded-full border transition-all duration-300 cursor-pointer
          ${value ? 'bg-positive/[0.18] border-positive/30' : 'bg-white/[0.04] border-border/25'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${value ? 'translate-x-5 bg-positive shadow-[0_0_6px_var(--positive)]' : 'translate-x-0.5 bg-text-muted/35'}`}
        />
      </button>
    </div>
  );
}

/* ── Field row ───────────────────────────────────────────── */
function FieldRow({ label, value, mono, masked }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-border/[0.1] last:border-0">
      <span className="text-[12px] text-text-muted/50 font-heading flex-shrink-0 min-w-[130px]">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
        <span className={`text-[12.5px] font-heading font-semibold text-text/75 truncate ${mono ? 'font-mono' : ''}`}>
          {masked && !show ? '••••••••••••••••' : value}
        </span>
        {masked && (
          <button type="button" onClick={() => setShow((s) => !s)}
            className="flex-shrink-0 text-text-muted/30 hover:text-text-muted transition-colors cursor-pointer ml-1">
            {show ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Action button ───────────────────────────────────────── */
function ActionBtn({ label, variant, onClick }) {
  const V = {
    brand:   ['var(--brand)',    'color-mix(in srgb,var(--brand) 12%,transparent)',    'color-mix(in srgb,var(--brand) 28%,transparent)'],
    warning: ['var(--warning)', 'color-mix(in srgb,var(--warning) 12%,transparent)', 'color-mix(in srgb,var(--warning) 28%,transparent)'],
    danger:  ['var(--negative)','color-mix(in srgb,var(--negative) 12%,transparent)','color-mix(in srgb,var(--negative) 22%,transparent)'],
    default: ['var(--text-muted)','transparent','var(--border)'],
  };
  const [color, bg, border] = V[variant] ?? V.default;
  return (
    <button type="button" onClick={onClick}
      className="h-8 px-4 rounded-[8px] text-[12px] font-semibold font-heading border transition-all hover:brightness-110 active:scale-[0.97] cursor-pointer"
      style={{ color, background: bg, borderColor: border }}>
      {label}
    </button>
  );
}

/* ── Section card ────────────────────────────────────────── */
function SectionCard({ section, toggleStates, onToggle, onAction }) {
  const toggleItems = section.items.filter((c) => c.type === 'toggle');
  const fieldItems  = section.items.filter((c) => c.type === 'field');
  const btnItems    = section.items.filter((c) => c.type === 'button');

  return (
    <div className="rounded-[12px] border border-border/25 bg-surface-elevated shadow-card-subtle overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-border/15">
        <span className="text-[9.5px] font-black uppercase tracking-[0.18em] text-text-muted/30 font-heading select-none">
          {section.title}
        </span>
      </div>
      <div className="px-5 pt-1 pb-2">
        {/* Toggles */}
        {toggleItems.map((c) => (
          <ToggleRow
            key={c.label} label={c.label} hint={c.hint}
            value={toggleStates[c.label] ?? c.on}
            onChange={(v) => onToggle(c.label, v)}
          />
        ))}
        {/* Fields */}
        {fieldItems.length > 0 && (
          <div className={toggleItems.length > 0 ? 'mt-3 mb-1' : 'mt-1 mb-1'}>
            {fieldItems.map((c) => (
              <FieldRow key={c.label} label={c.label} value={c.value} mono={c.mono} masked={c.masked} />
            ))}
          </div>
        )}
        {/* Buttons */}
        {btnItems.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 pb-3">
            {btnItems.map((c) => (
              <ActionBtn key={c.label} label={c.label} variant={c.variant} onClick={() => onAction(c.label)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Toast ───────────────────────────────────────────────── */
function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5
      text-[12px] font-semibold text-positive font-heading animate-in fade-in duration-200">
      <CheckCircle2 size={13} />{msg}
    </div>
  );
}

function SettingsContent({ ws }) {
  const [toggles, setToggles] = useState({});
  const [toast,   setToast]   = useState(null);

  const handleToggle = (label, val) => setToggles((p) => ({ ...p, [label]: val }));
  const handleAction = (label) => {
    setToast(`${label} — done`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <StatStrip stats={ws.stats} />
      <Toast msg={toast} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
        {ws.sections.map((section) => (
          <SectionCard
            key={section.title}
            section={section}
            toggleStates={toggles}
            onToggle={handleToggle}
            onAction={handleAction}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN SCREEN
═══════════════════════════════════════════════════════════ */
function SettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const slug     = location.pathname.split('/').filter(Boolean).pop();
  const activeId = NAV_ITEMS.find((n) => n.id === slug)?.id ?? 'api';
  const ws       = WORKSPACES[activeId] ?? WORKSPACES.api;

  return (
    <PageShell className="!pt-0">
      {/* ── Sticky sub-nav ── */}
      <div
        className="sticky top-[68px] z-20 -mx-6 px-6 mb-5 pt-4 pb-3 border-b border-border/20"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const { id, path, label, Icon } = item;
            const active = activeId === id;
            return (
              <button
                key={id} type="button"
                onClick={() => navigate(path)}
                className={[
                  'flex flex-shrink-0 items-center gap-1.5 rounded-[9px] border px-3 py-2',
                  'text-[12px] font-semibold font-heading transition-all duration-200 cursor-pointer',
                  active
                    ? 'border-primary/25 bg-primary/10 text-primary'
                    : 'border-transparent text-text-muted hover:border-border/35 hover:bg-bg/50 hover:text-text',
                ].join(' ')}
              >
                <Icon size={13} className="flex-shrink-0" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <SettingsContent key={activeId} ws={ws} />
    </PageShell>
  );
}

export default SettingsPage;
