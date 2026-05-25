export const ticketsData = [
  { id: 'TKT-DEMO', user: 'Demo User', uid: 'UID-000', email: 'demo@email.com', subject: 'Demo Subject', priority: 'LOW', status: 'OPEN', category: 'General', owner: 'Unassigned', updated: 'Just now', sla: 100, slaMins: 0, created: '2024-01-01 00:00', region: 'Global', kyc: 'VERIFIED', wallet: 'ACTIVE', trading: 'ACTIVE', replies: 0, tags: ['demo'] },
];

export const escalatedData = [
  { id: 'TKT-ESC', user: 'Demo Esc', uid: 'UID-111', email: 'esc@email.com', subject: 'Escalated Subject', priority: 'CRITICAL', status: 'ESCALATED', category: 'General', owner: 'Unassigned', updated: 'Just now', sla: 0, slaMins: 0, created: '2024-01-01 00:00', region: 'Global', kyc: 'VERIFIED', wallet: 'ACTIVE', trading: 'ACTIVE', replies: 0, escalationReason: 'Demo', tags: ['demo'] },
];

export const ticketConversation = [
  { id: 'MSG-DEMO', type: 'system', author: 'System', role: '', ts: '2024-01-01 00:00', body: 'Demo message' },
];

export const relatedTickets = [
  { id: 'TKT-REL', subject: 'Related Demo', status: 'RESOLVED', priority: 'LOW' },
];

export const supportWorkspaces = {
  tickets: {
    eyebrow: 'Support',
    title: 'Tickets',
    description: 'Primary support queue for live customer issues and internal workflows.',
    tableTitle: 'Ticket Queue',
    tableSubtitle: 'Open and active support tickets',
    metrics: [
      { label: 'Open Tickets', value: '1', subtext: 'Demo data', trend: 'up' },
    ],
    filters: [
      { key: 'priority', label: 'Priority', options: [{ value: 'HIGH', label: 'High' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'LOW', label: 'Low' }] },
      { key: 'status', label: 'Status', options: [{ value: 'OPEN', label: 'Open' }, { value: 'PENDING', label: 'Pending' }, { value: 'RESOLVED', label: 'Resolved' }] },
    ],
    columns: [
      { key: 'id', label: 'Ticket', type: 'mono' },
      { key: 'user', label: 'User' },
      { key: 'subject', label: 'Subject' },
      { key: 'priority', label: 'Priority', type: 'status' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'updated', label: 'Updated', type: 'mono' },
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
      { label: 'Escalated', value: '1', subtext: 'Demo data', trend: 'danger' },
    ],
    filters: [
      { key: 'category', label: 'Category', options: [{ value: 'Finance', label: 'Finance' }, { value: 'Compliance', label: 'Compliance' }, { value: 'Account', label: 'Account' }, { value: 'Prop', label: 'Prop' }] },
      { key: 'priority', label: 'Priority', options: [{ value: 'CRITICAL', label: 'Critical' }, { value: 'HIGH', label: 'High' }] },
    ],
    columns: [
      { key: 'id', label: 'Ticket', type: 'mono' },
      { key: 'user', label: 'User' },
      { key: 'subject', label: 'Subject' },
      { key: 'priority', label: 'Priority', type: 'status' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'updated', label: 'Updated', type: 'mono' },
    ],
    rows: escalatedData,
  },
};

export const ticketDetails = {
  'TKT-DEMO': { ...ticketsData[0], summary: ticketsData[0].subject, notes: ticketConversation, internalNotes: ['Demo notes'] },
};
