import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
  role?: 'PATIENT' | 'HOSPITAL' | 'ADMIN';
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'PATIENT' | 'HOSPITAL' | 'ADMIN';
  phone: string;
  age?: number;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  hospitalName?: string;
  licenseId?: string;
  specialization?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'PATIENT' | 'HOSPITAL' | 'ADMIN';
    isVerified?: boolean;
  };
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    console.log('🚀 Calling register API with:', { ...data, password: '***' });
    
    try {
      const response = await api.post('/auth/register', data);
      console.log('✅ Registration response:', response.data);
      
      // Handle both response formats
      if (response.data.token && response.data.user) {
        return response.data;
      } else if (response.data.token && response.data.id) {
        // Backend returned flat structure, convert it
        return {
          token: response.data.token,
          user: {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
            isVerified: response.data.isVerified,
          },
        };
      }
      
      throw new Error('Invalid response format from server');
    } catch (error: any) {
      console.error('❌ Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🚀 Sending login request:', { ...credentials, password: '***' });
    
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('✅ Login response:', response.data);
      
      // Handle both response formats
      if (response.data.token && response.data.user) {
        return response.data;
      } else if (response.data.token && response.data.id) {
        // Backend returned flat structure, convert it
        return {
          token: response.data.token,
          user: {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
            isVerified: response.data.isVerified,
          },
        };
      }
      
      throw new Error('Invalid response format from server');
    } catch (error: any) {
      console.error('❌ Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  async validateToken(): Promise<boolean> {
    try {
      const response = await api.get('/auth/validate');
      return response.data.valid === true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  },

  logout() {
    localStorage.removeItem('user');
  },
};