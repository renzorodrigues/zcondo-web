'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/auth/user.service';
import { toast } from 'react-hot-toast';
import { RiUserLine, RiMailLine, RiPhoneLine, RiMapPinLine, RiLockLine } from 'react-icons/ri';

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  cpf?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export default function UserRegistrationPage() {
  const router = useRouter();
  const { user, isUserRegistered } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UserProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Preenche os dados do formulário com as informações do usuário
  useEffect(() => {
    if (user) {
      // Divide o nome completo em primeiro e último nome
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData(prev => ({
        ...prev,
        firstName,
        lastName,
        email: user.email,
      }));
    }
  }, [user]);

  // Verifica se o usuário já está registrado
  useEffect(() => {
    const checkRegistration = async () => {
      if (!user?.email) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Verifica o status de registro diretamente com o serviço
        const isRegistered = await userService.checkActivation(user.email);
        console.log('Status de registro verificado:', isRegistered);
        
        // Se o usuário já estiver registrado, redireciona para o dashboard
        if (isRegistered) {
          // Atualiza o cookie is_user_registered para garantir consistência
          document.cookie = `is_user_registered=true; path=/; max-age=86400; SameSite=Lax; secure`;
          router.replace('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Erro ao verificar registro do usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkRegistration();
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Atualiza o perfil do usuário com os dados do formulário
      await userService.updateUserProfile(formData);
      
      // Após o cadastro bem-sucedido, atualiza o cookie is_user_registered
      document.cookie = `is_user_registered=true; path=/; max-age=86400; SameSite=Lax; secure`;
      
      toast.success('Cadastro realizado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      toast.error('Erro ao cadastrar usuário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se estiver carregando ou o usuário já estiver registrado, mostra o loading
  if (isLoading || isUserRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Complete seu cadastro</h1>
        <p className="text-gray-600 mt-1">Preencha suas informações para continuar</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800">Informações Pessoais</h2>
              
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiUserLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Nome"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Sobrenome
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiUserLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Sobrenome"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiMailLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                    className="bg-gray-100 focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiPhoneLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                  CPF
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiLockLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="cpf"
                    id="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </div>
            
            {/* Endereço */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800">Endereço</h2>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Endereço
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiMapPinLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Rua, número, complemento"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiMapPinLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Cidade"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiMapPinLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Estado"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  CEP
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiMapPinLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="zipCode"
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Salvar e continuar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 