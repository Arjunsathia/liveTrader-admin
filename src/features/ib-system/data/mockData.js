export const ibSystemWorkspaces = {
  referrals: {
    eyebrow: 'IB System',
    title: 'Referrals',
    description: 'Referral network structure, tiering, and active partner performance.',
    tableTitle: 'Referral Registry',
    tableSubtitle: 'Active IB relationships',
    metrics: [
      { label: 'IB Partners', value: '1', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'tier', label: 'Tier', options: [{ value: 'DIAMOND', label: 'Diamond' }, { value: 'PLATINUM', label: 'Platinum' }, { value: 'GOLD', label: 'Gold' }] },
      { key: 'status', label: 'Status', options: [{ value: 'ACTIVE', label: 'Active' }, { value: 'REVIEW', label: 'Review' }] },
    ],
    columns: [
      { key: 'partner', label: 'Partner' },
      { key: 'tier', label: 'Tier', type: 'status' },
      { key: 'referrals', label: 'Referrals' },
      { key: 'volume', label: 'Volume', type: 'amount' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'region', label: 'Region' },
    ],
    rows: [
      { id: 'IB-DEMO', partner: 'Demo Partner', tier: 'GOLD', referrals: '0', volume: '$0', status: 'ACTIVE', region: 'Global' },
    ],
  },
  commissions: {
    eyebrow: 'IB System',
    title: 'Commissions',
    description: 'Commission accrual, settlement history, and commission anomalies.',
    tableTitle: 'Commission Ledger',
    tableSubtitle: 'IB commission history',
    metrics: [
      { label: 'Monthly Commissions', value: '$0', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'status', label: 'Status', options: [{ value: 'SETTLED', label: 'Settled' }, { value: 'PENDING', label: 'Pending' }, { value: 'ADJUSTED', label: 'Adjusted' }] },
      { key: 'tier', label: 'Tier', options: [{ value: 'DIAMOND', label: 'Diamond' }, { value: 'PLATINUM', label: 'Platinum' }, { value: 'GOLD', label: 'Gold' }] },
    ],
    columns: [
      { key: 'statement', label: 'Statement', type: 'mono' },
      { key: 'partner', label: 'Partner' },
      { key: 'tier', label: 'Tier', type: 'status' },
      { key: 'amount', label: 'Amount', type: 'amount' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'period', label: 'Period', type: 'mono' },
    ],
    rows: [
      { id: 'COM-DEMO', statement: 'COM-DEMO', partner: 'Demo Partner', tier: 'GOLD', amount: '$0', status: 'SETTLED', period: 'Demo' },
    ],
  },
  payouts: {
    eyebrow: 'IB System',
    title: 'Payouts',
    description: 'Partner payout processing and treasury release status.',
    tableTitle: 'IB Payouts',
    tableSubtitle: 'Pending and completed IB payouts',
    metrics: [
      { label: 'Payouts Ready', value: '0', subtext: 'Demo data', trend: 'warning' },
    ],
    filters: [
      { key: 'status', label: 'Status', options: [{ value: 'READY', label: 'Ready' }, { value: 'PROCESSING', label: 'Processing' }, { value: 'BLOCKED', label: 'Blocked' }] },
      { key: 'method', label: 'Method', options: [{ value: 'WIRE', label: 'Wire' }, { value: 'USDT', label: 'USDT' }] },
    ],
    columns: [
      { key: 'batch', label: 'Batch', type: 'mono' },
      { key: 'partner', label: 'Partner' },
      { key: 'method', label: 'Method' },
      { key: 'amount', label: 'Amount', type: 'amount' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'eta', label: 'ETA', type: 'mono' },
    ],
    rows: [
      { id: 'PAYOUT-DEMO', batch: 'PAY-DEMO', partner: 'Demo Partner', method: 'WIRE', amount: '$0', status: 'READY', eta: 'N/A' },
    ],
  },
  performance: {
    eyebrow: 'IB System',
    title: 'IB Performance',
    description: 'Partner conversion, referred volume, and revenue contribution.',
    tableTitle: 'IB Performance',
    tableSubtitle: 'Partner performance ranking',
    metrics: [
      { label: 'Top Partner Growth', value: '+0%', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'performance', label: 'Performance', options: [{ value: 'TOP', label: 'Top' }, { value: 'MID', label: 'Mid' }, { value: 'LOW', label: 'Low' }] },
      { key: 'region', label: 'Region', options: [{ value: 'MENA', label: 'MENA' }, { value: 'EU', label: 'EU' }, { value: 'LATAM', label: 'LATAM' }] },
    ],
    columns: [
      { key: 'partner', label: 'Partner' },
      { key: 'conversion', label: 'Conversion', type: 'amount' },
      { key: 'fundedUsers', label: 'Funded Users' },
      { key: 'volume', label: 'Volume', type: 'amount' },
      { key: 'performance', label: 'Performance', type: 'status' },
      { key: 'region', label: 'Region' },
    ],
    rows: [
      { id: 'PERF-DEMO', partner: 'Demo Partner', conversion: '0%', fundedUsers: '0', volume: '$0', performance: 'MID', region: 'Global' },
    ],
  },
};
