import { HospitalProfile, PatientProfile } from './types';

export const MOCK_RECORDS: any[] = [];
export const MOCK_REMINDERS: any[] = [];
export const MOCK_PENDING_APPOINTMENTS: any[] = [];
export const MOCK_HOSPITALS: any[] = [];
export const MOCK_PATIENTS: any[] = [];
export const MOCK_REPORTS: any[] = [];
export const MOCK_BILLS: any[] = [];
export const MOCK_DISPUTES: any[] = [];
export const MOCK_AUDIT_LOGS: any[] = [];
export const HOSPITAL_APPOINTMENT_REQUESTS: any[] = [];
export const ANALYTICS_DATA: any = {};

export const MOCK_PATIENT_PROFILE: PatientProfile = {
  id: 'p1',
  name: 'John Doe',
  email: 'john.doe@email.com',
  phone: '+1 (555) 123-4567',
  age: 34,
  bloodGroup: 'O+',
  gender: 'Male',
  address: '123 Wellness Ave, Health City, HC 90210',
  emergencyContact: 'Jane Doe (Spouse): +1 (555) 987-6543',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  stats: {
    totalRecords: 42,
    approvedRecords: 38,
    hospitalsVisited: 5
  }
};

export const MOCK_HOSPITAL_PROFILE: HospitalProfile = {
  id: 'h1',
  name: 'St. Mary\'s Medical Center',
  licenseId: 'NY-MED-992-A',
  email: 'admin@stmarys.com',
  phone: '+1 (555) 999-8888',
  address: '400 W 113th St, New York, NY 10025',
  specialization: ['Cardiology', 'Neurology', 'Emergency Care'],
  description: 'A premier healthcare facility dedicated to providing world-class medical services with compassion and care.',
  website: 'www.stmarys.com',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SM&backgroundColor=1e40af',
  banner: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=400&fit=crop',
  stats: {
    totalPatients: 1250,
    recordsUploaded: 3890,
    doctorsCount: 45
  }
};
