import { Inbox, Clock, CheckCircle2, Zap, Plus, BookOpen, MessageCircle, Bell } from 'lucide-react';

export const SUPPORT_STATS = [
  { id: 'open',     label: 'Open Tickets',   value: 2,   Icon: Inbox,        colorCls: 'text-brand',    bgCls: 'bg-brand/10 border-brand/20'       },
  { id: 'pending',  label: 'Awaiting Reply',  value: 1,   Icon: Clock,        colorCls: 'text-warning',  bgCls: 'bg-warning/10 border-warning/20'   },
  { id: 'resolved', label: 'Resolved (30d)',  value: 4,   Icon: CheckCircle2, colorCls: 'text-positive', bgCls: 'bg-positive/10 border-positive/20' },
  { id: 'response', label: 'Avg Response',    value: '4h', Icon: Zap,         colorCls: 'text-purple',   bgCls: 'bg-purple/10 border-purple/20'     },
];

export const QUICK_ACTIONS = [
  { id: 'create', label: 'New Ticket',     sub: 'Report an issue',    Icon: Plus,          colorCls: 'text-brand',    bgCls: 'bg-brand/10 border border-brand/20',         path: '/client/support/create' },
  { id: 'tickets',label: 'My Tickets',    sub: 'View your cases',    Icon: Inbox,         colorCls: 'text-brand',    bgCls: 'bg-brand/[0.07] border border-brand/15',     path: '/client/support/tickets' },
  { id: 'kb',     label: 'Knowledge Base', sub: 'Browse guides',      Icon: BookOpen,      colorCls: 'text-positive', bgCls: 'bg-positive/10 border border-positive/20',      path: '/client/support/kb' },
  { id: 'chat',   label: 'Live Chat',      sub: 'Talk to an agent',   Icon: MessageCircle, colorCls: 'text-purple',   bgCls: 'bg-purple/10 border border-purple/20',  path: '/client/support/chat' },
  { id: 'anns',   label: 'Announcements',  sub: 'Platform updates',   Icon: Bell,          colorCls: 'text-warning',  bgCls: 'bg-warning/10 border border-warning/20',       path: '/client/support/announcements' },
];
