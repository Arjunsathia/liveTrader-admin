export const settingsWorkspaces = {
  api: {
    eyebrow: 'Platform Settings',
    title: 'API Config',
    description: 'Core API credentials, webhooks, and provider connectivity.',
    groups: [
      { title: 'Market Data API', value: 'Healthy', status: 'ACTIVE' },
      { title: 'Liquidity Provider Sync', value: '3 bridges connected', status: 'ACTIVE' },
      { title: 'Webhook Signing', value: 'Enabled', status: 'ACTIVE' },
    ],
  },
  'payment-gateway': {
    eyebrow: 'Platform Settings',
    title: 'Payment Gateway',
    description: 'Funding processors, rails, and fallback payment routing.',
    groups: [
      { title: 'Wire Gateway', value: 'Default payout rail', status: 'ACTIVE' },
      { title: 'Binance Pay', value: 'Settlement 4m avg', status: 'ACTIVE' },
      { title: 'Card Processor', value: 'Fraud checks enhanced', status: 'REVIEW' },
    ],
  },
  kyc: {
    eyebrow: 'Platform Settings',
    title: 'KYC Settings',
    description: 'Identity verification thresholds, document rules, and escalation policies.',
    groups: [
      { title: 'Tier 1 Requirements', value: 'ID + selfie', status: 'ACTIVE' },
      { title: 'Tier 2 Requirements', value: 'POA + source of funds', status: 'ACTIVE' },
      { title: 'EDD Routing', value: 'High-risk countries', status: 'ACTIVE' },
    ],
  },
  trading: {
    eyebrow: 'Platform Settings',
    title: 'Trading Settings',
    description: 'Symbol permissions, execution defaults, leverage ceilings, and session rules.',
    groups: [
      { title: 'Max Retail Leverage', value: '1:300', status: 'ACTIVE' },
      { title: 'Weekend Crypto Trading', value: 'Enabled', status: 'ACTIVE' },
      { title: 'Execution Safeguards', value: 'Slippage limits applied', status: 'ACTIVE' },
    ],
  },
  notifications: {
    eyebrow: 'Platform Settings',
    title: 'Notification Settings',
    description: 'System alerts, customer notifications, and escalation broadcasts.',
    groups: [
      { title: 'Admin Alerts', value: 'Critical and warning only', status: 'ACTIVE' },
      { title: 'Customer Notifications', value: 'Email + push enabled', status: 'ACTIVE' },
      { title: 'Escalation Broadcasts', value: 'Ops managers only', status: 'REVIEW' },
    ],
  },
  system: {
    eyebrow: 'Platform Settings',
    title: 'System Settings',
    description: 'Global environment controls, maintenance, and operational hardening.',
    groups: [
      { title: 'Maintenance Mode', value: 'Disabled', status: 'ACTIVE' },
      { title: 'Backup Policy', value: 'Hourly snapshots', status: 'ACTIVE' },
      { title: 'Disaster Recovery', value: 'Warm standby ready', status: 'ACTIVE' },
    ],
  },
};
