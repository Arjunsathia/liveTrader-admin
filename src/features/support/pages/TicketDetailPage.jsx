import React, { useState, useRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowUp, Bookmark, Check, CheckCircle2,
  ChevronDown, ChevronRight, ClipboardList, CreditCard,
  Download, ExternalLink, FileText, Hash, Link,
  Lock, MapPin, MessageCircle, MessageSquare, Paperclip,
  RefreshCw, Send, ShieldAlert, Timer, User,
  UserPlus, XCircle, CalendarDays,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ticketsData, ticketConversation, relatedTickets } from '@/config/constants/support/mockData';
import {
  KYC_CLR, WALL_CLR, TRADE_CLR,
  PriorityBadge, SupportStatusBadge, CatTag, SlaBar,
  UserAvatar, SupportSectionHead, SupportIconBtn, SupportToast, SlaCheckRow,
} from '@/features/support/components/SupportComponents';

/* ── Message style map ──────────────────────────────────── */
const MSG_STYLES = {
  user:     { bg: 'var(--bg)',              border: 'var(--border)',          nameColor: 'var(--text)' },
  agent:    { bg: 'color-mix(in srgb,var(--brand) 4%,transparent)',   border: 'color-mix(in srgb,var(--brand) 12%,transparent)',   nameColor: 'var(--brand)' },
  internal: { bg: 'color-mix(in srgb,#a78bfa 5%,transparent)',        border: 'color-mix(in srgb,#a78bfa 15%,transparent)',        nameColor: '#a78bfa' },
  system:   { bg: 'var(--surface)',         border: 'var(--border)',          nameColor: 'var(--text-muted)' },
};

const AGENTS = ['Marcus Webb', 'Priya Sharma', 'Lena Fischer', 'Dev Kapoor', 'Keiran Lynch'];

export function TicketDetailPage() {
  const { ticketId }  = useParams();
  const navigate      = useNavigate();

  /* ── Find ticket ── */
  const ticket = ticketsData.find((t) => t.id === ticketId);
  if (!ticket) return <Navigate to="/support/tickets" replace />;

  return <TicketDetail ticket={ticket} onBack={() => navigate('/support/tickets')} navigate={navigate} />;
}

/** Separated so hooks are always called with a valid ticket */
function TicketDetail({ ticket: t, onBack, navigate }) {
  const [messages,     setMessages]     = useState(ticketConversation);
  const [replyText,    setReplyText]    = useState('');
  const [noteType,     setNoteType]     = useState('REPLY');
  const [status,       setStatus]       = useState(t.status);
  const [owner,        setOwner]        = useState(t.owner);
  const [showAssign,   setShowAssign]   = useState(false);
  const [toast,        setToast]        = useState(null);
  const bottomRef = useRef(null);

  const act = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const sendReply = () => {
    if (!replyText.trim()) return;
    setMessages((p) => [
      ...p,
      {
        id:     `MSG-${Date.now()}`,
        type:   noteType === 'REPLY' ? 'agent' : 'internal',
        author: 'Arjun Ravi',
        role:   'Super Admin',
        ts:     new Date().toLocaleString('en-GB').replace(',', ''),
        body:   replyText.trim(),
      },
    ]);
    setReplyText('');
    act(noteType === 'REPLY' ? 'Reply sent to user' : 'Internal note saved');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <PageShell className="!pt-0">
      {/* ── Breadcrumb back ── */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold font-heading text-text-muted/45 hover:text-text transition-colors cursor-pointer mb-4"
      >
        <ArrowLeft size={13} />Back to Tickets
      </button>

      <SupportToast msg={toast} onDone={() => setToast(null)} />

      {/* ── Sticky detail header ── */}
      <div
        className="sticky top-[68px] z-20 -mx-6 px-6 py-3 mb-5 border-b border-border/20"
        style={{ backgroundColor: 'var(--bg)', backdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-start gap-4 flex-wrap">
          {/* Title block */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-text-muted/40 text-[11px]">{t.id}</span>
              <PriorityBadge value={t.priority} size="lg" />
              <SupportStatusBadge value={status} size="lg" />
              <CatTag value={t.category} />
            </div>
            <h1 className="text-[17px] font-bold tracking-[-0.025em] text-text font-heading leading-tight truncate max-w-[640px]">
              {t.subject}
            </h1>
            <div className="flex items-center gap-3 mt-1 text-[11px] text-text-muted/40 font-heading flex-wrap">
              <span className="flex items-center gap-1"><User size={10} />{t.user}</span>
              <span className="flex items-center gap-1"><Hash size={10} />{t.uid}</span>
              <span className="flex items-center gap-1"><MapPin size={10} />{t.region}</span>
              <span className="flex items-center gap-1"><CalendarDays size={10} />Opened {t.created}</span>
              <span className="flex items-center gap-1"><MessageCircle size={10} />{messages.filter((m) => m.type !== 'system').length} messages</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {/* Assign dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAssign((p) => !p)}
                className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[11px] font-semibold font-heading border border-border/30 bg-bg/40 text-text-muted/70 hover:text-text hover:border-border/50 cursor-pointer transition-all"
              >
                <UserPlus size={12} />Assign<ChevronDown size={10} className="opacity-50" />
              </button>
              {showAssign && (
                <div
                  className="absolute right-0 top-full mt-1 z-50 rounded-[10px] border border-border/30 py-1.5 min-w-[180px]"
                  style={{ background: 'var(--surface-elevated)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}
                >
                  {AGENTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => { setOwner(a); setShowAssign(false); act(`Assigned to ${a}`); }}
                      className={`w-full text-left px-3.5 py-2 text-[12px] font-heading font-semibold transition-colors hover:bg-bg/60 cursor-pointer ${owner === a ? 'text-primary' : 'text-text/70'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <SupportIconBtn label="Escalate" Icon={ArrowUp} variant="orange"
              onClick={() => act('Escalated')} />
            {status === 'OPEN' || status === 'PENDING'
              ? <SupportIconBtn label="Resolve" Icon={CheckCircle2} variant="success"
                  onClick={() => { setStatus('RESOLVED'); act('Ticket resolved'); }} />
              : <SupportIconBtn label="Reopen" Icon={RefreshCw} variant="warning"
                  onClick={() => { setStatus('OPEN'); act('Ticket reopened'); }} />
            }
            <SupportIconBtn label="Close" Icon={XCircle} variant="danger"
              onClick={() => { setStatus('CLOSED'); act('Ticket closed'); }} />
          </div>
        </div>
      </div>

      {/* ── 2-col layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_300px] gap-5 items-start">

        {/* ── LEFT: Timeline + Reply + Attachments ── */}
        <div className="space-y-4">

          {/* Conversation timeline */}
          <Card padding={false}>
            <div className="px-5 py-4 border-b border-border/15">
              <SupportSectionHead title="Conversation Timeline" Icon={MessageCircle} />
            </div>
            <div className="p-5 space-y-3 max-h-[520px] overflow-y-auto no-scrollbar">
              {messages.map((msg) => {
                const style     = MSG_STYLES[msg.type] ?? MSG_STYLES.agent;
                const isSystem   = msg.type === 'system';
                const isInternal = msg.type === 'internal';
                return (
                  <div
                    key={msg.id}
                    className={`rounded-[10px] border px-4 py-3.5 ${isSystem ? 'border-dashed' : ''}`}
                    style={{ background: style.bg, borderColor: style.border }}
                  >
                    {!isSystem && (
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar name={msg.author === 'System' ? 'SY' : msg.author} />
                          <div>
                            <span className="text-[12px] font-bold font-heading" style={{ color: style.nameColor }}>{msg.author}</span>
                            {msg.role && <span className="text-[10px] text-text-muted/35 font-heading ml-2">{msg.role}</span>}
                            {isInternal && (
                              <span className="ml-2 text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-[4px] font-heading"
                                style={{ color: '#a78bfa', background: 'color-mix(in srgb,#a78bfa 10%,transparent)', border: '1px solid color-mix(in srgb,#a78bfa 20%,transparent)' }}>
                                INTERNAL
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-text-muted/30">{msg.ts}</span>
                      </div>
                    )}
                    <p className={`font-heading leading-relaxed ${isSystem ? 'text-[10.5px] text-text-muted/35 text-center italic' : 'text-[12.5px] text-text/70'}`}>
                      {msg.body}
                    </p>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          </Card>

          {/* Reply box */}
          <Card>
            <div className="flex gap-2 mb-3">
              {[['REPLY', 'Reply to User', 'var(--brand)'], ['INTERNAL', 'Internal Note', '#a78bfa']].map(([type, label, color]) => (
                <button
                  key={type}
                  onClick={() => setNoteType(type)}
                  className="px-3 h-7 rounded-[7px] text-[11px] font-bold font-heading cursor-pointer transition-all border"
                  style={noteType === type
                    ? { color, background: `color-mix(in srgb, ${color} 12%, transparent)`, borderColor: `color-mix(in srgb, ${color} 25%, transparent)` }
                    : { color: 'var(--text-muted)', opacity: 0.5, background: 'transparent', borderColor: 'var(--border)' }}
                >
                  {label}
                </button>
              ))}
            </div>
            <textarea
              id="reply-box"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={noteType === 'REPLY' ? 'Write a reply to the user…' : 'Write an internal note (not visible to user)…'}
              rows={5}
              className="w-full rounded-[10px] border border-border/30 bg-bg/40 px-4 py-3 text-[13px] text-text font-heading outline-none placeholder:text-text-muted/25 focus:border-primary/30 resize-none transition-colors"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-[10.5px] text-text-muted/35 hover:text-text-muted font-heading cursor-pointer transition-colors">
                  <Paperclip size={11} />Attach
                </button>
                <button className="flex items-center gap-1.5 text-[10.5px] text-text-muted/35 hover:text-text-muted font-heading cursor-pointer transition-colors">
                  <Bookmark size={11} />Templates
                </button>
              </div>
              <div className="flex gap-2">
                <SupportIconBtn label="Save Draft" Icon={FileText} variant="default" small onClick={() => act('Draft saved')} />
                <button
                  onClick={sendReply}
                  disabled={!replyText.trim()}
                  className="flex items-center gap-1.5 h-7 px-3 rounded-[7px] text-[10.5px] font-bold font-heading border cursor-pointer transition-all disabled:opacity-30"
                  style={noteType === 'REPLY'
                    ? { background: 'var(--brand)', color: '#000', border: '1px solid color-mix(in srgb,var(--brand) 40%,transparent)' }
                    : { background: 'color-mix(in srgb,#a78bfa 12%,transparent)', color: '#a78bfa', border: '1px solid color-mix(in srgb,#a78bfa 25%,transparent)' }}
                >
                  <Send size={10} />{noteType === 'REPLY' ? 'Send Reply' : 'Save Note'}
                </button>
              </div>
            </div>
          </Card>

          {/* Attachments */}
          <Card>
            <SupportSectionHead title="Attachments" Icon={Paperclip}
              action={<button className="text-[10px] text-primary font-bold hover:underline cursor-pointer font-heading">Upload</button>}
            />
            <div className="space-y-2">
              {[
                { name: 'bank-statement-july.pdf',     size: '1.2 MB', ts: '2024-08-01 10:14' },
                { name: 'transaction-screenshot.png',  size: '380 KB', ts: '2024-08-01 10:14' },
              ].map((a) => (
                <div key={a.name} className="flex items-center gap-3 rounded-[9px] border border-border/20 bg-bg/30 px-3 py-2.5 hover:border-border/40 transition-all group">
                  <div className="w-7 h-7 rounded-[6px] flex items-center justify-center border border-border/25 flex-shrink-0">
                    <FileText size={13} className="text-text-muted/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-heading font-semibold text-text/75 truncate">{a.name}</div>
                    <div className="text-[10px] font-mono text-text-muted/30">{a.size} · {a.ts}</div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted/40 hover:text-text cursor-pointer">
                    <Download size={13} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── RIGHT: Meta panel ── */}
        <div className="xl:sticky xl:top-[148px] space-y-4">

          {/* User snapshot */}
          <Card>
            <SupportSectionHead title="User Snapshot" Icon={User} />
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/15">
              <UserAvatar name={t.user} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold font-heading text-text tracking-[-0.02em]">{t.user}</div>
                <div className="text-[10.5px] font-mono text-text-muted/40">{t.uid}</div>
                <div className="text-[10.5px] font-heading text-text-muted/35 mt-0.5">{t.email}</div>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'KYC Status', val: t.kyc,     color: KYC_CLR[t.kyc]    },
                { label: 'Wallet',     val: t.wallet,   color: WALL_CLR[t.wallet] },
                { label: 'Trading',    val: t.trading,  color: TRADE_CLR[t.trading] },
                { label: 'Region',     val: t.region,   color: 'var(--text-muted)' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between text-[11.5px]">
                  <span className="text-text-muted/45 font-heading">{s.label}</span>
                  <span className="font-bold font-heading" style={{ color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-3.5 flex items-center justify-center gap-1.5 h-7 rounded-[8px] border border-border/25 text-[11px] font-semibold font-heading text-text-muted/55 hover:text-text hover:border-border/50 cursor-pointer transition-all">
              <ExternalLink size={11} />Open User Profile
            </button>
          </Card>

          {/* Ticket info */}
          <Card>
            <SupportSectionHead title="Ticket Info" Icon={ClipboardList} />
            <div className="space-y-2.5">
              {[
                { label: 'Owner',        val: owner },
                { label: 'Category',     val: t.category },
                { label: 'Priority',     val: t.priority },
                { label: 'Created',      val: t.created },
                { label: 'Last Updated', val: t.updated },
                { label: 'Replies',      val: messages.filter((m) => m.type !== 'system').length },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between text-[11.5px]">
                  <span className="text-text-muted/45 font-heading">{s.label}</span>
                  <span className="font-semibold font-heading text-text/70">{s.val}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* SLA status */}
          <Card>
            <SupportSectionHead title="SLA Status" Icon={Timer} />
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5 text-[11px]">
                  <span className="text-text-muted/45 font-heading">Time remaining</span>
                  <span
                    className="font-mono font-bold"
                    style={{ color: t.slaMins != null && t.slaMins < 30 ? 'var(--negative)' : t.slaMins != null && t.slaMins < 120 ? 'var(--warning)' : 'var(--positive)' }}
                  >
                    {t.slaMins != null ? `${t.slaMins}m` : 'Resolved'}
                  </span>
                </div>
                <SlaBar pct={t.sla} slaMins={t.slaMins} />
              </div>
              <SlaCheckRow label="First Response SLA" sla="4 hours"  met={true} />
              <SlaCheckRow label="Resolution SLA"     sla="24 hours" met={t.sla > 20} />
              <SlaCheckRow label="Escalation SLA"     sla="8 hours"  met={t.status !== 'ESCALATED'} />
            </div>
          </Card>

          {/* Related tickets */}
          <Card>
            <SupportSectionHead title="Related Tickets" Icon={Link} />
            <div className="space-y-2">
              {relatedTickets.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-2.5 rounded-[8px] border border-border/15 bg-bg/20 px-3 py-2 hover:border-border/35 transition-all cursor-pointer"
                  onClick={() => navigate(`/support/tickets/${r.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-semibold font-heading text-text/70 truncate">{r.subject}</div>
                    <div className="text-[10px] font-mono text-text-muted/30 mt-0.5">{r.id}</div>
                  </div>
                  <SupportStatusBadge value={r.status} />
                </div>
              ))}
            </div>
          </Card>

          {/* Quick actions */}
          <Card>
            <SupportSectionHead title="Quick Actions" Icon={ChevronRight} />
            <div className="grid grid-cols-1 gap-2">
              <SupportIconBtn label="View Account"       Icon={User}       variant="default" onClick={() => act('Account profile opened')} />
              <SupportIconBtn label="Check Wallet"       Icon={CreditCard} variant="default" onClick={() => act('Wallet opened')} />
              <SupportIconBtn label="Flag for Compliance"Icon={ShieldAlert} variant="warning" onClick={() => act('Flagged for compliance')} />
              <SupportIconBtn label="Block User"         Icon={Lock}       variant="danger"  onClick={() => act('Block confirmation opened')} />
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
