import { api } from '@/services/api';
import { RegisterData, AuthResponse } from '@/types/auth';

interface ApiRegisterResponse {
  data: {
    message: string;
    success: boolean;
  };
}

class RegisterService {
  private static instance: RegisterService;

  private constructor() {}

  public static getInstance(): RegisterService {
    if (!RegisterService.instance) {
      RegisterService.instance = new RegisterService();
    }
    return RegisterService.instance;
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiRegisterResponse>('/Authentication/register', data);
      
      if (!response.data?.data?.success) {
        throw new Error('Falha no registro');
      }

      return {
        success: true,
        message: response.data.data.message
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro no registro: ${error.message}`);
      }
      throw new Error('Erro desconhecido durante o registro');
    }
  }
}

export const registerService = RegisterService.getInstance(); 