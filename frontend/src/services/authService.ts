import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
  role: 'PATIENT' | 'HOSPITAL';
  phone?: string;
  hospitalName?: string;
  hospitalAddress?: string;
  licenseNumber?: string;
}

export const authService = {
  // Register new user
  register: async (userData: RegisterData) => {
    console.log('📝 Registration request:', userData);
    const response = await axios.post(`${API_URL}/register`, userData);
    console.log('✅ Registration response:', response.data);
    
    // Save token and user data
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Login user
  login: async (loginData: LoginData) => {
    console.log('🔐 Sending login request:', { email: loginData.email });
    
    const response = await axios.post(`${API_URL}/login`, loginData);
    
    console.log('✅ Login response:', response.data);
    
    // Save token and user data to localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('💾 Token saved:', response.data.token.substring(0, 20) + '...');
    }
    
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('💾 User saved:', response.data.user);
    }
    
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('👋 Logged out');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Validate token with backend
  validateToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await axios.get(`${API_URL}/validate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.valid;
    } catch (error) {
      return false;
    }
  },
};