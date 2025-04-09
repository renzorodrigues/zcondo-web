'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se existe um token nos cookies
    const token = Cookies.get('auth-token');
    if (token) {
      // Aqui você faria uma chamada para sua API para validar o token
      // Por enquanto, vamos simular um usuário
      setUser({
        id: '1',
        name: 'Usuário Teste',
        email: 'teste@email.com',
        role: 'admin'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // In a real app, you would call your API here
      // const response = await api.post('/auth/login', { email, password });
      
      // For demo purposes, we'll just simulate a successful login
      const mockUser = {
        id: '1',
        name: 'Demo User',
        email: email,
        role: 'admin',
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remover o cookie
    Cookies.remove('auth-token');
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
} 