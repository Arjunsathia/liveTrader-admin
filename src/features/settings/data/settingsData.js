/**
 * settingsData.js
 * Platform Settings — rich configuration data for all 6 tabs.
 * Each workspace contains:
 *   - eyebrow / title / description  (for page header)
 *   - stats[]                        (stat strip)
 *   - controls[]                     (toggles, fields, buttons per section)
 *   - groups[]                       (legacy compat for settingsService)
 */

/* ── Shared helpers ──────────────────────────────────────── */

const toggle  = (label, hint, on = true)       => ({ type: 'toggle',  label, hint, value: on });
const field   = (label, value, mono = true, masked = false) => ({ type: 'field',  label, value, mono, masked });
const select  = (label, value, opts)           => ({ type: 'select',  label, value, opts });
const btn     = (label, variant = 'default', icon = null) => ({ type: 'button', label, variant, icon });
const divider = (title)                        => ({ type: 'divider', title });

/* ═══════════════════════════════════════════════════════════
   1. API CONFIG
═══════════════════════════════════════════════════════════ */
export const settingsWorkspaces = {
  api: {
    eyebrow: 'Platform Settings',
    title: 'API Configuration',
    description: 'Core API credentials, webhook routing, and liquidity bridge connectivity.',
    groups: [
      { title: 'Market Data API', value: 'Healthy · 14ms avg', status: 'ACTIVE' },
      { title: 'Liquidity Provider Sync', value: '3 bridges connected', status: 'ACTIVE' },
      { title: 'Webhook Signing', value: 'HMAC-SHA256 enabled', status: 'ACTIVE' },
    ],
    stats: [
      { label: 'API Uptime',     value: '99.98%',  color: 'var(--positive)' },
      { label: 'Avg Latency',    value: '14 ms',   color: 'var(--cyan)'     },
      { label: 'LP Bridges',     value: '3 Live',  color: 'var(--positive)' },
      { label: 'Last Sync',      value: '2m ago',  color: 'var(--text-muted)' },
    ],
    sections: [
      {
        title: 'Market Data',
        controls: [
          toggle('Market Data API',   'Live price feeds from primary LP bridge', true),
          toggle('Websocket Streaming','Real-time tick streaming for MT5 bridge', true),
          toggle('Fallback Feed',     'Switch to secondary LP on primary failure', false),
          field('API Base URL',        'https://api.livetrade.pro/v3', true),
          field('Primary LP',          'LiquidityPro Bridge 1 · SG cluster', false),
        ],
      },
      {
        title: 'Webhook & Security',
        controls: [
          toggle('Webhook Signing',    'HMAC-SHA256 signature on all outbound payloads', true),
          toggle('IP Allowlisting',    'Restrict inbound webhook sources to approved IPs', true),
          field('Webhook Secret',      '••••••••••••••••••••••••••••••••', true, true),
          field('Signing Algorithm',   'HMAC-SHA256', false),
          btn('Rotate Webhook Secret', 'warning'),
          btn('Test Connection',       'default'),
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     2. PAYMENT GATEWAY
  ═══════════════════════════════════════════════════════ */
  'payment-gateway': {
    eyebrow: 'Platform Settings',
    title: 'Payment Gateway',
    description: 'Funding processors, settlement rails, fallback routing, and fraud controls.',
    groups: [
      { title: 'Wire Gateway',     value: 'Default payout rail', status: 'ACTIVE' },
      { title: 'Binance Pay',      value: 'Settlement 4m avg',   status: 'ACTIVE' },
      { title: 'Card Processor',   value: 'Fraud checks enhanced', status: 'REVIEW' },
    ],
    stats: [
      { label: 'Active Gateways',  value: '3',        color: 'var(--positive)' },
      { label: 'Pending Review',   value: '1',        color: 'var(--warning)'  },
      { label: 'Avg Settlement',   value: '4 min',    color: 'var(--cyan)'     },
      { label: '24h Volume',       value: '$284K',    color: 'var(--brand)'    },
    ],
    sections: [
      {
        title: 'Wire Transfer',
        controls: [
          toggle('Wire Gateway Active',   'Enable SWIFT / SEPA wire payout rail', true),
          toggle('Manual Review Threshold','Flag wires above limit for manual approval', true),
          field('Review Threshold',        '$10,000 USD', true),
          field('Settlement SLA',          '1–3 business days', false),
          btn('Test Wire',                 'default'),
        ],
      },
      {
        title: 'Binance Pay',
        controls: [
          toggle('Binance Pay Active',     'Crypto settlement via Binance Pay API', true),
          toggle('Auto-conversion',        'Automatically convert USDT to USD on settlement', false),
          field('Merchant ID',             'BNB-8821-LT', true),
          field('Settlement Currency',     'USDT', false),
          btn('Test Binance Pay',          'default'),
        ],
      },
      {
        title: 'Card Processor',
        controls: [
          toggle('Card Processing Active', 'Visa / Mastercard deposit processing', true),
          toggle('Enhanced Fraud Checks',  '3D Secure + velocity checks', true),
          toggle('Chargeback Auto-flag',   'Auto-suspend accounts with active chargebacks', true),
          field('Processor Provider',      'Stripe · EU Region', false),
          field('Fraud Threshold',         '2% monthly chargeback rate', false),
          btn('Run Gateway Health Check',  'default'),
          btn('View Fraud Report',         'default'),
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     3. KYC SETTINGS
  ═══════════════════════════════════════════════════════ */
  kyc: {
    eyebrow: 'Platform Settings',
    title: 'KYC Settings',
    description: 'Identity verification tiers, document requirements, EDD escalation, and country policies.',
    groups: [
      { title: 'Tier 1 Requirements',  value: 'ID + selfie',            status: 'ACTIVE' },
      { title: 'Tier 2 Requirements',  value: 'POA + source of funds',  status: 'ACTIVE' },
      { title: 'EDD Routing',          value: 'High-risk countries',     status: 'ACTIVE' },
    ],
    stats: [
      { label: 'KYC Passed (30d)',   value: '1,284',  color: 'var(--positive)' },
      { label: 'Pending Review',     value: '47',     color: 'var(--warning)'  },
      { label: 'EDD Active',         value: '12',     color: 'var(--negative)' },
      { label: 'Avg Review Time',    value: '8h',     color: 'var(--cyan)'     },
    ],
    sections: [
      {
        title: 'Tier 1 — Basic Verification',
        controls: [
          toggle('Tier 1 Required',        'All users must complete Tier 1 before trading', true),
          toggle('Selfie Check',           'Liveness detection via camera selfie', true),
          toggle('Auto-Approve Low Risk',  'Auto-pass clean ID + selfie from low-risk regions', true),
          field('Deposit Limit (Unverified)', '$500 USD', true),
        ],
      },
      {
        title: 'Tier 2 — Enhanced Verification',
        controls: [
          toggle('Tier 2 Required for Withdrawals', 'Block withdrawals until Tier 2 complete', true),
          toggle('Source of Funds Required', 'Mandate SoF document for large deposits', false),
          field('SoF Trigger Threshold',    '$5,000 cumulative deposit', true),
          field('POA Document Types',       'Utility bill, Bank statement, Council tax', false),
        ],
      },
      {
        title: 'Enhanced Due Diligence (EDD)',
        controls: [
          toggle('EDD Auto-routing',      'Auto-escalate users from sanctioned countries', true),
          toggle('PEP Screening',         'Politically Exposed Person checks on all users', true),
          toggle('Adverse Media Check',   'Third-party adverse media screening on sign-up', false),
          field('High-risk Country List', '25 countries (FATF + internal)', false),
          btn('View Country List',        'default'),
          btn('Save KYC Settings',        'brand'),
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     4. TRADING SETTINGS
  ═══════════════════════════════════════════════════════ */
  trading: {
    eyebrow: 'Platform Settings',
    title: 'Trading Settings',
    description: 'Leverage caps by account type, execution safeguards, session controls, and symbol restrictions.',
    groups: [
      { title: 'Max Retail Leverage',    value: '1:300',                  status: 'ACTIVE' },
      { title: 'Weekend Crypto Trading', value: 'Enabled',                status: 'ACTIVE' },
      { title: 'Execution Safeguards',   value: 'Slippage limits applied', status: 'ACTIVE' },
    ],
    stats: [
      { label: 'Live Accounts',    value: '3,841',   color: 'var(--positive)' },
      { label: 'Open Positions',   value: '12,408',  color: 'var(--cyan)'     },
      { label: 'Max Leverage',     value: '1:300',   color: 'var(--warning)'  },
      { label: 'Restricted Pairs', value: '4',       color: 'var(--negative)' },
    ],
    sections: [
      {
        title: 'Leverage Caps',
        controls: [
          field('Retail Accounts',       '1:300', true),
          field('Pro Accounts',          '1:500', true),
          field('Institutional Accounts','1:1000', true),
          toggle('Dynamic Leverage',    'Automatically reduce leverage on large positions', true),
        ],
      },
      {
        title: 'Execution Safeguards',
        controls: [
          toggle('Slippage Limits',      'Reject orders exceeding max slippage tolerance', true),
          toggle('Max Order Size Check', 'Block orders exceeding single-order size cap', true),
          toggle('News Event Lock',      'Pause trading 2 minutes before major news events', false),
          field('Max Slippage',          '3 pips (Forex) · 0.05% (Crypto)', false),
          field('Max Single Order Size', '$500,000 notional', true),
        ],
      },
      {
        title: 'Session Rules',
        controls: [
          toggle('Weekend Crypto Trading','Allow crypto trading on Saturday & Sunday', true),
          toggle('24h Crypto Mode',       'Enable round-the-clock crypto execution', true),
          toggle('Rollover Suspend',      'Suspend equity/FX orders during daily rollover', true),
          field('Rollover Window',        '21:55 – 22:05 UTC', false),
          btn('Save Trading Settings',   'brand'),
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     5. NOTIFICATION SETTINGS
  ═══════════════════════════════════════════════════════ */
  notifications: {
    eyebrow: 'Platform Settings',
    title: 'Notification Settings',
    description: 'Admin alert channels, customer notification delivery, and escalation broadcast configuration.',
    groups: [
      { title: 'Admin Alerts',           value: 'Critical and warning only',    status: 'ACTIVE' },
      { title: 'Customer Notifications', value: 'Email + push enabled',         status: 'ACTIVE' },
      { title: 'Escalation Broadcasts',  value: 'Ops managers only',            status: 'REVIEW' },
    ],
    stats: [
      { label: 'Sent (24h)',       value: '4,821',  color: 'var(--positive)' },
      { label: 'Delivered',        value: '99.1%',  color: 'var(--positive)' },
      { label: 'Failed',           value: '43',     color: 'var(--negative)' },
      { label: 'Active Templates', value: '18',     color: 'var(--cyan)'     },
    ],
    sections: [
      {
        title: 'Admin Alerts',
        controls: [
          toggle('Critical Alerts',      'System-down and payment failure alerts', true),
          toggle('Warning Alerts',       'SLA breach, high-risk flagging alerts', true),
          toggle('Info Alerts',          'Successful bulk operations, batch reports', false),
          field('Alert Recipients',      'ops@livetrade.pro, risk@livetrade.pro', false),
          btn('Send Test Alert',         'default'),
        ],
      },
      {
        title: 'Customer Notifications',
        controls: [
          toggle('Email Notifications',  'Transactional emails via SendGrid', true),
          toggle('Push Notifications',   'Mobile push via Firebase FCM', true),
          toggle('SMS Notifications',    'OTP and critical alerts via Twilio', false),
          field('Email Sender',          'noreply@livetrade.pro', false),
          field('SMS Sender ID',         'LIVETRDR', false),
        ],
      },
      {
        title: 'Escalation Broadcasts',
        controls: [
          toggle('Slack Integration',    'Post escalations to #ops-alerts Slack channel', true),
          toggle('PagerDuty Integration','Trigger PagerDuty incident for P1 events', false),
          field('Slack Webhook URL',     '••••••••••••••••••••••••••••', true, true),
          field('Escalation Recipients', 'Ops Managers + Risk team (5 users)', false),
          btn('Save Notification Settings', 'brand'),
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     6. SYSTEM SETTINGS
  ═══════════════════════════════════════════════════════ */
  system: {
    eyebrow: 'Platform Settings',
    title: 'System Settings',
    description: 'Global environment controls, maintenance scheduling, backup policies, and operational hardening.',
    groups: [
      { title: 'Maintenance Mode',    value: 'Disabled',           status: 'ACTIVE' },
      { title: 'Backup Policy',       value: 'Hourly snapshots',   status: 'ACTIVE' },
      { title: 'Disaster Recovery',   value: 'Warm standby ready', status: 'ACTIVE' },
    ],
    stats: [
      { label: 'Environment',      value: 'PROD',     color: 'var(--positive)' },
      { label: 'Uptime (30d)',      value: '99.94%',  color: 'var(--positive)' },
      { label: 'Last Backup',       value: '38m ago', color: 'var(--cyan)'     },
      { label: 'DB Replication',    value: 'Healthy', color: 'var(--positive)' },
    ],
    sections: [
      {
        title: 'Maintenance',
        controls: [
          toggle('Maintenance Mode',     'Take the platform offline for all users (admin access preserved)', false),
          toggle('Read-Only Mode',       'Allow viewing but block all transactions and logins', false),
          field('Scheduled Downtime',    'None scheduled', false),
          btn('Schedule Maintenance',    'default'),
        ],
      },
      {
        title: 'Backup & Recovery',
        controls: [
          toggle('Hourly Snapshots',     'Automated hourly database snapshots to S3', true),
          toggle('Cross-Region Backup',  'Replicate backups to secondary AWS region', true),
          toggle('WAL Archiving',        'Write-ahead log continuous archiving', true),
          field('Backup Retention',      '30 days', false),
          field('Last Successful Backup','2026-04-30 09:12 UTC', false),
          btn('Run Backup Now',          'default'),
          btn('View Backup Log',         'default'),
        ],
      },
      {
        title: 'Environment & Security',
        controls: [
          field('Environment',           'PRODUCTION', false),
          field('App Version',           'v2.4.1 (build 1204)', false),
          field('Database',              'PostgreSQL 16 · RDS Multi-AZ', false),
          toggle('Rate Limiting',        'API rate limiting on all public endpoints', true),
          toggle('Audit Logging',        'Full audit trail for all admin actions', true),
          btn('Export System Report',    'default'),
          btn('Save System Settings',    'brand'),
        ],
      },
    ],
  },
};
