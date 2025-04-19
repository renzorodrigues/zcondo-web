import { api } from '@/services/api';
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

class LoginService {
  private static instance: LoginService;

  private constructor() { }

  public static getInstance(): LoginService {
    if (!LoginService.instance) {
      LoginService.instance = new LoginService();
    }
    return LoginService.instance;
  }

  public async login(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post<ApiLoginResponse>('/authentication/login', {
      username,
      password
    });

    if (!response.data?.data?.token?.access_token) {
      throw new Error('No access token received');
    }

    const { token, user } = response.data.data;

    // Armazena o token em memória
    tokenService.setTokens({
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_in: token.expires_in
    });

    // Retorna o formato esperado pelo LoginResponse
    return {
      access_token: token.access_token,
      expires_in: token.expires_in,
      user: {
        id: user.username,
        email: user.email,
        name: user.name,
        role: user.roles[0] || 'user'
      }
    };
  }

  public async logout(): Promise<void> {
    try {
      // Primeiro limpa os tokens (incluindo o cookie de refresh token)
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
}

export const loginService = LoginService.getInstance(); 