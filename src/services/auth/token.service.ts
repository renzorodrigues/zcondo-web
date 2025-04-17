import { TokenData } from '@/types/auth';
import Cookies from 'js-cookie';

class TokenService {
  private static instance: TokenService;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  private constructor() {}

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  public setTokens(tokenData: TokenData): void {
    // Calculate expiry time
    const expiryTime = Date.now() + tokenData.expires_in * 1000;
    
    // Store tokens in cookies
    Cookies.set(this.TOKEN_KEY, tokenData.access_token, { expires: 7 }); // 7 days
    Cookies.set(this.REFRESH_TOKEN_KEY, tokenData.refresh_token, { expires: 30 }); // 30 days
    Cookies.set(this.TOKEN_EXPIRY_KEY, expiryTime.toString(), { expires: 7 }); // 7 days
  }

  public getToken(): string | null {
    return Cookies.get(this.TOKEN_KEY) || null;
  }

  public getRefreshToken(): string | null {
    return Cookies.get(this.REFRESH_TOKEN_KEY) || null;
  }

  public isTokenExpired(): boolean {
    const expiryTime = this.getTokenExpiryTime();
    if (!expiryTime) return true;
    return Date.now() >= expiryTime;
  }

  public clearTokens(): void {
    Cookies.remove(this.TOKEN_KEY);
    Cookies.remove(this.REFRESH_TOKEN_KEY);
    Cookies.remove(this.TOKEN_EXPIRY_KEY);
  }

  private getTokenExpiryTime(): number | null {
    const expiryTime = Cookies.get(this.TOKEN_EXPIRY_KEY);
    return expiryTime ? parseInt(expiryTime, 10) : null;
  }
}

export const tokenService = TokenService.getInstance(); 