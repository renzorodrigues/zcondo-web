import axios from 'axios';
import { tokenService } from './auth/token.service';
import { UserData } from '@/types/auth';

interface ApiResponse<T> {
  data: T;
}

interface LoginResponse {
  data: {
    token: {
      access_token: string;
      expires_in: number;
      refresh_token: string;
    };
    user: UserData;
  };
}

// Configuração base da API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/Authentication/refresh')) {
      originalRequest._retry = true;

      try {
        // Tenta atualizar o token
        const newToken = await tokenService.refreshAccessToken();
        if (newToken) {
          // Atualiza o header da requisição original
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Repete a requisição original
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Erro ao tentar refresh token:', refreshError);
        // Se falhar o refresh, redireciona para o login
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Auth
  login: (username: string, password: string) => 
    api.post<LoginResponse>('/Authentication/login', { username, password }),
  
  register: (userData: UserData) => 
    api.post('/Authentication/register', userData),
  
  logout: () => 
    api.post('/Authentication/logout', null, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }),
  
  refresh: () => 
    api.post('/Authentication/refresh', null, {
      withCredentials: true
    }),
  
  // User
  getProfile: () => 
    api.get<ApiResponse<UserData>>('/User/profile'),
  
  updateProfile: (userData: UserData) => 
    api.put('/User/profile', userData),
  
  // Add more API methods as needed
};

export { api }; 