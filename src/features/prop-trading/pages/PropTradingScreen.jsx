import React from 'react';
import { useLocation } from 'react-router-dom';
import { PieChart, Layers, Clipboard, Trophy, BarChart2, Tag, Shield } from 'lucide-react';
import { PageShell } from '@components/common/PageShell';
import { PropOverviewScreen }          from './PropOverviewScreen';
import { ChallengeConfigurationsScreen } from './ChallengeConfigurationsScreen';
import { EvaluationRequestsScreen }    from './EvaluationRequestsScreen';
import { FundedAccountsScreen }        from './FundedAccountsScreen';
import { StatisticsScreen }            from './StatisticsScreen';
import { FeesCouponsScreen }           from './FeesCouponsScreen';
import { RulesRiskSettingsScreen }     from './RulesRiskSettingsScreen';

const NAV_ITEMS = [
  { id: 'overview',    path: '/prop-trading',                       label: 'Overview',           Icon: PieChart  },
  { id: 'challenges',  path: '/prop-trading/challenge-configurations', label: 'Challenge Config.',  Icon: Layers    },
  { id: 'evaluations', path: '/prop-trading/evaluation-requests',   label: 'Evaluation Requests', Icon: Clipboard, badge: 247 },
  { id: 'funded',      path: '/prop-trading/funded-accounts',       label: 'Funded Accounts',    Icon: Trophy    },
  { id: 'statistics',  path: '/prop-trading/statistics',            label: 'Statistics',          Icon: BarChart2 },
  { id: 'fees',        path: '/prop-trading/fees-coupons',          label: 'Fees & Coupons',      Icon: Tag       },
  { id: 'rules',       path: '/prop-trading/rules-risk',            label: 'Rules / Risk',        Icon: Shield    },
];

const PAGE_MAP = {
  overview:    PropOverviewScreen,
  challenges:  ChallengeConfigurationsScreen,
  evaluations: EvaluationRequestsScreen,
  funded:      FundedAccountsScreen,
  statistics:  StatisticsScreen,
  fees:        FeesCouponsScreen,
  rules:       RulesRiskSettingsScreen,
};

export function PropTradingScreen() {
  const location = useLocation();

  const found = NAV_ITEMS.find((n) => n.path === location.pathname);
  const activeId = found?.id ?? 'overview';

  const PageComponent = PAGE_MAP[activeId] ?? PropOverviewScreen;

  return (
    <PageShell className="!pt-0">
    
      {/* ── Active page ── */}
      <div className="space-y-5 animate-in fade-in duration-200">
        <PageComponent />
      </div>
    </PageShell>
  );
}

export default PropTradingScreen;;
