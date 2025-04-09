import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se existe um token nos cookies
    const token = Cookies.get('auth-token');
    if (token) {
      // Aqui você faria uma chamada para sua API para validar o token
      // Por enquanto, vamos simular um usuário
      setUser({
        id: '1',
        name: 'Usuário Teste',
        email: 'teste@email.com'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Aqui você faria uma chamada para sua API de login
      // Por enquanto, vamos simular um login bem-sucedido
      const mockUser = {
        id: '1',
        name: 'Usuário Teste',
        email: email
      };

      // Simular token
      const token = 'mock-token-' + Date.now();
      // Usar cookies em vez de localStorage
      Cookies.set('auth-token', token, { expires: 7 }); // Expira em 7 dias
      
      setUser(mockUser);
      router.push('/dashboard');
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    // Remover o cookie
    Cookies.remove('auth-token');
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
} 