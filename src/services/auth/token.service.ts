import { api } from '@/services/api';
import { TokenData, UserData } from '@/types/auth';

class TokenService {
  private static instance: TokenService;
  private accessToken: string | null = null;
  private accessTokenExpiration: number | null = null;
  private channel: BroadcastChannel;

  private constructor() {
    this.channel = new BroadcastChannel('auth');
    this.channel.onmessage = (event) => {
      if (event.data.type === 'TOKEN_UPDATE') {
        this.accessToken = event.data.token;
        this.accessTokenExpiration = event.data.expiration;
      }
    };
  }

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public setTokens(tokenData: TokenData): void {
    this.accessToken = tokenData.access_token;
    this.accessTokenExpiration = Date.now() + (tokenData.expires_in * 1000);
    
    // Notifica outras abas sobre a atualização do token
    this.channel.postMessage({
      type: 'TOKEN_UPDATE',
      token: this.accessToken,
      expiration: this.accessTokenExpiration
    });
  }

  public isTokenExpired(): boolean {
    if (!this.accessToken || !this.accessTokenExpiration) {
      return true;
    }
    return Date.now() >= this.accessTokenExpiration;
  }

  private removeRefreshTokenCookie(): void {
    // Remove o cookie em todos os domínios e paths possíveis
    const domains = [
      '', // sem domínio
      'localhost',
      window.location.hostname
    ];
    
    const paths = [
      '/',
      '/api',
      ''
    ];

    domains.forEach(domain => {
      paths.forEach(path => {
        document.cookie = `refresh_token=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT${domain ? `; Domain=${domain}` : ''}`;
      });
    });
  }

  public clearTokens(): void {
    this.accessToken = null;
    this.accessTokenExpiration = null;
    
    // Remove o cookie de refresh token
    this.removeRefreshTokenCookie();
    
    // Notifica outras abas
    this.channel.postMessage({
      type: 'TOKEN_UPDATE',
      token: null,
      expiration: null
    });
  }

  public async refreshAccessToken(): Promise<string | null> {
    try {
      const response = await api.post('/Authentication/refresh', null, { 
        withCredentials: true 
      });

      if (response.data?.access_token) {
        this.setTokens({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          expires_in: response.data.expires_in || 300
        });
        return response.data.access_token;
      }
      return null;
    } catch {
      // Se falhar o refresh, limpa todos os tokens
      this.clearTokens();
      return null;
    }
  }

  public decodeToken(token: string): UserData | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
}

export const tokenService = TokenService.getInstance(); 