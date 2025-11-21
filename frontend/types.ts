
export enum UserRole {
  PATIENT = 'PATIENT',
  HOSPITAL = 'HOSPITAL',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  hospitalName: string;
  date: string;
  type: 'Lab Report' | 'Prescription' | 'Imaging' | 'Discharge Summary' | 'Bill';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  description: string;
  imageUrl?: string; // For imaging/docs
  aiAnalyzed?: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  verified: boolean;
  status: 'Verified' | 'Pending' | 'Suspended';
  licenseId: string;
  aiFlag?: boolean;
}

export interface AnalyticsData {
  name: string;
  value: number;
}

export interface Appointment {
  id: string;
  hospitalId: string;
  hospitalName: string;
  date: string;
  time: string;
  reason: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'PENDING';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  status: 'Active' | 'Recovered' | 'Critical';
  aiFlag?: boolean;
}

export interface Dispute {
  id: string;
  recordTitle: string;
  patientName: string;
  hospitalName: string;
  status: 'Pending Review' | 'Resolved';
  aiSuggestion: 'Likely Valid' | 'Potential Issue';
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  target: string;
  date: string;
  result: 'Secure' | 'Failed Attempt' | 'Restricted Attempt';
}

export interface Reminder {
  id: string;
  title: string;
  type: 'MEDICINE' | 'CHECKUP';
  date?: string;
  time: string;
  frequency?: string;
  duration?: string;
  status: 'ONGOING' | 'COMPLETED' | 'REFILL_NEEDED' | 'UPCOMING';
  aiSuggested?: boolean;
}

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  avatar: string;
  stats: {
    totalRecords: number;
    approvedRecords: number;
    hospitalsVisited: number;
  }
}

export interface HospitalProfile {
  id: string;
  name: string;
  licenseId: string;
  email: string;
  phone: string;
  address: string;
  specialization: string[];
  description: string;
  website: string;
  avatar: string;
  banner: string;
  stats: {
    totalPatients: number;
    recordsUploaded: number;
    doctorsCount: number;
  }
}

export interface Bill {
  id: string;
  patientName: string;
  date: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  service: string;
}

export interface Report {
  id: string;
  title: string;
  date: string;
  type: 'Monthly' | 'Annual' | 'Audit';
  status: 'Ready' | 'Generating';
}
