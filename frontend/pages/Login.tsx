import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { Activity, User, Building2, ShieldCheck, ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.PATIENT);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      login(selectedRole);
      setIsLoading(false);
      
      // Redirect based on role
      if (selectedRole === UserRole.PATIENT) navigate('/patient/dashboard');
      else if (selectedRole === UserRole.HOSPITAL) navigate('/hospital/dashboard');
      else navigate('/admin/dashboard');
    }, 1000);
  };

  const RoleCard = ({ role, icon: Icon, label }: { role: UserRole, icon: any, label: string }) => (
    <button
      type="button"
      onClick={() => setSelectedRole(role)}
      className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all w-full ${
        selectedRole === role 
          ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
      }`}
    >
      <Icon size={32} className="mb-2" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Back to Home */}
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center text-gray-500 hover:text-primary-600 transition-colors font-medium">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex justify-center items-center space-x-2 text-primary-600 mb-6 hover:opacity-80 transition-opacity">
          <Activity size={48} />
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">MediCollab</h1>
        </Link>
        <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Select your user type to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          <div className="grid grid-cols-3 gap-3 mb-8">
            <RoleCard role={UserRole.PATIENT} icon={User} label="Patient" />
            <RoleCard role={UserRole.HOSPITAL} icon={Building2} label="Hospital" />
            <RoleCard role={UserRole.ADMIN} icon={ShieldCheck} label="Admin" />
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                  defaultValue={selectedRole === UserRole.HOSPITAL ? 'admin@hospital.com' : 'patient@example.com'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  defaultValue="password"
                />
              </div>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Sign in as {selectedRole === UserRole.PATIENT ? 'Patient' : selectedRole === UserRole.HOSPITAL ? 'Hospital' : 'Admin'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to MediCollab?
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
               <Button variant="outline" size="sm" onClick={() => navigate('/register/patient')}>Register Patient</Button>
               <Button variant="outline" size="sm" onClick={() => navigate('/register/hospital')}>Register Hospital</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};