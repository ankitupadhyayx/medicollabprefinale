
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  BarChart, 
  UploadCloud, 
  Users, 
  AlertTriangle, 
  LogOut, 
  Menu, 
  X, 
  Activity,
  Calendar,
  Settings,
  CreditCard,
  Brain,
  Shield,
  FileSearch,
  Database,
  Lock,
  Clock,
  User,
  Building2
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return <>{children}</>;

  const getNavItems = () => {
    switch (user.role) {
      case UserRole.PATIENT:
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/patient/dashboard' },
          { icon: CheckCircle, label: 'Approvals', path: '/patient/approvals' },
          { icon: Activity, label: 'Health Timeline', path: '/patient/timeline' },
          { icon: Calendar, label: 'Appointments', path: '/patient/appointments' },
          { icon: Clock, label: 'Reminders', path: '/patient/reminders' },
          { icon: Brain, label: 'AI Insights', path: '/patient/ai-insights' },
          { icon: User, label: 'Profile', path: '/patient/profile' },
        ];
      case UserRole.HOSPITAL:
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/hospital/dashboard' },
          { icon: Users, label: 'Patient Directory', path: '/hospital/patients' },
          { icon: CreditCard, label: 'Billing & Invoices', path: '/hospital/billing' },
          { icon: FileText, label: 'Reports & Analytics', path: '/hospital/reports' },
          { icon: Building2, label: 'Hospital Profile', path: '/hospital/profile' },
        ];
      case UserRole.ADMIN:
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: Users, label: 'Hospitals / Doctors', path: '/admin/hospitals' },
          { icon: Users, label: 'Patients', path: '/admin/patients' }, // View only
          { icon: AlertTriangle, label: 'Disputed Records', path: '/admin/disputes' },
          { icon: BarChart, label: 'System Analytics', path: '/admin/analytics' },
          { icon: FileSearch, label: 'Audit Trail', path: '/admin/audit' },
          { icon: Database, label: 'Backup & Data', path: '/admin/backup' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-[#EEF2FF] flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center border-b sticky top-0 z-20 shadow-sm">
        <div className="flex items-center space-x-2 text-primary-600 font-bold text-xl">
          <Activity /> <span>MediCollab</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-10 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-lg
      `}>
        <div className="p-6 flex items-center space-x-2 text-primary-600 font-bold text-2xl border-b border-gray-100">
           <div className="bg-primary-100 p-1.5 rounded-lg">
             <Activity size={24} />
           </div>
           <span className="tracking-tight">MediCollab</span>
        </div>
        
        {/* Profile Section */}
        <div className="px-6 py-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border-4 border-primary-50 shadow-md object-cover" />
              {user.role === UserRole.ADMIN && (
                 <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary-600 border-2 border-white rounded-full flex items-center justify-center">
                    <Shield size={12} className="text-white" />
                 </div>
              )}
              {user.role !== UserRole.ADMIN && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <h3 className="mt-3 font-bold text-gray-900">{user.name}</h3>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{user.role}</p>
            
            {(user.role === UserRole.HOSPITAL || user.role === UserRole.ADMIN || user.role === UserRole.PATIENT) && (
              <div className="mt-2 flex items-center px-2 py-1 bg-ai-500/10 rounded-full border border-ai-500/20">
                <Brain size={12} className="text-ai-500 mr-1.5" />
                <span className="text-[10px] font-bold text-ai-600 uppercase">AI Enabled 🧠</span>
              </div>
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="px-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Simplified active logic
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 border-l-4
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary-600 to-medical-600 text-white shadow-md shadow-primary-500/30 border-transparent' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 border-transparent hover:border-primary-200'
                  }
                `}
              >
                <Icon size={20} className={isActive ? 'text-white' : ''} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 space-y-1">
          <button 
            onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl w-full transition-colors ${location.pathname === '/settings' ? 'text-primary-600 bg-gray-50 font-bold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
          <button 
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl w-full transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen relative bg-[#F5F6FB]">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
