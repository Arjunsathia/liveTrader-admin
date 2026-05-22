export const userMetrics = [
  { label: 'Demo Metric', value: '0', subtext: 'Demo data', trend: 'up' }
];

export const users = [
  {
    id: 'usr-demo',
    uid: '0000',
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '+1 555 000 0000',
    country: 'US',
    tier: 'Standard',
    segment: 'Retail',
    fundingState: 'PENDING',
    kycStatus: 'PENDING',
    riskStatus: 'LOW',
    walletBalance: '$0.00',
    equity: '$0.00',
    pnl30d: '$0.00',
    openPositions: 0,
    mt5Accounts: 0,
    registered: '2024-01-01 00:00',
    lastSeen: 'Just now',
    source: 'Demo',
    address: 'Demo Address',
    notesSummary: 'Demo structure',
    kyc: {
      level: 'Level 1',
      submittedAt: '2024-01-01 00:00',
      reviewer: 'System',
      status: 'PENDING',
      documents: ['ID'],
      aml: 'Clear',
    },
    wallet: [
      { asset: 'USD', balance: '$0.00', available: '$0.00', hold: '$0.00' }
    ],
    mt5: [
      { login: '000000', server: 'Demo', group: 'Demo', leverage: '1:100', status: 'DISCONNECTED', equity: '$0', marginLevel: 'n/a', lastSync: 'N/A' }
    ],
    tradingHistory: [
      { ticket: '000000', symbol: 'EURUSD', side: 'BUY', lots: '0.00', open: '0.000', close: '0.000', pnl: '$0', time: '2024-01-01 00:00' }
    ],
    activity: [
      { time: '00:00', actor: 'System', action: 'Account Created', channel: 'System' }
    ],
    risk: {
      score: '0 / 100',
      exposure: '$0',
      concentration: 'None',
      drawdown: '0%',
      status: 'LOW',
      alerts: [],
    },
    notes: [
      { id: 'NOTE-DEMO', author: 'System', time: '2024-01-01 00:00', text: 'Demo note' }
    ],
  }
];

export const kycQueue = [
  { id: 'KYC-DEMO', userId: 'usr-demo', user: 'Demo User', tier: 'Standard', country: 'US', status: 'PENDING', eta: 'N/A', docs: '0/0', risk: 'LOW' }
];

export const userActivityFeed = [
  { id: 'ACT-DEMO', userId: 'usr-demo', user: 'Demo User', event: 'Demo Event', source: 'System', severity: 'INFO', time: '00:00', owner: 'System' }
];

export const mt5Accounts = [
  { id: 'MT5-DEMO', login: '000000', userId: 'usr-demo', user: 'Demo User', server: 'Demo', status: 'DISCONNECTED', connection: 'N/A', group: 'Demo', leverage: '1:100', balance: '$0', lastSync: 'N/A' }
];
