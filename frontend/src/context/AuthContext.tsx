import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/auth.api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Optional: verify token or fetch profile
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('token', res.token);
  };

  const signup = async (email: string, password: string) => {
    const res = await authApi.signup(email, password);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('token', res.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = { user, token, login, signup, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};