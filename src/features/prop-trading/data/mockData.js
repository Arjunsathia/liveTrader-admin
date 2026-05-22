export const propTradingWorkspaces = {
  overview: {
    eyebrow: 'Prop Trading',
    title: 'Overview',
    description: 'Challenge funnel, active evaluations, funded trader health, and breach alerts.',
    tableTitle: 'Challenge Funnel',
    tableSubtitle: 'Challenge and funded account summary',
    metrics: [
      { label: 'Active Challenges', value: '1', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'status', label: 'Status', options: [{ value: 'ACTIVE', label: 'Active' }, { value: 'PASSED', label: 'Passed' }, { value: 'BREACH', label: 'Breach' }] },
      { key: 'phase', label: 'Phase', options: [{ value: 'PHASE 1', label: 'Phase 1' }, { value: 'PHASE 2', label: 'Phase 2' }, { value: 'FUNDED', label: 'Funded' }] },
    ],
    columns: [
      { key: 'account', label: 'Account' },
      { key: 'phase', label: 'Phase', type: 'status' },
      { key: 'equity', label: 'Equity', type: 'amount' },
      { key: 'target', label: 'Target' },
      { key: 'drawdown', label: 'Daily Loss' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    rows: [
      { id: 'PROP-DEMO', account: 'DEMO-ACC', phase: 'PHASE 1', equity: '$0', target: '0%', drawdown: '0%', status: 'ACTIVE' },
    ],
  },
  'challenge-configurations': {
    eyebrow: 'Prop Trading',
    title: 'Challenge Configurations',
    description: 'Leverage settings, profit targets, max daily loss, phase rules, and fees.',
    tableTitle: 'Challenge Templates',
    tableSubtitle: 'Challenge products and rule sets',
    metrics: [
      { label: 'Live Templates', value: '1', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'phaseCount', label: 'Phases', options: [{ value: '1', label: '1 Phase' }, { value: '2', label: '2 Phases' }, { value: '3', label: '3 Phases' }] },
      { key: 'status', label: 'Status', options: [{ value: 'LIVE', label: 'Live' }, { value: 'DRAFT', label: 'Draft' }] },
    ],
    columns: [
      { key: 'template', label: 'Template' },
      { key: 'leverage', label: 'Leverage' },
      { key: 'profitTarget', label: 'Profit Target' },
      { key: 'maxDailyLoss', label: 'Max Daily Loss' },
      { key: 'phaseCount', label: 'Phases' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    rows: [
      { id: 'CFG-DEMO', template: 'Demo Template', leverage: '1:100', profitTarget: '8%', maxDailyLoss: '5%', phaseCount: '2', status: 'LIVE' },
    ],
  },
  'evaluation-requests': {
    eyebrow: 'Prop Trading',
    title: 'Evaluation Requests',
    description: 'Approval queue for challenge completions and funded promotions.',
    tableTitle: 'Evaluation Queue',
    tableSubtitle: 'Trader evaluations awaiting approval',
    metrics: [
      { label: 'Pending Requests', value: '0', subtext: 'Demo data', trend: 'warning' },
    ],
    filters: [
      { key: 'decision', label: 'Decision', options: [{ value: 'PENDING', label: 'Pending' }, { value: 'APPROVE', label: 'Approve' }, { value: 'REJECT', label: 'Reject' }] },
      { key: 'phase', label: 'Phase', options: [{ value: 'PHASE 1', label: 'Phase 1' }, { value: 'PHASE 2', label: 'Phase 2' }, { value: 'FUNDED', label: 'Funded' }] },
    ],
    columns: [
      { key: 'account', label: 'Account' },
      { key: 'trader', label: 'Trader' },
      { key: 'phase', label: 'Phase', type: 'status' },
      { key: 'pnl', label: 'Result', type: 'amount' },
      { key: 'decision', label: 'Decision', type: 'status' },
      { key: 'submitted', label: 'Submitted', type: 'mono' },
    ],
    rows: [
      { id: 'EVAL-DEMO', account: 'DEMO-ACC', trader: 'Demo Trader', phase: 'PHASE 1', pnl: '+0%', decision: 'PENDING', submitted: '00:00' },
    ],
  },
  'funded-accounts': {
    eyebrow: 'Prop Trading',
    title: 'Funded Accounts',
    description: 'Funded trader tracking, payout posture, and restriction handling.',
    tableTitle: 'Funded Trader Book',
    tableSubtitle: 'Live funded accounts and health',
    metrics: [
      { label: 'Funded Traders', value: '1', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'status', label: 'Status', options: [{ value: 'LIVE', label: 'Live' }, { value: 'RESTRICTED', label: 'Restricted' }, { value: 'BREACH', label: 'Breach' }] },
      { key: 'payoutState', label: 'Payout', options: [{ value: 'READY', label: 'Ready' }, { value: 'LOCKED', label: 'Locked' }, { value: 'PROCESSING', label: 'Processing' }] },
    ],
    columns: [
      { key: 'account', label: 'Account' },
      { key: 'trader', label: 'Trader' },
      { key: 'equity', label: 'Equity', type: 'amount' },
      { key: 'payoutState', label: 'Payout', type: 'status' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'lastReview', label: 'Last Review', type: 'mono' },
    ],
    rows: [
      { id: 'FUN-DEMO', account: 'DEMO-ACC', trader: 'Demo Trader', equity: '$0', payoutState: 'READY', status: 'LIVE', lastReview: '2024-01-01' },
    ],
  },
  statistics: {
    eyebrow: 'Prop Trading',
    title: 'Statistics',
    description: 'Challenge performance statistics, funnel conversion, and cohort behavior.',
    tableTitle: 'Challenge Statistics',
    tableSubtitle: 'Performance cohorts and conversion',
    metrics: [
      { label: 'Conversion Rate', value: '0%', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'cohort', label: 'Cohort', options: [{ value: 'MARCH', label: 'March' }, { value: 'FEB', label: 'February' }, { value: 'JAN', label: 'January' }] },
      { key: 'segment', label: 'Segment', options: [{ value: '25K', label: '25K' }, { value: '100K', label: '100K' }, { value: '200K', label: '200K' }] },
    ],
    columns: [
      { key: 'cohort', label: 'Cohort' },
      { key: 'segment', label: 'Segment' },
      { key: 'entries', label: 'Entries' },
      { key: 'passes', label: 'Passes' },
      { key: 'conversion', label: 'Conversion', type: 'amount' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    rows: [
      { id: 'STAT-DEMO', cohort: 'JAN', segment: '100K', entries: '0', passes: '0', conversion: '0%', status: 'HEALTHY' },
    ],
  },
  'fees-coupons': {
    eyebrow: 'Prop Trading',
    title: 'Fees & Coupons',
    description: 'Challenge fees, coupon codes, discounts, and redemption tracking.',
    tableTitle: 'Fee and Coupon Center',
    tableSubtitle: 'Challenge fees and promotional controls',
    metrics: [
      { label: 'Monthly Fee Revenue', value: '$0', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'status', label: 'Status', options: [{ value: 'ACTIVE', label: 'Active' }, { value: 'EXPIRED', label: 'Expired' }, { value: 'DRAFT', label: 'Draft' }] },
      { key: 'discountType', label: 'Discount', options: [{ value: 'PERCENT', label: 'Percent' }, { value: 'FIXED', label: 'Fixed' }] },
    ],
    columns: [
      { key: 'code', label: 'Coupon', type: 'mono' },
      { key: 'challenge', label: 'Challenge' },
      { key: 'discount', label: 'Discount' },
      { key: 'fee', label: 'Challenge Fee', type: 'amount' },
      { key: 'usage', label: 'Usage' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    rows: [
      { id: 'FEE-DEMO', code: 'DEMO', challenge: 'Demo', discount: '0%', fee: '$0', usage: '0', status: 'ACTIVE' },
    ],
  },
  'rules-risk': {
    eyebrow: 'Prop Trading',
    title: 'Rules / Risk Settings',
    description: 'Platform-wide rules for leverage, inactivity, max daily loss, and trailing constraints.',
    tableTitle: 'Risk Settings',
    tableSubtitle: 'Global prop trading controls',
    metrics: [
      { label: 'Active Rules', value: '1', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'scope', label: 'Scope', options: [{ value: 'GLOBAL', label: 'Global' }, { value: 'CHALLENGE', label: 'Challenge' }, { value: 'FUNDED', label: 'Funded' }] },
      { key: 'status', label: 'Status', options: [{ value: 'ACTIVE', label: 'Active' }, { value: 'DRAFT', label: 'Draft' }] },
    ],
    columns: [
      { key: 'rule', label: 'Rule' },
      { key: 'scope', label: 'Scope', type: 'status' },
      { key: 'value', label: 'Value' },
      { key: 'trigger', label: 'Trigger' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'updated', label: 'Updated', type: 'mono' },
    ],
    rows: [
      { id: 'RULE-DEMO', rule: 'Demo Rule', scope: 'GLOBAL', value: '0%', trigger: 'Demo trigger', status: 'ACTIVE', updated: '2024-01-01' },
    ],
  },
};
