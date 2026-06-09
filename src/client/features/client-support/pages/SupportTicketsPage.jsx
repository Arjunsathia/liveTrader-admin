import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquarePlus, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';

const MOCK_TICKETS = [
  { id: 'TK-001', subject: 'Withdrawal delayed for 3 days', status: 'open',     priority: 'high',   date: 'Jun 2, 2026',   lastReply: '2h ago' },
  { id: 'TK-002', subject: 'KYC document re-upload request', status: 'pending',  priority: 'medium', date: 'May 30, 2026',  lastReply: '1d ago' },
  { id: 'TK-003', subject: 'Unable to link MT5 account',     status: 'resolved', priority: 'low',    date: 'May 25, 2026',  lastReply: '5d ago' },
];

const STATUS_CFG = {
  open:     { icon: AlertCircle,  color: 'negative', label: 'Open'     },
  pending:  { icon: Clock,        color: 'warning',  label: 'Pending'  },
  resolved: { icon: CheckCircle,  color: 'positive', label: 'Resolved' },
};
const PRIORITY_CFG = {
  high:   { color: 'negative', label: 'High'   },
  medium: { color: 'warning',  label: 'Medium' },
  low:    { color: 'positive', label: 'Low'    },
};

export function SupportTicketsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[10.5px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">Help & Support</p>
          <h1 className="font-heading font-semibold text-[26px] tracking-[-0.03em] leading-tight text-text mt-0.5">Support Center</h1>
        </div>
        <button
          onClick={() => navigate('/client/support/tickets/new')}
          className="flex items-center gap-2 h-9 px-4 rounded-[9px] font-semibold text-[12.5px] transition-all duration-200 cursor-pointer active:scale-95"
          style={{ background: 'var(--brand)', color: 'var(--text-on-accent)' }}
        >
          <MessageSquarePlus size={13} strokeWidth={2.2} /> New Ticket
        </button>
      </div>

      {/* Tickets list */}
      <div className="rounded-[14px] overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="px-5 py-3.5" style={{ background: 'var(--muted-surface)', borderBottom: '1px solid var(--border)' }}>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-text-muted">Your Tickets ({MOCK_TICKETS.length})</p>
        </div>
        <div style={{ background: 'var(--surface)' }}>
          {MOCK_TICKETS.map((ticket, i) => {
            const { icon: StatusIcon, color: sColor, label: sLabel } = STATUS_CFG[ticket.status];
            const { color: pColor, label: pLabel } = PRIORITY_CFG[ticket.priority];
            return (
              <button
                key={ticket.id}
                onClick={() => navigate(`/client/support/tickets/${ticket.id}`)}
                className="w-full flex items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-text/[0.02] text-left outline-none cursor-pointer"
                style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}
              >
                <div
                  className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0"
                  style={{ background: `color-mix(in srgb, var(--${sColor}) 10%, transparent)`, color: `var(--${sColor})` }}
                >
                  <StatusIcon size={16} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-text truncate">{ticket.subject}</p>
                  <p className="text-[11.5px] text-text-muted mt-0.5">{ticket.id} · Opened {ticket.date} · Last reply {ticket.lastReply}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.1em] px-2 py-1 rounded-[5px]"
                    style={{ background: `color-mix(in srgb, var(--${pColor}) 8%, transparent)`, color: `var(--${pColor})` }}
                  >
                    {pLabel}
                  </span>
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.1em] px-2 py-1 rounded-[5px] hidden sm:block"
                    style={{ background: `color-mix(in srgb, var(--${sColor}) 10%, transparent)`, color: `var(--${sColor})` }}
                  >
                    {sLabel}
                  </span>
                  <ChevronRight size={14} className="text-text-muted/25" strokeWidth={2} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {MOCK_TICKETS.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <MessageSquarePlus size={36} className="mx-auto mb-3 opacity-30" strokeWidth={1.4} />
          <p className="text-[14px] font-semibold">No tickets yet</p>
          <p className="text-[12.5px] mt-1">Open a ticket if you need help with anything.</p>
        </div>
      )}
    </div>
  );
}
