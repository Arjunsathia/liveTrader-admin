import React, { useState } from 'react';
import { CircleDollarSign, Edit2, Tag, Plus, CheckCircle2, PauseCircle, PlayCircle, Trash2, X, Check } from 'lucide-react';
import { feesRows, couponsRows } from '../configs/fees.config';
import { Card, SectionHead, IconBtn, Badge, FormField, TextInput, SelectInput } from '../components/PropShared';
import { FeesTable } from '../components/FeesTable';

export function FeesCouponsPage() {
  const [toast, setToast] = useState(null);
  const [couponForm, setCouponForm] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const [cf, setCf] = useState({ code: '', discount: '', type: 'PERCENT', maxUses: '', expires: '', campaign: '' });

  return (
    <div className="space-y-6">
      {toast && (
        <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading">
          <CheckCircle2 size={13} />{toast}
        </div>
      )}

      <FeesTable rows={feesRows} showToast={showToast} />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start">
        <Card pad={false}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
            <SectionHead title="Coupon Codes" Icon={Tag} />
            <IconBtn label="New Coupon" Icon={Plus} variant="brand" small onClick={() => setCouponForm(true)} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {['Code', 'Discount', 'Type', 'Uses', 'Expires', 'Campaign', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[9.5px] font-black uppercase tracking-[0.12em] text-text-muted/30 font-heading">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {couponsRows.map(r => (
                  <tr key={r.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                    <td className="px-4 py-3">
                      <code className="font-mono font-bold text-[12px] text-cyan bg-cyan/[0.07] px-2 py-0.5 rounded-[5px] border border-cyan/[0.15]">{r.code}</code>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-brand">{r.discount}</td>
                    <td className="px-4 py-3">
                      <span className="text-[9.5px] font-black uppercase font-heading text-text-muted/50 border border-white/[0.06] px-1.5 py-0.5 rounded-[4px]">{r.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[10.5px] font-mono">{r.uses.toLocaleString()}{r.maxUses ? <span className="text-text-muted/30"> / {r.maxUses.toLocaleString()}</span> : <span className="text-text-muted/30"> / ∞</span>}</div>
                      {r.maxUses && (
                        <div className="w-16 h-1 bg-white/[0.05] rounded-full mt-1">
                          <div className="h-full rounded-full" style={{ width: `${Math.min((r.uses / r.maxUses) * 100, 100)}%`, background: r.uses >= r.maxUses ? 'var(--negative)' : 'var(--brand)' }} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-text-muted/40">{r.expires ?? '∞'}</td>
                    <td className="px-4 py-3 text-text-muted/55 font-heading">{r.campaign}</td>
                    <td className="px-4 py-3"><Badge value={r.status} /></td>
                    <td className="px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <button onClick={() => showToast(`Editing ${r.code}`)} className="w-6 h-6 rounded-[5px] border border-white/[0.08] flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer"><Edit2 size={10} /></button>
                        <button onClick={() => showToast(`Deleted ${r.code}`)} className="w-6 h-6 rounded-[5px] border border-negative/[0.15] flex items-center justify-center text-negative/50 hover:text-negative cursor-pointer"><Trash2 size={10} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                { label: 'Active Coupons', val: couponsRows.filter(r => r.status === 'ACTIVE').length, color: 'var(--positive)' },
                { label: 'Total Uses', val: couponsRows.reduce((s, r) => s + r.uses, 0).toLocaleString(), color: 'var(--brand)' },
                { label: 'Expiring Soon', val: couponsRows.filter(r => r.status === 'EXPIRING').length, color: 'var(--warning)' },
                { label: 'Expired', val: couponsRows.filter(r => r.status === 'EXPIRED').length, color: 'var(--text-muted)' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-[12px] font-heading font-semibold text-text/60">{s.label}</span>
                  <span className="font-mono font-bold text-[14px]" style={{ color: s.color }}>{s.val}</span>
                </div>
              ))}
              <button onClick={() => setCouponForm(true)} className="w-full flex items-center justify-center gap-1.5 h-8 rounded-[8px] border border-primary/20 bg-primary/[0.07] text-primary text-[11px] font-bold font-heading cursor-pointer hover:brightness-110 transition-all mt-2">
                <Plus size={12} /> New Coupon
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
