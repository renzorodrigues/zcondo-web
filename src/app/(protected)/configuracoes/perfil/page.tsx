'use client';

import { useState } from 'react';
import { RiUserLine, RiMailLine, RiPhoneLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiVipCrownLine, RiCheckLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';

interface ProfileData {
  nome: string;
  email: string;
  telefone: string;
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

interface SubscriptionData {
  plano: string;
  status: 'ativo' | 'inativo' | 'trial';
  dataVencimento: string;
  recursos: string[];
}

export default function ConfiguracoesPerfilPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    nome: '',
    email: '',
    telefone: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  // Mock subscription data - in a real app, this would come from an API
  const [subscriptionData] = useState<SubscriptionData>({
    plano: 'Premium',
    status: 'ativo',
    dataVencimento: '2024-12-31',
    recursos: [
      'Gestão de múltiplos condomínios',
      'Relatórios avançados',
      'Suporte prioritário',
      'Backup automático',
      'API de integração'
    ]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implementar a chamada à API para atualizar o perfil
      console.log('Dados do perfil:', formData);
      
      // Simular um delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Limpar campos de senha após sucesso
      setFormData(prev => ({
        ...prev,
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      }));
      
      // TODO: Mostrar mensagem de sucesso
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      // TODO: Mostrar mensagem de erro
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGerenciarAssinatura = () => {
    router.push('/configuracoes/assinatura');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e senha</p>
      </div>
      
      <div className="space-y-6">
        {/* Plano de Assinatura */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800">Plano de Assinatura</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscriptionData.status === 'ativo' 
                ? 'bg-green-100 text-green-800' 
                : subscriptionData.status === 'trial'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {subscriptionData.status === 'ativo' ? 'Ativo' : subscriptionData.status === 'trial' ? 'Período Trial' : 'Inativo'}
            </span>
          </div>
          
          <div className="flex items-center mb-4">
            <RiVipCrownLine className="text-2xl text-purple-600 mr-2" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{subscriptionData.plano}</h3>
              <p className="text-sm text-gray-500">Vencimento: {new Date(subscriptionData.dataVencimento).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Recursos incluídos:</h4>
            <ul className="space-y-2">
              {subscriptionData.recursos.map((recurso, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <RiCheckLine className="text-green-500 mr-2" />
                  {recurso}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleGerenciarAssinatura}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Gerenciar Assinatura
            </button>
          </div>
        </div>

        {/* Informações Pessoais */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Informações Pessoais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <RiUserLine className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Seu nome completo"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <RiMailLine className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="seu.email@exemplo.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <RiPhoneLine className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Alterar Senha */}
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Alterar Senha</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-700 mb-1">
                      Senha Atual
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <RiLockLine className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="senhaAtual"
                        name="senhaAtual"
                        value={formData.senhaAtual}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700 mb-1">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <RiLockLine className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="novaSenha"
                        name="novaSenha"
                        value={formData.novaSenha}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <RiLockLine className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmarSenha"
                        name="confirmarSenha"
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <RiEyeOffLine className="text-gray-400 hover:text-gray-500" />
                        ) : (
                          <RiEyeLine className="text-gray-400 hover:text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 