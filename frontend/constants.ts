
import { MedicalRecord, UserRole, AnalyticsData, Hospital, Appointment, Patient, Dispute, AuditLog, Reminder, PatientProfile, HospitalProfile, Bill, Report } from './types';

export const MOCK_RECORDS: MedicalRecord[] = [
  {
    id: '1',
    title: 'Annual Cardiac Checkup',
    hospitalName: 'City General Hospital',
    date: '2023-10-24',
    type: 'Lab Report',
    status: 'APPROVED',
    description: 'Comprehensive blood work analysis showing elevated cholesterol levels. Recommended diet changes.',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    aiAnalyzed: true
  },
  {
    id: '2',
    title: 'MRI Scan - Lumbar Spine',
    hospitalName: 'NeuroSpine Institute',
    date: '2023-11-05',
    type: 'Imaging',
    status: 'PENDING',
    description: 'L4-L5 disc herniation observed. Physiotherapy recommended.',
    imageUrl: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: '3',
    title: 'Dermatology Consultation',
    hospitalName: 'Skin Care Clinic',
    date: '2023-11-12',
    type: 'Prescription',
    status: 'REJECTED',
    description: 'Prescription for eczema treatment. Rejected due to incorrect insurance coding.',
  },
  {
    id: '4',
    title: 'ER Visit Report',
    hospitalName: 'City General Hospital',
    date: '2023-12-01',
    type: 'Discharge Summary',
    status: 'PENDING',
    description: 'Patient admitted for acute stomach pain. Diagnosed with gastritis.',
    aiAnalyzed: true
  }
];

export const MOCK_PENDING_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-pending-1',
    hospitalId: 'h1',
    hospitalName: 'St. Marys Medical Center',
    date: '2023-12-05',
    time: '09:30 AM',
    reason: 'Requested Follow-up: Cardiac Review Post-Medication',
    status: 'PENDING'
  }
];

export const HOSPITAL_APPOINTMENT_REQUESTS: Appointment[] = [
  {
    id: 'req-1',
    hospitalId: 'h1',
    hospitalName: 'City General Hospital',
    date: '2023-12-12',
    time: '10:00 AM',
    reason: 'Severe chest pain recurrence',
    status: 'PENDING'
  },
  {
    id: 'req-2',
    hospitalId: 'h1',
    hospitalName: 'City General Hospital',
    date: '2023-12-14',
    time: '02:30 PM',
    reason: 'Regular checkup',
    status: 'PENDING'
  }
];

export const MOCK_PATIENTS: Patient[] = [
  { id: 'p1', name: 'Sarah Jenkins', age: 45, gender: 'F', lastVisit: '2023-11-20', status: 'Active', aiFlag: true },
  { id: 'p2', name: 'Michael Chen', age: 32, gender: 'M', lastVisit: '2023-11-18', status: 'Recovered' },
  { id: 'p3', name: 'Emma Wilson', age: 28, gender: 'F', lastVisit: '2023-11-15', status: 'Active' },
  { id: 'p4', name: 'James Rodriguez', age: 55, gender: 'M', lastVisit: '2023-11-10', status: 'Critical', aiFlag: true },
  { id: 'p5', name: 'Linda Johnson', age: 62, gender: 'F', lastVisit: '2023-11-05', status: 'Active', aiFlag: true },
];

export const ANALYTICS_DATA: AnalyticsData[] = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 72 },
  { name: 'Mar', value: 68 },
  { name: 'Apr', value: 85 },
  { name: 'May', value: 82 },
  { name: 'Jun', value: 90 },
];

export const MOCK_HOSPITALS: Hospital[] = [
  { id: 'h1', name: 'St. Marys Medical Center', location: 'New York, NY', verified: true, status: 'Verified', licenseId: 'NY-MED-992', aiFlag: false },
  { id: 'h2', name: 'Grand River Hospital', location: 'Austin, TX', verified: false, status: 'Pending', licenseId: 'TX-REG-001', aiFlag: true },
  { id: 'h3', name: 'Sunrise Health Clinic', location: 'Miami, FL', verified: true, status: 'Verified', licenseId: 'FL-HLT-445', aiFlag: false },
  { id: 'h4', name: 'Apex Cardio Institute', location: 'Chicago, IL', verified: false, status: 'Suspended', licenseId: 'IL-CAR-888', aiFlag: true },
];

export const MOCK_DISPUTES: Dispute[] = [
  { id: 'd1', recordTitle: 'Orthopedic Surgery Bill', patientName: 'John Doe', hospitalName: 'Grand River Hospital', status: 'Pending Review', aiSuggestion: 'Potential Issue' },
  { id: 'd2', recordTitle: 'MRI Scan Report', patientName: 'Alice Smith', hospitalName: 'St. Marys Medical Center', status: 'Pending Review', aiSuggestion: 'Likely Valid' },
  { id: 'd3', recordTitle: 'Prescription #9922', patientName: 'Bob Jones', hospitalName: 'Sunrise Health Clinic', status: 'Resolved', aiSuggestion: 'Likely Valid' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'l1', action: 'Record Access', performedBy: 'Dr. A. Patel', target: 'Patient #8821', date: '2023-12-01 10:45 AM', result: 'Secure' },
  { id: 'l2', action: 'Hospital Verification', performedBy: 'Admin System', target: 'Apex Cardio', date: '2023-12-01 09:30 AM', result: 'Failed Attempt' },
  { id: 'l3', action: 'Data Backup', performedBy: 'System Job', target: 'Database', date: '2023-12-01 02:00 AM', result: 'Secure' },
  { id: 'l4', action: 'Login Attempt', performedBy: 'Unknown IP', target: 'Admin Panel', date: '2023-11-30 11:55 PM', result: 'Restricted Attempt' },
];

export const MOCK_REMINDERS: Reminder[] = [
  { id: 'r1', title: 'Atorvastatin (Cholesterol)', type: 'MEDICINE', time: '08:00 AM', frequency: 'Daily', duration: '30 Days', status: 'ONGOING', aiSuggested: true },
  { id: 'r2', title: 'Vitamin D3', type: 'MEDICINE', time: '09:00 PM', frequency: 'Weekly', duration: 'Lifetime', status: 'REFILL_NEEDED' },
  { id: 'r3', title: 'Cardiac Review', type: 'CHECKUP', date: '2023-12-15', time: '10:00 AM', status: 'UPCOMING', aiSuggested: true }
];

export const MOCK_PATIENT_PROFILE: PatientProfile = {
  id: 'u1',
  name: 'Alex Doe',
  email: 'alex@example.com',
  phone: '+1 (555) 123-4567',
  dob: '1985-04-12',
  gender: 'Male',
  bloodGroup: 'O+',
  address: '123 Wellness Ave, Health City, HC 90210',
  emergencyContact: {
    name: 'Jane Doe (Spouse)',
    phone: '+1 (555) 987-6543'
  },
  avatar: 'https://picsum.photos/100/100?random=50',
  stats: {
    totalRecords: 42,
    approvedRecords: 38,
    hospitalsVisited: 5
  }
};

export const MOCK_HOSPITAL_PROFILE: HospitalProfile = {
  id: 'h1',
  name: 'St. Marys Medical Center',
  licenseId: 'NY-MED-992-A',
  email: 'admin@stmarys.com',
  phone: '+1 (555) 999-8888',
  address: '400 W 113th St, New York, NY 10025',
  specialization: ['Cardiology', 'Neurology', 'Emergency Care'],
  description: 'A premier healthcare facility dedicated to providing world-class medical services with compassion and care.',
  website: 'www.stmarys.com',
  avatar: 'https://picsum.photos/150/150?random=90',
  banner: 'https://picsum.photos/1200/300?random=91',
  stats: {
    totalPatients: 1240,
    recordsUploaded: 8500,
    doctorsCount: 45
  }
};

export const MOCK_BILLS: Bill[] = [
  { id: 'b1', patientName: 'Sarah Jenkins', date: '2023-11-20', amount: 150.00, status: 'PAID', service: 'General Consultation' },
  { id: 'b2', patientName: 'Michael Chen', date: '2023-11-22', amount: 450.00, status: 'PENDING', service: 'MRI Scan' },
  { id: 'b3', patientName: 'James Rodriguez', date: '2023-11-23', amount: 1200.00, status: 'OVERDUE', service: 'Surgery Advance' },
  { id: 'b4', patientName: 'Linda Johnson', date: '2023-11-24', amount: 75.00, status: 'PAID', service: 'Blood Work' },
];

export const MOCK_REPORTS: Report[] = [
  { id: 'rep-1', title: 'Monthly Patient Influx', date: '2023-11-01', type: 'Monthly', status: 'Ready' },
  { id: 'rep-2', title: 'Annual Revenue Audit', date: '2023-10-01', type: 'Annual', status: 'Ready' },
  { id: 'rep-3', title: 'Compliance & Security Log', date: '2023-12-01', type: 'Audit', status: 'Generating' },
];

export const DEFAULT_USER = {
  id: 'u1',
  name: 'Alex Doe',
  email: 'alex@example.com',
  role: UserRole.PATIENT,
  avatar: 'https://picsum.photos/100/100?random=50'
};
