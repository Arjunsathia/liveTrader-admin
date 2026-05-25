import { kycQueue } from '@/config/constants/MOCK_USERS';

export const kycService = {
  list() {
    return kycQueue;
  },
  getById(caseId) {
    return kycQueue.find((item) => item.id === caseId);
  },
  approve(caseId) {
    const item = kycQueue.find((i) => i.id === caseId);
    if (item) {
      item.status = 'VERIFIED';
      item.eta = 'Completed';
      return { ...item };
    }
    return null;
  },
  reject(caseId) {
    const item = kycQueue.find((i) => i.id === caseId);
    if (item) {
      item.status = 'REJECTED';
      item.eta = 'Requires outreach';
      return { ...item };
    }
    return null;
  },
  updateStatusByUserId(userId, status) {
    const item = kycQueue.find((i) => i.userId === userId);
    if (item) {
      item.status = status;
      if (status === 'VERIFIED') {
        item.eta = 'Completed';
      } else if (status === 'REJECTED') {
        item.eta = 'Requires outreach';
      }
      return { ...item };
    }
    return null;
  },
};

