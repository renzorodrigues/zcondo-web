'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiUserLine, RiArrowLeftLine, RiAddLine, RiDeleteBinLine, RiCheckLine } from 'react-icons/ri';
import { CondominioSteps } from '@/components/ui/Steps';

interface Morador {
  id: string;
  unidadeId: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  tipo: 'proprietario' | 'inquilino' | 'morador';
}

interface Unidade {
  id: string;
  blocoId: string;
  numero: string;
  andar: number;
  tipo: string;
  area: number;
  vagas: number;
}

interface Bloco {
  id: string;
  nome: string;
  andares: number;
  unidadesPorAndar: number;
}

export default function CadastroMoradoresPage() {
  const router = useRouter();
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    unidadeId: '',
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    tipo: ''
  });

  // Carregar dados do localStorage (simulando dados da API)
  useEffect(() => {
    // Em um ambiente real, isso viria da API
    const mockBlocos: Bloco[] = [
      { id: '1', nome: 'Bloco A', andares: 10, unidadesPorAndar: 4 },
      { id: '2', nome: 'Bloco B', andares: 8, unidadesPorAndar: 3 }
    ];
    
    const mockUnidades: Unidade[] = [
      { id: '1', blocoId: '1', numero: '101', andar: 1, tipo: 'apartamento', area: 75.5, vagas: 2 },
      { id: '2', blocoId: '1', numero: '102', andar: 1, tipo: 'apartamento', area: 75.5, vagas: 2 },
      { id: '3', blocoId: '2', numero: '201', andar: 2, tipo: 'apartamento', area: 90.0, vagas: 2 }
    ];
    
    setBlocos(mockBlocos);
    setUnidades(mockUnidades);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMorador = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMorador: Morador = {
      id: Date.now().toString(),
      unidadeId: formData.unidadeId,
      nome: formData.nome,
      cpf: formData.cpf,
      email: formData.email,
      telefone: formData.telefone,
      tipo: formData.tipo as 'proprietario' | 'inquilino' | 'morador'
    };
    
    setMoradores(prev => [...prev, newMorador]);
    setFormData({ unidadeId: '', nome: '', cpf: '', email: '', telefone: '', tipo: '' });
    setShowForm(false);
  };

  const handleRemoveMorador = (id: string) => {
    setMoradores(prev => prev.filter(morador => morador.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implementar a chamada à API para salvar os moradores
      console.log('Dados dos moradores:', moradores);
      
      // Simular um delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar para a página de listagem de condomínios
      router.push('/condominios');
    } catch (error) {
      console.error('Erro ao cadastrar moradores:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUnidadeInfo = (unidadeId: string) => {
    const unidade = unidades.find(u => u.id === unidadeId);
    if (!unidade) return '';
    
    const bloco = blocos.find(b => b.id === unidade.blocoId);
    return `${bloco?.nome} - ${unidade.numero}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <RiArrowLeftLine className="text-gray-600 text-xl" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Vinculação de Moradores</h1>
      </div>
      
      {/* Componente de Steps */}
      <CondominioSteps currentStep="moradores" />
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm"
          >
            <RiUserLine className="mr-1.5 text-lg" />
            {showForm ? 'Cancelar' : 'Adicionar Morador'}
          </button>
        </div>
        
        {showForm && (
          <form onSubmit={handleAddMorador} className="mb-6 p-4 border border-gray-200 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="unidadeId" className="block text-sm font-medium text-gray-700 mb-1">
                  Unidade
                </label>
                <select
                  id="unidadeId"
                  name="unidadeId"
                  value={formData.unidadeId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecione uma unidade</option>
                  {unidades.map(unidade => (
                    <option key={unidade.id} value={unidade.id}>
                      {getUnidadeInfo(unidade.id)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nome do morador"
                />
              </div>
              
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="000.000.000-00"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecione um tipo</option>
                  <option value="proprietario">Proprietário</option>
                  <option value="inquilino">Inquilino</option>
                  <option value="morador">Morador</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <RiAddLine className="text-xl" />
              </button>
            </div>
          </form>
        )}
        
        {moradores.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Moradores Vinculados</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unidade
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CPF
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        E-mail
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telefone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {moradores.map(morador => (
                      <tr key={morador.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {getUnidadeInfo(morador.unidadeId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {morador.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {morador.cpf}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {morador.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {morador.telefone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {morador.tipo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveMorador(morador.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <RiDeleteBinLine className="text-xl" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <img src="/loading.gif" alt="Carregando..." className="w-6 h-6" />
                ) : (
                  <RiCheckLine className="text-xl" />
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <RiUserLine className="mx-auto text-gray-400 text-5xl mb-4" />
            <p className="text-gray-500">Nenhum morador vinculado. Adicione um morador para continuar.</p>
          </div>
        )}
      </div>
    </div>
  );
} 