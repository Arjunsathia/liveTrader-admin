export const dashboardKpis = [
  { label: 'Users Under Review', value: '154', delta: '+18', tone: 'warning', note: 'KYC and compliance queue' },
  { label: 'Treasury Net Flow', value: '+$439k', delta: '+6.2%', tone: 'success', note: '24h deposits minus withdrawals' },
  { label: 'Routed Volume', value: '$128.4M', delta: '+8.2%', tone: 'info', note: 'FX, metals, and crypto' },
  { label: 'Copy Trading AUM', value: '$22.5M', delta: '+3.4%', tone: 'info', note: 'Follower equity under management' },
  { label: 'Prop Evaluations', value: '84', delta: '+11', tone: 'warning', note: 'Active challenge reviews' },
  { label: 'Open Support Tickets', value: '42', delta: '-5', tone: 'danger', note: 'Pending operator replies' },
];

export const dashboardAnalytics = [
  { time: '00:00', volume: 14.2, revenue: 72, prop: 18, copy: 5.2 },
  { time: '04:00', volume: 17.8, revenue: 84, prop: 21, copy: 6.1 },
  { time: '08:00', volume: 21.3, revenue: 93, prop: 25, copy: 6.9 },
  { time: '12:00', volume: 25.6, revenue: 112, prop: 31, copy: 7.8 },
  { time: '16:00', volume: 23.4, revenue: 104, prop: 29, copy: 8.1 },
  { time: '20:00', volume: 28.1, revenue: 121, prop: 35, copy: 8.9 },
  { time: '23:59', volume: 26.7, revenue: 129, prop: 33, copy: 9.3 },
];

export const operationsTasks = [
  { id: 'TASK-1', cat: 'Compliance', level: 'critical', stamp: 'Due now', title: 'KYC backlog breaching SLA', text: '43 tier-2 files need operator review before the next sweep.', action: 'Review', path: '/users/kyc' },
  { id: 'TASK-2', cat: 'Treasury', level: 'warning', stamp: 'Manual hold', title: 'Large withdrawal paused', text: '$85,000 USDT request flagged after velocity alerts triggered.', action: 'Open', path: '/finance/withdrawals' },
  { id: 'TASK-3', cat: 'Trading', level: 'warning', stamp: '15m SLA', title: 'EUR/USD routing spike', text: 'LP-03 latency reached 182ms on the London bridge.', action: 'Inspect', path: '/trading/execution-logs' },
  { id: 'TASK-4', cat: 'Copy', level: 'critical', stamp: 'Hard stop', title: 'Master account drawdown alert', text: 'Provider CT-771 crossed the 6.8% intraday drawdown threshold.', action: 'Review', path: '/copy-trading/performance' },
  { id: 'TASK-5', cat: 'Prop', level: 'warning', stamp: 'Approval gate', title: 'Evaluation batch ready for decision', text: '11 challenge accounts have cleared phase two and need review.', action: 'Approve', path: '/prop-trading/evaluation-requests' },
];

export const quickActions = [
  { label: 'Approve KYC', path: '/users/kyc' },
  { label: 'Review Withdrawals', path: '/finance/approvals' },
  { label: 'Inspect Orders', path: '/trading/orders' },
  { label: 'Check Providers', path: '/copy-trading/providers' },
  { label: 'Review Prop Eval', path: '/prop-trading/evaluation-requests' },
  { label: 'Open Support', path: '/support/tickets' },
];

export const recentActivity = [
  { id: 'ACT-1', stream: 'Users', primary: 'Elena Vance', secondary: 'Proof of address uploaded', tertiary: '08:52' },
  { id: 'ACT-2', stream: 'Finance', primary: 'TXN-90211', secondary: 'Withdrawal moved to manual approval', tertiary: '09:10' },
  { id: 'ACT-3', stream: 'Trading', primary: 'EUR/USD cluster', secondary: 'Execution latency normalized to 14ms', tertiary: '09:42' },
  { id: 'ACT-4', stream: 'Prop', primary: 'Challenge CFG-Prime', secondary: 'Coupon campaign reached 18.4% conversion', tertiary: '10:05' },
];

export const dashboardTables = {
  withdrawals: [
    { id: 'WD-1', subject: 'Kofi Arhin', meta: 'USDT ERC20', value: '$85,000', status: 'HIGH RISK', time: '09m ago' },
    { id: 'WD-2', subject: 'Elena Vance', meta: 'Wire USD', value: '$18,500', status: 'REVIEW', time: '24m ago' },
    { id: 'WD-3', subject: 'Marco Rossi', meta: 'SEPA EUR', value: '$5,900', status: 'NORMAL', time: '47m ago' },
  ],
  prop: [
    { id: 'PROP-1', subject: 'LT-CH-2412', meta: 'Phase 2 / 8% target', value: '+8.4%', status: 'PASSED', time: 'Review' },
    { id: 'PROP-2', subject: 'LT-CH-2417', meta: 'Phase 1 / 5% target', value: '-4.8%', status: 'BREACH', time: 'Escalated' },
    { id: 'PROP-3', subject: 'LT-CH-2424', meta: 'Funded / Alpha FX', value: '+2.1%', status: 'FUNDED', time: 'Healthy' },
  ],
};
