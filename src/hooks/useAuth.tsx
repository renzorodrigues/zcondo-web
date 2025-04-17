'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginService } from '@/services/auth';
import { UserData } from '@/types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
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
      }
    };

    checkAuth();
  }, [router, pathname]);

  const login = async (email: string, password: string) => {
    try {
      const { tokenData, userData } = await loginService.login({ username: email, password });
      setIsAuthenticated(true);
      setUser(userData);
      setAccessToken(tokenData.access_token);
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
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
    setAccessToken(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, accessToken, login, logout }}>
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