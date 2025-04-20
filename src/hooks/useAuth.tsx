'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loginService } from '@/services/auth/login.service';
import { tokenService } from '@/services/auth/token.service';
import { userService } from '@/services/auth/user.service';
import { apiService } from '@/services/api';
import { UserData } from '@/types/auth';
import { toast } from 'react-hot-toast';

// Define a estrutura do contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean; // Indica se o usuário está autenticado
  isUserRegistered: boolean; // Indica se o usuário completou o registro
  isLoading: boolean; // Estado de carregamento para operações de autenticação
  user: UserData | null; // Dados do usuário atual
  login: (username: string, password: string) => Promise<boolean>; // Função de login
  logout: () => void; // Função de logout
}

// Cria o contexto de autenticação com valor padrão indefinido
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Lista de rotas públicas que não requerem autenticação
const publicRoutes = ['/', '/login', '/register', '/register/confirmation', '/landing', '/activate'];

// Função auxiliar para verificar se uma rota é pública
const isPublicRoute = (pathname: string) => {
  return publicRoutes.includes(pathname) || pathname.startsWith('/activate/');
};

// Chave usada para armazenar dados do usuário no localStorage
const USER_STORAGE_KEY = 'user_data';

// Função para salvar dados do usuário no localStorage
const saveUserToStorage = (userData: UserData) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  }
};

// Função para recuperar dados do usuário do localStorage
const getUserFromStorage = (): UserData | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

// Função para limpar dados do usuário do localStorage
const clearUserFromStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

// Função para definir o cookie is_user_registered de forma consistente
const setUserRegisteredCookie = (isRegistered: boolean) => {
  // Define o cookie com opções mais robustas para garantir persistência
  document.cookie = `is_user_registered=${isRegistered}; path=/; max-age=86400; SameSite=Lax; secure`;
  console.log(`Cookie is_user_registered definido como: ${isRegistered}`);
};

// Componente AuthProvider que envolve a aplicação e fornece o contexto de autenticação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  // Função para verificar o status de autenticação
  const checkAuth = useCallback(async () => {
    try {
      // Primeiro tenta obter o usuário do localStorage para evitar chamadas desnecessárias à API
      const storedUser = getUserFromStorage();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
        try {
          const isRegistered = await userService.checkActivation(storedUser.email);
          setIsUserRegistered(isRegistered);
          setUserRegisteredCookie(isRegistered);
        } catch (error) {
          console.error('Erro ao verificar registro do usuário:', error);
        }
        return;
      }

      // Verifica se temos um token
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

      // Se já estiver autenticado e tiver usuário, apenas verifica o status de registro
      if (isAuthenticated && user) {
        const isRegistered = await userService.checkActivation(user.email);
        setIsUserRegistered(isRegistered);
        setUserRegisteredCookie(isRegistered);
        return;
      }

      setIsAuthenticated(true);

      // Se não tiver no localStorage, busca do perfil da API
      const response = await apiService.getProfile();
      const userData = response.data.data;
      setUser(userData);
      saveUserToStorage(userData);

      // Verifica se o usuário está registrado usando o email
      if (!userData?.email) {
        console.error('Email do usuário não encontrado');
        return;
      }

      const isRegistered = await userService.checkActivation(userData.email);
      setIsUserRegistered(isRegistered);
      setUserRegisteredCookie(isRegistered);
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

  // Verifica a autenticação quando o componente é montado
  useEffect(() => {
    checkAuth();
  }, []); // Removidas as dependências que causavam loops

  // Função para lidar com o login do usuário
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      // Chama o serviço de login para autenticar o usuário
      const { access_token, user: userData } = await loginService.login(username, password);
      tokenService.setAccessToken(access_token);
      setUser(userData);
      saveUserToStorage(userData);
      setIsAuthenticated(true);
      
      // Verifica se o usuário está registrado
      console.log('Verificando registro do usuário após login:', userData.email);
      const isRegistered = await userService.checkActivation(userData.email);
      console.log('Resultado da verificação de registro:', isRegistered);
      setIsUserRegistered(isRegistered);
      setUserRegisteredCookie(isRegistered);
      
      // Retorna o status de registro para o componente de login fazer o redirecionamento
      return isRegistered;
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Usuário ou senha inválidos');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com o logout do usuário
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
      document.cookie = 'is_user_registered=; path=/; max-age=0; SameSite=Lax; secure';
      
      // Por fim, redireciona para a página de login
      router.push('/login');
    }
  };

  // Fornece o contexto de autenticação para os componentes filhos
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

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 