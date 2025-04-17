'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginService } from '@/services/auth';
import { UserData } from '@/types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await loginService.isAuthenticated();
        console.log('Status de autenticação:', isAuth);
        setIsAuthenticated(isAuth);
        
        if (isAuth) {
          const userData = loginService.getUserData();
          console.log('Dados do usuário:', userData);
          setUser(userData);
          
          if (pathname === '/login') {
            router.push('/dashboard');
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  const login = async (email: string, password: string) => {
    try {
      await loginService.login({ username: email, password });
      setIsAuthenticated(true);
      
      const userData = loginService.getUserData();
      console.log('Login bem-sucedido para:', userData);
      setUser(userData);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      setIsAuthenticated(false);
      setUser(null);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha na autenticação');
    }
  };

  const logout = () => {
    loginService.logout();
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
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