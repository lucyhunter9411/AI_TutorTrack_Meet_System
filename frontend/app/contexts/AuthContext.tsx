'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import API from '../../utils/api';

interface User {
  email: string;
  role: string;
  _id: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      console.log('AuthContext - Fetching user data...');
      console.log('AuthContext - Authorization header:', API.defaults.headers.common['Authorization']);
      
      // First test the JWT authentication
      console.log('AuthContext - Testing JWT authentication...');
      const testResponse = await API.get('/users/test');
      console.log('AuthContext - Test response:', testResponse.data);
      
      // Then fetch user data
      const response = await API.get('/users/me');
      console.log('AuthContext - User data received:', response.data);
      setUser(response.data);
    } catch (error) {
      console.log('AuthContext - Error fetching user data:', error);
      // If token is invalid, remove it
      localStorage.removeItem('token');
      delete API.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  useEffect(() => {
    // Check if user is already logged in (check localStorage for token)
    const token = localStorage.getItem('token');
    if (token) {
      // Set the token in axios headers
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch user data
      fetchUserData().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { access_token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', access_token);
      
      // Set token in axios headers
      API.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Fetch user data
      await fetchUserData();
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 