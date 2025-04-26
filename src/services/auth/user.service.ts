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
   * Atualiza as informações básicas do usuário
   * @param userData Dados básicos do usuário
   * @returns Dados do usuário atualizados
   */
  async updateUser(userData: {
    firstname: string;
    surname: string;
    email: string;
  }) {
    try {
      const response = await axios.put('/users/update', userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }
}

export const userService = UserService.getInstance(); 