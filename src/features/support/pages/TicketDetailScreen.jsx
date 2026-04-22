import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { PageShell } from '../../../components/common/PageShell';
import { DetailHeader } from '../../../components/common/detail/DetailHeader';
import { ActivityTimeline } from '../../../components/common/detail/ActivityTimeline';
import { StatusBadge } from '../../../components/common/feedback/StatusBadge';
import { supportService } from '../services/support.service';

export function TicketDetailScreen() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const ticket = supportService.getById(ticketId);

  if (!ticket) {
    return <Navigate to="/support/tickets" replace />;
  }

  return (
    <PageShell>
      <button
        type="button"
        onClick={() => navigate('/support/tickets')}
        className="inline-flex items-center gap-2 text-[12px] font-medium text-text-muted hover:text-text"
      >
        <ArrowLeft size={14} />
        Back to Tickets
      </button>

      <DetailHeader
        title={ticket.subject}
        subtitle={`${ticket.user} • ${ticket.owner}`}
        badges={(
          <>
            <StatusBadge status={ticket.priority} />
            <StatusBadge status={ticket.status} dot={false} />
          </>
        )}
        meta={(
          <>
            <span>Ticket {ticket.id}</span>
            <span>Created {ticket.createdAt}</span>
          </>
        )}
        actions={(
          <>
            <Button variant="secondary">Add Internal Note</Button>
            <Button variant="primary">Escalate Ticket</Button>
          </>
        )}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Card title="Ticket Summary" subtitle="Customer issue">
          <p className="text-[14px] leading-6 text-text-muted">{ticket.summary}</p>
          <div className="mt-6">
            <ActivityTimeline items={ticket.notes} />
          </div>
        </Card>
        <Card title="Internal Notes" subtitle="Operator context">
          <div className="space-y-3">
            {ticket.internalNotes.map((note) => (
              <div key={note} className="rounded-[10px] border border-border/30 bg-bg/70 p-4 text-[13px] leading-6 text-text-muted">
                {note}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
