export const MOCK_CONVERSATION = [
  {
    id: 1,
    from: 'user',
    name: 'Marcus Chen',
    initials: 'MC',
    ts: 'Aug 1 · 10:14 AM',
    text: 'Hi, I submitted a withdrawal request 5 business days ago for $8,400 and it still has not arrived. Transaction ID: TXN-88210. Please help.',
    attachments: ['bank-statement.pdf'],
  },
  {
    id: 2,
    from: 'agent',
    name: 'Sarah — Support',
    initials: 'SA',
    ts: 'Aug 1 · 10:42 AM',
    text: 'Hi Marcus, I can see your withdrawal TXN-88210 was processed on our side on July 26th. Escalating to our finance team now to investigate the bank transfer status. We will update you within 24 hours.',
    attachments: [],
  },
  {
    id: 3,
    from: 'user',
    name: 'Marcus Chen',
    initials: 'MC',
    ts: 'Aug 1 · 11:30 AM',
    text: 'Any update? This is urgent.',
    attachments: [],
  },
  {
    id: 4,
    from: 'system',
    ts: 'Aug 1 · 14:00',
    text: 'Ticket priority escalated to HIGH.',
  },
  {
    id: 5,
    from: 'agent',
    name: 'Dev — Finance',
    initials: 'DF',
    ts: 'Aug 1 · 15:15 PM',
    text: 'Hi Marcus, we have initiated a bank trace with our correspondent bank. These typically resolve in 24–48 hours. I will update you as soon as we have confirmation.',
    attachments: [],
  },
];

export const TICKET_META_FIELDS = [
  { label: 'Ticket ID',   key: 'id'       },
  { label: 'Category',    key: 'category' },
  { label: 'Priority',    key: 'priority' },
  { label: 'Status',      key: 'status'   },
  { label: 'Created',     key: 'created'  },
  { label: 'Last update', key: 'updated'  },
];
