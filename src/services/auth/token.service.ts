class TokenService {
  private static instance: TokenService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {}

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  public setRefreshToken(token: string): void {
    this.refreshToken = token;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  public clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }

  public isTokenExpired(): boolean {
    if (!this.accessToken) return true;
    
    try {
      const tokenData = JSON.parse(atob(this.accessToken.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  public async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) return null;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.clearTokens();
      return null;
    }
  }
}

export const tokenService = TokenService.getInstance(); 