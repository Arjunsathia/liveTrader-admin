import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageShell } from '../../../layout/PageShell';
import { NAV_ITEMS } from '../configs/shared.config';

// Import sub-pages
import { IBOverviewPage } from './IBOverviewPage';
import { ReferralsPage } from './ReferralsPage';
import { CommissionsPage } from './CommissionsPage';
import { PayoutsPage } from './PayoutsPage';
import { IBPerformancePage } from './IBPerformancePage';
import { PartnerTreePage } from './PartnerTreePage';

export function IBSystemPage() {
  const location = useLocation();
  const [page, setPage] = useState('overview');

  useEffect(() => {
    const slug = location.pathname.split('/').filter(Boolean).pop();
    const item = NAV_ITEMS.find(n => n.id === slug);
    setPage(item?.id ?? 'overview');
  }, [location.pathname]);

  const renderPage = () => {
    switch (page) {
      case 'overview':     return <IBOverviewPage />;
      case 'referrals':    return <ReferralsPage />;
      case 'commissions':  return <CommissionsPage />;
      case 'payouts':      return <PayoutsPage />;
      case 'performance':  return <IBPerformancePage />;
      case 'tree':         return <PartnerTreePage />;
      default:             return <IBOverviewPage />;
    }
  };

  return (
    <PageShell>
      <div className="space-y-5">
        {renderPage()}
      </div>
    </PageShell>
  );
}

export default IBSystemPage;