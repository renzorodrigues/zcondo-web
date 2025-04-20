import axios from 'axios';
import { tokenService } from '@/services/auth/token.service';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de acesso em todas as requisições
instance.interceptors.request.use(
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

// Interceptor para lidar com erros de autenticação
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (Unauthorized) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenta obter um novo token
        const newToken = await tokenService.refreshAccessToken();
        if (!newToken) {
          throw new Error('No refresh token available');
        }

        // Atualiza o token no header da requisição original
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Tenta a requisição original novamente
        return instance(originalRequest);
      } catch (refreshError) {
        // Se falhar ao obter um novo token, redireciona para o login
        tokenService.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance; 