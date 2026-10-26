import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'officer' | 'admin';
  department?: string;
  ward?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  role: 'citizen' | 'officer' | 'admin' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string; role?: string }) => Promise<User>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronously initialize user from localStorage to eliminate blank screen flicker or redirect races
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('roadguard_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    // If we have no token, auth initialization is immediately complete
    const token = localStorage.getItem('roadguard_access_token');
    return !!token;
  });

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('roadguard_access_token');
      const storedUser = localStorage.getItem('roadguard_user');

      if (storedToken && storedUser) {
        try {
          // Pre-populate default authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          // Verify and sync profile with /auth/me
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('roadguard_user', JSON.stringify(res.data));
        } catch {
          // Token invalid or expired — clear storage
          localStorage.removeItem('roadguard_access_token');
          localStorage.removeItem('roadguard_refresh_token');
          localStorage.removeItem('roadguard_user');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string; role?: string }): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', credentials);
      const { access_token, refresh_token, role, user_id, name, email } = res.data;

      localStorage.setItem('roadguard_access_token', access_token);
      localStorage.setItem('roadguard_refresh_token', refresh_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      const loggedUser: User = { id: user_id, name, email, role };
      localStorage.setItem('roadguard_user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      setIsLoading(false);
      return loggedUser;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (userData: { name: string; email: string; password: string; phone?: string }): Promise<User> => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', userData);
      // Automatically authenticate newly registered citizen seamlessly
      const loggedUser = await login({
        email: userData.email,
        password: userData.password,
      });
      return loggedUser;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('roadguard_access_token');
    localStorage.removeItem('roadguard_refresh_token');
    localStorage.removeItem('roadguard_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
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
