// Use string literal type instead of enum
export type UserRole = 'PATIENT' | 'HOSPITAL' | 'ADMIN';

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
  imageUrl?: string;
  aiAnalyzed?: boolean;
  files?: Array<{ url: string; name: string }>;
}

// Add this new interface for backend records
export interface Record {
  _id: string;
  title: string;
  description: string;
  patient: {
    _id: string;
    name: string;
    email: string;
  };
  hospital: {
    _id: string;
    name: string;
    hospitalName?: string;
    email: string;
  };
  hospitalName: string;
  recordType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  metadata?: {
    doctorName?: string;
    department?: string;
    dateOfVisit?: string;
    diagnosis?: string;
  };
  createdAt: string;
  updatedAt: string;
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
  patientName: string;
  hospitalName: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  reason: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: 'Active' | 'Inactive' | 'Critical' | 'Recovered';
  lastVisit: string;
}

export interface Dispute {
  id: string;
  recordTitle: string;
  patientName: string;
  hospitalName: string;
  reason: string;
  status: 'Pending Review' | 'In Review' | 'Resolved';
  date: string;
  aiSuggestion?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
  severity?: 'Low' | 'Medium' | 'High';
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'Medicine' | 'Appointment' | 'Refill' | 'Test';
  status: 'UPCOMING' | 'COMPLETED' | 'REFILL_NEEDED';
}

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  bloodGroup: string;
  gender: string;
  address: string;
  emergencyContact: string;
  avatar: string;
  stats: {
    totalRecords: number;
    approvedRecords: number;
    hospitalsVisited: number;
  };
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
  };
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

// Export as named export
export { UserRole };