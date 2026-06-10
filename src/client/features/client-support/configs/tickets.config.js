/* ── Status colour maps ── */
export const STATUS_MAP = {
  OPEN: {
    label: 'Open',
    cls: 'bg-brand/10 text-brand border-brand/20',
    dot: true,
  },
  PENDING: {
    label: 'Pending',
    cls: 'bg-warning/10 text-warning border-warning/20',
    dot: false,
  },
  RESOLVED: {
    label: 'Resolved',
    cls: 'bg-positive/10 text-positive border-positive/20',
    dot: false,
  },
  CLOSED: {
    label: 'Closed',
    cls: 'bg-muted-surface text-text-muted border-border/30',
    dot: false,
  },
};

export const PRIORITY_MAP = {
  HIGH: { label: 'High',   cls: 'bg-negative/10 text-negative border-negative/20' },
  MED:  { label: 'Medium', cls: 'bg-warning/10 text-warning border-warning/20'   },
  LOW:  { label: 'Low',    cls: 'bg-positive/10 text-positive border-positive/20' },
};

export const CATEGORY_MAP = {
  Finance:       { cls: 'bg-brand/10 text-brand border-brand/20'         },
  KYC:           { cls: 'bg-positive/10 text-positive border-positive/20' },
  Technical:     { cls: 'bg-warning/10 text-warning border-warning/20'   },
  'Copy Trading':{ cls: 'bg-purple/10 text-purple border-purple/20' },
  Account:       { cls: 'bg-muted-surface text-text-muted border-border/30' },
  Other:         { cls: 'bg-muted-surface text-text-muted border-border/30' },
};

/* ── Mock ticket data ── */
export const MOCK_TICKETS = [
  {
    id: 'TKT-4421',
    subject: 'Withdrawal not received after 5 business days',
    category: 'Finance',
    priority: 'HIGH',
    status: 'OPEN',
    updated: '2 min ago',
    created: 'Aug 1, 2026',
    unread: true,
    messages: 3,
  },
  {
    id: 'TKT-4420',
    subject: 'KYC documents rejected — resubmission required',
    category: 'KYC',
    priority: 'MED',
    status: 'PENDING',
    updated: '1h ago',
    created: 'Jul 31, 2026',
    unread: false,
    messages: 2,
  },
  {
    id: 'TKT-4419',
    subject: 'MT5 login issue — password reset loop',
    category: 'Technical',
    priority: 'HIGH',
    status: 'OPEN',
    updated: '3h ago',
    created: 'Jul 31, 2026',
    unread: true,
    messages: 5,
  },
  {
    id: 'TKT-4418',
    subject: 'Copy trading strategy not executing orders',
    category: 'Copy Trading',
    priority: 'MED',
    status: 'PENDING',
    updated: '1d ago',
    created: 'Jul 30, 2026',
    unread: false,
    messages: 1,
  },
  {
    id: 'TKT-4417',
    subject: 'Bonus credit inquiry for July promotion',
    category: 'Account',
    priority: 'LOW',
    status: 'RESOLVED',
    updated: '2d ago',
    created: 'Jul 29, 2026',
    unread: false,
    messages: 4,
  },
  {
    id: 'TKT-4416',
    subject: 'Unable to access trading history older than 30 days',
    category: 'Technical',
    priority: 'LOW',
    status: 'RESOLVED',
    updated: '5d ago',
    created: 'Jul 26, 2026',
    unread: false,
    messages: 2,
  },
];

export const STATUS_FILTERS  = ['ALL', 'OPEN', 'PENDING', 'RESOLVED'];
export const CATEGORY_FILTERS = ['ALL', 'Finance', 'KYC', 'Technical', 'Copy Trading', 'Account'];
export const PRIORITY_FILTERS = ['ALL', 'HIGH', 'MED', 'LOW'];
