
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import { Register } from './pages/Register';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';
import { PatientDashboard } from './pages/patient/Dashboard';
import { PatientAnalytics } from './pages/patient/Analytics';
import { PatientAppointments } from './pages/patient/Appointments';
import { PatientApprovals } from './pages/patient/Approvals';
import { PatientTimeline } from './pages/patient/Timeline';
import { PatientReminders } from './pages/patient/Reminders';
import { PatientAIInsights } from './pages/patient/AIInsights';
import { PatientProfile } from './pages/patient/Profile';
import { HospitalDashboard } from './pages/hospital/Dashboard';
import { HospitalPatients } from './pages/hospital/Patients';
import { HospitalBilling } from './pages/hospital/Billing';
import { HospitalReports } from './pages/hospital/Reports';
import { HospitalProfile } from './pages/hospital/Profile';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminHospitals } from './pages/admin/Hospitals';
import { AdminPatients } from './pages/admin/Patients';
import { AdminDisputes } from './pages/admin/Disputes';
import { AdminAnalytics } from './pages/admin/Analytics';
import { AdminAudit } from './pages/admin/Audit';
import { AdminBackup } from './pages/admin/Backup';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return <Layout>{children}</Layout>;
};

const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* Unified Registration Route */}
      <Route path="/register" element={<Register />} />
      <Route path="/register/patient" element={<Navigate to="/register?role=patient" replace />} />
      <Route path="/register/hospital" element={<Navigate to="/register?role=hospital" replace />} />

      {/* Patient Routes */}
      <Route path="/patient/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute><PatientAppointments /></ProtectedRoute>} />
      <Route path="/patient/approvals" element={<ProtectedRoute><PatientApprovals /></ProtectedRoute>} />
      <Route path="/patient/timeline" element={<ProtectedRoute><PatientTimeline /></ProtectedRoute>} />
      <Route path="/patient/reminders" element={<ProtectedRoute><PatientReminders /></ProtectedRoute>} />
      <Route path="/patient/ai-insights" element={<ProtectedRoute><PatientAIInsights /></ProtectedRoute>} />
      <Route path="/patient/profile" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
      <Route path="/patient/analytics" element={<ProtectedRoute><PatientAnalytics /></ProtectedRoute>} />

      {/* Hospital Routes */}
      <Route path="/hospital/dashboard" element={<ProtectedRoute><HospitalDashboard /></ProtectedRoute>} />
      <Route path="/hospital/patients" element={<ProtectedRoute><HospitalPatients /></ProtectedRoute>} />
      <Route path="/hospital/billing" element={<ProtectedRoute><HospitalBilling /></ProtectedRoute>} />
      <Route path="/hospital/reports" element={<ProtectedRoute><HospitalReports /></ProtectedRoute>} />
      <Route path="/hospital/profile" element={<ProtectedRoute><HospitalProfile /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/hospitals" element={<ProtectedRoute><AdminHospitals /></ProtectedRoute>} />
      <Route path="/admin/patients" element={<ProtectedRoute><AdminPatients /></ProtectedRoute>} />
      <Route path="/admin/disputes" element={<ProtectedRoute><AdminDisputes /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/audit" element={<ProtectedRoute><AdminAudit /></ProtectedRoute>} />
      <Route path="/admin/backup" element={<ProtectedRoute><AdminBackup /></ProtectedRoute>} />

      {/* Common Protected Routes */}
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
