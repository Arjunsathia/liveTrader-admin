import { MOCK_TICKETS } from '../configs/tickets.config';
import { MOCK_CONVERSATION } from '../configs/ticketDetail.config';
import { KB_ARTICLES, KB_FAQS, KB_CATEGORIES } from '../configs/knowledge.config';
import { ANNOUNCEMENTS, INCIDENTS } from '../configs/announcements.config';
import { SUPPORT_STATS } from '../configs/overview.config';

const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const supportApi = {
  /* ── Overview ── */
  async getStats() {
    await wait();
    return SUPPORT_STATS;
  },

  /* ── Tickets ── */
  async getTickets() {
    await wait();
    return MOCK_TICKETS;
  },

  async getTicket(id) {
    await wait();
    const ticket = MOCK_TICKETS.find((t) => t.id === id) ?? MOCK_TICKETS[0];
    return { ...ticket, conversation: MOCK_CONVERSATION };
  },

  async createTicket(payload) {
    await wait(600);
    const id = `TKT-${Date.now().toString().slice(-4)}`;
    return { id, ...payload, status: 'OPEN', created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
  },

  async sendMessage(ticketId, message) {
    await wait(400);
    return {
      id: Date.now(),
      from: 'user',
      name: 'You',
      initials: 'ME',
      ts: 'Just now',
      text: message,
      attachments: [],
    };
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
