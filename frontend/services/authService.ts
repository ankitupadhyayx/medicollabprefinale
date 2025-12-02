import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'patient' | 'hospital';
  phone?: string;
  address?: string;
  hospitalName?: string;
  licenseNumber?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified?: boolean;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  validateToken: async (): Promise<boolean> => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return false;
      
      const parsedUser = JSON.parse(user);
      if (!parsedUser.token) return false;

      // Try to fetch user profile to validate token
      await api.get(`/${parsedUser.user.role}/profile`);
      return true;
    } catch {
      return false;
    }
  },
};