import { api } from '@/services/api';

interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

class TokenService {
  private static instance: TokenService;
  private accessToken: string | null = null;
  private expiresAt: number | null = null;
  private channel: BroadcastChannel;

  private constructor() {
    this.channel = new BroadcastChannel('auth');
    this.channel.addEventListener('message', this.handleTokenUpdate);
  }

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  private handleTokenUpdate = (event: MessageEvent) => {
    if (event.data.type === 'TOKEN_UPDATE') {
      this.accessToken = event.data.token;
      this.expiresAt = event.data.expiresAt;
    }
  };

  public setTokens(data: TokenData): void {
    this.accessToken = data.access_token;
    this.expiresAt = Date.now() + data.expires_in * 1000;

    // Notifica outras abas sobre a atualização do token
    this.channel.postMessage({
      type: 'TOKEN_UPDATE',
      token: data.access_token,
      expiresAt: this.expiresAt
    });
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public isTokenExpired(): boolean {
    if (!this.expiresAt) return true;
    return Date.now() >= this.expiresAt;
  }

  public async refreshAccessToken(): Promise<string | null> {
    try {
      const response = await api.post('/Authentication/refresh', null, {
        withCredentials: true
      });

      if (response.data?.data?.token?.access_token) {
        const { access_token, expires_in } = response.data.data.token;
        this.setTokens({ access_token, expires_in });
        return access_token;
      }
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  public clearTokens(): void {
    this.accessToken = null;
    this.expiresAt = null;

    // Notifica outras abas que os tokens foram limpos
    this.channel.postMessage({
      type: 'TOKEN_UPDATE',
      token: null,
      expiresAt: null
    });
  }
}

export const tokenService = TokenService.getInstance(); 