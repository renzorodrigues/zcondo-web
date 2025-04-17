import { LoginData, TokenData, ApiError, UserData } from '@/types/auth';
import { tokenService } from './token.service';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface LoginCredentials {
  username: string;
  password: string;
}

class LoginService {
  private static instance: LoginService;
  private baseUrl: string;
  private readonly EMAIL_KEY = 'user_email';
  private readonly USER_DATA_KEY = 'user_data';

  private constructor() {
    this.baseUrl = `${API_URL}/Authentication`;
  }

  public static getInstance(): LoginService {
    if (!LoginService.instance) {
      LoginService.instance = new LoginService();
    }
    return LoginService.instance;
  }

  private decodeToken(token: string): UserData | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Ocorreu um erro na requisição');
    }
    return response.json();
  }

  public async login(credentials: LoginCredentials): Promise<TokenData> {
    console.log('Tentando login com:', credentials.username);
    
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Credenciais inválidas');
    }

    const { data } = await this.handleResponse<{ data: TokenData }>(response);
    console.log('Resposta do login:', data);
    
    if (data.access_token) {
      // Decodifica o token e armazena os dados do usuário
      const userData = this.decodeToken(data.access_token);
      if (userData) {
        Cookies.set(this.USER_DATA_KEY, JSON.stringify(userData), { expires: 7 });
        console.log('Dados do usuário armazenados:', userData);
      }
      
      tokenService.setTokens(data);
      return data;
    }

    throw new Error('Token não encontrado na resposta');
  }

  public async isAuthenticated(): Promise<boolean> {
    const token = tokenService.getToken();
    const userData = Cookies.get(this.USER_DATA_KEY);
    console.log('Verificando autenticação - Token:', token ? 'existe' : 'não existe', 'UserData:', userData ? 'existe' : 'não existe');
    
    if (!token || !userData) {
      console.log('Não autenticado - faltando:', !token ? 'token' : 'dados do usuário');
      return false;
    }

    // Verifica se o token está expirado
    if (tokenService.isTokenExpired()) {
      console.log('Token expirado');
      this.logout();
      return false;
    }

    return true;
  }

  public getUserData(): UserData | null {
    const userDataStr = Cookies.get(this.USER_DATA_KEY);
    if (!userDataStr) return null;
    
    try {
      return JSON.parse(userDataStr);
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  }

  public logout(): void {
    Cookies.remove(this.USER_DATA_KEY);
    tokenService.clearTokens();
  }
}

export const loginService = LoginService.getInstance(); 