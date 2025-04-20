'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loginService } from '@/services/auth/login.service';
import { tokenService } from '@/services/auth/token.service';
import { userService } from '@/services/auth/user.service';
import { apiService } from '@/services/api';
import { UserData } from '@/types/auth';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  isUserRegistered: boolean;
  isLoading: boolean;
  user: UserData | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Lista de rotas públicas que não requerem autenticação
const publicRoutes = ['/', '/login', '/register', '/register/confirmation', '/landing', '/activate'];

// Função para verificar se uma rota é pública
const isPublicRoute = (pathname: string) => {
  return publicRoutes.includes(pathname) || pathname.startsWith('/activate/');
};

// Funções para gerenciar dados do usuário no localStorage
const USER_STORAGE_KEY = 'user_data';

const saveUserToStorage = (userData: UserData) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  }
};

const getUserFromStorage = (): UserData | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

const clearUserFromStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      // Tenta recuperar usuário do localStorage primeiro
      const storedUser = getUserFromStorage();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
        return;
      }

      const token = tokenService.getAccessToken();
      if (!token) {
        setIsAuthenticated(false);
        setIsUserRegistered(false);
        setUser(null);
        return;
      }

      // Verifica se o token é válido
      const isValid = !tokenService.isTokenExpired();
      if (!isValid) {
        tokenService.clearTokens();
        setIsAuthenticated(false);
        setIsUserRegistered(false);
        setUser(null);
        clearUserFromStorage();
        return;
      }

      // Se já está autenticado e tem usuário, apenas verifica o registro
      if (isAuthenticated && user) {
        const isRegistered = await userService.checkUser(user.email);
        setIsUserRegistered(isRegistered);
        return;
      }

      setIsAuthenticated(true);

      // Se não tem no localStorage, busca do perfil
      const response = await apiService.getProfile();
      const userData = response.data.data;
      setUser(userData);
      saveUserToStorage(userData);

      // Verifica se o usuário está registrado usando o email do login
      if (!userData?.email) {
        console.error('Email do usuário não encontrado');
        return;
      }

      const isRegistered = await userService.checkUser(userData.email);
      setIsUserRegistered(isRegistered);

      // Atualiza o cookie is_user_registered
      document.cookie = `is_user_registered=${isRegistered}; path=/; max-age=86400; SameSite=Lax`;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      // Em caso de erro, mantém os dados do usuário se existirem
      const storedUser = getUserFromStorage();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [router, user, isAuthenticated]);

  useEffect(() => {
    // Verifica a autenticação apenas uma vez ao montar o componente
    checkAuth();
  }, []); // Removido as dependências que causavam o loop

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const { access_token, user: userData } = await loginService.login(username, password);
      tokenService.setAccessToken(access_token);
      setUser(userData);
      saveUserToStorage(userData);
      setIsAuthenticated(true);
      
      // Verifica se o usuário está registrado
      console.log('Verificando registro do usuário após login:', userData.email);
      const isRegistered = await userService.checkUser(userData.email);
      console.log('Resultado da verificação de registro:', isRegistered);
      setIsUserRegistered(isRegistered);
      
      // Atualiza o cookie is_user_registered
      document.cookie = `is_user_registered=${isRegistered}; path=/; max-age=86400; SameSite=Lax`;
      
      // Retorna o estado de registro para o componente de login fazer o redirecionamento
      return isRegistered;
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Usuário ou senha inválidos');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Primeiro chama o serviço de logout para invalidar o token no servidor
      await loginService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Mesmo se houver erro, limpa os tokens e estados
      tokenService.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      setIsUserRegistered(false);
      clearUserFromStorage();
      
      // Remove o cookie is_user_registered
      document.cookie = 'is_user_registered=; path=/; max-age=0; SameSite=Lax';
      
      // Por fim, redireciona para o login
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isUserRegistered,
        isLoading,
        user,
        login,
        logout,
      }}
    >
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