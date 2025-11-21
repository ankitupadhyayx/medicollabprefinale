import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEFAULT_USER } from '../constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking local storage
    const storedUser = localStorage.getItem('medicollab_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (role: UserRole) => {
    // In a real app, this would accept credentials and validate with API
    const newUser: User = {
      ...DEFAULT_USER,
      role: role,
      name: role === UserRole.HOSPITAL ? 'City General Hospital' : role === UserRole.ADMIN ? 'System Admin' : 'Alex Doe',
      avatar: role === UserRole.HOSPITAL ? 'https://picsum.photos/100/100?random=60' : DEFAULT_USER.avatar
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('medicollab_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('medicollab_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};