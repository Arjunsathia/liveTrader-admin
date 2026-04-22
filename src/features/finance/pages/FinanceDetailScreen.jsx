import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle, ArrowLeft, ArrowUpRight, Check, CheckCircle2,
  Clock, Copy, CreditCard, Download, Edit2, Eye, ExternalLink,
  FileText, Flag, Globe, Hash, Lock, Send, Shield,
  ShieldCheck, TrendingUp, User, Wallet, X, XCircle, Zap,
  Activity,
} from 'lucide-react';
import { PageShell } from '../../../components/common/PageShell';
import {
  FinanceChip, Field, SectionLabel, ScanBadge, MoreMenu,
  STATUS_COLOR, RISK_COLOR,
} from '../components/FinanceDetailShared';

/* ─────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────── */
const ALL_DEPOSITS = {
  'DEP-10041': {
    id: 'DEP-10041', user: 'Klaus Mueller', uid: 'U-8821',
    email: 'k.mueller@mail.com', phone: '+49 170 8812 001',
    country: 'DE', segment: 'Retail FX', tier: 'Prime',
    kycStatus: 'VERIFIED', riskStatus: 'LOW',
    amount: '$10,000.00', currency: 'USD', amountRaw: 10000,
    method: 'Wire Transfer', rail: 'SWIFT', status: 'PENDING',
    hash: 'SWIFT-92841KL-EU-2024', bankName: 'Deutsche Bank AG',
    bankAcct: 'IBAN: DE89 3704 0044 0532 0130 00', swift: 'DEUTDEDB',
    senderName: 'Klaus Mueller', senderAcct: 'IBAN: DE89 3704 0044 0532 0130 00',
    region: 'Europe / SEPA', fee: '$0.00', feeRate: '0%',
    processingTime: '1–3 business days',
    createdAt: '2024-01-15 09:12 UTC', updatedAt: '2024-01-15 09:14 UTC',
    reviewedBy: '—', approvedAt: '—',
    ipAddress: '185.44.12.81', device: 'Chrome 120 / Windows 11',
    amlScan: 'PASSED', pepScan: 'CLEAR', sanctionScan: 'CLEAR', fraudScore: '12 / 100',
    note: 'Regular monthly top-up. Known user since 2022. Wire transferred from verified personal account at Deutsche Bank.',
    history: [
      { status: 'CREATED', by: 'system', time: '2024-01-15 09:12 UTC', note: 'Deposit initiated via client portal.' },
      { status: 'SCANNING', by: 'auto-aml', time: '2024-01-15 09:12 UTC', note: 'AML, PEP, and sanctions screening triggered automatically.' },
      { status: 'REVIEWING', by: 'auto-aml', time: '2024-01-15 09:13 UTC', note: 'Screening passed. Amount above $10k threshold — routed to manual queue.' },
      { status: 'PENDING', by: 'james.risk', time: '2024-01-15 09:14 UTC', note: 'Assigned to ops queue. Awaiting final reviewer approval.' },
    ],
    relatedTx: [
      { id: 'TXN-9841', type: 'Deposit', amount: '+$10,000', date: '2024-01-15', status: 'PENDING' },
      { id: 'TXN-9701', type: 'Deposit', amount: '+$8,500', date: '2023-12-01', status: 'CONFIRMED' },
      { id: 'WDR-20991', type: 'Withdrawal', amount: '-$5,000', date: '2023-11-18', status: 'COMPLETED' },
    ],
    walletBefore: '$2,840.00', walletAfter: '$12,840.00',
  },
  'DEP-10040': {
    id: 'DEP-10040', user: 'Priya Sharma', uid: 'U-4102',
    email: 'p.sharma@mail.com', phone: '+44 7911 554 002',
    country: 'GB', segment: 'Retail FX', tier: 'Standard',
    kycStatus: 'VERIFIED', riskStatus: 'LOW',
    amount: '$4,500.00', currency: 'USD', amountRaw: 4500,
    method: 'Crypto USDT', rail: 'TRC-20', status: 'CONFIRMED',
    hash: 'TXH-0xA1B2C3D4E5F6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    bankName: '—', bankAcct: '—', swift: '—',
    senderName: 'p.sharma (self)', senderAcct: 'TRX: TAbc...4f9z',
    region: 'Global / Crypto', fee: '$4.50', feeRate: '0.1%',
    processingTime: 'Instant (on-chain)',
    createdAt: '2024-01-15 08:44 UTC', updatedAt: '2024-01-15 08:46 UTC',
    reviewedBy: 'sarah.ops', approvedAt: '2024-01-15 08:46 UTC',
    ipAddress: '91.210.45.9', device: 'Safari 17 / macOS',
    amlScan: 'PASSED', pepScan: 'CLEAR', sanctionScan: 'CLEAR', fraudScore: '8 / 100',
    note: 'Tether TRC-20 deposit confirmed on-chain. 6/6 block confirmations. No flags on wallet address.',
    history: [
      { status: 'CREATED', by: 'system', time: '2024-01-15 08:44 UTC', note: 'On-chain deposit detected. Awaiting confirmations.' },
      { status: 'CONFIRMING', by: 'system', time: '2024-01-15 08:44 UTC', note: 'Block confirmation in progress (0/6).' },
      { status: 'CONFIRMED', by: 'sarah.ops', time: '2024-01-15 08:46 UTC', note: 'Full 6/6 block confirmations received. Credited to wallet.' },
    ],
    relatedTx: [
      { id: 'TXN-9839', type: 'Deposit', amount: '+$4,500', date: '2024-01-15', status: 'CONFIRMED' },
      { id: 'TXN-9720', type: 'Deposit', amount: '+$2,000', date: '2023-11-22', status: 'CONFIRMED' },
    ],
    walletBefore: '$3,210.00', walletAfter: '$7,710.00',
  },
  'DEP-10038': {
    id: 'DEP-10038', user: 'François Martin', uid: 'U-7723',
    email: 'f.martin@mail.com', phone: '+33 6 12 34 56 78',
    country: 'FR', segment: 'Institutional Copy', tier: 'VIP',
    kycStatus: 'VERIFIED', riskStatus: 'ELEVATED',
    amount: '$25,000.00', currency: 'USD', amountRaw: 25000,
    method: 'Wire Transfer', rail: 'SEPA', status: 'REVIEWING',
    hash: 'SEPA-RFR-4412-FR-2024', bankName: 'Société Générale',
    bankAcct: 'IBAN: FR76 3000 4000 0300 0400 0664 43', swift: 'SOGEFRPP',
    senderName: 'MARTIN FRANCOIS', senderAcct: 'IBAN: FR76 3000 4000 0300 0400 0664 43',
    region: 'Europe / SEPA', fee: '$0.00', feeRate: '0%',
    processingTime: '1–3 business days',
    createdAt: '2024-01-14 22:51 UTC', updatedAt: '2024-01-14 22:55 UTC',
    reviewedBy: '—', approvedAt: '—',
    ipAddress: '78.192.44.201', device: 'Chrome 119 / macOS',
    amlScan: 'REVIEW', pepScan: 'CLEAR', sanctionScan: 'CLEAR', fraudScore: '41 / 100',
    note: 'Large wire from new remittance account not previously seen. AML volume trigger fired. Enhanced due diligence in progress.',
    history: [
      { status: 'CREATED', by: 'system', time: '2024-01-14 22:51 UTC', note: 'Wire received from new IBAN not on file.' },
      { status: 'SCANNING', by: 'auto-aml', time: '2024-01-14 22:51 UTC', note: 'AML engine triggered — new sender account + high volume.' },
      { status: 'FLAGGED', by: 'auto-aml', time: '2024-01-14 22:52 UTC', note: 'Automatic flag: unrecognized sender IBAN.' },
      { status: 'REVIEWING', by: 'james.risk', time: '2024-01-14 22:55 UTC', note: 'Enhanced due diligence initiated.' },
    ],
    relatedTx: [
      { id: 'TXN-9836', type: 'Deposit', amount: '+$25,000', date: '2024-01-14', status: 'REVIEWING' },
      { id: 'TXN-9801', type: 'Deposit', amount: '+$18,000', date: '2023-12-15', status: 'CONFIRMED' },
      { id: 'WDR-21023', type: 'Withdrawal', amount: '-$22,000', date: '2024-01-13', status: 'FLAGGED' },
    ],
    walletBefore: '$14,200.00', walletAfter: '$39,200.00',
  },
  'DEP-10036': {
    id: 'DEP-10036', user: 'Adewale Okonkwo', uid: 'U-5519',
    email: 'a.okonkwo@mail.com', phone: '+234 803 441 0091',
    country: 'NG', segment: 'Retail FX', tier: 'Standard',
    kycStatus: 'VERIFIED', riskStatus: 'ELEVATED',
    amount: '$50,000.00', currency: 'USD', amountRaw: 50000,
    method: 'Wire Transfer', rail: 'SWIFT', status: 'FLAGGED',
    hash: 'SWIFT-FFG-2291-NG-2024', bankName: 'First Bank of Nigeria',
    bankAcct: 'IBAN: NG82 FBNI 0000 0000 0000 1234', swift: 'FBNINGLA',
    senderName: 'OKONKWO ADEWALE C', senderAcct: 'Acct: 3044812901 (FBN)',
    region: 'Africa / SWIFT', fee: '$25.00', feeRate: '0.05%',
    processingTime: '2–5 business days',
    createdAt: '2024-01-14 14:30 UTC', updatedAt: '2024-01-14 15:10 UTC',
    reviewedBy: 'james.risk', approvedAt: '—',
    ipAddress: '41.220.108.44', device: 'Chrome 120 / Android 14',
    amlScan: 'REVIEW', pepScan: 'CLEAR', sanctionScan: 'CLEAR', fraudScore: '67 / 100',
    note: 'Unusual source bank. Amount significantly exceeds prior deposit history. Potential third-party funding concern.',
    history: [
      { status: 'CREATED', by: 'system', time: '2024-01-14 14:30 UTC', note: 'Large inbound SWIFT wire from Nigeria detected.' },
      { status: 'SCANNING', by: 'auto-aml', time: '2024-01-14 14:30 UTC', note: 'Full AML, PEP, sanctions, and fraud scoring initiated.' },
      { status: 'FLAGGED', by: 'auto-aml', time: '2024-01-14 14:32 UTC', note: 'Fraud score 67/100. Jurisdiction risk elevated.' },
      { status: 'FLAGGED', by: 'james.risk', time: '2024-01-14 15:10 UTC', note: 'Manual review confirms flag. Escalated to compliance.' },
    ],
    relatedTx: [
      { id: 'TXN-9834', type: 'Deposit', amount: '+$50,000', date: '2024-01-14', status: 'FLAGGED' },
      { id: 'WDR-21034', type: 'Withdrawal', amount: '-$47,500', date: '2024-01-15', status: 'PENDING' },
      { id: 'TXN-9700', type: 'Deposit', amount: '+$8,000', date: '2023-10-20', status: 'CONFIRMED' },
    ],
    walletBefore: '$3,100.00', walletAfter: '$3,100.00',
  },
};

const ALL_WITHDRAWALS = {
  'WD-4412': {
    id: 'WD-4412', user: 'Kofi Arhin', uid: 'U-9901',
    email: 'k.arhin@ghana-mail.com', phone: '+233 24 123 4567',
    country: 'GH', segment: 'Retail FX', tier: 'Standard',
    kycStatus: 'VERIFIED', riskStatus: 'HIGH RISK',
    amount: '$85,000.00', currency: 'USD', amountRaw: 85000,
    method: 'Crypto USDT', rail: 'ERC-20', status: 'REVIEWING',
    hash: '0x742a...e91d', bankName: '—', bankAcct: '0x742a...e91d (Wallet)', swift: '—',
    senderName: 'Kofi Arhin', senderAcct: 'Wallet: 0x742a...e91d',
    region: 'Africa / Crypto', fee: '$85.00', feeRate: '0.1%',
    processingTime: '2–4 hours',
    createdAt: '2024-01-16 11:20 UTC', updatedAt: '2024-01-16 11:29 UTC',
    reviewedBy: '—', approvedAt: '—',
    ipAddress: '154.160.12.4', device: 'iPhone 15 / iOS 17',
    amlScan: 'REVIEW', pepScan: 'CLEAR', sanctionScan: 'CLEAR', fraudScore: '82 / 100',
    note: 'Large withdrawal from high-risk jurisdiction. USDT payout. Due diligence in progress.',
    history: [
      { status: 'CREATED', by: 'system', time: '2024-01-16 11:20 UTC', note: 'Withdrawal request initiated by user.' },
      { status: 'REVIEWING', by: 'james.risk', time: '2024-01-16 11:29 UTC', note: 'Enhanced due diligence in progress.' },
    ],
    relatedTx: [],
    walletBefore: '$120,500.00', walletAfter: '$35,500.00',
  },
};

const ALL_TRANSACTIONS = { ...ALL_DEPOSITS, ...ALL_WITHDRAWALS };

function getFinanceRecord(slug, id) {
  const datasets = {
    deposits: ALL_DEPOSITS,
    withdrawals: ALL_WITHDRAWALS,
    transactions: ALL_TRANSACTIONS,
    'failed-payments': ALL_DEPOSITS,
    approvals: ALL_DEPOSITS,
  };
  const data = datasets[slug] || ALL_DEPOSITS;
  return data[id] || Object.values(data)[0];
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export function FinanceDetailScreen() {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const dep = getFinanceRecord(slug, id);
  const [actionDone, setActionDone] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([
    { author: 'james.risk', text: dep.note, time: dep.updatedAt },
  ]);

  const sectionTitle = slug?.charAt(0).toUpperCase() + slug?.slice(1, -1);
  const isWithdrawal = slug === 'withdrawals';
  const sc = STATUS_COLOR[dep.status] ?? STATUS_COLOR.PENDING;
  const hue = (dep.user.charCodeAt(0) * 37) % 360;

  const riskFlags = useMemo(() => [
    dep.riskStatus === 'ELEVATED' && 'Elevated risk score — enhanced compliance review required',
    dep.riskStatus === 'WATCHLIST' && 'User is on the internal compliance watchlist',
    dep.status === 'FLAGGED' && 'Automatic AML/fraud flag triggered by detection engine',
    dep.amountRaw > 20000 && 'Large transaction — above $20,000 manual authorization threshold',
    dep.amlScan === 'REVIEW' && 'AML screening flagged for manual review',
    dep.fraudScore && parseInt(dep.fraudScore) > 50 && `High fraud score: ${dep.fraudScore}`,
  ].filter(Boolean), [dep]);

  function saveNote() {
    if (!newNote.trim()) return;
    setNotes((n) => [
      { author: 'admin.ops', text: newNote.trim(), time: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC' },
      ...n,
    ]);
    setNewNote('');
    setActionDone('Note saved successfully');
  }

  function handleAction(label) {
    setActionDone(`Action recorded: ${label}`);
  }

  return (
    <PageShell>
      {/* ── BACK ───────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-text-muted/55 hover:text-text transition-colors"
      >
        <ArrowLeft size={13} />
        Back to {slug?.charAt(0).toUpperCase() + slug?.slice(1)}
      </button>

      {/* ══ PAGE HEADER ════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden rounded-[14px] border border-border/30 bg-surface-elevated p-8"
        style={{ boxShadow: 'var(--shadow-dynamic)' }}
      >
        {/* Top row: ID + status + actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
          <div className="flex items-start gap-4 flex-1">
            {/* Icon badge */}
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[11px] border"
              style={{ background: sc.bg, borderColor: sc.border }}
            >
              {isWithdrawal
                ? <ArrowLeft size={20} style={{ color: sc.c }} />
                : <ArrowUpRight size={20} style={{ color: sc.c }} />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-[20px] font-semibold tracking-tight text-text">{dep.id}</span>
                <FinanceChip value={dep.status} />
                <FinanceChip value={dep.riskStatus} colorMap={RISK_COLOR} />
              </div>
              <div className="mt-1.5 flex items-center gap-3 flex-wrap text-[12px] text-text-muted/55">
                <span className="flex items-center gap-1"><User size={11} />{dep.user} · {dep.uid}</span>
                <span className="h-3 w-px bg-border/30" />
                <span className="flex items-center gap-1"><Clock size={11} />{dep.createdAt}</span>
                <span className="h-3 w-px bg-border/30" />
                <span className="flex items-center gap-1"><Globe size={11} />{dep.region}</span>
                <span className="h-3 w-px bg-border/30" />
                <span>{dep.method} · {dep.rail}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
            <button
              onClick={() => navigate(`/users/${dep.uid}`)}
              className="flex h-9 items-center gap-2 rounded-[8px] border border-border/25 px-4 text-[12px] font-bold text-text-muted hover:border-border/50 hover:text-text hover:bg-surface transition-all"
            >
              <ExternalLink size={12} /> View User
            </button>
            <button className="flex h-9 items-center gap-2 rounded-[8px] border border-border/25 px-4 text-[12px] font-bold text-text-muted hover:border-border/50 hover:text-text hover:bg-surface transition-all">
              <Download size={12} /> Export
            </button>
            <MoreMenu items={[
              { label: 'Copy Record ID', Icon: Copy, fn: () => navigator.clipboard.writeText(dep.id).catch(() => {}) },
              { label: 'Audit Trail', Icon: Activity, fn: () => {} },
              { label: 'Freeze Funds', Icon: Lock, fn: () => handleAction('Freeze Funds') },
              { label: 'Delete Record', Icon: XCircle, fn: () => {}, danger: true },
            ]} />
          </div>
        </div>

        {/* Amount strip */}
        <div className="mt-5 pt-4 border-t border-border/15 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
          <div className="col-span-2 flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-text-muted/45">{sectionTitle} Amount</span>
            <span
              className="font-mono text-[26px] font-semibold tracking-tight leading-none"
              style={{ color: isWithdrawal ? 'var(--negative)' : 'var(--brand)' }}
            >
              {dep.amount}
            </span>
            <span className="text-[11px] text-text-muted/50 mt-0.5">{dep.currency} · fee {dep.fee}</span>
          </div>
          {[
            { label: 'Method', value: dep.method },
            { label: 'Rail', value: dep.rail, mono: true },
            { label: 'Processing', value: dep.processingTime },
            { label: 'Reviewed By', value: dep.reviewedBy },
            { label: 'Approved At', value: dep.approvedAt },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-text-muted/45">{label}</span>
              <span
                className={`text-[12px] font-medium leading-snug ${mono ? 'font-mono' : ''}`}
                style={{ color: value === '—' ? 'var(--text-muted)' : 'var(--text)' }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ MAIN CONTENT GRID ══════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">

        {/* ── LEFT COLUMN ──────────────────────────────────── */}
        <div className="space-y-5">

          {/* 1. Summary */}
          <div className="rounded-[12px] border border-border/30 bg-surface-elevated p-6">
            <SectionLabel title={`${sectionTitle} Summary`} Icon={Wallet} />
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <Field label={`${sectionTitle} ID`} value={dep.id} mono copyable />
              <Field label="Amount" value={dep.amount} mono accent={isWithdrawal ? 'var(--negative)' : 'var(--brand)'} />
              <Field label="Currency" value={dep.currency} />
              <Field label="Fee" value={dep.fee} mono />
              <Field label="Fee Rate" value={dep.feeRate} />
              <Field label="Processing Time" value={dep.processingTime} />
              <Field label="Created At" value={dep.createdAt} mono />
              <Field label="Updated At" value={dep.updatedAt} mono />
              <Field label="Region" value={dep.region} />
            </div>
            {/* Wallet impact */}
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <div className="rounded-[9px] border border-border/15 bg-bg/40 px-3 py-2.5 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/45 mb-1">Before</div>
                <div className="font-mono text-[13px] font-semibold text-text-muted">{dep.walletBefore}</div>
              </div>
              <div
                className="rounded-[9px] border px-3 py-2.5 text-center flex flex-col items-center justify-center"
                style={{
                  borderColor: isWithdrawal ? 'color-mix(in srgb, var(--negative) 25%, transparent)' : 'color-mix(in srgb, var(--positive) 25%, transparent)',
                  background: isWithdrawal ? 'color-mix(in srgb, var(--negative) 6%, transparent)' : 'color-mix(in srgb, var(--positive) 6%, transparent)',
                }}
              >
                {isWithdrawal
                  ? <ArrowLeft size={14} style={{ color: 'var(--negative)' }} />
                  : <ArrowUpRight size={14} style={{ color: 'var(--positive)' }} />}
                <div className="font-mono text-[12px] font-semibold mt-0.5" style={{ color: isWithdrawal ? 'var(--negative)' : 'var(--positive)' }}>
                  {isWithdrawal ? '-' : '+'}{dep.amount}
                </div>
              </div>
              <div className="rounded-[9px] border border-border/15 bg-bg/40 px-3 py-2.5 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted/45 mb-1">After</div>
                <div className="font-mono text-[13px] font-semibold" style={{ color: isWithdrawal ? 'var(--text-muted)' : 'var(--brand)' }}>
                  {dep.walletAfter}
                </div>
              </div>
            </div>
          </div>

          {/* 2. User Information */}
          <div className="rounded-[12px] border border-border/30 bg-surface-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <SectionLabel title="User Information" Icon={User} />
              <button
                onClick={() => navigate(`/users/${dep.uid}`)}
                className="flex items-center gap-1 text-[11px] font-semibold text-text-muted/50 hover:text-text transition-colors -mt-2"
              >
                Open Profile <ExternalLink size={10} />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4 rounded-[9px] border border-border/15 bg-bg/40 p-3">
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-semibold"
                style={{
                  background: `hsl(${hue},35%,22%)`,
                  color: `hsl(${hue},80%,65%)`,
                  border: `1px solid hsl(${hue},40%,30%)`,
                }}
              >
                {dep.user[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-text">{dep.user}</div>
                <div className="text-[11px] text-text-muted/60 truncate">{dep.email}</div>
              </div>
              <div className="flex gap-1.5">
                <FinanceChip value={dep.kycStatus} colorMap={{ VERIFIED: { c: 'var(--positive)', bg: 'color-mix(in srgb, var(--positive) 10%, transparent)', border: 'color-mix(in srgb, var(--positive) 25%, transparent)' } }} />
                <FinanceChip value={dep.riskStatus} colorMap={RISK_COLOR} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <Field label="UID" value={dep.uid} mono copyable />
              <Field label="Email" value={dep.email} copyable />
              <Field label="Phone" value={dep.phone} />
              <Field label="Country" value={dep.country} />
              <Field label="Segment" value={dep.segment} />
              <Field label="Tier" value={dep.tier} />
            </div>
          </div>

          {/* 3. Payment Details */}
          <div className="rounded-[12px] border border-border/30 bg-surface-elevated p-6">
            <SectionLabel title="Payment Details" Icon={CreditCard} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Payment Method" value={dep.method} />
              <Field label="Rail / Network" value={dep.rail} mono />
              <Field label="Bank Name" value={dep.bankName} />
              <Field label="SWIFT / BIC" value={dep.swift} mono copyable />
              <Field label="Sender Name" value={dep.senderName} wide />
              <Field label="Sender Account / Address" value={dep.senderAcct} mono copyable wide />
              <Field label="Tx Hash / Reference" value={dep.hash} mono copyable wide />
            </div>
          </div>

          {/* 4. Compliance & AML */}
          <div className="rounded-[12px] border border-border/30 bg-surface-elevated p-6">
            <SectionLabel title="Compliance & AML" Icon={ShieldCheck} />
            <div className="grid grid-cols-2 gap-2 mb-4">
              <ScanBadge label="AML Screening" value={dep.amlScan} />
              <ScanBadge label="PEP Check" value={dep.pepScan} />
              <ScanBadge label="Sanctions Screening" value={dep.sanctionScan} />
              <div className="flex items-center justify-between gap-2 rounded-[8px] border border-border/15 bg-bg/40 px-3 py-2">
                <span className="text-[11px] text-text-muted/60">Fraud Score</span>
                <span
                  className="font-mono text-[11px] font-semibold"
                  style={{
                    color: parseInt(dep.fraudScore) > 50 ? 'var(--negative)'
                      : parseInt(dep.fraudScore) > 30 ? 'var(--warning)'
                      : 'var(--positive)',
                  }}
                >
                  {dep.fraudScore}
                </span>
              </div>
            </div>
            {riskFlags.length > 0 ? (
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.15em] text-warning/70 mb-1.5">
                  Active Risk Flags ({riskFlags.length})
                </div>
                {riskFlags.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-[8px] border border-warning/25 bg-warning/[0.06] px-3 py-2.5">
                    <AlertTriangle size={12} className="mt-0.5 flex-shrink-0 text-warning" />
                    <span className="text-[12px] leading-5 text-warning/85">{f}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2.5 rounded-[8px] border border-positive/20 bg-positive/[0.06] px-3 py-2.5">
                <CheckCircle2 size={13} className="text-positive" />
                <span className="text-[12px] text-positive/80">No active risk flags or anomalies detected.</span>
              </div>
            )}
          </div>

          {/* 5. Session & Device */}
          <div className="rounded-[12px] border border-border/30 bg-surface-elevated p-6">
            <SectionLabel title="Session & Device" Icon={Activity} />
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="IP Address" value={dep.ipAddress} mono copyable />
              <Field label="Device" value={dep.device} />
            </div>
          </div>

          {/* 6. Related Transactions */}
          {dep.relatedTx.length > 0 && (
            <div className="rounded-[12px] border border-border/30 bg-surface-elevated p-6">
              <SectionLabel title="Related Transactions" Icon={Hash} />
              <div className="rounded-[9px] border border-border/15 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/15 bg-bg/60">
                      {['Transaction ID', 'Type', 'Amount', 'Date', 'Status'].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.11em] text-text-muted/40">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dep.relatedTx.map((tx) => {
                      const isIn = tx.type === 'Deposit';
                      const col = STATUS_COLOR[tx.status] ?? { c: 'var(--text-muted)', bg: 'transparent' };
                      return (
                        <tr
                          key={tx.id}
                          className="border-b border-border/10 last:border-0 hover:bg-surface/40 transition-colors cursor-pointer"
                          onClick={() => navigate(`/finance/${isIn ? 'deposits' : 'withdrawals'}/${tx.id}`)}
                        >
                          <td className="px-3 py-2.5 font-mono text-[11px] text-text-muted/70">{tx.id}</td>
                          <td className="px-3 py-2.5">
                            <span
                              className="inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[10px] font-semibold"
                              style={{ color: isIn ? 'var(--positive)' : 'var(--negative)', background: isIn ? 'color-mix(in srgb, var(--positive) 10%, transparent)' : 'color-mix(in srgb, var(--negative) 10%, transparent)' }}
                            >
                              {isIn ? <ArrowUpRight size={9} /> : <ArrowLeft size={9} />}
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-[12px] font-semibold" style={{ color: isIn ? 'var(--positive)' : 'var(--negative)' }}>{tx.amount}</td>
                          <td className="px-3 py-2.5 font-mono text-[11px] text-text-muted/55">{tx.date}</td>
                          <td className="px-3 py-2.5">
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px]" style={{ color: col.c, background: col.bg }}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. Status History */}
          <div className="rounded-[12px] border border-border/30 bg-surface-elevated p-6">
            <SectionLabel title="Status History" Icon={Clock} />
            <div className="space-y-1.5">
              {dep.history.map((h, i) => {
                const hc = STATUS_COLOR[h.status] ?? { c: 'var(--text-muted)', bg: 'transparent' };
                return (
                  <div key={i} className="flex items-start gap-3 rounded-[8px] border border-border/15 bg-bg/40 px-3.5 py-3">
                    <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                      <div className="h-2 w-2 rounded-full" style={{ background: hc.c }} />
                      {i < dep.history.length - 1 && <div className="w-px bg-border/20" style={{ height: '20px' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-[3px]" style={{ color: hc.c, background: hc.bg }}>
                            {h.status}
                          </span>
                          <span className="text-[11px] text-text-muted/55">by {h.by}</span>
                        </div>
                        <span className="font-mono text-[10px] text-text-muted/40 flex-shrink-0">{h.time}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-4 text-text-muted/60">{h.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 8. Internal Notes */}
          <div className="rounded-[12px] border border-border/30 bg-surface-elevated p-6">
            <SectionLabel title="Internal Notes" Icon={FileText} />
            <div className="space-y-3 mb-4">
              {notes.map((n, i) => (
                <div key={i} className="rounded-[9px] border border-border/20 bg-surface p-3.5">
                  <div className="flex items-center gap-2 mb-1.5 border-b border-border/10 pb-1.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold" style={{ background: 'var(--brand)', color: 'var(--text-on-accent)' }}>
                      {n.author[0].toUpperCase()}
                    </div>
                    <span className="text-[11px] font-semibold text-text">{n.author}</span>
                    <span className="font-mono text-[10px] text-text-muted/40 ml-auto">{n.time}</span>
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-text-muted/80">{n.text}</p>
                </div>
              ))}
            </div>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add an operator note, compliance remark, or investigation comment…"
              rows={4}
              className="w-full rounded-[8px] border border-border/25 bg-bg px-3 py-2.5 text-[12px] text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-border/50 resize-none mb-2"
            />
            <button
              onClick={saveNote}
              disabled={!newNote.trim()}
              className="flex h-9 items-center justify-center gap-2 rounded-[8px] px-6 text-[12px] font-bold transition-all disabled:opacity-35 w-full"
              style={{ background: 'var(--brand)', color: 'var(--text-on-accent)' }}
            >
              <Send size={13} /> Save Note
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────── */}
        <div className="space-y-4">

          {/* Admin Actions */}
          <div className="rounded-[12px] border border-border/30 bg-surface-elevated p-5">
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-text-muted/45 mb-3">Admin Actions</div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: `Approve ${sectionTitle}`, Icon: Check, color: 'var(--positive)', bg: 'color-mix(in srgb, var(--positive) 10%, transparent)', border: 'color-mix(in srgb, var(--positive) 25%, transparent)' },
                { label: `Reject ${sectionTitle}`, Icon: X, color: 'var(--negative)', bg: 'color-mix(in srgb, var(--negative) 10%, transparent)', border: 'color-mix(in srgb, var(--negative) 25%, transparent)' },
                { label: 'Mark Reviewed', Icon: Eye, color: 'var(--cyan)', bg: 'color-mix(in srgb, var(--cyan) 10%, transparent)', border: 'color-mix(in srgb, var(--cyan) 25%, transparent)' },
                { label: 'Flag for AML', Icon: Flag, color: 'var(--warning)', bg: 'color-mix(in srgb, var(--warning) 10%, transparent)', border: 'color-mix(in srgb, var(--warning) 25%, transparent)' },
                { label: 'Freeze Funds', Icon: Lock, color: 'var(--purple)', bg: 'color-mix(in srgb, var(--purple) 10%, transparent)', border: 'color-mix(in srgb, var(--purple) 25%, transparent)' },
                { label: 'Export Record', Icon: Download, color: 'var(--text-muted)', bg: 'transparent', border: 'var(--border)' },
              ].map(({ label, Icon, color, bg, border }) => (
                <button
                  key={label}
                  onClick={() => handleAction(label)}
                  className="flex items-center gap-2.5 rounded-[8px] border px-3.5 py-2.5 text-[12px] font-semibold transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ color, background: bg, borderColor: border }}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
            {actionDone && (
              <div className="mt-3 flex items-center gap-2 rounded-[7px] border border-positive/25 bg-positive/[0.06] px-3 py-2">
                <CheckCircle2 size={12} className="text-positive" />
                <span className="text-[11px] text-positive/80">{actionDone}</span>
              </div>
            )}
          </div>

          {/* AML Summary */}
          <div className="rounded-[12px] border border-border/30 bg-surface-elevated p-5">
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-text-muted/45 mb-3">AML Summary</div>
            <div className="space-y-1.5">
              <ScanBadge label="AML Screening" value={dep.amlScan} />
              <ScanBadge label="PEP Check" value={dep.pepScan} />
              <ScanBadge label="Sanctions" value={dep.sanctionScan} />
              <div className="flex items-center justify-between gap-2 rounded-[8px] border border-border/15 bg-bg/40 px-3 py-2">
                <span className="text-[11px] text-text-muted/60">Fraud Score</span>
                <span
                  className="font-mono text-[11px] font-semibold"
                  style={{ color: parseInt(dep.fraudScore) > 50 ? 'var(--negative)' : parseInt(dep.fraudScore) > 30 ? 'var(--warning)' : 'var(--positive)' }}
                >
                  {dep.fraudScore}
                </span>
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="rounded-[12px] border border-border/30 bg-surface-elevated p-5">
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-text-muted/45 mb-3">Assignment</div>
            <div className="space-y-2">
              {[
                { label: 'Current Status', value: dep.status, isChip: true },
                { label: 'Reviewed By', value: dep.reviewedBy },
                { label: 'Approved At', value: dep.approvedAt },
                { label: 'Risk Level', value: dep.riskStatus, isRisk: true },
              ].map(({ label, value, isChip, isRisk }) => (
                <div key={label} className="flex items-center justify-between gap-2 rounded-[7px] border border-border/15 bg-bg/40 px-3 py-2">
                  <span className="text-[11px] text-text-muted/55">{label}</span>
                  {isChip && <FinanceChip value={value} />}
                  {isRisk && <FinanceChip value={value} colorMap={RISK_COLOR} />}
                  {!isChip && !isRisk && <span className="font-mono text-[11px] text-text">{value}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="rounded-[12px] border border-border/30 bg-surface-elevated p-5">
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-text-muted/45 mb-3">Metadata</div>
            <div className="space-y-2">
              {[
                { label: 'Record ID', value: dep.id },
                { label: 'Created', value: dep.createdAt },
                { label: 'Updated', value: dep.updatedAt },
                { label: 'IP Address', value: dep.ipAddress },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-text-muted/45 uppercase tracking-[0.1em] font-semibold text-[9px]">{label}</span>
                  <span className="font-mono text-text/70 truncate max-w-[180px] text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageShell>
  );
}
