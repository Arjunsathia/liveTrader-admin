import { kycQueue } from '../data/kyc-data';

export const kycService = {
  list() {
    return kycQueue;
  },
  getById(caseId) {
    return kycQueue.find((item) => item.id === caseId);
  },
  approve(item) {
    return { ...item, status: 'VERIFIED' };
  },
  reject(item) {
    return { ...item, status: 'REJECTED' };
  },
};
