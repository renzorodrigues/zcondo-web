'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

function AuthProviderContent({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Bootstrap auth function
  const bootstrapAuth = useCallback(async () => {
    try {
      const token = tokenService.getAccessToken();
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Se o token expirou, tenta renovar
      if (tokenService.isTokenExpired()) {
        const newToken = await tokenService.refreshAccessToken();
        if (!newToken) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
      }

      // Se chegou aqui, temos um token válido
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error during bootstrap:', error);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  // Bootstrap auth state
  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  // Listen for storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Ignore changes from condominium selection
      if (e.key === 'selectedCondominiumId') return;
      
      bootstrapAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [bootstrapAuth]);

  // Efeito para verificar o token quando o pathname mudar
  useEffect(() => {
    // Verifica se o token existe e está válido quando o pathname mudar
    const token = tokenService.getAccessToken();
    if (token && !tokenService.isTokenExpired()) {
      // Se o token é válido, mantém o usuário autenticado
      if (!isAuthenticated) {
        setIsAuthenticated(true);
      }
    }
  }, [pathname, user, isAuthenticated]);

  // Efeito para lidar com redirecionamentos baseado no estado de autenticação
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Se estiver autenticado e tentar acessar uma rota pública, redireciona para o dashboard
        if (pathname === '/login' || pathname === '/register' || pathname === '/' || pathname === '/landing') {
          // Realiza o refresh do token antes de redirecionar
          tokenService.refreshAccessToken().then(() => {
            // Não limpa o estado do usuário durante o redirecionamento
            router.replace('/dashboard');
          });
        }
      } else {
        if (!pathname.startsWith('/login') && 
            !pathname.startsWith('/register') && 
            !pathname.startsWith('/landing') && 
            !pathname.startsWith('/activate') && 
            pathname !== '/') {
          const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
          router.replace(redirectUrl);
        }
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Efeito para carregar as informações do usuário do localStorage
  useEffect(() => {
    // Tenta carregar as informações do usuário do localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    const result = await loginService.login(username, password);

    if (!result.access_token) {
      throw new Error('No access token received');
    }

    // Usar diretamente as informações do usuário da resposta da API
    if (result.user) {
      // Armazena as informações do usuário no estado
      setUser(result.user);
      setIsAuthenticated(true);
      
      // Armazena as informações do usuário no localStorage para persistência
      localStorage.setItem('user', JSON.stringify(result.user));
    }
  };

  const logout = async () => {
    try {
      // Limpa as informações do usuário do estado e do localStorage
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      
      // Chama a API de logout
      await loginService.logout();
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Mesmo em caso de erro, garante que os tokens estejam limpos
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      router.replace('/');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProviderContent>{children}</AuthProviderContent>
    </Suspense>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 