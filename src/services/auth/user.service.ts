import axios from '@/lib/axios';

class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Verifica se o usuário já está cadastrado no backend
   * @param email Email do usuário
   * @returns true se o usuário já está cadastrado, false caso contrário
   */
  async checkActivation(email: string): Promise<boolean> {
    try {
      console.log('Verificando usuário:', email);
      const response = await axios.get(`/users/check-activation/${email}`);
      console.log('Resposta da verificação:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      return false;
    }
  }

  /**
   * Cadastra ou atualiza as informações do usuário
   * @param userData Dados do usuário
   * @returns Dados do usuário atualizados
   */
  async updateUserProfile(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    cpf?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }) {
    try {
      const response = await axios.post('/users/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }
}

export const userService = UserService.getInstance(); 