import React from 'react';
import { PageShell } from '../../../layout/PageShell';

/**
 * CopyTradingLayout — simple page wrapper.
 * Sub-navigation is handled entirely by the sidebar (navigation.js).
 * No tab bar needed here.
 */
export function CopyTradingLayout({ children }) {
  return (
    <PageShell>
      <div className="space-y-5">
        {children}
      </div>
    </PageShell>
  );
}
