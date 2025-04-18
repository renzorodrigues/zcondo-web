'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { loginService } from '@/services/auth/login.service';
import { tokenService } from '@/services/auth/token.service';
import { UserData } from '@/types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname() || '';
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const bootstrapAuth = async () => {
    try {
      // Evita múltiplos refreshes simultâneos
      if (isRefreshing) {
        return;
      }

      const token = tokenService.getAccessToken();

      if (token) {
        if (!tokenService.isTokenExpired()) {
          const decodedUser = tokenService.decodeToken(token);
          if (decodedUser) {
            setUser(decodedUser);
            setIsAuthenticated(true);
          }
        } else {
          setIsRefreshing(true);
          const newToken = await tokenService.refreshAccessToken();
          if (newToken) {
            const decodedUser = tokenService.decodeToken(newToken);
            if (decodedUser) {
              setUser(decodedUser);
              setIsAuthenticated(true);
            }
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
          setIsRefreshing(false);
        }
      } else {
        // Se não temos token, não tentamos refresh
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error during auth bootstrap:', error);
      setUser(null);
      setIsAuthenticated(false);
      setIsRefreshing(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Bootstrap auth apenas na montagem do componente
  useEffect(() => {
    bootstrapAuth();
  }, []);

  // Efeito para verificar o token quando o pathname mudar
  useEffect(() => {
    // Verifica se o token existe e está válido quando o pathname mudar
    const token = tokenService.getAccessToken();
    if (token && !tokenService.isTokenExpired()) {
      const decodedUser = tokenService.decodeToken(token);
      if (decodedUser && !user) {
        setUser(decodedUser);
        setIsAuthenticated(true);
      }
    }
  }, [pathname, user]);

  // Efeito para lidar com redirecionamentos baseado no estado de autenticação
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Se estiver autenticado e tentar acessar uma rota pública, redireciona para o dashboard
        if (pathname === '/login' || pathname === '/register' || pathname === '/' || pathname === '/landing') {
          // Realiza o refresh do token antes de redirecionar
          tokenService.refreshAccessToken().then(() => {
            router.replace('/dashboard');
          });
        }
      } else {
        if (!pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/landing') && pathname !== '/') {
          const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
          router.replace(redirectUrl);
        }
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, searchParams]);

  // Efeito para atualizar o estado quando o token mudar
  useEffect(() => {
    const handleStorageChange = () => {
      bootstrapAuth();
    };

    const handleTokenUpdate = (event: MessageEvent) => {
      if (event.data.type === 'TOKEN_UPDATE') {
        if (event.data.token) {
          const decodedUser = tokenService.decodeToken(event.data.token);
          if (decodedUser) {
            setUser(decodedUser);
            setIsAuthenticated(true);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const channel = new BroadcastChannel('auth');
    channel.addEventListener('message', handleTokenUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      channel.removeEventListener('message', handleTokenUpdate);
      channel.close();
    };
  }, []);

  const login = async (username: string, password: string) => {
    const result = await loginService.login(username, password);

    if (!result.access_token) {
      throw new Error('No access token received');
    }

    const decodedUser = tokenService.decodeToken(result.access_token);
    if (decodedUser) {
      setUser(decodedUser);
      setIsAuthenticated(true);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      await loginService.logout();
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 