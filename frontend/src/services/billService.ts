import api from './api';

export interface Bill {
  _id: string;
  patient: string;
  hospital: string;
  amount: number;
  description: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  paidDate?: string;
  createdAt: string;
}

export const billService = {
  getBills: async (role: 'patient' | 'hospital'): Promise<Bill[]> => {
    const response = await api.get(`/bills/${role}`);
    return response.data;
  },

  createBill: async (data: {
    patientId: string;
    amount: number;
    description: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    dueDate: string;
  }): Promise<Bill> => {
    const response = await api.post('/bills', data);
    return response.data;
  },
};