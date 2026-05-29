import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import StrategyDetailPage from '../detail/StrategyDetailPage';
import ProviderDetailPage from '../detail/ProviderDetailPage';
import FollowerDetailPage from '../detail/FollowerDetailPage';
import SubscriptionDetailPage from '../detail/SubscriptionDetailPage';
import LogDetailPage from '../detail/LogDetailPage';

import { strategiesData } from '../configs/strategies.config';
import { providersData } from '../configs/providers.config';
import { followersData } from '../configs/followers.config';
import { subsData } from '../configs/subscriptions.config';
import { logsData } from '../configs/logs.config';

export function CopyTradingDetailPage() {
  const { slug, id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    // If slug is strategy, providers, logs, subs etc. navigate back to respective tab
    let plural = 'strategies';
    if (slug === 'provider') plural = 'providers';
    if (slug === 'follower') plural = 'followers';
    if (slug === 'subscription') plural = 'subscriptions';
    if (slug === 'log') plural = 'logs';
    navigate(`/copy-trading/${plural}`);
  };

  const handleAction = (msg, entityId) => {
    console.log(`Action on ${slug} (${entityId}): ${msg}`);
  };

  switch (slug) {
    case 'strategy': {
      const row = strategiesData.find(x => x.id === id);
      if (!row) return <div className="p-6 text-text font-heading">Strategy not found</div>;
      return <StrategyDetailPage row={row} onBack={handleBack} act={handleAction} />;
    }
    case 'provider': {
      const row = providersData.find(x => x.id === id);
      if (!row) return <div className="p-6 text-text font-heading">Provider not found</div>;
      return <ProviderDetailPage row={row} onBack={handleBack} act={handleAction} />;
    }
    case 'follower': {
      const row = followersData.find(x => x.id === id);
      if (!row) return <div className="p-6 text-text font-heading">Follower not found</div>;
      return <FollowerDetailPage row={row} onBack={handleBack} act={handleAction} />;
    }
    case 'subscription': {
      const row = subsData.find(x => x.id === id);
      if (!row) return <div className="p-6 text-text font-heading">Subscription not found</div>;
      return <SubscriptionDetailPage row={row} onBack={handleBack} act={handleAction} />;
    }
    case 'log': {
      const row = logsData.find(x => x.id === id);
      if (!row) return <div className="p-6 text-text font-heading">Log not found</div>;
      return <LogDetailPage row={row} onBack={handleBack} act={handleAction} />;
    }
    default:
      return <div className="p-6 text-text font-heading">Detail category not found</div>;
  }
}

export default CopyTradingDetailPage;
