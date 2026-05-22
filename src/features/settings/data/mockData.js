/**
 * settingsData.js
 * Platform Settings — rich configuration data for all 6 tabs.
 */

const toggle  = (label, hint, on = true)       => ({ type: 'toggle',  label, hint, value: on });
const field   = (label, value, mono = true, masked = false) => ({ type: 'field',  label, value, mono, masked });

export const settingsWorkspaces = {
  api: {
    eyebrow: 'Platform Settings',
    title: 'API Configuration',
    description: 'Core API credentials, webhook routing, and liquidity bridge connectivity.',
    groups: [
      { title: 'Market Data API', value: 'Healthy', status: 'ACTIVE' },
    ],
    stats: [
      { label: 'API Uptime',     value: '0%',  color: 'var(--positive)' },
    ],
    sections: [
      {
        title: 'Market Data',
        controls: [
          toggle('Market Data API',   'Live price feeds from primary LP bridge', true),
          field('API Base URL',        'https://api.livetrade.pro/v3', true),
        ],
      },
    ],
  },
  'payment-gateway': {
    eyebrow: 'Platform Settings',
    title: 'Payment Gateway',
    description: 'Funding processors, settlement rails, fallback routing, and fraud controls.',
    groups: [
      { title: 'Wire Gateway',     value: 'Default payout rail', status: 'ACTIVE' },
    ],
    stats: [
      { label: 'Active Gateways',  value: '0',        color: 'var(--positive)' },
    ],
    sections: [
      {
        title: 'Wire Transfer',
        controls: [
          toggle('Wire Gateway Active',   'Enable SWIFT / SEPA wire payout rail', true),
        ],
      },
    ],
  },
  kyc: {
    eyebrow: 'Platform Settings',
    title: 'KYC Settings',
    description: 'Identity verification tiers, document requirements, EDD escalation, and country policies.',
    groups: [
      { title: 'Tier 1 Requirements',  value: 'ID + selfie',            status: 'ACTIVE' },
    ],
    stats: [
      { label: 'KYC Passed',   value: '0',  color: 'var(--positive)' },
    ],
    sections: [
      {
        title: 'Tier 1 — Basic Verification',
        controls: [
          toggle('Tier 1 Required',        'All users must complete Tier 1 before trading', true),
        ],
      },
    ],
  },
  trading: {
    eyebrow: 'Platform Settings',
    title: 'Trading Settings',
    description: 'Leverage caps by account type, execution safeguards, session controls, and symbol restrictions.',
    groups: [
      { title: 'Max Retail Leverage',    value: '1:300',                  status: 'ACTIVE' },
    ],
    stats: [
      { label: 'Live Accounts',    value: '0',   color: 'var(--positive)' },
    ],
    sections: [
      {
        title: 'Leverage Caps',
        controls: [
          field('Retail Accounts',       '1:300', true),
        ],
      },
    ],
  },
  notifications: {
    eyebrow: 'Platform Settings',
    title: 'Notification Settings',
    description: 'Admin alert channels, customer notification delivery, and escalation broadcast configuration.',
    groups: [
      { title: 'Admin Alerts',           value: 'Critical and warning only',    status: 'ACTIVE' },
    ],
    stats: [
      { label: 'Sent',       value: '0',  color: 'var(--positive)' },
    ],
    sections: [
      {
        title: 'Admin Alerts',
        controls: [
          toggle('Critical Alerts',      'System-down and payment failure alerts', true),
        ],
      },
    ],
  },
  system: {
    eyebrow: 'Platform Settings',
    title: 'System Settings',
    description: 'Global environment controls, maintenance scheduling, backup policies, and operational hardening.',
    groups: [
      { title: 'Maintenance Mode',    value: 'Disabled',           status: 'ACTIVE' },
    ],
    stats: [
      { label: 'Environment',      value: 'PROD',     color: 'var(--positive)' },
    ],
    sections: [
      {
        title: 'Environment & Security',
        controls: [
          field('Environment',           'PRODUCTION', false),
        ],
      },
    ],
  },
};
