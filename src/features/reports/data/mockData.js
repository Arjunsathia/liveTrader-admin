import { FileText, AlarmClock, AlertOctagon, Layers, CheckCircle2, Clock } from 'lucide-react';

export const overviewKpis = [
  { label: 'Generated Today', value: '0', Icon: FileText, color: 'var(--cyan)', trend: '+0', sub: 'Demo data' }
];

export const reportActivity = [
  { hour: '00', generated: 0, failed: 0 }
];

export const deliveryTrend = [
  { day: 'Mon', success: 0, failed: 0 }
];

export const reportTypeSplit = [
  { name: 'Demo', value: 0, color: 'var(--brand)' }
];

export const recentReports = [
  { id: 'RPT-DEMO', name: 'Demo Report', type: 'System', status: 'READY', format: 'PDF', generatedAt: 'Just now', size: '0 KB' }
];

export const financeRows = [
  { id: 'RPT-DEMO', name: 'Demo Finance Report', period: 'Demo', owner: 'Demo', source: 'System', status: 'READY', format: 'PDF', generated: '2024-01-01 00:00', size: '0 KB', rows: 0 }
];

export const tradingRows = [
  { id: 'TRD-DEMO', title: 'Demo Trading Report', scope: 'All', symbols: 'ALL', pnl: '$0', winRate: '0%', drawdown: '0%', status: 'READY', generated: '2024-01-01 00:00', format: 'XLSX', size: '0 KB' }
];

export const userRows = [
  { id: 'USR-DEMO', name: 'Demo User Report', segment: 'All', kyc: 'VERIFIED', wallet: 'ACTIVE', trading: 'ACTIVE', risk: 'LOW', status: 'READY', generated: '2024-01-01 00:00', format: 'CSV', size: '0 KB' }
];

export const systemRows = [
  { id: 'SYS-DEMO', name: 'Demo System Report', service: 'System', severity: 'INFO', status: 'SUCCESS', generated: '2024-01-01 00:00', retries: 0, size: '0 KB' }
];

export const exportTemplates = [
  { id: 'TPL-DEMO', name: 'Demo Template', type: 'System', format: 'PDF', freq: 'Daily', recipients: ['demo@demo.com'], lastRun: '2024-01-01 00:00', status: 'ACTIVE', nextRun: '2024-01-02 00:00' }
];

export const exportFailureLog = [
  { id: 'EXP-F-DEMO', template: 'Demo Template', ts: '2024-01-01 00:00', reason: 'Demo failure' }
];
