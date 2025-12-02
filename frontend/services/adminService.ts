import api from './api';

export interface AdminStats {
  totalPatients: number;
  totalHospitals: number;
  verifiedHospitals: number;
  pendingVerifications: number;
  totalRecords: number;
  activeDisputes: number;
}

export interface AuditLog {
  _id: string;
  action: string;
  performedBy: string;
  details: any;
  timestamp: string;
}

export const adminService = {
  getHospitals: async (): Promise<any[]> => {
    const response = await api.get('/admin/hospitals');
    return response.data;
  },

  updateHospitalStatus: async (
    hospitalId: string,
    isVerified: boolean
  ): Promise<any> => {
    const response = await api.put(`/admin/hospitals/${hospitalId}/status`, {
      isVerified,
    });
    return response.data;
  },

  getDisputes: async (): Promise<any[]> => {
    const response = await api.get('/admin/disputes');
    return response.data;
  },

  resolveDispute: async (disputeId: string, resolution: string): Promise<any> => {
    const response = await api.put(`/admin/disputes/${disputeId}/resolve`, {
      resolution,
    });
    return response.data;
  },

  getStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    const response = await api.get('/admin/audit-logs');
    return response.data;
  },
};