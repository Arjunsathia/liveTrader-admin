import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import TicketsPage from '@/features/support/pages/TicketsPage';
import EscalatedPage from '@/features/support/pages/EscalatedPage';

const PAGE_MAP = {
  tickets:   TicketsPage,
  escalated: EscalatedPage,
};

function SupportPage() {
  const location = useLocation();

  const slug = location.pathname.split('/').filter(Boolean).pop();
  const activeId = PAGE_MAP[slug] ? slug : 'tickets';
  const PageComponent = PAGE_MAP[activeId];

  return (
    <PageShell>
      <div className="animate-in fade-in duration-200">
        <PageComponent />
      </div>
    </PageShell>
  );
}

export default SupportPage;