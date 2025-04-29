import { api } from '../api';
import { LoginResponse } from '@/types/auth';
import { tokenService } from './token.service';

interface ApiLoginResponse {
  data: {
    token: {
      access_token: string;
      expires_in: number;
      refresh_expires_in: number;
      refresh_token: string;
      token_type: string;
      scope: string;
      session_state: string;
    };
    user: {
      username: string;
      name: string;
      email: string;
      avatar: string | null;
      roles: string[];
    };
  };
}

export const loginService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<ApiLoginResponse>('/authentication/login', {
        username,
        password,
      });

      if (!response.data?.data?.token?.access_token) {
        throw new Error('Token de acesso não recebido');
      }

      const { token, user } = response.data.data;

      return {
        access_token: token.access_token,
        expires_in: token.expires_in,
        refresh_token: token.refresh_token,
        user: {
          id: user.username,
          email: user.email,
          name: user.name,
          role: user.roles[0] || 'user'
        }
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Credenciais inválidas');
      }
      if (error.response?.status === 403) {
        throw new Error('Acesso negado');
      }
      throw new Error('Erro ao realizar login. Tente novamente mais tarde.');
    }
  },

  async logout(): Promise<void> {
    try {
      // Primeiro limpa os tokens
      tokenService.clearTokens();

      // Depois chama a API de logout
      await api.delete('/authentication/logout', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Mesmo em caso de erro, garante que os tokens estejam limpos
      tokenService.clearTokens();
    }
  }
}; 