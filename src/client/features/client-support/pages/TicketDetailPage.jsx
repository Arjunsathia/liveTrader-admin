import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, User, Clock } from 'lucide-react';

const MOCK_THREAD = [
  { id: 'm1', author: 'John Doe',       role: 'client', time: 'Jun 2, 2026 · 10:14 AM', body: 'Hi, my withdrawal has been pending for 3 days now. Transaction ID: WD-2026-0482. Could you please look into this?' },
  { id: 'm2', author: 'Support Agent',  role: 'agent',  time: 'Jun 2, 2026 · 11:30 AM', body: 'Hi John! Thank you for reaching out. We\'ve located your withdrawal request WD-2026-0482 and have escalated it to our finance team. You should receive an update within 24 hours. We apologize for the delay.' },
  { id: 'm3', author: 'John Doe',       role: 'client', time: 'Jun 2, 2026 · 12:00 PM', body: 'Thank you for the quick response! I\'ll wait for the update.' },
];

export function ClientTicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState(MOCK_THREAD);

  const handleSend = () => {
    if (!reply.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id:     `m${Date.now()}`,
        author: 'You',
        role:   'client',
        time:   'Just now',
        body:   reply.trim(),
      },
    ]);
    setReply('');
  };

  return (
    <div className="space-y-5 animate-fade-up max-w-[720px]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/client/support/tickets')}
          className="w-8 h-8 rounded-[8px] flex items-center justify-center transition-all duration-150 cursor-pointer hover:bg-white/[0.04]"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          <ArrowLeft size={14} strokeWidth={2} />
        </button>
        <div>
          <p className="text-[10.5px] font-black uppercase tracking-[0.2em] text-text-muted/40">Ticket {id}</p>
          <h1 className="font-heading font-bold text-[18px] tracking-[-0.03em] text-text">Withdrawal delayed for 3 days</h1>
        </div>
      </div>

      {/* Status bar */}
      <div
        className="rounded-[11px] px-4 py-3 flex items-center gap-4 flex-wrap"
        style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)' }}
      >
        {[
          { label: 'Status',   value: 'Open',    color: 'negative' },
          { label: 'Priority', value: 'High',    color: 'negative' },
          { label: 'Opened',   value: 'Jun 2, 2026' },
          { label: 'Category', value: 'Withdrawals' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-text-muted/40">{label}</span>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-[5px]"
              style={color
                ? { background: `color-mix(in srgb, var(--${color}) 10%, transparent)`, color: `var(--${color})` }
                : { color: 'var(--text)', fontWeight: 600 }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Message thread */}
      <div className="rounded-[14px] overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex flex-col gap-0">
          {messages.map((msg, i) => {
            const isAgent = msg.role === 'agent';
            return (
              <div
                key={msg.id}
                className="px-5 py-4"
                style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)', background: isAgent ? 'color-mix(in srgb, var(--brand) 3%, var(--surface))' : 'transparent' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                    style={{
                      background: isAgent ? 'color-mix(in srgb, var(--brand) 15%, transparent)' : 'color-mix(in srgb, var(--cyan) 12%, transparent)',
                      color:      isAgent ? 'var(--brand)' : 'var(--cyan)',
                    }}
                  >
                    {isAgent ? 'S' : <User size={12} strokeWidth={2} />}
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[13px] font-semibold text-text truncate">{msg.author}</span>
                    {isAgent && (
                      <span
                        className="text-[9px] font-black uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-[4px] shrink-0"
                        style={{ background: 'color-mix(in srgb, var(--brand) 10%, transparent)', color: 'var(--brand)' }}
                      >
                        Support
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-text-muted/40 shrink-0">
                      <Clock size={10} /> {msg.time}
                    </span>
                  </div>
                </div>
                <p className="text-[13.5px] leading-relaxed text-text-muted/80 ml-10">{msg.body}</p>
              </div>
            );
          })}
        </div>

        {/* Reply input */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)', background: 'var(--muted-surface)' }}>
          <div className="flex gap-3">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleSend(); }}
              placeholder="Write a reply… (Ctrl+Enter to send)"
              rows={3}
              className="flex-1 px-3.5 py-2.5 rounded-[9px] text-[13.5px] outline-none transition-all duration-200 resize-none"
              style={{ background: 'var(--surface)', border: '1px solid rgba(173,198,255,0.08)', color: 'var(--text)', caretColor: 'var(--brand)' }}
            />
            <button
              onClick={handleSend}
              disabled={!reply.trim()}
              className="w-11 h-11 rounded-[9px] flex items-center justify-center self-end transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              style={{ background: 'var(--brand)', color: 'var(--text-on-accent)' }}
              aria-label="Send reply"
            >
              <Send size={16} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
