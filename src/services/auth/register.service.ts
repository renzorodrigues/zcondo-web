import { RegisterData, AuthResponse, ApiError } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class RegisterService {
  private static instance: RegisterService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_URL}/Authentication/register`;
  }

  public static getInstance(): RegisterService {
    if (!RegisterService.instance) {
      RegisterService.instance = new RegisterService();
    }
    return RegisterService.instance;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Ocorreu um erro na requisição');
    }
    return response.json();
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const authResponse = await this.handleResponse<AuthResponse>(response);
      // Não salvamos o token aqui pois a conta precisa ser ativada
      return authResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro no registro: ${error.message}`);
      }
      throw new Error('Erro desconhecido durante o registro');
    }
  }
}

export const registerService = RegisterService.getInstance(); 