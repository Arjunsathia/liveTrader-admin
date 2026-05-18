import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Activity, 
  BarChart2, 
  Users, 
  ShieldAlert, 
  TrendingUp, 
  Wallet,
  Settings,
  History,
  Lock
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { DrawerSection, DrawerField, DrawerGrid } from '../../../components/overlays/DrawerUI';
import { strategiesConfig } from '../data/workspaces/strategies.workspace';
import { providersConfig } from '../data/workspaces/providers.workspace';
import { followersConfig } from '../data/workspaces/followers.workspace';
import { subscriptionsConfig } from '../data/workspaces/subscriptions.workspace';
import { performanceConfig } from '../data/workspaces/performance.workspace';

const WORKSPACE_MAP = {
  strategies: strategiesConfig,
  providers: providersConfig,
  followers: followersConfig,
  subscriptions: subscriptionsConfig,
  performance: performanceConfig,
};

export function CopyTradingDetailScreen() {
  const { slug, id } = useParams();
  const navigate = useNavigate();

  const config = WORKSPACE_MAP[slug];
  const row = useMemo(() => config?.rows?.find(r => r.id === id), [config, id]);

  if (!row) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-xl font-bold text-text">Record Not Found</h2>
        <p className="mt-2 text-text-muted">The {slug} record with ID {id} could not be located.</p>
        <Button variant="primary" className="mt-4" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-[40] -mx-4 md:-mx-8 mb-6 border-b border-white/[0.06] bg-bg/80 backdrop-blur-md px-4 md:px-8 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border/25 text-text-muted hover:bg-surface-bright/20 hover:text-text transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">
                {slug.replace(/-/g, ' ')} Detail
              </p>
              <h1 className="text-[24px] font-bold tracking-[-0.04em] text-text">{row.name || row.id}</h1>
              <p className="mt-1 text-[13px] font-medium text-text-muted/50">
                {row.provider || row.user || row.id} · {row.status} · Updated {row.lastUpdated || row.ts || 'just now'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="secondary" icon={History}>History</Button>
             <Button variant="primary" icon={Settings}>Configure</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Detailed Overview">
            <DrawerGrid>
              {Object.entries(row).map(([key, value]) => {
                if (typeof value === 'object' || key === 'id' || key === 'name') return null;
                return (
                  <DrawerField 
                    key={key} 
                    label={key.replace(/([A-Z])/g, ' $1').toUpperCase()} 
                    value={String(value)} 
                    mono={key.toLowerCase().includes('id') || key.toLowerCase().includes('vol')}
                  />
                );
              })}
            </DrawerGrid>
          </Card>

          <Card title="Performance Analytics">
             <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border/10 rounded-[12px] bg-bg/20">
                <BarChart2 size={32} className="text-text-muted/20 mb-4" />
                <p className="text-[13px] text-text-muted/40 uppercase tracking-widest font-bold">Performance Visualization</p>
                <p className="mt-2 text-[12px] text-text-muted/25">Detailed equity and ROI charts are available in the performance module.</p>
             </div>
          </Card>
        </div>

        <div className="space-y-6">
           <Card title="Operational Controls">
              <div className="space-y-2">
                 <Button variant="secondary" className="w-full justify-start gap-3" icon={Activity}>
                    Monitor Execution
                 </Button>
                 <Button variant="secondary" className="w-full justify-start gap-3" icon={Users}>
                    View Followers
                 </Button>
                 <Button variant="secondary" className="w-full justify-start gap-3" icon={ShieldAlert}>
                    Risk Assessment
                 </Button>
                 <div className="pt-2 border-t border-border/10">
                    <Button variant="danger" className="w-full justify-start gap-3" icon={Lock}>
                       Emergency Stop
                    </Button>
                 </div>
              </div>
           </Card>

           <Card title="System Context">
              <div className="space-y-4">
                 <DrawerSection title="Record Metadata" />
                 <DrawerGrid cols={1}>
                    <DrawerField label="Registry ID" value={row.id} mono />
                    <DrawerField label="Slug Reference" value={slug} mono />
                    <DrawerField label="Data Integrity" value="VERIFIED" accent="var(--positive)" />
                 </DrawerGrid>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

