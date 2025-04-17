import { UserData } from '@/types/auth';

class TokenDecoderService {
  private static instance: TokenDecoderService;

  private constructor() {}

  public static getInstance(): TokenDecoderService {
    if (!TokenDecoderService.instance) {
      TokenDecoderService.instance = new TokenDecoderService();
    }
    return TokenDecoderService.instance;
  }

  public decodeToken(token: string): UserData {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Invalid token format');
    }
  }

  public getInitials(name: string): string {
    const nameParts = name.split(' ');
    if (nameParts.length < 2) return name.substring(0, 2).toUpperCase();
    
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    return (firstName[0] + lastName[0]).toUpperCase();
  }
}

export const tokenDecoderService = TokenDecoderService.getInstance(); 