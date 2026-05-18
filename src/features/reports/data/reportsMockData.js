import { FileText, AlarmClock, AlertOctagon, Layers, CheckCircle2, Clock } from 'lucide-react';

export const overviewKpis = [
  { label: 'Generated Today', value: '84', Icon: FileText, color: 'var(--cyan)', trend: '+12', sub: 'Reports created today' },
  { label: 'Scheduled Reports', value: '31', Icon: AlarmClock, color: 'var(--brand)', trend: '4 due', sub: 'Pending queue' },
  { label: 'Failed Exports', value: '3', Icon: AlertOctagon, color: 'var(--negative)', trend: '-2', sub: 'Require retry' },
  { label: 'Active Templates', value: '18', Icon: Layers, color: 'var(--positive)', trend: '+2', sub: 'Reusable templates' },
  { label: 'Delivery Success', value: '98.1%', Icon: CheckCircle2, color: 'var(--positive)', trend: '+0.3%', sub: 'Email + API delivery' },
  { label: 'Last Generation', value: '2m ago', Icon: Clock, color: 'var(--text-muted)', trend: '', sub: 'Finance Q3 summary' },
];

export const reportActivity = [
  { hour: '00', generated: 2, failed: 0 }, { hour: '02', generated: 1, failed: 0 },
  { hour: '04', generated: 0, failed: 0 }, { hour: '06', generated: 4, failed: 1 },
  { hour: '08', generated: 18, failed: 0 }, { hour: '10', generated: 26, failed: 1 },
  { hour: '12', generated: 22, failed: 0 }, { hour: '14', generated: 31, failed: 1 },
  { hour: '16', generated: 19, failed: 0 }, { hour: '18', generated: 12, failed: 0 },
  { hour: '20', generated: 8, failed: 0 }, { hour: '22', generated: 5, failed: 0 },
];

export const deliveryTrend = [
  { day: 'Mon', success: 142, failed: 3 }, { day: 'Tue', success: 168, failed: 1 },
  { day: 'Wed', success: 134, failed: 4 }, { day: 'Thu', success: 189, failed: 2 },
  { day: 'Fri', success: 201, failed: 1 }, { day: 'Sat', success: 88, failed: 0 },
  { day: 'Sun', success: 61, failed: 0 },
];

export const reportTypeSplit = [
  { name: 'Finance', value: 38, color: 'var(--brand)' },
  { name: 'Trading', value: 28, color: 'var(--cyan)' },
  { name: 'User', value: 21, color: '#a78bfa' },
  { name: 'System', value: 13, color: 'rgba(255,255,255,0.3)' },
];

export const recentReports = [
  { id: 'RPT-8841', name: 'Finance Q3 Summary', type: 'Finance', status: 'READY', format: 'PDF', generatedAt: '2 min ago', size: '2.4 MB' },
  { id: 'RPT-8840', name: 'Active Traders July', type: 'Trading', status: 'READY', format: 'XLSX', generatedAt: '14 min ago', size: '1.1 MB' },
  { id: 'RPT-8839', name: 'KYC Pending Users Batch', type: 'User', status: 'READY', format: 'CSV', generatedAt: '31 min ago', size: '480 KB' },
  { id: 'RPT-8838', name: 'Risk Engine Audit Log', type: 'System', status: 'FAILED', format: 'JSON', generatedAt: '1h ago', size: '—' },
  { id: 'RPT-8837', name: 'IB Commission July', type: 'Finance', status: 'READY', format: 'CSV', generatedAt: '2h ago', size: '840 KB' },
  { id: 'RPT-8836', name: 'Drawdown Breach Report', type: 'Trading', status: 'READY', format: 'PDF', generatedAt: '3h ago', size: '1.8 MB' },
];

export const financeRows = [
  { id: 'RPT-8841', name: 'Finance Q3 2024 Summary', period: 'Jul–Sep 2024', owner: 'Yuki Nakamura', source: 'Finance Module', status: 'READY', format: 'PDF', generated: '2024-08-01 14:32', size: '2.4 MB', rows: 4821 },
  { id: 'RPT-8837', name: 'IB Commission July 2024', period: 'Jul 2024', owner: 'Dev Kapoor', source: 'IB System', status: 'READY', format: 'CSV', generated: '2024-08-01 12:11', size: '840 KB', rows: 2104 },
  { id: 'RPT-8830', name: 'Payout Disbursement Report', period: 'Jul 2024', owner: 'Keiran Lynch', source: 'Finance Module', status: 'READY', format: 'XLSX', generated: '2024-08-01 09:40', size: '1.2 MB', rows: 312 },
  { id: 'RPT-8820', name: 'Deposit & Withdrawal Summary', period: 'Jun 2024', owner: 'Yuki Nakamura', source: 'Finance Module', status: 'READY', format: 'PDF', generated: '2024-07-31 16:22', size: '3.1 MB', rows: 6820 },
  { id: 'RPT-8810', name: 'Fee & Coupon Usage Report', period: 'Jun 2024', owner: 'Dev Kapoor', source: 'Prop Trading', status: 'SCHEDULED', format: 'CSV', generated: '—', size: '—', rows: 0 },
  { id: 'RPT-8801', name: 'Commission Reconciliation', period: 'May 2024', owner: 'Keiran Lynch', source: 'Finance Module', status: 'FAILED', format: 'XLSX', generated: '2024-07-30 08:14', size: '—', rows: 0 },
  { id: 'RPT-8798', name: 'Platform Revenue Overview', period: 'May 2024', owner: 'Arjun Ravi', source: 'Finance Module', status: 'READY', format: 'PDF', generated: '2024-07-29 14:00', size: '1.9 MB', rows: 3210 },
  { id: 'RPT-8790', name: 'Crypto Deposit Audit', period: 'Apr 2024', owner: 'Priya Sharma', source: 'Finance Module', status: 'READY', format: 'CSV', generated: '2024-07-28 11:30', size: '560 KB', rows: 841 },
];

export const tradingRows = [
  { id: 'TRD-4401', title: 'Active Traders July 2024', scope: 'All Accounts', symbols: 'EURUSD, GBPUSD', pnl: '+$248,400', winRate: '58.4%', drawdown: '-3.2%', status: 'READY', generated: '2024-08-01 14:22', format: 'XLSX', size: '1.1 MB' },
  { id: 'TRD-4400', title: 'Drawdown Breach Report', scope: 'Funded Only', symbols: 'ALL', pnl: '-$18,200', winRate: '41.2%', drawdown: '-8.4%', status: 'READY', generated: '2024-08-01 10:18', format: 'PDF', size: '1.8 MB' },
  { id: 'TRD-4399', title: 'Copy Trading Performance', scope: 'Copy Accounts', symbols: 'XAUUSD, BTCUSD', pnl: '+$84,100', winRate: '63.1%', drawdown: '-1.8%', status: 'READY', generated: '2024-07-31 17:44', format: 'CSV', size: '920 KB' },
  { id: 'TRD-4398', title: 'Prop Challenge Stats Q3', scope: 'Prop Accounts', symbols: 'EURUSD', pnl: '+$34,800', winRate: '34.2%', drawdown: '-6.1%', status: 'READY', generated: '2024-07-31 14:00', format: 'PDF', size: '2.2 MB' },
  { id: 'TRD-4397', title: 'High-Volume Trader Report', scope: 'Top 100 Traders', symbols: 'ALL', pnl: '+$612,000', winRate: '61.8%', drawdown: '-2.4%', status: 'PROCESSING', generated: '—', format: 'XLSX', size: '—' },
  { id: 'TRD-4396', title: 'Weekend Trade Violations', scope: 'Prop Accounts', symbols: 'ALL', pnl: '—', winRate: '—', drawdown: '—', status: 'FAILED', generated: '2024-07-30 22:00', format: 'CSV', size: '—' },
  { id: 'TRD-4395', title: 'Symbol Exposure Summary', scope: 'All Accounts', symbols: 'EURUSD, GBPJPY', pnl: '+$112,400', winRate: '54.6%', drawdown: '-4.1%', status: 'READY', generated: '2024-07-29 08:30', format: 'PDF', size: '1.4 MB' },
  { id: 'TRD-4394', title: 'Overnight Position Audit', scope: 'Funded Only', symbols: 'ALL', pnl: '-$4,200', winRate: '48.9%', drawdown: '-5.8%', status: 'READY', generated: '2024-07-28 06:00', format: 'XLSX', size: '780 KB' },
];

export const userRows = [
  { id: 'USR-6601', name: 'KYC Pending Users Batch', segment: 'Unverified', kyc: 'PENDING', wallet: 'INACTIVE', trading: 'NONE', risk: 'LOW', status: 'READY', generated: '2024-08-01 13:41', format: 'CSV', size: '480 KB' },
  { id: 'USR-6600', name: 'High-Value Depositors July', segment: 'VIP Tier', kyc: 'VERIFIED', wallet: 'ACTIVE', trading: 'ACTIVE', risk: 'LOW', status: 'READY', generated: '2024-08-01 11:00', format: 'XLSX', size: '620 KB' },
  { id: 'USR-6599', name: 'Risk-Flagged User List', segment: 'Flagged', kyc: 'VERIFIED', wallet: 'ACTIVE', trading: 'ACTIVE', risk: 'HIGH', status: 'READY', generated: '2024-08-01 09:30', format: 'PDF', size: '1.1 MB' },
  { id: 'USR-6598', name: 'Dormant Account Analysis', segment: 'Dormant 90d+', kyc: 'MIXED', wallet: 'INACTIVE', trading: 'NONE', risk: 'LOW', status: 'READY', generated: '2024-07-31 15:00', format: 'CSV', size: '310 KB' },
  { id: 'USR-6597', name: 'New Registrations July', segment: 'New Users', kyc: 'PENDING', wallet: 'INACTIVE', trading: 'NONE', risk: 'LOW', status: 'READY', generated: '2024-07-31 10:14', format: 'XLSX', size: '240 KB' },
  { id: 'USR-6596', name: 'Withdrawal Request Audit', segment: 'All Active', kyc: 'VERIFIED', wallet: 'ACTIVE', trading: 'ACTIVE', risk: 'MEDIUM', status: 'SCHEDULED', generated: '—', format: 'CSV', size: '—' },
  { id: 'USR-6595', name: 'IB Referral Network Users', segment: 'IB-Referred', kyc: 'VERIFIED', wallet: 'ACTIVE', trading: 'ACTIVE', risk: 'LOW', status: 'READY', generated: '2024-07-30 14:22', format: 'PDF', size: '1.6 MB' },
  { id: 'USR-6594', name: 'AML Screening Batch Q2', segment: 'All Users', kyc: 'VERIFIED', wallet: 'MIXED', trading: 'MIXED', risk: 'HIGH', status: 'FAILED', generated: '2024-07-29 22:00', format: 'JSON', size: '—' },
];

export const systemRows = [
  { id: 'SYS-3301', name: 'Risk Engine Daily Audit', service: 'RiskEngine', severity: 'INFO', status: 'SUCCESS', generated: '2024-08-01 03:00', retries: 0, size: '120 KB' },
  { id: 'SYS-3300', name: 'Database Backup Verification', service: 'DBService', severity: 'INFO', status: 'SUCCESS', generated: '2024-08-01 01:00', retries: 0, size: '8.2 MB' },
  { id: 'SYS-3299', name: 'API Gateway Health Report', service: 'APIGateway', severity: 'WARNING', status: 'SUCCESS', generated: '2024-08-01 00:00', retries: 1, size: '84 KB' },
  { id: 'SYS-3298', name: 'Risk Engine Audit Log', service: 'RiskEngine', severity: 'ERROR', status: 'FAILED', generated: '2024-07-31 22:00', retries: 3, size: '—' },
  { id: 'SYS-3297', name: 'Trade Execution Log Export', service: 'OrderManager', severity: 'INFO', status: 'SUCCESS', generated: '2024-07-31 20:00', retries: 0, size: '4.4 MB' },
  { id: 'SYS-3296', name: 'Email Delivery Digest', service: 'Notifications', severity: 'INFO', status: 'SUCCESS', generated: '2024-07-31 18:00', retries: 0, size: '64 KB' },
  { id: 'SYS-3295', name: 'Session Token Sweep', service: 'AuthService', severity: 'WARNING', status: 'SUCCESS', generated: '2024-07-31 06:00', retries: 0, size: '24 KB' },
  { id: 'SYS-3294', name: 'Compliance AML Batch Job', service: 'ComplianceEngine', severity: 'CRITICAL', status: 'FAILED', generated: '2024-07-30 23:00', retries: 3, size: '—' },
  { id: 'SYS-3293', name: 'Payout Processor Digest', service: 'PayoutService', severity: 'INFO', status: 'SUCCESS', generated: '2024-07-30 20:00', retries: 0, size: '186 KB' },
  { id: 'SYS-3292', name: 'Broker Feed Latency Report', service: 'MarketData', severity: 'INFO', status: 'SUCCESS', generated: '2024-07-30 12:00', retries: 0, size: '48 KB' },
];

export const exportTemplates = [
  { id: 'TPL-01', name: 'Finance Monthly Summary', type: 'Finance', format: 'PDF', freq: 'Monthly', recipients: ['cfo@firm.com', 'ops@firm.com'], lastRun: '2024-08-01 06:00', status: 'ACTIVE', nextRun: '2024-09-01 06:00' },
  { id: 'TPL-02', name: 'IB Commission Weekly', type: 'Finance', format: 'CSV', freq: 'Weekly', recipients: ['ib@firm.com'], lastRun: '2024-07-29 06:00', status: 'ACTIVE', nextRun: '2024-08-05 06:00' },
  { id: 'TPL-03', name: 'Trader P&L Daily', type: 'Trading', format: 'XLSX', freq: 'Daily', recipients: ['risk@firm.com', 'ops@firm.com'], lastRun: '2024-08-01 05:00', status: 'ACTIVE', nextRun: '2024-08-02 05:00' },
  { id: 'TPL-04', name: 'KYC Pending Batch', type: 'User', format: 'CSV', freq: 'Daily', recipients: ['compliance@firm.com'], lastRun: '2024-08-01 04:00', status: 'ACTIVE', nextRun: '2024-08-02 04:00' },
  { id: 'TPL-05', name: 'Risk Flags Summary', type: 'User', format: 'PDF', freq: 'Weekly', recipients: ['risk@firm.com', 'ceo@firm.com'], lastRun: '2024-07-29 07:00', status: 'ACTIVE', nextRun: '2024-08-05 07:00' },
  { id: 'TPL-06', name: 'System Health Digest', type: 'System', format: 'JSON', freq: 'Hourly', recipients: ['devops@firm.com'], lastRun: '2024-08-01 14:00', status: 'ACTIVE', nextRun: '2024-08-01 15:00' },
  { id: 'TPL-07', name: 'AML Full Export', type: 'User', format: 'CSV', freq: 'Monthly', recipients: ['compliance@firm.com', 'legal@firm.com'], lastRun: '2024-07-01 08:00', status: 'PAUSED', nextRun: '—' },
  { id: 'TPL-08', name: 'Executive Dashboard PDF', type: 'Finance', format: 'PDF', freq: 'Weekly', recipients: ['ceo@firm.com', 'cfo@firm.com'], lastRun: '2024-07-29 08:00', status: 'ACTIVE', nextRun: '2024-08-05 08:00' },
];

export const exportFailureLog = [
  { id: 'EXP-F-012', template: 'Finance Monthly Summary', ts: '2024-07-01 06:02', reason: 'SMTP timeout — delivery to cfo@firm.com failed after 3 retries' },
  { id: 'EXP-F-011', template: 'AML Full Export', ts: '2024-07-01 08:11', reason: 'Timeout: compliance engine unresponsive — job aborted' },
  { id: 'EXP-F-010', template: 'Risk Flags Summary', ts: '2024-06-24 07:04', reason: 'Output size exceeded 50 MB limit — compress or split required' },
];
