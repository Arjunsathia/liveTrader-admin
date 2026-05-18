import React from 'react';
import { PageShell } from '../../../components/common/PageShell';

export function TradingLayout({ children }) {
  return (
    <PageShell title="Trading Operations">
      <div className="space-y-6">
        {children}
      </div>
    </PageShell>
  );
}
