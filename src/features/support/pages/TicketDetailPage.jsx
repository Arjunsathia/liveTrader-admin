import React, { useState, useRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowUp, Bookmark, Check, CheckCircle2,
  ChevronDown, ChevronRight, ClipboardList, CreditCard,
  Download, ExternalLink, FileText, Hash, Link,
  Lock, MapPin, MessageCircle, MessageSquare, Paperclip,
  RefreshCw, Send, ShieldAlert, Timer, User,
  UserPlus, XCircle, CalendarDays, Dot, Circle,
  AlertTriangle, Activity, Clock, Tag, Zap,
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

/* ─── Priority accent map ──────────────────────────────── */
const PRIORITY_ACCENT = {
  CRITICAL: 'var(--negative)',
  HIGH:     '#f97316',
  MEDIUM:   'var(--warning)',
  LOW:      'var(--cyan)',
};

const AGENTS = ['Marcus Webb', 'Priya Sharma', 'Lena Fischer', 'Dev Kapoor', 'Keiran Lynch'];

/* ─────────────────────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────────────────────── */

/** Glass surface panel */
function Panel({ children, className = '' }) {
  return (
    <div className={`rounded-[10px] border border-border/30 bg-surface-elevated overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/** Compact panel header strip */
function PanelHead({ icon: Icon, title, right }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/12 bg-bg/5">
      <div className="flex items-center gap-2">
        {Icon && (
          <span className="w-5 h-5 rounded-[6px] bg-brand/10 flex items-center justify-center shrink-0">
            <Icon size={10} className="text-brand" />
          </span>
        )}
        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 font-heading">
          {title}
        </span>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

/** Inline key-value meta row */
function MetaRow({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-border/8 last:border-0">
      <span className="text-[11px] text-text-muted/70 font-heading font-semibold uppercase tracking-[0.05em] shrink-0">{label}</span>
      <span
        className="text-[13px] font-semibold font-heading truncate text-right text-text/85"
        style={{ color: accent }}
      >
        {value || '—'}
      </span>
    </div>
  );
}

/** Reusable action button */
function ActionBtn({ onClick, icon: Icon, label, variant = 'ghost', full = false, small = false }) {
  const s = {
    success: 'border-positive/22 bg-positive/7 text-positive hover:bg-positive/14 hover:border-positive/35',
    danger:  'border-negative/22 bg-negative/7 text-negative hover:bg-negative/14 hover:border-negative/35',
    warning: 'border-warning/22 bg-warning/7 text-warning hover:bg-warning/14 hover:border-warning/35',
    brand:   'border-brand/30 bg-brand text-text-on-accent hover:bg-brand-hover',
    orange:  'border-orange-400/22 bg-orange-400/7 text-orange-400 hover:bg-orange-400/14',
    ghost:   'border-border/20 bg-transparent text-text-muted/75 hover:text-text hover:border-border/38 hover:bg-bg/40',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-[7px] border font-semibold uppercase tracking-[0.05em] font-heading active:scale-[0.97] transition-all cursor-pointer
        ${small ? 'h-7 px-2.5 text-[11px]' : 'h-8 px-3 text-[11.5px]'}
        ${s[variant] || s.ghost}
        ${full ? 'w-full justify-start' : ''}`}
    >
      {Icon && <Icon size={small ? 10 : 12} className="shrink-0" />}
      <span>{label}</span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   CONVERSATION THREAD
   Thread-style (helpdesk), not chat-bubble style.
   All messages left-aligned with color-coded indicators.
───────────────────────────────────────────────────────── */

function ThreadMessage({ msg }) {
  /* System events render as a timeline divider */
  if (msg.type === 'system') {
    return (
      <div className="flex items-center gap-3 px-5 py-3">
        <div className="flex-1 h-px bg-border/8" />
        <span className="text-[10px] font-mono italic text-text-muted/28 shrink-0 px-1">{msg.body}</span>
        <div className="flex-1 h-px bg-border/8" />
      </div>
    );
  }

  const isUser     = msg.type === 'user';
  const isAgent    = msg.type === 'agent';
  const isInternal = msg.type === 'internal';

  /* Accent color per sender type */
  const accent = isInternal ? '#a78bfa'
               : isAgent    ? 'var(--brand)'
               :               'var(--text-muted)';

  const initials = msg.author
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`group relative flex gap-3 px-5 py-4 border-b border-border/8 last:border-0 transition-colors hover:bg-bg/5 ${isInternal ? 'bg-purple-500/[0.02]' : ''}`}
    >
      {/* Left accent bar — only for agent / internal */}
      {!isUser && (
        <span
          className="absolute left-0 top-3 bottom-3 w-[2px] rounded-r-full"
          style={{ background: accent, opacity: 0.45 }}
        />
      )}

      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 text-[10px] font-semibold font-heading border mt-[1px]"
        style={{
          background: `color-mix(in srgb, ${accent} 11%, transparent)`,
          borderColor: `color-mix(in srgb, ${accent} 20%, transparent)`,
          color: accent,
        }}
      >
        {initials}
      </div>

      {/* Content column */}
      <div className="flex-1 min-w-0">
        {/* Header row: author · role · badge · timestamp */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className="text-[13px] font-semibold font-heading leading-none"
            style={{ color: isUser ? 'var(--text)' : accent }}
          >
            {msg.author}
          </span>

          {msg.role && (
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.05em] font-heading px-2 py-0.5 rounded-[4px] leading-none"
              style={{
                background: `color-mix(in srgb, ${accent} 12%, transparent)`,
                color: accent,
              }}
            >
              {msg.role}
            </span>
          )}

          {isInternal && (
            <span
              className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.05em] font-heading px-2 py-0.5 rounded-[4px] leading-none border"
              style={{
                background: 'color-mix(in srgb, #a78bfa 12%, transparent)',
                borderColor: 'color-mix(in srgb, #a78bfa 22%, transparent)',
                color: '#a78bfa',
              }}
            >
              <Lock size={9} />
              Private Note
            </span>
          )}

          <span className="text-[11px] font-mono text-text-muted/70 ml-auto leading-none">
            {msg.ts}
          </span>
        </div>

        {/* Bubble */}
        <div
          className="rounded-[10px] border px-4 py-3 text-[13.5px] font-medium text-text/85 leading-relaxed"
          style={{
            background: isInternal
              ? 'color-mix(in srgb, #a78bfa 4%, transparent)'
              : isAgent
                ? 'color-mix(in srgb, var(--brand) 3.5%, transparent)'
                : 'color-mix(in srgb, var(--bg) 38%, transparent)',
            borderColor: isInternal
              ? 'color-mix(in srgb, #a78bfa 14%, transparent)'
              : isAgent
                ? 'color-mix(in srgb, var(--brand) 11%, transparent)'
                : 'color-mix(in srgb, var(--border) 22%, transparent)',
          }}
        >
          <p className="whitespace-pre-wrap">{msg.body}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   REPLY COMPOSER
   Tab-underline switcher, auto-expanding textarea, tools.
───────────────────────────────────────────────────────── */

function ReplyComposer({ noteType, setNoteType, replyText, setReplyText, onSend, onDraft }) {
  const activeColor = noteType === 'REPLY' ? 'var(--brand)' : '#a78bfa';

  return (
    <div className="border-t border-border/12 bg-bg/4">
      {/* Tab switcher — underline style */}
      <div className="flex items-end px-5 pt-3.5 gap-0 border-b border-border/10">
        {[
          ['REPLY',    'Reply to Customer', Send],
          ['INTERNAL', 'Internal Note',     Lock],
        ].map(([type, label, Icon]) => {
          const active = noteType === type;
          const col = type === 'REPLY' ? 'var(--brand)' : '#a78bfa';
          return (
            <button
              key={type}
              onClick={() => setNoteType(type)}
              className="flex items-center gap-1.5 px-3.5 pb-2.5 text-[11.5px] font-semibold font-heading cursor-pointer transition-all border-b-[2px] -mb-px"
              style={active
                ? { color: col, borderColor: col }
                : { color: 'var(--text-muted)', opacity: 0.7, borderColor: 'transparent' }}
            >
              <Icon size={9} />
              {label}
            </button>
          );
        })}
        <div className="flex-1 border-b border-border/10 pb-0" />
      </div>

      <div className="px-5 py-3.5 space-y-3">
        <textarea
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          placeholder={
            noteType === 'REPLY'
              ? 'Write a reply to the customer…'
              : 'Write an internal note — not visible to the customer…'
          }
          rows={4}
          className="w-full resize-none rounded-[8px] border border-border/20 bg-bg/18 px-3.5 py-3 text-[12.5px] text-text font-heading font-medium outline-none placeholder:text-text-muted/22 transition-all leading-relaxed"
          style={{ '--tw-ring-color': 'transparent' }}
          onFocus={e => { e.target.style.borderColor = `color-mix(in srgb, ${activeColor} 38%, transparent)`; }}
          onBlur={e => { e.target.style.borderColor = ''; }}
        />

        <div className="flex items-center justify-between">
          {/* Tool shortcuts */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-[11px] text-text-muted/70 hover:text-text cursor-pointer transition-colors">
              <Paperclip size={11} />
              Attach
            </button>
            <button className="flex items-center gap-1.5 text-[11px] text-text-muted/70 hover:text-text cursor-pointer transition-colors">
              <FileText size={11} />
              Templates
            </button>
            <button className="flex items-center gap-1.5 text-[11px] text-text-muted/70 hover:text-text cursor-pointer transition-colors">
              <Bookmark size={11} />
              Macros
            </button>
          </div>

          {/* Send / Save */}
          <div className="flex items-center gap-2">
            <ActionBtn
              onClick={onDraft}
              icon={FileText}
              label="Draft"
              variant="ghost"
              small
            />
            <button
              onClick={onSend}
              disabled={!replyText.trim()}
              className="flex items-center gap-1.5 h-8 px-4 rounded-[7px] text-[11.5px] font-semibold font-heading border cursor-pointer transition-all active:scale-[0.97] disabled:opacity-25 disabled:cursor-not-allowed uppercase tracking-wider"
              style={noteType === 'REPLY'
                ? {
                    background: 'var(--brand)',
                    color: 'var(--text-on-accent)',
                    borderColor: 'color-mix(in srgb, var(--brand) 35%, transparent)',
                  }
                : {
                    background: 'color-mix(in srgb, #a78bfa 11%, transparent)',
                    color: '#a78bfa',
                    borderColor: 'color-mix(in srgb, #a78bfa 24%, transparent)',
                  }}
            >
              <Send size={10} />
              {noteType === 'REPLY' ? 'Send Reply' : 'Save Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ASSIGN DROPDOWN ──────────────────────────────── */

function AssignDropdown({ owner, onAssign, open, setOpen }) {
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1.5 h-8 px-3 rounded-[7px] text-[11px] font-semibold font-heading border border-border/20 bg-bg/22 text-text-muted/70 hover:text-text hover:border-border/38 transition-all cursor-pointer uppercase tracking-wider"
      >
        <UserPlus size={10} />
        {owner?.name || 'Assign'}
        <ChevronDown size={9} className="opacity-40" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 z-50 rounded-[10px] border border-border/20 py-1.5 min-w-[184px] overflow-hidden"
          style={{
            background: 'var(--surface-elevated)',
            boxShadow: '0 14px 44px rgba(0,0,0,0.42)',
          }}
        >
          {AGENTS.map(a => (
            <button
              key={a}
              onClick={() => onAssign(a)}
              className="w-full text-left px-3.5 py-2.5 text-[11.5px] font-heading font-semibold hover:bg-bg/45 cursor-pointer transition-colors flex items-center gap-2.5"
              style={{ color: owner?.name === a ? 'var(--brand)' : 'var(--text-muted)' }}
            >
              <div
                className="w-5 h-5 rounded-full text-[8px] font-black flex items-center justify-center shrink-0"
                style={{
                  background: 'color-mix(in srgb, var(--brand) 10%, transparent)',
                  color: 'var(--brand)',
                }}
              >
                {a.split(' ').map(w => w[0]).join('')}
              </div>
              {a}
              {owner?.name === a && (
                <Check size={10} className="ml-auto" style={{ color: 'var(--brand)' }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PAGE EXPORT
───────────────────────────────────────────────────────── */

export function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const ticket = ticketsData.find(t => t.id === ticketId);
  if (!ticket) return <Navigate to="/support/tickets" replace />;
  return (
    <TicketDetail
      ticket={ticket}
      onBack={() => navigate('/support/tickets')}
      navigate={navigate}
    />
  );
}

/* ─────────────────────────────────────────────────────────
   TICKET DETAIL (main body)
───────────────────────────────────────────────────────── */

function TicketDetail({ ticket: t, onBack, navigate }) {
  const [messages, setMessages]   = useState(ticketConversation);
  const [replyText, setReplyText] = useState('');
  const [noteType, setNoteType]   = useState('REPLY');
  const [status, setStatus]       = useState(t.status);
  const [owner, setOwner]         = useState(() => {
    if (typeof t.owner === 'object' && t.owner !== null) return t.owner;
    return { name: t.owner || 'Unassigned', photo: '' };
  });
  const [showAssign, setShowAssign] = useState(false);
  const [toast, setToast]           = useState(null);
  const bottomRef = useRef(null);

  const notify = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const sendReply = () => {
    if (!replyText.trim()) return;
    setMessages(prev => [
      ...prev,
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
    notify(noteType === 'REPLY' ? 'Reply sent to customer' : 'Internal note saved');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const assignAgent = name => {
    setOwner({ name, photo: '' });
    setShowAssign(false);
    notify(`Assigned to ${name}`);
  };

  const msgCount  = messages.filter(m => m.type !== 'system').length;
  const isOverdue = t.slaMins != null && t.slaMins < 0;

  /* SLA time-remaining display color */
  const slaColor = t.slaMins == null
    ? 'var(--positive)'
    : t.slaMins < 30
      ? 'var(--negative)'
      : t.slaMins < 120
        ? 'var(--warning)'
        : 'var(--positive)';

  return (
    <PageShell className="!pt-0">
      <SupportToast msg={toast} onDone={() => setToast(null)} />

      {/* ── BREADCRUMB ── */}
      <div className="flex items-center gap-2 mb-4 animate-fade-up">
        <button
          type="button"
          onClick={onBack}
          className="group w-7 h-7 flex items-center justify-center rounded-[7px] border border-border/18 bg-bg/28 text-text-muted/48 hover:text-text hover:border-border/35 transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
        </button>
        <button
          onClick={onBack}
          className="text-[11px] text-text-muted/70 font-semibold uppercase tracking-[0.05em] font-heading hover:text-text transition-colors cursor-pointer"
        >
          Support Tickets
        </button>
        <ChevronRight size={10} className="text-text-muted/20" />
        <span className="text-[11px] font-mono font-semibold text-brand/75">{t.id}</span>
      </div>

      {/* ── TICKET HEADER ── */}
      <Panel className="mb-4 animate-fade-up">
        <div className="p-5">
          {/* Row 1 — Subject + action buttons */}
          <div className="flex items-start justify-between gap-4 mb-3.5">
            {/* Left: ID + badges + title */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                <span className="text-[10.5px] font-mono font-semibold text-text-muted/32">{t.id}</span>
                <PriorityBadge value={t.priority} />
                <SupportStatusBadge value={status} />
                <CatTag value={t.category} />
                {isOverdue && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-[3px] rounded-[5px] text-[9px] font-black uppercase tracking-[0.1em]"
                    style={{
                      color: 'var(--negative)',
                      background: 'color-mix(in srgb,var(--negative) 10%,transparent)',
                      border: '1px solid color-mix(in srgb,var(--negative) 20%,transparent)',
                    }}
                  >
                    <AlertTriangle size={8} className="animate-pulse" />
                    Overdue
                  </span>
                )}
              </div>
              <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-text font-heading leading-tight max-w-[660px]">
                {t.subject}
              </h1>
            </div>

            {/* Right: Assign + status actions */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              <AssignDropdown
                owner={owner}
                onAssign={assignAgent}
                open={showAssign}
                setOpen={setShowAssign}
              />

              <ActionBtn
                onClick={() => notify('Ticket escalated')}
                icon={ArrowUp}
                label="Escalate"
                variant="orange"
              />

              {status === 'OPEN' || status === 'PENDING' ? (
                <ActionBtn
                  onClick={() => { setStatus('RESOLVED'); notify('Ticket resolved'); }}
                  icon={CheckCircle2}
                  label="Resolve"
                  variant="success"
                />
              ) : (
                <ActionBtn
                  onClick={() => { setStatus('OPEN'); notify('Ticket reopened'); }}
                  icon={RefreshCw}
                  label="Reopen"
                  variant="warning"
                />
              )}

              <ActionBtn
                onClick={() => { setStatus('CLOSED'); notify('Ticket closed'); }}
                icon={XCircle}
                label="Close"
                variant="danger"
              />
            </div>
          </div>

          {/* Row 2 — Meta pill strip */}
          <div className="flex items-center flex-wrap gap-0 border-t border-border/8 pt-3">
            {[
              { Icon: User,         val: t.user },
              { Icon: Hash,         val: t.uid },
              { Icon: MapPin,       val: t.region },
              { Icon: CalendarDays, val: `Opened ${t.created}` },
              { Icon: Clock,        val: `Updated ${t.updated || '—'}` },
              { Icon: MessageCircle, val: `${msgCount} messages` },
            ].map(({ Icon, val }, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-[11.5px] text-text-muted/75 font-heading font-semibold px-3.5 first:pl-0 border-r border-border/8 last:border-0"
              >
                <Icon size={11} className="shrink-0 text-text-muted/60" />
                <span>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* ── 2-COLUMN WORKSPACE ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.65fr)_276px] gap-4 items-start animate-fade-up">

        {/* ═══════════════════════════════
            LEFT — Conversation + Attachments
        ═══════════════════════════════ */}
        <div className="space-y-4">

          {/* Conversation panel */}
          <Panel>
            <PanelHead
              icon={MessageCircle}
              title="Conversation Thread"
              right={
                <div className="flex items-center gap-3.5 text-[9.5px] font-heading font-semibold text-text-muted/30">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--text-muted)', opacity: 0.35 }} />
                    Customer
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--brand)', opacity: 0.6 }} />
                    Agent
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#a78bfa', opacity: 0.6 }} />
                    Internal
                  </span>
                </div>
              }
            />

            {/* Message list */}
            <div className="max-h-[520px] overflow-y-auto scroll-smooth">
              {messages.map(msg => (
                <ThreadMessage key={msg.id} msg={msg} />
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Reply composer */}
            <ReplyComposer
              noteType={noteType}
              setNoteType={setNoteType}
              replyText={replyText}
              setReplyText={setReplyText}
              onSend={sendReply}
              onDraft={() => notify('Draft saved')}
            />
          </Panel>

          {/* Attachments panel */}
          <Panel>
            <PanelHead
              icon={Paperclip}
              title="Attachments"
              right={
                <button className="text-[10px] text-brand/65 font-black font-heading uppercase tracking-wider hover:text-brand cursor-pointer transition-colors">
                  + Upload
                </button>
              }
            />
            <div className="p-3 space-y-1.5">
              {[
                { name: 'bank-statement-july.pdf', size: '1.2 MB', ts: '01 Aug 2024 10:14', ext: 'PDF' },
                { name: 'transaction-screenshot.png', size: '380 KB', ts: '01 Aug 2024 10:14', ext: 'IMG' },
              ].map(a => (
                <div
                  key={a.name}
                  className="flex items-center gap-3 rounded-[8px] border border-border/12 bg-bg/10 px-3 py-2.5 hover:border-border/26 hover:bg-bg/20 transition-all group cursor-pointer"
                >
                  <div
                    className="w-8 h-8 rounded-[7px] flex items-center justify-center shrink-0 text-[8px] font-black font-heading border"
                    style={{
                      background: 'color-mix(in srgb, var(--brand) 8%, transparent)',
                      borderColor: 'color-mix(in srgb, var(--brand) 15%, transparent)',
                      color: 'var(--brand)',
                    }}
                  >
                    {a.ext}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11.5px] font-heading font-semibold text-text/62 truncate">{a.name}</p>
                    <p className="text-[9.5px] font-mono text-text-muted/28 mt-0.5">{a.size} · {a.ts}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted/38 hover:text-text cursor-pointer">
                    <Download size={12} />
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ═══════════════════════════════
            RIGHT SIDEBAR — Context panels
        ═══════════════════════════════ */}
        <div className="space-y-4">

          {/* ── CUSTOMER OVERVIEW ── */}
          <Panel>
            <PanelHead icon={User} title="Customer Overview" />

            <div className="p-4 space-y-3.5">
              {/* Identity row */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[12px] font-semibold font-heading border"
                  style={{
                    background: 'color-mix(in srgb, var(--brand) 10%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--brand) 18%, transparent)',
                    color: 'var(--brand)',
                  }}
                >
                  {t.user.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-semibold text-text font-heading leading-tight truncate">{t.user}</p>
                  <p className="text-[11px] font-mono text-text-muted/75 truncate mt-0.5">{t.uid}</p>
                  <p className="text-[11px] text-text-muted/75 font-heading truncate">{t.email}</p>
                </div>
              </div>

              {/* 2×2 status grid */}
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'KYC Status', val: t.kyc,     color: KYC_CLR[t.kyc] },
                  { label: 'Wallet',     val: t.wallet,  color: WALL_CLR[t.wallet] },
                  { label: 'MT5 Accts',  val: t.trading, color: TRADE_CLR[t.trading] },
                  { label: 'Region',     val: t.region,  color: 'var(--text-muted)' },
                ].map(({ label, val, color }) => (
                  <div
                    key={label}
                    className="rounded-[7px] border border-border/10 bg-bg/10 px-2.5 py-2"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 font-heading mb-0.5">
                      {label}
                    </p>
                    <p
                      className="text-[12px] font-semibold font-heading uppercase tracking-[0.04em] truncate"
                      style={{ color }}
                    >
                      {val}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/users/${t.uid}`)}
                className="w-full h-8 flex items-center justify-center gap-1.5 rounded-[7px] border border-border/14 bg-bg/10 text-text-muted/70 hover:text-text hover:border-border/28 hover:bg-bg/22 text-[10.5px] font-semibold uppercase tracking-wider font-heading transition-all cursor-pointer"
              >
                <ExternalLink size={10} />
                Open Customer Profile
              </button>
            </div>

            {/* SLA block — inside customer panel */}
            <div className="border-t border-border/10 p-4 space-y-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 font-heading">
                  SLA Status
                </span>
                <span className="font-mono font-semibold text-[11.5px]" style={{ color: slaColor }}>
                  {t.slaMins != null ? `${t.slaMins}m remaining` : 'Resolved'}
                </span>
              </div>

              <SlaBar pct={t.sla} slaMins={t.slaMins} />

              <div className="space-y-2 pt-2.5 border-t border-border/8">
                <SlaCheckRow label="First Response" sla="4 hrs"  met={true} />
                <SlaCheckRow label="Resolution"     sla="24 hrs" met={t.sla > 20} />
                <SlaCheckRow label="Escalation"     sla="8 hrs"  met={status !== 'ESCALATED'} />
              </div>
            </div>
          </Panel>

          {/* ── TICKET DETAILS ── */}
          <Panel>
            <PanelHead icon={ClipboardList} title="Ticket Details" />

            <div className="px-4 py-1">
              {[
                { label: 'Assigned To',   value: owner?.name || 'Unassigned' },
                { label: 'Category',      value: t.category },
                { label: 'Priority',      value: t.priority },
                { label: 'Opened',        value: t.created },
                { label: 'Last Activity', value: t.updated || '—' },
                { label: 'Messages',      value: String(msgCount) },
              ].map(({ label, value }) => (
                <MetaRow key={label} label={label} value={value} />
              ))}
            </div>

            {/* Related / previous tickets */}
            <div className="border-t border-border/10 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 font-heading mb-2 px-1">
                <Link size={9} className="shrink-0 text-text-muted/50" />
                Customer's Ticket History
              </p>

              <div className="space-y-1.5">
                {relatedTickets.map(r => (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/support/tickets/${r.id}`)}
                    className="flex items-center gap-2.5 rounded-[7px] border border-border/10 bg-bg/10 px-3 py-2 hover:border-border/24 hover:bg-bg/20 transition-all cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold font-heading text-text/85 truncate group-hover:text-text/78 transition-colors">
                        {r.subject}
                      </p>
                      <p className="text-[11px] font-mono text-text-muted/70 mt-0.5">{r.id}</p>
                    </div>
                    <SupportStatusBadge value={r.status} />
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {/* ── ADMIN CONTROLS ── */}
          <Panel>
            <PanelHead icon={Zap} title="Admin Controls" />
            <div className="p-3 space-y-1.5">
              {[
                { label: 'View Account Profile',    icon: User,        variant: 'ghost',   cb: () => navigate(`/users/${t.uid}`) },
                { label: 'Check Payment Wallet',    icon: CreditCard,  variant: 'ghost',   cb: () => notify('Wallet ledger opened') },
                { label: 'Flag for Security Check', icon: ShieldAlert, variant: 'warning', cb: () => notify('Flagged for security review') },
                { label: 'Suspend User Access',     icon: Lock,        variant: 'danger',  cb: () => notify('Suspension dialog opened') },
              ].map(({ label, icon, variant, cb }) => (
                <ActionBtn
                  key={label}
                  onClick={cb}
                  icon={icon}
                  label={label}
                  variant={variant}
                  full
                />
              ))}
            </div>
          </Panel>

        </div>
      </div>
    </PageShell>
  );
}