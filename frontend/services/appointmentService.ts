import api from './api';

export interface Appointment {
  _id: string;
  patient: string;
  hospital: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export const appointmentService = {
  bookAppointment: async (data: {
    hospitalId: string;
    date: string;
    time: string;
    reason: string;
  }): Promise<Appointment> => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  getPatientAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments/patient');
    return response.data;
  },

  getHospitalAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments/hospital');
    return response.data;
  },

  updateStatus: async (
    appointmentId: string,
    status: 'confirmed' | 'cancelled' | 'completed',
    notes?: string
  ): Promise<Appointment> => {
    const response = await api.put(`/appointments/${appointmentId}/status`, {
      status,
      notes,
    });
    return response.data;
  },
};