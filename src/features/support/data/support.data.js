/**
 * support.data.js
 * Single source of truth for all Support feature data.
 * Exports both the legacy workspace format (used by support.service.js)
 * and the rich ticket dataset used by the new page components.
 */

/* ── Rich ticket dataset ─────────────────────────────────── */

export const ticketsData = [
  { id: 'TKT-9041', user: 'Marcus Chen',  uid: 'UID-7823', email: 'marcus@email.com',  subject: 'Withdrawal not received after 5 business days',        priority: 'HIGH',     status: 'OPEN',      category: 'Finance',    owner: 'Marcus Webb',   updated: '4 min ago', sla: 82,  slaMins: 118,  created: '2024-08-01 10:14', region: 'SG', kyc: 'VERIFIED', wallet: 'ACTIVE',   trading: 'ACTIVE',    replies: 3,  tags: ['withdrawal', 'urgent'] },
  { id: 'TKT-9040', user: 'Priya Mehta',  uid: 'UID-3341', email: 'priya@email.com',   subject: 'KYC documents rejected — resubmission required',          priority: 'MEDIUM',   status: 'PENDING',   category: 'KYC',        owner: 'Priya Sharma',  updated: '18 min ago',sla: 64,  slaMins: 276,  created: '2024-08-01 07:22', region: 'IN', kyc: 'PENDING',  wallet: 'INACTIVE', trading: 'NONE',      replies: 1,  tags: ['kyc'] },
  { id: 'TKT-9039', user: 'Sam Torres',   uid: 'UID-8821', email: 'sam@email.com',     subject: 'MT5 platform login issue — password reset loop',           priority: 'HIGH',     status: 'OPEN',      category: 'Technical',  owner: 'Lena Fischer',  updated: '42 min ago',sla: 31,  slaMins: 58,   created: '2024-08-01 09:58', region: 'MX', kyc: 'VERIFIED', wallet: 'ACTIVE',   trading: 'ACTIVE',    replies: 2,  tags: ['platform', 'login'] },
  { id: 'TKT-9038', user: 'Lena Braun',   uid: 'UID-5521', email: 'lena@email.com',    subject: 'Incorrect bonus credit applied to account',                priority: 'MEDIUM',   status: 'OPEN',      category: 'Finance',    owner: 'Dev Kapoor',    updated: '1h ago',    sla: 55,  slaMins: 210,  created: '2024-07-31 16:44', region: 'DE', kyc: 'VERIFIED', wallet: 'ACTIVE',   trading: 'ACTIVE',    replies: 5,  tags: ['bonus', 'finance'] },
  { id: 'TKT-9037', user: 'Ali Hassan',   uid: 'UID-9102', email: 'ali@email.com',     subject: 'Account suspended without notification',                   priority: 'CRITICAL', status: 'ESCALATED', category: 'Account',    owner: 'Keiran Lynch',  updated: '1h ago',    sla: 12,  slaMins: 22,   created: '2024-08-01 08:00', region: 'EG', kyc: 'VERIFIED', wallet: 'FROZEN',   trading: 'SUSPENDED', replies: 8,  tags: ['suspended', 'urgent'] },
  { id: 'TKT-9036', user: 'Yuki Tanaka',  uid: 'UID-1182', email: 'yuki@email.com',   subject: 'Copy trading strategy not executing orders',               priority: 'HIGH',     status: 'OPEN',      category: 'Trading',    owner: 'Marcus Webb',   updated: '2h ago',    sla: 71,  slaMins: 98,   created: '2024-07-31 14:30', region: 'JP', kyc: 'VERIFIED', wallet: 'ACTIVE',   trading: 'ACTIVE',    replies: 4,  tags: ['copy-trading'] },
  { id: 'TKT-9035', user: 'Dev Patel',    uid: 'UID-6634', email: 'dev@email.com',     subject: 'IB commission not credited for July referrals',            priority: 'MEDIUM',   status: 'PENDING',   category: 'IB',         owner: 'Unassigned',    updated: '3h ago',    sla: 48,  slaMins: 384,  created: '2024-07-31 11:00', region: 'IN', kyc: 'VERIFIED', wallet: 'ACTIVE',   trading: 'ACTIVE',    replies: 0,  tags: ['ib', 'commission'] },
  { id: 'TKT-9034', user: 'Nina Voronova',uid: 'UID-2298', email: 'nina@email.com',    subject: 'Deposit failed — bank transfer returned',                  priority: 'HIGH',     status: 'OPEN',      category: 'Finance',    owner: 'Lena Fischer',  updated: '4h ago',    sla: 22,  slaMins: 46,   created: '2024-07-31 10:18', region: 'RU', kyc: 'VERIFIED', wallet: 'INACTIVE', trading: 'NONE',      replies: 2,  tags: ['deposit', 'failed'] },
  { id: 'TKT-9033', user: 'Kwame Asante', uid: 'UID-4421', email: 'kwame@email.com',   subject: 'Prop challenge phase 1 failed — dispute raised',           priority: 'MEDIUM',   status: 'OPEN',      category: 'Prop',       owner: 'Dev Kapoor',    updated: '5h ago',    sla: 88,  slaMins: 540,  created: '2024-07-30 17:00', region: 'GH', kyc: 'VERIFIED', wallet: 'ACTIVE',   trading: 'ACTIVE',    replies: 3,  tags: ['prop', 'dispute'] },
  { id: 'TKT-9032', user: 'Sofia Reyes',  uid: 'UID-8812', email: 'sofia@email.com',   subject: 'Two-factor authentication not working on app',             priority: 'LOW',      status: 'RESOLVED',  category: 'Technical',  owner: 'Marcus Webb',   updated: '6h ago',    sla: 100, slaMins: null, created: '2024-07-30 12:00', region: 'ES', kyc: 'VERIFIED', wallet: 'ACTIVE',   trading: 'ACTIVE',    replies: 6,  tags: ['2fa', 'tech'] },
  { id: 'TKT-9031', user: 'Omar Farouk',  uid: 'UID-3310', email: 'omar@email.com',    subject: 'Leverage setting not saving after update',                 priority: 'LOW',      status: 'RESOLVED',  category: 'Trading',    owner: 'Lena Fischer',  updated: '8h ago',    sla: 100, slaMins: null, created: '2024-07-30 08:30', region: 'EG', kyc: 'VERIFIED', wallet: 'ACTIVE',   trading: 'ACTIVE',    replies: 4,  tags: ['trading', 'settings'] },
  { id: 'TKT-9030', user: 'Ivan Petrov',  uid: 'UID-7710', email: 'ivan@email.com',    subject: 'Large withdrawal request — additional verification',       priority: 'HIGH',     status: 'ESCALATED', category: 'Finance',    owner: 'Keiran Lynch',  updated: '10h ago',   sla: 0,   slaMins: -30,  created: '2024-07-30 06:00', region: 'RU', kyc: 'VERIFIED', wallet: 'ACTIVE',   trading: 'ACTIVE',    replies: 7,  tags: ['withdrawal', 'aml'] },
];

export const escalatedData = [
  ...ticketsData.filter((t) => t.status === 'ESCALATED'),
  { id: 'TKT-9028', user: 'Tom Fischer',  uid: 'UID-4410', email: 'tom@email.com',   subject: 'Funded account breached — payout dispute',      priority: 'CRITICAL', status: 'ESCALATED', category: 'Prop',       owner: 'Keiran Lynch', updated: '2h ago',  sla: 5, slaMins: 8,   created: '2024-07-30 04:00', region: 'DE', kyc: 'VERIFIED', wallet: 'FROZEN',   trading: 'SUSPENDED', replies: 12, escalationReason: 'Financial dispute > $10,000',          tags: ['prop', 'payout', 'dispute'] },
  { id: 'TKT-9025', user: 'Aisha Nwosu',  uid: 'UID-3345', email: 'aisha@email.com', subject: 'Compliance flag — suspicious activity pattern',  priority: 'CRITICAL', status: 'ESCALATED', category: 'Compliance', owner: 'Unassigned',   updated: '3h ago',  sla: 0, slaMins: -15, created: '2024-07-29 22:00', region: 'NG', kyc: 'REVIEW',   wallet: 'FROZEN',   trading: 'SUSPENDED', replies: 4,  escalationReason: 'AML / compliance review required',     tags: ['aml', 'compliance', 'urgent'] },
];

export const ticketConversation = [
  { id: 'MSG-001', type: 'user',     author: 'Marcus Chen', role: '',        ts: '2024-08-01 10:14', body: "Hi, I submitted a withdrawal request 5 business days ago for $8,400 and it still hasn't arrived. The transaction ID is TXN-88210. My bank says they haven't received anything. Please help." },
  { id: 'MSG-002', type: 'agent',    author: 'Marcus Webb', role: 'Support', ts: '2024-08-01 10:42', body: "Hi Marcus, thanks for reaching out. I've located your withdrawal request TXN-88210. I can see it was processed on our side on July 26th. I'm now escalating this to our finance team to investigate the bank transfer status." },
  { id: 'MSG-003', type: 'internal', author: 'Marcus Webb', role: 'Support', ts: '2024-08-01 10:43', body: "INTERNAL: Checked payment gateway — transfer marked as 'Sent' but no bank confirmation received. Forwarding to Finance for manual trace. Possible SWIFT delay." },
  { id: 'MSG-004', type: 'user',     author: 'Marcus Chen', role: '',        ts: '2024-08-01 11:30', body: "Any update? I really need this money urgently. This is very frustrating." },
  { id: 'MSG-005', type: 'agent',    author: 'Dev Kapoor',  role: 'Finance', ts: '2024-08-01 12:15', body: "Hi Marcus, I've picked this up from the Finance side. We've initiated a bank trace with our correspondent bank. These typically take 24–48 hours. We'll update you as soon as we have a confirmed status." },
  { id: 'MSG-006', type: 'system',   author: 'System',      role: '',        ts: '2024-08-01 14:00', body: 'SLA Warning: Ticket approaching 4-hour response threshold. Priority escalated to HIGH.' },
];

export const relatedTickets = [
  { id: 'TKT-8982', subject: 'Withdrawal delay — July 10', status: 'RESOLVED', priority: 'MEDIUM' },
  { id: 'TKT-8840', subject: 'Account deposit confirmation', status: 'RESOLVED', priority: 'LOW' },
];

/* ── Legacy workspace format (keeps support.service.js working) ── */

export const supportWorkspaces = {
  tickets: {
    eyebrow: 'Support',
    title: 'Tickets',
    description: 'Primary support queue for live customer issues and internal workflows.',
    tableTitle: 'Ticket Queue',
    tableSubtitle: 'Open and active support tickets',
    metrics: [
      { label: 'Open Tickets',  value: String(ticketsData.filter((t) => t.status === 'OPEN').length),      subtext: 'Awaiting response',           trend: 'warning' },
      { label: 'Avg Response',  value: '1.5h',                                                              subtext: 'Last 24 hours',               trend: 'up' },
      { label: 'Urgent',        value: String(ticketsData.filter((t) => t.priority === 'CRITICAL').length), subtext: 'Priority management review',   trend: 'danger' },
      { label: 'CSAT',          value: '4.8/5',                                                             subtext: 'Service satisfaction',         trend: 'up' },
    ],
    filters: [
      { key: 'priority', label: 'Priority', options: [{ value: 'HIGH', label: 'High' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'LOW', label: 'Low' }] },
      { key: 'status',   label: 'Status',   options: [{ value: 'OPEN', label: 'Open' }, { value: 'PENDING', label: 'Pending' }, { value: 'RESOLVED', label: 'Resolved' }] },
    ],
    columns: [
      { key: 'id',       label: 'Ticket',   type: 'mono' },
      { key: 'user',     label: 'User' },
      { key: 'subject',  label: 'Subject' },
      { key: 'priority', label: 'Priority', type: 'status' },
      { key: 'status',   label: 'Status',   type: 'status' },
      { key: 'updated',  label: 'Updated',  type: 'mono' },
    ],
    rows: ticketsData,
  },
  escalated: {
    eyebrow: 'Support',
    title: 'Escalated Tickets',
    description: 'Tickets escalated to management, finance, compliance, or trading operations.',
    tableTitle: 'Escalated Queue',
    tableSubtitle: 'High-touch escalations requiring senior review',
    metrics: [
      { label: 'Escalated',   value: String(escalatedData.length),                                                       subtext: 'Currently active',         trend: 'danger' },
      { label: 'Compliance',  value: String(escalatedData.filter((t) => t.category === 'Compliance').length),             subtext: 'KYC or AML related',       trend: 'warning' },
      { label: 'Finance',     value: String(escalatedData.filter((t) => ['Finance', 'Prop'].includes(t.category)).length),subtext: 'Payout or funding issues',  trend: 'warning' },
      { label: 'Unassigned',  value: String(escalatedData.filter((t) => t.owner === 'Unassigned').length),                subtext: 'Need immediate assignment', trend: 'danger' },
    ],
    filters: [
      { key: 'category', label: 'Category', options: [{ value: 'Finance', label: 'Finance' }, { value: 'Compliance', label: 'Compliance' }, { value: 'Account', label: 'Account' }, { value: 'Prop', label: 'Prop' }] },
      { key: 'priority', label: 'Priority', options: [{ value: 'CRITICAL', label: 'Critical' }, { value: 'HIGH', label: 'High' }] },
    ],
    columns: [
      { key: 'id',       label: 'Ticket',   type: 'mono' },
      { key: 'user',     label: 'User' },
      { key: 'subject',  label: 'Subject' },
      { key: 'priority', label: 'Priority', type: 'status' },
      { key: 'status',   label: 'Status',   type: 'status' },
      { key: 'updated',  label: 'Updated',  type: 'mono' },
    ],
    rows: escalatedData,
  },
};

export const ticketDetails = {
  'TKT-9041': { ...ticketsData[0], summary: ticketsData[0].subject, notes: ticketConversation, internalNotes: ['VIP account. Keep response times under 15 minutes.', 'Coordinate with treasury before sending customer-facing ETA.'] },
  'TKT-1025': { id: 'TKT-1025', subject: 'Withdrawal Delay', user: 'Marco Rossi', priority: 'HIGH', status: 'OPEN', owner: 'Finance', createdAt: '2026-03-31 09:12', summary: 'Client reports a delay on a high-value withdrawal and requests treasury confirmation.', notes: [], internalNotes: ['VIP account. Keep response times under 15 minutes.'] },
  'TKT-1024': { id: 'TKT-1024', subject: '2FA Reset Request', user: 'Elena Vance', priority: 'MEDIUM', status: 'IN_PROGRESS', owner: 'Support', createdAt: '2026-03-31 08:02', summary: 'User cannot access the client portal after changing device and requested a 2FA reset.', notes: [], internalNotes: ['Identity verification completed through phone callback.'] },
};
