import { apiClient } from '@/shared/api/client/apiClient';
import { kycQueue } from '@/config/constants/MOCK_USERS';

const mapKycRecord = (rawKyc) => {
  if (!rawKyc) return null;
  
  // Resolve user display name
  let userName = 'Unknown User';
  if (typeof rawKyc.user === 'string') {
    userName = rawKyc.user;
  } else if (rawKyc.user && typeof rawKyc.user === 'object') {
    userName = rawKyc.user.name || rawKyc.user.fullName || rawKyc.user.email || 'Unknown User';
  } else if (rawKyc.fullName) {
    userName = rawKyc.fullName;
  } else if (rawKyc.personalInfo?.fullName) {
    userName = rawKyc.personalInfo.fullName;
  }

  // Resolve status: UI expects uppercase 'PENDING', 'VERIFIED' (for approved), 'REJECTED'
  let mappedStatus = 'PENDING';
  const rawStatus = (rawKyc.status || 'pending').toLowerCase();
  if (rawStatus === 'approved' || rawStatus === 'verified') {
    mappedStatus = 'VERIFIED';
  } else if (rawStatus === 'rejected') {
    mappedStatus = 'REJECTED';
  } else if (rawStatus === 'draft') {
    mappedStatus = 'DRAFT';
  }

  // Count documents
  let docCount = 0;
  if (rawKyc.idFrontImage || rawKyc.identityDocument?.front) docCount++;
  if (rawKyc.idBackImage || rawKyc.identityDocument?.back) docCount++;
  if (rawKyc.selfieImage || rawKyc.selfie) docCount++;
  if (rawKyc.addressDocImage || rawKyc.addressProof?.file) docCount++;
  if (docCount === 0) {
    // Fallback doc count
    docCount = rawKyc.docs ? parseInt(String(rawKyc.docs)) : 3;
  }

  return {
    id: rawKyc.id || 'N/A',
    userId: rawKyc.userId || rawKyc.user?.id || 'N/A',
    user: userName,
    tier: rawKyc.tier || rawKyc.user?.tier || 'Standard',
    country: rawKyc.country || rawKyc.personalInfo?.country || rawKyc.user?.country || 'GLOBAL',
    status: mappedStatus,
    eta: mappedStatus === 'VERIFIED' ? 'Completed' : (mappedStatus === 'REJECTED' ? 'Requires outreach' : 'Review pending'),
    docs: `${docCount}/${rawKyc.idDocType === 'passport' ? '3' : '4'}`,
    risk: rawKyc.risk || rawKyc.user?.riskStatus || 'LOW',
    submittedAt: rawKyc.createdAt || rawKyc.submittedAt || rawKyc.user?.submittedAt || rawKyc.kyc?.submittedAt || '',
    raw: rawKyc
  };
};

export const kycService = {
  async list(status) {
    let endpoint = '/kyc';
    if (status && status !== 'all') {
      let backendStatus = status.toLowerCase();
      if (backendStatus === 'verified') {
        backendStatus = 'approved';
      }
      endpoint += `?status=${backendStatus}`;
    }
    try {
      const response = await apiClient.get(endpoint);
      const listData = response?.data ?? response ?? [];
      return Array.isArray(listData) ? listData.map(mapKycRecord) : [];
    } catch (error) {
      console.warn('Failed to list KYC submissions from API, falling back to local mocks:', error);
      const listData = kycQueue;
      return listData.map(mapKycRecord);
    }
  },

  async getById(id) {
    if (!id) return null;
    try {
      const response = await apiClient.get(`/kyc/${id}`);
      const rawKyc = response?.data ?? response;
      return mapKycRecord(rawKyc);
    } catch (error) {
      console.warn(`Failed to get KYC details for ID ${id} from API, trying to find in local mocks:`, error);
      const mockRecord = kycQueue.find((item) => item.id === id);
      if (mockRecord) return mapKycRecord(mockRecord);
      throw error;
    }
  },

  async approve(id) {
    if (!id) return null;
    try {
      const response = await apiClient.put(`/kyc/${id}/approve`);
      return response?.data ?? response;
    } catch (error) {
      console.error(`Failed to approve KYC for ID ${id}`, error);
      throw error;
    }
  },

  async reject(id, reason) {
    if (!id) return null;
    try {
      const response = await apiClient.put(`/kyc/${id}/reject`, { reason });
      return response?.data ?? response;
    } catch (error) {
      console.error(`Failed to reject KYC for ID ${id}`, error);
      throw error;
    }
  },

  // Retain updateStatusByUserId for backwards compatibility with user detail page
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


