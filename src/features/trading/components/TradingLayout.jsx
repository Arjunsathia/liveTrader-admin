import React from 'react';
import { PageShell } from '../../../components/common/PageShell';

export function TradingLayout({ children }) {
  return (
    <PageShell>
      <div className="space-y-6 animate-fade-up">
        {children}
      </div>
    </PageShell>
  );
}
