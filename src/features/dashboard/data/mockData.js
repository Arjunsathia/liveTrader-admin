export const dashboardKpis = [
  { label: 'Demo KPI', value: '0', delta: '+0', tone: 'info', note: 'Demo structural data' }
];

export const dashboardAnalytics = [
  { time: '00:00', volume: 0, revenue: 0, prop: 0, copy: 0 }
];

export const operationsTasks = [
  { id: 'TASK-DEMO', cat: 'System', level: 'info', stamp: 'Demo', title: 'Demo Task', text: 'This is a structural placeholder.', action: 'View', path: '/' }
];

export const quickActions = [
  { label: 'Demo Action', path: '/' }
];

export const recentActivity = [
  { id: 'ACT-DEMO', stream: 'System', primary: 'Demo Activity', secondary: 'Placeholder', tertiary: '00:00' }
];

export const dashboardTables = {
  withdrawals: [
    { id: 'WD-DEMO', subject: 'Demo User', meta: 'Demo Asset', value: '$0', status: 'NORMAL', time: 'Just now' }
  ],
  prop: [
    { id: 'PROP-DEMO', subject: 'Demo Subject', meta: 'Demo Meta', value: '+0%', status: 'FUNDED', time: 'Just now' }
  ],
};
