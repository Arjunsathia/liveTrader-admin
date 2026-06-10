import { Wallet, Shield, BarChart2, Layers, User, CreditCard } from 'lucide-react';

export const KB_CATEGORIES = [
  {
    id: 'finance',
    Icon: Wallet,
    label: 'Deposits & Withdrawals',
    count: 24,
    colorCls: 'text-brand',
    bgCls: 'bg-brand/10 border border-brand/20',
    desc: 'Funding accounts, bank traces, and deposit rules.'
  },
  {
    id: 'kyc',
    Icon: Shield,
    label: 'KYC & Verification',
    count: 18,
    colorCls: 'text-positive',
    bgCls: 'bg-positive/10 border border-positive/20',
    desc: 'ID checks, document requirements, and status.'
  },
  {
    id: 'trading',
    Icon: BarChart2,
    label: 'Trading & MT5',
    count: 32,
    colorCls: 'text-warning',
    bgCls: 'bg-warning/10 border border-warning/20',
    desc: 'MT5 settings, terminal setups, and leverage.'
  },
  {
    id: 'copy',
    Icon: Layers,
    label: 'Copy Trading',
    count: 15,
    colorCls: 'text-purple',
    bgCls: 'bg-purple/10 border border-purple/20',
    desc: 'Provider links, copy ratios, and profit sharing.'
  },
  {
    id: 'account',
    Icon: User,
    label: 'Account Management',
    count: 21,
    colorCls: 'text-cyan',
    bgCls: 'bg-cyan/10 border border-cyan/20',
    desc: 'Passwords, 2FA, settings, and profile details.'
  },
  {
    id: 'payments',
    Icon: CreditCard,
    label: 'Payments',
    count: 12,
    colorCls: 'text-negative',
    bgCls: 'bg-negative/10 border border-negative/20',
    desc: 'Card systems, crypto rails, and billing info.'
  },
];

export const KB_ARTICLES = [
  { id: 'a1', title: 'How to deposit funds into your account', views: '12.4K', readTime: '3 min', category: 'Finance', helpful: 94 },
  { id: 'a2', title: 'MT5 platform setup guide',               views: '8.2K',  readTime: '5 min', category: 'Trading', helpful: 88 },
  { id: 'a3', title: 'Understanding KYC requirements',          views: '6.8K',  readTime: '4 min', category: 'KYC',     helpful: 92 },
  { id: 'a4', title: 'How copy trading works — beginner guide', views: '5.1K',  readTime: '6 min', category: 'Copy',    helpful: 97 },
  { id: 'a5', title: 'Withdrawal processing times by method',   views: '9.3K',  readTime: '2 min', category: 'Finance', helpful: 85 },
  { id: 'a6', title: 'Reset your MT5 password step by step',    views: '4.4K',  readTime: '2 min', category: 'Trading', helpful: 91 },
];

export const KB_FAQS = [
  {
    id: 'f1',
    q: 'How long do withdrawals take?',
    a: 'Bank wire transfers take 3–5 business days. Crypto withdrawals process within 24 hours. Card refunds take 5–10 business days depending on your bank.',
  },
  {
    id: 'f2',
    q: 'Why was my KYC rejected?',
    a: 'KYC is typically rejected due to blurry documents, expired ID, mismatched name, or utility bills older than 3 months. Resubmit clear, valid documents.',
  },
  {
    id: 'f3',
    q: 'How do I change my leverage?',
    a: 'Log into MT5, right-click your account number, and select Account Properties. Leverage cannot be changed while you have open positions.',
  },
  {
    id: 'f4',
    q: 'Can I have multiple accounts?',
    a: 'Each client may have one Live account and one Demo account. Duplicate accounts may lead to suspension under our multi-account policy.',
  },
  {
    id: 'f5',
    q: 'What is the minimum deposit?',
    a: 'The minimum initial deposit is $100 USD. For subsequent deposits the minimum is $50 USD via all supported payment methods.',
  },
  {
    id: 'f6',
    q: 'How does copy trading work?',
    a: 'You allocate funds to a strategy. When the provider places trades, proportional positions are automatically copied to your account based on your copy ratio.',
  },
];
