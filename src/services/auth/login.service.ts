import { LoginData, TokenData, ApiError, UserData } from '@/types/auth';
import { tokenService } from './token.service';
import { tokenDecoderService } from './token-decoder.service';
import { api } from '../api';
import Cookies from 'js-cookie';

class LoginService {
  private static instance: LoginService;
  private readonly USER_DATA_KEY = 'user_data';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  private constructor() {}

  public static getInstance(): LoginService {
    if (!LoginService.instance) {
      LoginService.instance = new LoginService();
    }
    return LoginService.instance;
  }

  public async login(credentials: LoginData): Promise<{ tokenData: TokenData; userData: UserData }> {
    console.log('Tentando login com:', credentials.username);
    
    try {
      const response = await api.post<{ data: TokenData }>('/Authentication/login', credentials);
      const { data } = response.data;
      console.log('Resposta do login:', data);
      
      if (data.access_token) {
        // Decodifica o token e armazena os dados do usuário
        const userData = tokenDecoderService.decodeToken(data.access_token);
        if (userData) {
          // Armazena os dados do usuário em um cookie
          Cookies.set(this.USER_DATA_KEY, JSON.stringify(userData), { 
            expires: 7,
            secure: true,
            sameSite: 'strict',
            path: '/'
          });
          console.log('Dados do usuário armazenados:', userData);
        }
        
        // Armazena o refresh token em um cookie
        Cookies.set(this.REFRESH_TOKEN_KEY, data.refresh_token, {
          expires: 30,
          secure: true,
          sameSite: 'strict',
          path: '/'
        });
        
        // Store tokens and get access token for context
        const accessToken = tokenService.setTokens(data);
        return { tokenData: data, userData };
      }

      throw new Error('Token não encontrado na resposta');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    const userData = Cookies.get(this.USER_DATA_KEY);
    const refreshToken = Cookies.get(this.REFRESH_TOKEN_KEY);
    console.log('Verificando autenticação - UserData:', userData ? 'existe' : 'não existe');
    console.log('Verificando autenticação - RefreshToken:', refreshToken ? 'existe' : 'não existe');
    
    if (!userData || !refreshToken) {
      console.log('Não autenticado - faltando dados do usuário ou refresh token');
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
      console.error('Erro ao decodificar dados do usuário:', error);
      return null;
    }
  }

  public logout(): void {
    tokenService.clearTokens();
    Cookies.remove(this.USER_DATA_KEY, { path: '/' });
    Cookies.remove(this.REFRESH_TOKEN_KEY, { path: '/' });
  }
}

export const loginService = LoginService.getInstance(); 