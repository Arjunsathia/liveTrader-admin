import { Inbox, Clock, CheckCircle2, Zap } from 'lucide-react';
import { KB_ARTICLES, KB_FAQS, KB_CATEGORIES } from '../configs/knowledge.config';
import { ANNOUNCEMENTS, INCIDENTS } from '../configs/announcements.config';

const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const getStoredTickets = () => {
  const data = localStorage.getItem('client_support_tickets');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

const setStoredTickets = (tickets) => {
  localStorage.setItem('client_support_tickets', JSON.stringify(tickets));
};

const getStoredConversations = () => {
  const data = localStorage.getItem('client_support_conversations');
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
};

const setStoredConversations = (conversations) => {
  localStorage.setItem('client_support_conversations', JSON.stringify(conversations));
};

export const supportApi = {
  /* ── Overview ── */
  async getStats() {
    await wait();
    const tickets = getStoredTickets();
    const open = tickets.filter(t => t.status === 'OPEN').length;
    const pending = tickets.filter(t => t.status === 'PENDING').length;
    const resolved = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
    return [
      { id: 'open',     label: 'Open',   value: open,   Icon: Inbox,        colorCls: 'text-brand',    bgCls: 'bg-brand/10 border-brand/20'       },
      { id: 'pending',  label: 'Pending',  value: pending,   Icon: Clock,        colorCls: 'text-warning',  bgCls: 'bg-warning/10 border-warning/20'   },
      { id: 'resolved', label: 'Resolved',  value: resolved,   Icon: CheckCircle2, colorCls: 'text-positive', bgCls: 'bg-positive/10 border-positive/20' },
      { id: 'response', label: 'Response time',    value: '4h', Icon: Zap,         colorCls: 'text-purple',   bgCls: 'bg-purple/10 border-purple/20'     },
    ];
  },

  /* ── Tickets ── */
  async getTickets() {
    await wait();
    return getStoredTickets();
  },

  async getTicket(id) {
    await wait();
    const tickets = getStoredTickets();
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return null;
    const conversations = getStoredConversations();
    const conversation = conversations[id] || [];
    return { ...ticket, conversation };
  },

  async createTicket(payload) {
    await wait(600);
    const id = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id,
      ...payload,
      status: 'OPEN',
      unread: false,
      messages: 1,
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      updated: 'Just now',
    };

    // Save to stored tickets list
    const tickets = getStoredTickets();
    tickets.unshift(newTicket);
    setStoredTickets(tickets);

    // Save initial message to conversations map
    const conversations = getStoredConversations();
    conversations[id] = [
      {
        id: 1,
        from: 'user',
        name: 'You',
        initials: 'ME',
        ts: 'Just now',
        text: payload.message,
        attachments: payload.attachments || [],
      }
    ];
    setStoredConversations(conversations);

    return newTicket;
  },

  async sendMessage(ticketId, message) {
    await wait(400);
    const msg = {
      id: Date.now(),
      from: 'user',
      name: 'You',
      initials: 'ME',
      ts: 'Just now',
      text: message,
      attachments: [],
    };

    // Save to conversation
    const conversations = getStoredConversations();
    if (!conversations[ticketId]) {
      conversations[ticketId] = [];
    }
    conversations[ticketId].push(msg);
    setStoredConversations(conversations);

    // Update ticket updated time and messages count
    const tickets = getStoredTickets();
    const tIdx = tickets.findIndex((t) => t.id === ticketId);
    if (tIdx !== -1) {
      tickets[tIdx].updated = 'Just now';
      tickets[tIdx].messages = conversations[ticketId].length;
      setStoredTickets(tickets);
    }

    return msg;
  },

  /* ── Knowledge Base ── */
  async getKBCategories() {
    await wait();
    return KB_CATEGORIES;
  },

  async getKBArticles(query = '') {
    await wait();
    if (!query) return KB_ARTICLES;
    const q = query.toLowerCase();
    return KB_ARTICLES.filter((a) => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  },

  async getFaqs() {
    await wait();
    return KB_FAQS;
  },

  /* ── Announcements ── */
  async getAnnouncements() {
    await wait();
    return ANNOUNCEMENTS;
  },

  async getIncidents() {
    await wait();
    return INCIDENTS;
  },
};
