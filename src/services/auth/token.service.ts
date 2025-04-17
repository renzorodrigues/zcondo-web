import { TokenData } from '@/types/auth';
import { api } from '../api';
import Cookies from 'js-cookie';

class TokenService {
  private static instance: TokenService;
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';
  private readonly ACCESS_TOKEN_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  private accessToken: string | null = null;

  private constructor() {}

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  public setTokens(tokenData: TokenData): string {
    // Calculate and store expiry time
    const expiryTime = Date.now() + this.ACCESS_TOKEN_TTL;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    }

    // Store access token in memory
    this.accessToken = tokenData.access_token;
    return tokenData.access_token;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;
    return Date.now() >= parseInt(expiryTime, 10);
  }

  public clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    }
    this.accessToken = null;
  }

  public async refreshAccessToken(): Promise<string | null> {
    const refreshToken = Cookies.get('refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await api.post<{ data: TokenData }>('/Authentication/refresh', {
        refresh_token: refreshToken
      });

      if (!response.data.data.access_token) {
        this.clearTokens();
        return null;
      }

      return this.setTokens(response.data.data);
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.clearTokens();
      return null;
    }
  }
}

export const tokenService = TokenService.getInstance(); 