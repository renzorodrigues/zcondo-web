'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

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
      try {
        // Tentar obter o usuário do localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simulação de registro
      // Em um ambiente real, isso seria uma chamada à API
      if (name && email && password) {
        // Criar um usuário fake
        const fakeUser = {
          id: '1',
          name: name,
          email: email,
          role: 'admin'
        };
        
        // Salvar no estado e no localStorage
        setUser(fakeUser);
        localStorage.setItem('user', JSON.stringify(fakeUser));
        
        // Adicionar um cookie de autenticação
        Cookies.set('auth-token', 'fake-token', { expires: 7 }); // Expira em 7 dias
        
        // Redirecionar para o dashboard
        router.push('/dashboard');
        return true;
      } else {
        throw new Error('Nome, email e senha são obrigatórios');
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

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
        
        // Adicionar um cookie de autenticação
        Cookies.set('auth-token', 'fake-token', { expires: 7 }); // Expira em 7 dias
        
        // Redirecionar para o dashboard
        router.push('/dashboard');
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
    
    // Remover o cookie de autenticação
    Cookies.remove('auth-token');
    
    // Redirecionar para o login
    router.push('/login');
  };

  return {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };
} 