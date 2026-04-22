import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PieChart, Layers, Clipboard, Trophy, BarChart2, Tag, Shield } from 'lucide-react';
import { PageShell } from '../../../components/common/PageShell';
import { PropOverviewScreen } from './PropOverviewScreen';
import { ChallengeConfigurationsScreen } from './ChallengeConfigurationsScreen';
import { EvaluationRequestsScreen } from './EvaluationRequestsScreen';
import { FundedAccountsScreen } from './FundedAccountsScreen';
import { StatisticsScreen } from './StatisticsScreen';
import { FeesCouponsScreen } from './FeesCouponsScreen';
import { RulesRiskSettingsScreen } from './RulesRiskSettingsScreen';

const NAV_ITEMS = [
  { id: 'overview', path: '/prop-trading', label: 'Overview', Icon: PieChart },
  { id: 'challenges', path: '/prop-trading/challenge-configurations', label: 'Challenge Config.', Icon: Layers },
  { id: 'evaluations', path: '/prop-trading/evaluation-requests', label: 'Evaluation Requests', Icon: Clipboard, badge: 247 },
  { id: 'funded', path: '/prop-trading/funded-accounts', label: 'Funded Accounts', Icon: Trophy },
  { id: 'statistics', path: '/prop-trading/statistics', label: 'Statistics', Icon: BarChart2 },
  { id: 'fees', path: '/prop-trading/fees-coupons', label: 'Fees & Coupons', Icon: Tag },
  { id: 'rules', path: '/prop-trading/rules-risk', label: 'Rules / Risk', Icon: Shield },
];

const PAGE_TITLES = {
  overview: 'Prop Trading Overview',
  challenges: 'Challenge Configurations',
  evaluations: 'Evaluation Requests',
  funded: 'Funded Accounts',
  statistics: 'Statistics & Analytics',
  fees: 'Fees & Coupons',
  rules: 'Rules & Risk Settings',
};

export function PropTradingScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState('overview');

  useEffect(() => {
    const item = NAV_ITEMS.find(n => n.path === location.pathname);
    if (item) setPage(item.id);
    else if (location.pathname === '/prop-trading/') setPage('overview');
  }, [location.pathname]);

  const renderScreen = () => {
    switch (page) {
      case 'overview': return <PropOverviewScreen />;
      case 'challenges': return <ChallengeConfigurationsScreen />;
      case 'evaluations': return <EvaluationRequestsScreen />;
      case 'funded': return <FundedAccountsScreen />;
      case 'statistics': return <StatisticsScreen />;
      case 'fees': return <FeesCouponsScreen />;
      case 'rules': return <RulesRiskSettingsScreen />;
      default: return null;
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

export default PropTradingScreen;
