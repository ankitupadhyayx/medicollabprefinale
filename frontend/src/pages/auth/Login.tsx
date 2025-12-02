import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, AlertCircle, Loader } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🚀 Attempting login with:', formData.email);
      
      const response = await authService.login(formData);
      
      console.log('✅ Login successful:', response);

      // Navigate based on role
      if (response.user.role === 'HOSPITAL') {
        navigate('/login#/hospital/dashboard');
      } else if (response.user.role === 'PATIENT') {
        navigate('/login#/patient/dashboard');
      } else if (response.user.role === 'ADMIN') {
        navigate('/login#/admin/dashboard');
      }
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-medical-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-medical-600 rounded-2xl mb-4 shadow-lg">
            <LogIn className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="your@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-2" size={20} />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};