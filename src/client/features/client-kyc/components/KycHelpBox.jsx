import React from 'react';
import { FileImage, Maximize2, LockKeyhole, LifeBuoy, CheckCircle2, XCircle, Clock3, Info } from 'lucide-react';

const TIPS = [
  {
    Icon: FileImage,
    title: 'Accepted file types',
    items: ['JPG / PNG — photos and scans', 'PDF — statements and agreements'],
  },
  {
    Icon: Maximize2,
    title: 'Image quality',
    items: ['All text clearly legible', 'All corners visible and unobstructed', 'Max 10 MB per file — no screenshots'],
  },
  {
    Icon: LockKeyhole,
    title: 'Your data is protected',
    items: ['AES-256 encryption in transit and at rest', 'Accessible only to our compliance team', 'Deleted after the mandatory retention period'],
  },
  {
    Icon: Clock3,
    title: 'Review timeline',
    items: ['Standard review: 1–3 business days', 'Complex cases: up to 5 business days', 'Email notification on every status change'],
  },
];

const DOs = ['Use original documents only', 'Ensure all four corners are visible', 'Use good natural or artificial lighting'];
const DONTs = ['No expired or cancelled documents', 'No blurry, dark, or low-contrast images', 'No cropped, edited, or altered files'];

export function KycHelpBox() {
  return (
    <div className="rounded-[12px] border border-border/35 bg-surface-elevated overflow-hidden">

      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/25">
        <div className="w-7 h-7 rounded-[8px] bg-brand/12 flex items-center justify-center">
          <Info size={13} className="text-brand" />
        </div>
        <p className="text-[12.5px] font-bold">Document help</p>
      </div>

      <div className="p-5 space-y-5">

        {/* Tips */}
        <div className="space-y-4">
          {TIPS.map(({ Icon, title, items }) => (
            <div key={title} className="flex gap-3">
              <div className="w-7 h-7 rounded-[8px] bg-brand/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={13} className="text-brand" />
              </div>
              <div>
                <p className="text-[11.5px] font-bold mb-1">{title}</p>
                <ul className="space-y-0.5">
                  {items.map((t) => (
                    <li key={t} className="text-[10.5px] text-text-muted leading-relaxed">{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Do's & Don'ts */}
        <div className="rounded-[10px] bg-muted-surface/50 border border-border/25 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-text-muted mb-3">Quick checklist</p>
          <div className="space-y-1.5">
            {DOs.map((d) => (
              <div key={d} className="flex items-start gap-2">
                <CheckCircle2 size={11} className="text-positive shrink-0 mt-0.5" />
                <span className="text-[10.5px] text-text-muted leading-relaxed">{d}</span>
              </div>
            ))}
            <div className="my-1 border-t border-border/20" />
            {DONTs.map((d) => (
              <div key={d} className="flex items-start gap-2">
                <XCircle size={11} className="text-negative shrink-0 mt-0.5" />
                <span className="text-[10.5px] text-text-muted leading-relaxed">{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Support link */}
        <a href="#/client/support/tickets/new"
          className="flex items-center gap-2.5 pt-4 border-t border-border/25 text-[11.5px] font-bold text-brand hover:opacity-75 transition-opacity">
          <div className="w-7 h-7 rounded-[8px] bg-brand/12 flex items-center justify-center">
            <LifeBuoy size={13} />
          </div>
          Contact verification support
        </a>
      </div>
    </div>
  );
}