import api from './api';

export interface HospitalProfile {
  _id: string;
  hospitalName: string;
  email: string;
  phone?: string;
  address?: string;
  licenseNumber?: string;
  specialties?: string[];
  isVerified: boolean;
}

export interface Patient {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  lastVisit?: string;
  recordsCount: number;
}

export const hospitalService = {
  getProfile: async (): Promise<HospitalProfile> => {
    const response = await api.get('/hospital/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<HospitalProfile>): Promise<HospitalProfile> => {
    const response = await api.put('/hospital/profile', data);
    return response.data;
  },

  getPatients: async (): Promise<Patient[]> => {
    const response = await api.get('/hospital/patients');
    return response.data;
  },
};