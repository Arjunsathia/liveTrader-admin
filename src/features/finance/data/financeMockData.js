/**
 * finance/data/financeMockData.js
 * All mock datasets + shared color maps for the Finance module.
 */
import { Building2, CreditCard, Bitcoin, CircleDollarSign, Database } from 'lucide-react';

const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
const uid = (n) => `UID-${n}`;
const users = [
  { name: 'Marcus Chen', uid: uid(7823), email: 'marcus@email.com', region: 'SG' },
  { name: 'Priya Mehta', uid: uid(3341), email: 'priya@email.com', region: 'IN' },
  { name: 'Sam Torres', uid: uid(8821), email: 'sam@email.com', region: 'MX' },
  { name: 'Lena Braun', uid: uid(5521), email: 'lena@email.com', region: 'DE' },
  { name: 'Ali Hassan', uid: uid(9102), email: 'ali@email.com', region: 'EG' },
  { name: 'Yuki Tanaka', uid: uid(1182), email: 'yuki@email.com', region: 'JP' },
  { name: 'Dev Patel', uid: uid(6634), email: 'dev@email.com', region: 'IN' },
  { name: 'Nina Voronova', uid: uid(2298), email: 'nina@email.com', region: 'RU' },
  { name: 'Kwame Asante', uid: uid(4421), email: 'kwame@email.com', region: 'GH' },
  { name: 'Ivan Petrov', uid: uid(7710), email: 'ivan@email.com', region: 'RU' },
];

// ── Deposits ──────────────────────────────────────────────────────
export const depositsData = [
  { id: 'DEP-8841', user: users[0], amount: '$8,400', amtRaw: 8400, method: 'Bank Wire', rail: 'SWIFT', status: 'PENDING', risk: 'LOW', created: '2024-08-01 14:22', reviewedBy: 'Auto', hash: '0xAb3f...', note: '' },
  { id: 'DEP-8840', user: users[1], amount: '$2,100', amtRaw: 2100, method: 'Card', rail: 'Stripe', status: 'APPROVED', risk: 'LOW', created: '2024-08-01 12:11', reviewedBy: 'Yuki Nakamura', hash: null, note: '' },
  { id: 'DEP-8839', user: users[2], amount: '$14,200', amtRaw: 14200, method: 'Crypto', rail: 'USDT-TRC20', status: 'PENDING', risk: 'MEDIUM', created: '2024-08-01 11:04', reviewedBy: 'Auto', hash: '0xCd8e...', note: 'Large crypto deposit â€” manual KYC check required' },
  { id: 'DEP-8838', user: users[3], amount: '$500', amtRaw: 500, method: 'Card', rail: 'Stripe', status: 'APPROVED', risk: 'LOW', created: '2024-08-01 09:55', reviewedBy: 'Auto', hash: null, note: '' },
  { id: 'DEP-8837', user: users[4], amount: '$28,000', amtRaw: 28000, method: 'Bank Wire', rail: 'SWIFT', status: 'FLAGGED', risk: 'HIGH', created: '2024-08-01 08:30', reviewedBy: 'Keiran Lynch', hash: null, note: 'AML flag: unusual transaction pattern. Pending compliance review.' },
  { id: 'DEP-8836', user: users[5], amount: '$3,200', amtRaw: 3200, method: 'Crypto', rail: 'BTC', status: 'APPROVED', risk: 'LOW', created: '2024-07-31 18:00', reviewedBy: 'Auto', hash: '0xBf1a...', note: '' },
  { id: 'DEP-8835', user: users[6], amount: '$1,000', amtRaw: 1000, method: 'E-Wallet', rail: 'Skrill', status: 'FAILED', risk: 'LOW', created: '2024-07-31 16:44', reviewedBy: 'â€”', hash: null, note: 'Skrill: insufficient balance at source.' },
  { id: 'DEP-8834', user: users[7], amount: '$42,000', amtRaw: 42000, method: 'Bank Wire', rail: 'SEPA', status: 'PENDING', risk: 'HIGH', created: '2024-07-31 14:00', reviewedBy: 'Priya Sharma', hash: null, note: 'Large SEPA transfer â€” source of funds doc requested.' },
  { id: 'DEP-8833', user: users[8], amount: '$750', amtRaw: 750, method: 'Card', rail: 'Adyen', status: 'APPROVED', risk: 'LOW', created: '2024-07-31 10:30', reviewedBy: 'Auto', hash: null, note: '' },
  { id: 'DEP-8832', user: users[9], amount: '$5,600', amtRaw: 5600, method: 'Crypto', rail: 'ETH', status: 'FLAGGED', risk: 'HIGH', created: '2024-07-31 08:12', reviewedBy: 'Keiran Lynch', hash: '0xEe2b...', note: 'Wallet flagged in OFAC screening.' },
];

// ── Withdrawals ──────────────────────────────────────────────────
export const withdrawalsData = [
  { id: 'WDR-4841', user: users[0], amount: '$18,400', amtRaw: 18400, destination: 'DBS Bank SG ****4821', method: 'Bank Wire', rail: 'SWIFT', status: 'PENDING', risk: 'LOW', created: '2024-08-01 14:10', reviewedBy: 'Keiran Lynch', compliance: 'PASS', aml: 'CLEAR' },
  { id: 'WDR-4840', user: users[2], amount: '$3,200', amtRaw: 3200, destination: 'USDT 0xAb3f...9e12', method: 'Crypto', rail: 'USDT-ERC20', status: 'PENDING', risk: 'MEDIUM', created: '2024-08-01 12:44', reviewedBy: 'Auto', compliance: 'PASS', aml: 'REVIEW' },
  { id: 'WDR-4839', user: users[4], amount: '$8,100', amtRaw: 8100, destination: 'BTC 1Bc3x...kq9m', method: 'Crypto', rail: 'BTC', status: 'FROZEN', risk: 'HIGH', created: '2024-08-01 08:11', reviewedBy: 'Keiran Lynch', compliance: 'FAIL', aml: 'FLAG' },
  { id: 'WDR-4838', user: users[5], amount: '$12,900', amtRaw: 12900, destination: 'MUFG Bank JP ****7732', method: 'Bank Wire', rail: 'SWIFT', status: 'PROCESSING', risk: 'LOW', created: '2024-07-31 17:00', reviewedBy: 'Yuki Nakamura', compliance: 'PASS', aml: 'CLEAR' },
  { id: 'WDR-4837', user: users[1], amount: '$1,500', amtRaw: 1500, destination: 'Skrill priya@email.com', method: 'E-Wallet', rail: 'Skrill', status: 'PAID', risk: 'LOW', created: '2024-07-31 14:22', reviewedBy: 'Auto', compliance: 'PASS', aml: 'CLEAR' },
  { id: 'WDR-4836', user: users[3], amount: '$4,800', amtRaw: 4800, destination: 'Deutsche Bank ****3311', method: 'Bank Wire', rail: 'SEPA', status: 'PAID', risk: 'LOW', created: '2024-07-31 10:00', reviewedBy: 'Keiran Lynch', compliance: 'PASS', aml: 'CLEAR' },
  { id: 'WDR-4835', user: users[9], amount: '$24,400', amtRaw: 24400, destination: 'Sber Bank RU ****9921', method: 'Bank Wire', rail: 'SWIFT', status: 'FLAGGED', risk: 'HIGH', created: '2024-07-30 22:00', reviewedBy: 'Priya Sharma', compliance: 'FAIL', aml: 'FLAG' },
  { id: 'WDR-4834', user: users[6], amount: '$2,100', amtRaw: 2100, destination: 'ETH 0xDf4c...8a21', method: 'Crypto', rail: 'ETH', status: 'REJECTED', risk: 'MEDIUM', created: '2024-07-30 16:44', reviewedBy: 'Dev Kapoor', compliance: 'FAIL', aml: 'REVIEW' },
];

// ── Transactions ─────────────────────────────────────────────────
export const transactionsData = [
  { id: 'TXN-9901', user: users[0], type: 'DEPOSIT', amount: '+$8,400', amtRaw: 8400, method: 'Bank Wire', reference: 'DEP-8841', status: 'SETTLED', ts: '2024-08-01 14:22' },
  { id: 'TXN-9900', user: users[1], type: 'WITHDRAWAL', amount: '-$1,500', amtRaw: -1500, method: 'E-Wallet', reference: 'WDR-4837', status: 'SETTLED', ts: '2024-08-01 12:00' },
  { id: 'TXN-9899', user: users[2], type: 'DEPOSIT', amount: '+$14,200', amtRaw: 14200, method: 'Crypto', reference: 'DEP-8839', status: 'PENDING', ts: '2024-08-01 11:04' },
  { id: 'TXN-9898', user: users[3], type: 'FEE', amount: '-$249', amtRaw: -249, method: 'Internal', reference: 'FEE-2241', status: 'SETTLED', ts: '2024-08-01 10:30' },
  { id: 'TXN-9897', user: users[4], type: 'WITHDRAWAL', amount: '-$8,100', amtRaw: -8100, method: 'Crypto', reference: 'WDR-4839', status: 'FROZEN', ts: '2024-08-01 08:11' },
  { id: 'TXN-9896', user: users[5], type: 'DEPOSIT', amount: '+$3,200', amtRaw: 3200, method: 'Crypto', reference: 'DEP-8836', status: 'SETTLED', ts: '2024-07-31 18:00' },
  { id: 'TXN-9895', user: users[6], type: 'REVERSAL', amount: '+$1,000', amtRaw: 1000, method: 'E-Wallet', reference: 'REV-0811', status: 'SETTLED', ts: '2024-07-31 16:44' },
  { id: 'TXN-9894', user: users[7], type: 'DEPOSIT', amount: '+$42,000', amtRaw: 42000, method: 'Bank Wire', reference: 'DEP-8834', status: 'PENDING', ts: '2024-07-31 14:00' },
  { id: 'TXN-9893', user: users[8], type: 'COMMISSION', amount: '+$840', amtRaw: 840, method: 'Internal', reference: 'COM-8821', status: 'SETTLED', ts: '2024-07-31 10:30' },
  { id: 'TXN-9892', user: users[9], type: 'WITHDRAWAL', amount: '-$24,400', amtRaw: -24400, method: 'Bank Wire', reference: 'WDR-4835', status: 'FLAGGED', ts: '2024-07-30 22:00' },
  { id: 'TXN-9891', user: users[0], type: 'ADJUSTMENT', amount: '+$200', amtRaw: 200, method: 'Internal', reference: 'ADJ-0099', status: 'SETTLED', ts: '2024-07-30 18:00' },
  { id: 'TXN-9890', user: users[1], type: 'DEPOSIT', amount: '+$2,100', amtRaw: 2100, method: 'Card', reference: 'DEP-8840', status: 'SETTLED', ts: '2024-07-30 12:11' },
];

// ── Failed Payments ──────────────────────────────────────────────
export const failedPaymentsData = [
  { id: 'FAIL-3301', user: users[6], method: 'E-Wallet', provider: 'Skrill', reason: 'INSUFFICIENT_BALANCE', code: 'SKR-4002', severity: 'LOW', status: 'UNRESOLVED', retries: 1, created: '2024-07-31 16:44' },
  { id: 'FAIL-3300', user: users[4], method: 'Bank Wire', provider: 'SWIFT', reason: 'ACCOUNT_NOT_FOUND', code: 'SWF-1404', severity: 'MEDIUM', status: 'RETRY', retries: 2, created: '2024-08-01 08:30' },
  { id: 'FAIL-3299', user: users[9], method: 'Bank Wire', provider: 'SWIFT', reason: 'AML_BLOCK', code: 'SWF-7001', severity: 'CRITICAL', status: 'UNRESOLVED', retries: 3, created: '2024-07-30 22:00' },
  { id: 'FAIL-3298', user: users[2], method: 'Crypto', provider: 'Fireblocks', reason: 'GAS_LIMIT_EXCEEDED', code: 'FBK-3003', severity: 'LOW', status: 'RESOLVED', retries: 1, created: '2024-07-31 09:12' },
  { id: 'FAIL-3297', user: users[7], method: 'Crypto', provider: 'Fireblocks', reason: 'BLACKLISTED_WALLET', code: 'FBK-9001', severity: 'CRITICAL', status: 'UNRESOLVED', retries: 0, created: '2024-08-01 06:00' },
  { id: 'FAIL-3296', user: users[3], method: 'Card', provider: 'Stripe', reason: 'CARD_DECLINED', code: 'STR-4231', severity: 'LOW', status: 'RESOLVED', retries: 2, created: '2024-07-30 14:00' },
  { id: 'FAIL-3295', user: users[5], method: 'Bank Wire', provider: 'SEPA', reason: 'ROUTING_ERROR', code: 'SEP-2002', severity: 'MEDIUM', status: 'RETRY', retries: 1, created: '2024-07-30 10:30' },
  { id: 'FAIL-3294', user: users[8], method: 'E-Wallet', provider: 'Neteller', reason: 'ACCOUNT_SUSPENDED', code: 'NET-5501', severity: 'HIGH', status: 'UNRESOLVED', retries: 0, created: '2024-07-29 20:00' },
];

// ── Approvals ────────────────────────────────────────────────────
export const approvalsData = [
  { id: 'APR-2201', user: users[4], amount: '$28,000', amtRaw: 28000, type: 'DEPOSIT', risk: 'HIGH', rule: 'AML_THRESHOLD', reviewer: 'Keiran Lynch', status: 'PENDING', priority: 'CRITICAL', sla: 12, created: '2024-08-01 08:30' },
  { id: 'APR-2200', user: users[7], amount: '$42,000', amtRaw: 42000, type: 'DEPOSIT', risk: 'HIGH', rule: 'LARGE_WIRE_REVIEW', reviewer: 'Priya Sharma', status: 'PENDING', priority: 'HIGH', sla: 45, created: '2024-07-31 14:00' },
  { id: 'APR-2199', user: users[4], amount: '$8,100', amtRaw: 8100, type: 'WITHDRAWAL', risk: 'HIGH', rule: 'SANCTIONS_HIT', reviewer: 'Keiran Lynch', status: 'ESCALATED', priority: 'CRITICAL', sla: 0, created: '2024-08-01 08:11' },
  { id: 'APR-2198', user: users[9], amount: '$24,400', amtRaw: 24400, type: 'WITHDRAWAL', risk: 'HIGH', rule: 'OFAC_SCREENING', reviewer: 'Priya Sharma', status: 'PENDING', priority: 'CRITICAL', sla: 4, created: '2024-07-30 22:00' },
  { id: 'APR-2197', user: users[2], amount: '$14,200', amtRaw: 14200, type: 'DEPOSIT', risk: 'MEDIUM', rule: 'CRYPTO_KYC_REQUIRED', reviewer: 'Unassigned', status: 'PENDING', priority: 'HIGH', sla: 82, created: '2024-08-01 11:04' },
  { id: 'APR-2196', user: users[9], amount: '$5,600', amtRaw: 5600, type: 'DEPOSIT', risk: 'HIGH', rule: 'WALLET_BLACKLIST', reviewer: 'Keiran Lynch', status: 'PENDING', priority: 'CRITICAL', sla: 18, created: '2024-07-31 08:12' },
  { id: 'APR-2195', user: users[8], amount: '$2,100', amtRaw: 2100, type: 'WITHDRAWAL', risk: 'MEDIUM', rule: 'MANUAL_REVIEW_FLAG', reviewer: 'Dev Kapoor', status: 'APPROVED', priority: 'MEDIUM', sla: 100, created: '2024-07-30 16:44' },
  { id: 'APR-2194', user: users[3], amount: '$4,800', amtRaw: 4800, type: 'WITHDRAWAL', risk: 'LOW', rule: 'DAILY_LIMIT_CHECK', reviewer: 'Yuki Nakamura', status: 'APPROVED', priority: 'LOW', sla: 100, created: '2024-07-30 10:00' },
  { id: 'APR-2193', user: users[6], amount: '$1,500', amtRaw: 1500, type: 'WITHDRAWAL', risk: 'MEDIUM', rule: 'VELOCITY_CHECK', reviewer: 'Dev Kapoor', status: 'REJECTED', priority: 'MEDIUM', sla: 100, created: '2024-07-29 20:00' },
];

// ── Color maps ───────────────────────────────────────────────────
export const STATUS_CLR = {
  PENDING: 'var(--warning)', APPROVED: 'var(--positive)', FAILED: 'var(--negative)',
  FLAGGED: 'var(--negative)', PROCESSING: 'var(--cyan)', PAID: 'var(--positive)',
  FROZEN: 'var(--negative)', REJECTED: 'var(--negative)', SETTLED: 'var(--positive)',
  REVERSED: 'var(--warning)', UNRESOLVED: 'var(--negative)', RESOLVED: 'var(--positive)',
  RETRY: 'var(--warning)', ESCALATED: 'var(--negative)', LOCKED: 'var(--negative)',
  REVIEW: 'var(--warning)',
};
export const RISK_CLR = { LOW: 'var(--positive)', MEDIUM: 'var(--warning)', HIGH: 'var(--negative)', CRITICAL: 'var(--negative)' };
export const PRIORITY_CLR = { CRITICAL: 'var(--negative)', HIGH: '#f97316', MEDIUM: 'var(--warning)', LOW: 'var(--cyan)' };
export const SEV_CLR = { LOW: 'var(--positive)', MEDIUM: 'var(--warning)', HIGH: 'var(--negative)', CRITICAL: 'var(--negative)' };
export const TXN_TYPE_CLR = {
  DEPOSIT: 'var(--positive)', WITHDRAWAL: 'var(--negative)', FEE: 'var(--warning)',
  REVERSAL: 'var(--cyan)', COMMISSION: 'var(--brand)', ADJUSTMENT: '#a78bfa',
};

export const METHOD_ICONS = {
  'Bank Wire': Building2, 'Card': CreditCard, 'Crypto': Bitcoin,
  'E-Wallet': CircleDollarSign, 'Internal': Database,
};

