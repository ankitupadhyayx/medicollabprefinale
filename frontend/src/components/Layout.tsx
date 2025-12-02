import React, { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Settings,
  LogOut,
  User,
  Bell,
  Search,
  Building2,
  Users,
  AlertTriangle,
  BarChart,
  FileSearch,
  Database,
  CheckCircle,
  Activity,
  Clock,
  Brain,
  CreditCard,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'PATIENT':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/patient/dashboard' },
          { icon: CheckCircle, label: 'Approvals', path: '/patient/approvals' },
          { icon: Activity, label: 'Health Timeline', path: '/patient/timeline' },
          { icon: Calendar, label: 'Appointments', path: '/patient/appointments' },
          { icon: Clock, label: 'Reminders', path: '/patient/reminders' },
          { icon: Brain, label: 'AI Insights', path: '/patient/ai-insights' },
          { icon: User, label: 'Profile', path: '/patient/profile' },
        ];
      case 'HOSPITAL':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/hospital/dashboard' },
          { icon: Users, label: 'Patient Directory', path: '/hospital/patients' },
          { icon: CreditCard, label: 'Billing & Invoices', path: '/hospital/billing' },
          { icon: FileText, label: 'Reports & Analytics', path: '/hospital/reports' },
          { icon: Building2, label: 'Hospital Profile', path: '/hospital/profile' },
        ];
      case 'ADMIN':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: Building2, label: 'Hospitals / Doctors', path: '/admin/hospitals' },
          { icon: Users, label: 'Patients', path: '/admin/patients' },
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">MediCollab</h1>
          <p className="text-xs text-gray-500 mt-1">{user?.role} Portal</p>
        </div>
        
        <nav className="px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};