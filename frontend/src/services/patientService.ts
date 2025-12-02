import api from './api';

export interface PatientProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface Reminder {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'medication' | 'appointment' | 'test' | 'other';
  isCompleted: boolean;
}

export interface Hospital {
  _id: string;
  hospitalName: string;
  email: string;
  phone?: string;
  address?: string;
  specialties?: string[];
  isVerified: boolean;
}

export const patientService = {
  getProfile: async (): Promise<PatientProfile> => {
    const response = await api.get('/patient/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<PatientProfile>): Promise<PatientProfile> => {
    const response = await api.put('/patient/profile', data);
    return response.data;
  },

  getReminders: async (): Promise<Reminder[]> => {
    const response = await api.get('/patient/reminders');
    return response.data;
  },

  createReminder: async (data: Omit<Reminder, '_id' | 'isCompleted'>): Promise<Reminder> => {
    const response = await api.post('/patient/reminders', data);
    return response.data;
  },

  getVerifiedHospitals: async (): Promise<Hospital[]> => {
    const response = await api.get('/patient/verified-hospitals');
    return response.data;
  },
};