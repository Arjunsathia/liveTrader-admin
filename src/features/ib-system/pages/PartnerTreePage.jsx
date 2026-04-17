import React, { useState, useMemo } from 'react';
import { CircleDollarSign, Download, UserPlus } from 'lucide-react';
import { PageToolbar } from '../../../components/toolbar/PageToolbar';
import { IBCard, SectionHead } from '../components/IBSystemShared';
import { TreeNode, TreeDetailPanel } from '../components/PartnerTree';
import { partnerTree } from '../configs/tree.config';
import { TIER_CLR } from '../configs/shared.config';

export function PartnerTreePage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filterTree = (nodes, q) => {
    if (!q) return nodes;
    return nodes
      .map(n => ({ ...n, subIBs: filterTree(n.subIBs, q) }))
      .filter(n => n.name.toLowerCase().includes(q.toLowerCase()) || n.id.includes(q) || n.subIBs.length > 0);
  };
  const visibleTree = useMemo(() => filterTree(partnerTree, search), [search]);
  const countNodes  = (nodes) => nodes.reduce((s, n) => s + 1 + countNodes(n.subIBs), 0);

  return (
    <div className="space-y-4">
      <PageToolbar
        search={search} onSearchChange={setSearch} placeholder="Search partner name or ID…"
        showFilters={false}
        actions={[
          { label: 'Export Network', icon: Download,  onClick: () => {} },
          { label: 'Add IB',         icon: UserPlus,  variant: 'primary', onClick: () => {} },
        ]}
      />
      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'Top-Level IBs',   val: partnerTree.length, color: 'var(--brand)' },
          { label: 'Total Nodes',     val: countNodes(partnerTree), color: 'var(--cyan)' },
          { label: 'Total Referrals', val: partnerTree.reduce((s, n) => s + n.referrals, 0).toLocaleString(), color: 'var(--positive)' },
          { label: 'Max Depth',       val: '3 levels', color: 'var(--warning)' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 rounded-[8px] border border-border/30 bg-bg/60 px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-[11px] text-text-muted/50 font-heading">{s.label}</span>
            <span className="text-[11px] font-mono font-bold" style={{ color: s.color }}>{s.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-4 items-start">
        <IBCard pad={false}>
          <div className="flex items-center px-4 py-2.5 border-b border-border/30 text-[9.5px] font-black uppercase tracking-[0.12em] text-text-muted/50 font-heading bg-bg/40">
            <div className="w-5 mr-2 flex-shrink-0" /><div className="w-8 mr-3 flex-shrink-0" />
            <div className="min-w-[160px] flex-shrink-0 mr-4">Partner</div>
            <div className="hidden md:flex items-center gap-3 flex-1">
              <div className="w-24">Tier</div><div className="w-20">Referrals</div>
              <div className="w-24">Commission</div><div className="w-20">Share</div>
            </div>
          </div>
          <div className="p-2 max-h-[620px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
            {visibleTree.length === 0
              ? <div className="py-10 text-center text-text-muted/30 text-[12px] font-heading">No results for "{search}"</div>
              : visibleTree.map(node => <TreeNode key={node.id} node={node} depth={0} selectedId={selected?.id} onSelect={setSelected} />)
            }
          </div>
        </IBCard>
        <div className="xl:sticky xl:top-24">
          <TreeDetailPanel node={selected} onClose={() => setSelected(null)} />
        </div>
      </div>

      <IBCard>
        <SectionHead title="Commission Flow Logic" Icon={CircleDollarSign} />
        <div className="flex flex-wrap gap-3">
          {[
            { tier: 'PLATINUM', share: '35%', color: TIER_CLR.PLATINUM },
            { tier: 'GOLD',     share: '30%', color: TIER_CLR.GOLD     },
            { tier: 'SILVER',   share: '25%', color: TIER_CLR.SILVER   },
            { tier: 'BRONZE',   share: '20%', color: TIER_CLR.BRONZE   },
            { tier: 'BASIC',    share: '15%', color: TIER_CLR.BASIC    },
          ].map(t => (
            <div key={t.tier} className="flex items-center gap-2 rounded-[8px] border border-border/30 bg-bg/60 px-3 py-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
              <span className="text-[11.5px] font-heading font-semibold" style={{ color: t.color }}>{t.tier}</span>
              <span className="text-text-muted/40 text-[11px]">→</span>
              <span className="font-mono font-bold text-brand text-[11px]">{t.share}</span>
              <span className="text-text-muted/30 text-[10.5px]">rev. share</span>
            </div>
          ))}
        </div>
      </IBCard>
    </div>
  );
}
