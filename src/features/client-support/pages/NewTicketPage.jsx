import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Paperclip } from 'lucide-react';

const CATEGORIES = [
  'Deposits & Payments',
  'Withdrawals',
  'Account Verification (KYC)',
  'Trading Issues',
  'Technical Support',
  'Copy Trading',
  'Prop Trading',
  'Other',
];

export function NewTicketPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [subject, setSubject]   = useState('');
  const [message, setMessage]   = useState('');

  const valid = category && subject.trim().length > 5 && message.trim().length > 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    // Would call API — navigate back on mock success
    navigate('/client/support/tickets');
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-[680px]">
      <div>
        <p className="text-[10.5px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">Help & Support</p>
        <h1 className="font-heading font-semibold text-[26px] tracking-[-0.03em] leading-tight text-text mt-0.5">Open a Support Ticket</h1>
        <p className="text-[13.5px] text-text-muted mt-1">Our support team typically responds within 8 hours.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Category */}
        <div
          className="rounded-[14px] p-5 space-y-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h2 className="font-heading font-bold text-[15px] tracking-[-0.03em] text-text">Ticket Details</h2>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-2" style={{ color: 'var(--text-muted)' }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3.5 rounded-[9px] text-[13.5px] font-medium outline-none transition-all duration-200 appearance-none cursor-pointer"
              style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)', color: category ? 'var(--text)' : 'var(--text-muted)' }}
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-2" style={{ color: 'var(--text-muted)' }}>
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full h-10 px-3.5 rounded-[9px] text-[13.5px] outline-none transition-all duration-200"
              style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)', color: 'var(--text)', caretColor: 'var(--brand)' }}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-2" style={{ color: 'var(--text-muted)' }}>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail…"
              rows={6}
              className="w-full px-3.5 py-3 rounded-[9px] text-[13.5px] outline-none transition-all duration-200 resize-none"
              style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)', color: 'var(--text)', caretColor: 'var(--brand)' }}
            />
          </div>

          {/* Attachment hint */}
          <div
            className="flex items-center gap-2.5 p-3.5 rounded-[9px] cursor-pointer hover:bg-text/[0.02] transition-colors"
            style={{ background: 'color-mix(in srgb, var(--brand) 4%, transparent)', border: '1px dashed var(--border)' }}
          >
            <Paperclip size={14} strokeWidth={2} style={{ color: 'var(--text-muted)' }} />
            <span className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>Attach screenshots or documents (optional, max 5MB)</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!valid}
            className="h-11 px-6 rounded-[10px] font-bold text-[13.5px] transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ background: 'var(--brand)', color: 'var(--text-on-accent)' }}
          >
            <ChevronRight size={15} strokeWidth={2.5} />
            Submit Ticket
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-11 px-5 rounded-[10px] font-semibold text-[13px] transition-all duration-200 cursor-pointer"
            style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
