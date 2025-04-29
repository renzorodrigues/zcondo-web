import { api } from '../api';
import { RegisterData, LoginResponse } from '@/types/auth';

export class RegisterService {
  private static instance: RegisterService;

  private constructor() {}

  public static getInstance(): RegisterService {
    if (!RegisterService.instance) {
      RegisterService.instance = new RegisterService();
    }
    return RegisterService.instance;
  }

  public async register(data: RegisterData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/authentication/register', {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      passwordConfirmation: data.passwordConfirmation
    });
    return response.data;
  }

  async activateAccount(activationCode: string): Promise<LoginResponse> {
    const response = await api.patch<LoginResponse>(`/authentication/activate/${activationCode}`);
    return response.data;
  }
}

export const registerService = RegisterService.getInstance(); 