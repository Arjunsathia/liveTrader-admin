import React, { useState } from 'react';
import { CircleDollarSign, Edit2, Tag, Plus, CheckCircle2, PauseCircle, PlayCircle, Trash2, X, Check } from 'lucide-react';
import { feesRows, couponsRows } from '../configs/fees.config';
import { Card, SectionHead, IconBtn, Badge, FormField, TextInput, SelectInput } from '../components/PropTradingShared';
import { ActionToast } from '../../../components/ui/FeatureUI';
import { FeesTable } from '../components/FeesTable';
import { FeatureTable } from '../../../components/tables/FeatureTable';

export function FeesCouponsPage() {
  const [toast, setToast] = useState(null);
  const [couponForm, setCouponForm] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const [cf, setCf] = useState({ code: '', discount: '', type: 'PERCENT', maxUses: '', expires: '', campaign: '' });

  const couponsCols = [
    { key: 'code',     label: 'Code',     render: (v) => <code className="font-mono font-bold text-[12px] text-cyan bg-cyan/[0.07] px-2 py-0.5 rounded-[5px] border border-cyan/[0.15]">{v}</code> },
    { key: 'discount', label: 'Discount', render: (v) => <span className="font-mono font-bold text-brand">{v}</span> },
    { key: 'type',     label: 'Type',     render: (v) => <span className="text-[9.5px] font-black uppercase font-heading text-text-muted/50 border border-border/25 px-1.5 py-0.5 rounded-[4px]">{v}</span> },
    { key: 'uses',     label: 'Uses',     render: (v, r) => (
        <div>
          <div className="text-[10.5px] font-mono">{v.toLocaleString()}{r.maxUses ? <span className="text-text-muted/30"> / {r.maxUses.toLocaleString()}</span> : <span className="text-text-muted/30"> / ∞</span>}</div>
          {r.maxUses && (
            <div className="w-16 h-1 bg-white/[0.05] rounded-full mt-1">
              <div className="h-full rounded-full" style={{ width: `${Math.min((v / r.maxUses) * 100, 100)}%`, background: v >= r.maxUses ? 'var(--negative)' : 'var(--brand)' }} />
            </div>
          )}
        </div>
    )},
    { key: 'expires',  label: 'Expires',  render: (v) => <span className="font-mono text-text-muted/40">{v ?? '∞'}</span> },
    { key: 'campaign', label: 'Campaign', render: (v) => <span className="text-text-muted/55 font-heading">{v}</span> },
    { key: 'status',   label: 'Status',   render: (v) => <Badge value={v} /> },
    { key: '_actions', label: '',         render: (_, r) => (
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => showToast(`Editing ${r.code}`)} className="w-6 h-6 rounded-[5px] border border-border/25 flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer"><Edit2 size={10} /></button>
        <button onClick={() => showToast(`Deleted ${r.code}`)} className="w-6 h-6 rounded-[5px] border border-negative/20 bg-negative/5 flex items-center justify-center text-negative/50 hover:text-negative cursor-pointer"><Trash2 size={10} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <ActionToast msg={toast} />

      <FeesTable rows={feesRows} showToast={showToast} />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start">
        <Card pad={false}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/25">
            <SectionHead title="Coupon Codes" Icon={Tag} />
            <IconBtn label="New Coupon" Icon={Plus} variant="brand" small onClick={() => setCouponForm(true)} />
          </div>
          <FeatureTable cols={couponsCols} rows={couponsRows} />
        </Card>

        <Card>
          <SectionHead title={couponForm ? 'New Coupon' : 'Coupon Summary'} Icon={Tag} />
          {couponForm ? (
            <div className="space-y-3">
              <FormField label="Coupon Code">
                <TextInput value={cf.code} onChange={v => setCf(p => ({ ...p, code: v.toUpperCase() }))} placeholder="e.g. SAVE20" mono />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Discount Value">
                  <TextInput value={cf.discount} onChange={v => setCf(p => ({ ...p, discount: v }))} placeholder="20 or 30" mono />
                </FormField>
                <FormField label="Type">
                  <SelectInput value={cf.type} onChange={v => setCf(p => ({ ...p, type: v }))} options={['PERCENT', 'FLAT']} />
                </FormField>
                <FormField label="Max Uses" hint="Leave blank for unlimited">
                  <TextInput value={cf.maxUses} onChange={v => setCf(p => ({ ...p, maxUses: v }))} placeholder="500" type="number" mono />
                </FormField>
                <FormField label="Expires">
                  <TextInput value={cf.expires} onChange={v => setCf(p => ({ ...p, expires: v }))} placeholder="2024-12-31" mono />
                </FormField>
              </div>
              <FormField label="Campaign Name">
                <TextInput value={cf.campaign} onChange={v => setCf(p => ({ ...p, campaign: v }))} placeholder="Black Friday 2024" />
              </FormField>
              <div className="flex gap-2 pt-1">
                <IconBtn label="Cancel" Icon={X} variant="default" onClick={() => setCouponForm(null)} />
                <IconBtn label="Create Coupon" Icon={Check} variant="success" onClick={() => { setCouponForm(null); showToast(`Coupon ${cf.code || 'NEW'} created`); }} />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { l: 'Total Active Codes', v: '14' },
                { l: 'Redemptions (30d)', v: '1,245' },
                { l: 'Discount Volume', v: '$48,200', a: 'var(--brand)' },
                { l: 'Most Used (30d)', v: 'WINTER24 (450)' },
              ].map(i => (
                <div key={i.l} className="flex items-center justify-between p-3 rounded-[9px] border border-border/20 bg-bg/50">
                  <span className="text-[11.5px] font-semibold text-text/75">{i.l}</span>
                  <span className="text-[12.5px] font-mono font-bold" style={{ color: i.a || 'var(--text)' }}>{i.v}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
