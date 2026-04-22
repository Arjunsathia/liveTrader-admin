import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageShell } from '../../../components/common/PageShell';
import { NAV_ITEMS } from '../data/workspaces/shared.workspace';

// Import sub-pages
import { IBOverviewScreen } from './IBOverviewScreen';
import { ReferralsScreen } from './ReferralsScreen';
import { CommissionsScreen } from './CommissionsScreen';
import { PayoutsScreen } from './PayoutsScreen';
import { IBPerformanceScreen } from './IBPerformanceScreen';
import { PartnerTreeScreen } from './PartnerTreeScreen';

export function IBSystemScreen() {
  const location = useLocation();
  const [page, setPage] = useState('overview');

  useEffect(() => {
    const slug = location.pathname.split('/').filter(Boolean).pop();
    const item = NAV_ITEMS.find(n => n.id === slug);
    setPage(item?.id ?? 'overview');
  }, [location.pathname]);

  const renderScreen = () => {
    switch (page) {
      case 'overview':     return <IBOverviewScreen />;
      case 'referrals':    return <ReferralsScreen />;
      case 'commissions':  return <CommissionsScreen />;
      case 'payouts':      return <PayoutsScreen />;
      case 'performance':  return <IBPerformanceScreen />;
      case 'tree':         return <PartnerTreeScreen />;
      default:             return <IBOverviewScreen />;
    }
  };

  return (
    <PageShell>
      <div className="space-y-5">
        {renderScreen()}
      </div>
    </PageShell>
  );
}

export default IBSystemScreen;
