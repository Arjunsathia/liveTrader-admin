import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { AttachmentUploader } from '../components/AttachmentUploader';
import { supportApi } from '../services/support.api';
import { PageShell } from '@/shared/components/layout/PageShell';

const CATEGORIES = ['Finance', 'KYC', 'Technical', 'Copy Trading', 'Account', 'Other'];
const PRIORITIES = [
  { value: 'LOW',  label: 'Low — general inquiry'      },
  { value: 'MED',  label: 'Medium — needs attention'   },
  { value: 'HIGH', label: 'High — urgent issue'        },
];

export function CreateTicketPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: '', category: '', priority: 'MED', message: '' });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const upd = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const isValid = form.subject.trim() && form.category && form.message.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    try {
      const ticket = await supportApi.createTicket({ ...form, attachments: files.map((f) => f.name) });
      setCreated(ticket);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success screen ── */
  if (created) {
    return (
      <PageShell className="max-w-[480px] mx-auto flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-positive/12 flex items-center justify-center mb-5 border border-positive/20">
          <CheckCircle2 size={30} className="text-positive" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-positive">Ticket created</span>
        <h1 className="font-heading font-semibold text-[24px] tracking-[-0.03em] text-text mt-2.5 mb-2">
          Ticket submitted!
        </h1>
        <p className="text-[13px] text-text-muted leading-relaxed mb-2">
          We created ticket{' '}
          <span className="font-mono font-bold text-brand">{created.id}</span>.
          Our team will respond within 4 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto">
          <button
            onClick={() => navigate(`/client/support/tickets/${created.id}`)}
            className="h-10 px-5 rounded-[9px] bg-brand text-text-on-accent text-[12.5px] font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm"
          >
            View ticket <ArrowRight size={13} />
          </button>
          <button
            onClick={() => { setCreated(null); setForm({ subject: '', category: '', priority: 'MED', message: '' }); setFiles([]); }}
            className="h-10 px-5 rounded-[9px] border border-border/40 text-[12.5px] font-bold flex items-center justify-center hover:bg-muted-surface/50 transition-colors"
          >
            Create another
          </button>
        </div>
      </PageShell>
    );
  }

  /* ── Form ── */
  return (
    <PageShell className="space-y-5 max-w-[820px] w-full mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate('/client/support/tickets')}
        className="flex items-center gap-2 text-[11.5px] font-bold text-text-muted hover:text-text transition-colors self-start cursor-pointer"
      >
        <ArrowLeft size={13} /> Back to tickets
      </button>

      {/* Header */}
      <div>
        <p className="text-section-eyebrow">Support</p>
        <h1 className="font-heading font-semibold text-[27px] tracking-[-0.04em] text-text mt-1">Create a Ticket</h1>
        <p className="text-[13px] text-text-muted mt-1">Describe your issue and we will respond as soon as possible.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-[16px] border border-border/35 bg-surface-elevated p-5 md:p-6 space-y-5 shadow-sm">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-[10.5px] font-black uppercase tracking-[0.1em] text-text-muted mb-2">
                Category <span className="text-negative">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => upd('category')(e.target.value)}
                  required
                  className="w-full h-10 pl-3 pr-8 bg-surface border border-border/35 rounded-[9px] text-[13px] text-text outline-none hover:border-border/60 focus:border-brand/60 focus:ring-4 focus:ring-brand/8 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="">Select…</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[10.5px] font-black uppercase tracking-[0.1em] text-text-muted mb-2">Priority</label>
              <div className="relative">
                <select
                  value={form.priority}
                  onChange={(e) => upd('priority')(e.target.value)}
                  className="w-full h-10 pl-3 pr-8 bg-surface border border-border/35 rounded-[9px] text-[13px] text-text outline-none hover:border-border/60 focus:border-brand/60 focus:ring-4 focus:ring-brand/8 transition-all duration-200 appearance-none cursor-pointer"
                >
                  {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[10.5px] font-black uppercase tracking-[0.1em] text-text-muted mb-2">
              Subject <span className="text-negative">*</span>
            </label>
            <input
              value={form.subject}
              onChange={(e) => upd('subject')(e.target.value)}
              placeholder="Brief description of your issue…"
              required
              className="w-full h-10 px-3 bg-surface border border-border/35 rounded-[9px] text-[13px] text-text placeholder:text-text-muted/40 outline-none hover:border-border/60 focus:border-brand/60 focus:ring-4 focus:ring-brand/8 transition-all duration-200"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-[10.5px] font-black uppercase tracking-[0.1em] text-text-muted mb-2">
              Message <span className="text-negative">*</span>
            </label>
            <textarea
              value={form.message}
              onChange={(e) => upd('message')(e.target.value)}
              placeholder="Describe your issue in detail. Include transaction IDs, dates, or any relevant information…"
              required
              rows={5}
              className="w-full px-3 py-2.5 bg-surface border border-border/35 rounded-[9px] text-[13px] text-text placeholder:text-text-muted/40 outline-none hover:border-border/60 focus:border-brand/60 focus:ring-4 focus:ring-brand/8 transition-all duration-200 resize-none"
            />
            <p className="flex items-center gap-1.5 text-[10.5px] text-text-muted/55 mt-2">
              <Info size={11} /> More detail helps us resolve your issue faster.
            </p>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-[10.5px] font-black uppercase tracking-[0.1em] text-text-muted mb-2">
              Attachments <span className="text-text-muted/40 font-normal normal-case tracking-normal">(optional)</span>
            </label>
            <AttachmentUploader files={files} onChange={setFiles} />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/client/support/tickets')}
            className="h-10 px-4 rounded-[9px] border border-border/40 text-[12.5px] font-bold hover:bg-muted-surface/50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="h-10 px-5 rounded-[9px] bg-brand text-text-on-accent text-[12.5px] font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all duration-150 cursor-pointer shadow-sm"
          >
            {submitting ? 'Submitting…' : 'Submit Ticket'}
          </button>
        </div>
      </form>
    </PageShell>
  );
}

export default CreateTicketPage;
