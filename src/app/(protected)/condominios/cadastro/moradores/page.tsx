'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiUserLine, RiArrowLeftLine, RiAddLine, RiDeleteBinLine, RiCheckLine, RiBuilding2Line } from 'react-icons/ri';
import { TbLoader3 } from 'react-icons/tb';
import { CondominioSteps } from '@/components/ui/Steps';
import { toast } from 'react-hot-toast';

interface Morador {
  id: string;
  unidadeId: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  tipo: 'proprietario' | 'inquilino' | 'morador';
}

interface MoradorDisponivel {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
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
  const [moradoresDisponiveis, setMoradoresDisponiveis] = useState<MoradorDisponivel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    unidadeId: '',
    tipo: ''
  });
  const [moradoresSelecionados, setMoradoresSelecionados] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    
    // Simulando moradores disponíveis para seleção
    const mockMoradoresDisponiveis: MoradorDisponivel[] = [
      { id: '1', nome: 'João Silva', cpf: '123.456.789-00', email: 'joao@exemplo.com', telefone: '(11) 98765-4321' },
      { id: '2', nome: 'Maria Oliveira', cpf: '987.654.321-00', email: 'maria@exemplo.com', telefone: '(11) 91234-5678' },
      { id: '3', nome: 'Pedro Santos', cpf: '456.789.123-00', email: 'pedro@exemplo.com', telefone: '(11) 94567-8901' },
      { id: '4', nome: 'Ana Costa', cpf: '789.123.456-00', email: 'ana@exemplo.com', telefone: '(11) 97890-1234' },
      { id: '5', nome: 'Carlos Ferreira', cpf: '321.654.987-00', email: 'carlos@exemplo.com', telefone: '(11) 92345-6789' }
    ];
    
    setBlocos(mockBlocos);
    setUnidades(mockUnidades);
    setMoradoresDisponiveis(mockMoradoresDisponiveis);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMoradorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setMoradoresSelecionados(selectedOptions);
  };

  const handleAddMorador = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (moradoresSelecionados.length === 0) {
      alert('Selecione pelo menos um morador');
      return;
    }
    
    const novosMoradores: Morador[] = moradoresSelecionados.map(moradorId => {
      const morador = moradoresDisponiveis.find(m => m.id === moradorId);
      if (!morador) return null;
      
      return {
        id: Date.now().toString() + moradorId,
        unidadeId: formData.unidadeId,
        nome: morador.nome,
        cpf: morador.cpf,
        email: morador.email,
        telefone: morador.telefone,
        tipo: formData.tipo as 'proprietario' | 'inquilino' | 'morador'
      };
    }).filter(Boolean) as Morador[];
    
    setMoradores(prev => [...prev, ...novosMoradores]);
    setFormData({ unidadeId: '', tipo: '' });
    setMoradoresSelecionados([]);
    setShowForm(false);
  };

  const handleRemoveMorador = (id: string) => {
    setMoradores(prev => prev.filter(morador => morador.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aqui você faria a chamada para a API para cadastrar os moradores
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulando uma chamada à API
      toast.success('Moradores cadastrados com sucesso!');
      router.push('/condominios');
    } catch (error) {
      console.error('Erro ao cadastrar moradores:', error);
    } finally {
      setIsLoading(false);
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
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
                <label htmlFor="moradores" className="block text-sm font-medium text-gray-700 mb-1">
                  Moradores
                </label>
                <select
                  id="moradores"
                  name="moradores"
                  multiple
                  value={moradoresSelecionados}
                  onChange={handleMoradorSelect}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px] text-gray-900"
                >
                  {moradoresDisponiveis.map(morador => (
                    <option key={morador.id} value={morador.id}>
                      {morador.nome} - {morador.cpf}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">Pressione Ctrl (ou Cmd) para selecionar múltiplos moradores</p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
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
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <TbLoader3 className="w-5 h-5 text-white animate-spin mr-2" />
                    <span>Cadastrando...</span>
                  </div>
                ) : (
                  'Cadastrar'
                )}
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
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <RiArrowLeftLine className="text-xl" />
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center justify-center w-10 h-10 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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