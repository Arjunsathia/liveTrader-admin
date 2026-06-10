const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const overview = {
  status: 'not-started',
  level: 'Basic',
  progress: 20,
  estimatedReviewTime: '1-2 business days',
  nextStep: 'Complete your personal information',
  reference: 'KYC-LT-2026-00482',
};

const history = [
  {
    id: 'KYC-LT-2025-00119',
    submittedAt: '18 Nov 2025, 10:42 AM',
    status: 'rejected',
    note: 'The proof of address was older than 90 days.',
    rejectionReason: 'Expired proof of address',
  },
];

export const kycApi = {
  async getOverview() {
    await wait();
    return overview;
  },
  async getHistory() {
    await wait();
    return history;
  },
  async saveDraft(payload) {
    await wait(250);
    return { savedAt: new Date().toISOString(), payload };
  },
  async uploadFile(file, category) {
    await wait(500);
    return { id: `${category}-${Date.now()}`, name: file.name, size: file.size, category };
  },
  async submit(payload) {
    await wait(700);
    return { ...overview, ...payload, status: 'pending', progress: 100 };
  },
};
