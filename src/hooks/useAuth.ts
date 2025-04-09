'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    // Verificar se existe um usuário no localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simulação de autenticação
      // Em um ambiente real, isso seria uma chamada à API
      if (email && password) {
        // Criar um usuário fake
        const fakeUser = {
          id: '1',
          name: 'Usuário Teste',
          email: email,
          role: 'admin'
        };
        
        // Salvar no estado e no localStorage
        setUser(fakeUser);
        localStorage.setItem('user', JSON.stringify(fakeUser));
        
        // Usar window.location.href para garantir o redirecionamento
        window.location.href = '/dashboard';
        return true;
      } else {
        throw new Error('Email e senha são obrigatórios');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remover o usuário do estado e do localStorage
    setUser(null);
    localStorage.removeItem('user');
    // Usar window.location.href para garantir o redirecionamento
    window.location.href = '/login';
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
} 