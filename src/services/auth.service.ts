import { LoginData, TokenData, AuthResponse } from '@/types/auth';
import { tokenService } from './auth/token.service';

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  }

  async login(credentials: LoginData): Promise<TokenData> {
    try {
      const response = await fetch(`${this.baseUrl}/Authentication/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const authResponse: AuthResponse = await response.json();
      tokenService.setTokens(authResponse.data);
      return authResponse.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  logout(): void {
    tokenService.clearTokens();
  }

  async isAuthenticated(): Promise<boolean> {
    const token = tokenService.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${this.baseUrl}/Authentication/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Auth verification error:', error);
      return false;
    }
  }
}

export const authService = new AuthService(); 