import api from './api';

export interface MedicalRecord {
  _id: string;
  patient: string;
  hospital: string;
  recordType: string;
  title: string;
  description: string;
  date: string;
  files: Array<{
    url: string;
    fileType: string;
    encryptedKey?: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

export const recordService = {
  uploadRecord: async (formData: FormData): Promise<MedicalRecord> => {
    const response = await api.post('/records/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPendingRecords: async (): Promise<MedicalRecord[]> => {
    const response = await api.get('/records/pending');
    return response.data;
  },

  getTimeline: async (patientId: string): Promise<MedicalRecord[]> => {
    const response = await api.get(`/records/timeline/${patientId}`);
    return response.data;
  },

  approveRecord: async (recordId: string): Promise<MedicalRecord> => {
    const response = await api.put(`/records/${recordId}/approve`);
    return response.data;
  },

  rejectRecord: async (recordId: string, reason: string): Promise<MedicalRecord> => {
    const response = await api.put(`/records/${recordId}/reject`, { reason });
    return response.data;
  },
};