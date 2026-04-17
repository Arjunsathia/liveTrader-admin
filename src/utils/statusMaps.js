/* ─── Canonical CSS-variable color maps ──────────────────────────
   Used by TradingTable, CopyTradingTable, StatusChip, and any
   future feature table. Import the map you need rather than
   re-defining it locally in every file.
─────────────────────────────────────────────────────────────────── */

/** General status values → CSS variable color */
export const STATUS_COLORS = {
  // Positive
  ACTIVE:      'var(--positive)',
  FILLED:      'var(--positive)',
  WIN:         'var(--positive)',
  APPROVED:    'var(--positive)',
  PUBLISHED:   'var(--positive)',
  VERIFIED:    'var(--positive)',
  PAID:        'var(--positive)',
  SUCCESS:     'var(--positive)',
  COMPLETED:   'var(--positive)',
  RENEWED:     'var(--positive)',
  // Warning
  PENDING:     'var(--warning)',
  REVIEW:      'var(--warning)',
  PAUSED:      'var(--warning)',
  SUSPENDED:   'var(--warning)',
  WARNED:      'var(--warning)',
  READONLY:    'var(--warning)',
  PROCESSING:  'var(--warning)',
  EXPIRING:    'var(--warning)',
  IN_REVIEW:   'var(--warning)',
  FROZEN:      'var(--warning)',
  // Danger
  BLOCKED:     'var(--negative)',
  REJECTED:    'var(--negative)',
  FAILED:      'var(--negative)',
  LOSS:        'var(--negative)',
  BREACHED:    'var(--negative)',
  CRITICAL:    'var(--negative)',
  RESTRICTED:  'var(--negative)',
  // Cyan
  OPEN:        'var(--cyan)',
  IN_PROGRESS: 'var(--cyan)',
  REVIEW_ONLY: 'var(--cyan)',
  // Muted
  CANCELED:    'var(--text-muted)',
  EXPIRED:     'var(--text-muted)',
  DRAFT:       'var(--text-muted)',
  INACTIVE:    'var(--text-muted)',
  HEARTBEAT:   'var(--text-muted)',
};

/** Risk level → color */
export const RISK_COLORS = {
  LOW:    'var(--positive)',
  MEDIUM: 'var(--warning)',
  HIGH:   'var(--negative)',
};

/** Severity level → color */
export const SEVERITY_COLORS = {
  INFO:     'var(--positive)',
  WARN:     'var(--warning)',
  ERROR:    'var(--negative)',
  CRITICAL: 'var(--negative)',
};

/** Trading execution log type → color */
export const TRADING_LOG_COLORS = {
  EXECUTION:   'var(--positive)',
  SYNC:        'var(--cyan)',
  REJECTION:   'var(--negative)',
  RETRY:       'var(--warning)',
  PRICE_FEED:  'var(--purple)',
  HEARTBEAT:   'var(--text-muted)',
  MARGIN_CALL: 'var(--negative)',
};

/** Copy-trading event log type → color */
export const COPY_LOG_COLORS = {
  COPY_EXECUTED:    'var(--positive)',
  SUBSCRIPTION:     'var(--cyan)',
  SYNC_FAIL:        'var(--negative)',
  PROVIDER_UPDATE:  'var(--warning)',
  RISK_FLAG:        'var(--negative)',
  FOLLOWER_JOINED:  'var(--purple)',
};

/** IB tier badge colors */
export const IB_TIER_COLORS = {
  GOLD:     'rgba(218,165,32,1)',
  PLATINUM: 'rgba(180,190,210,1)',
  ELITE:    'rgba(139,92,246,1)',
  STANDARD: 'rgba(100,116,139,1)',
};

/** Original statusVariantMap kept for backward compat with StatusBadge */
export const statusVariantMap = {
  active: 'success', verified: 'success', approved: 'success', approve: 'success',
  completed: 'success', connected: 'success', funded: 'success', settled: 'success',
  success: 'success', healthy: 'success', top: 'success', ready: 'success',
  received: 'success', open: 'info', live: 'info', info: 'info', low: 'info',
  gold: 'info', elite: 'info', global: 'info', finance: 'info', users: 'info',
  trading: 'info', audit: 'info', infra: 'info', api: 'info', csv: 'info',
  xlsx: 'info', zip: 'info', pending: 'warning', review: 'warning',
  'in-review': 'warning', paused: 'warning', flagged: 'warning', warning: 'warning',
  escalated: 'warning', medium: 'warning', watch: 'warning', watchlist: 'warning',
  'in-progress': 'warning', 'new-device': 'warning', processing: 'warning',
  review_only: 'warning', platinum: 'warning', desk: 'warning', challenge: 'warning',
  funded_scope: 'warning', trial: 'warning', failed: 'danger', rejected: 'danger',
  reject: 'danger', blocked: 'danger', limited: 'danger', disconnected: 'danger',
  critical: 'danger', high: 'danger', breach: 'danger', restricted: 'danger',
  'high-risk': 'danger', hold: 'danger', draft: 'danger', expired: 'danger',
};

export function getStatusVariant(status = '') {
  const normalized = String(status).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return statusVariantMap[normalized] ?? 'muted';
}
