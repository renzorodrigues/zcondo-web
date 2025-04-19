'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiBuilding2Line, RiArrowLeftLine, RiAddLine, RiDeleteBinLine, RiHomeLine, RiArrowRightLine } from 'react-icons/ri';
import { TbLoader3 } from 'react-icons/tb';
import { CondominioSteps } from '@/components/ui/Steps';
import { toast } from 'react-hot-toast';

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

export default function CadastroUnidadesPage() {
  const router = useRouter();
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    blocoId: '',
    numero: '',
    andar: '',
    tipo: '',
    area: '',
    vagas: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Carregar blocos do localStorage (simulando dados da API)
  useEffect(() => {
    // Em um ambiente real, isso viria da API
    const mockBlocos: Bloco[] = [
      { id: '1', nome: 'Bloco A', andares: 10, unidadesPorAndar: 4 },
      { id: '2', nome: 'Bloco B', andares: 8, unidadesPorAndar: 3 }
    ];
    setBlocos(mockBlocos);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUnidade = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUnidade: Unidade = {
      id: Date.now().toString(),
      blocoId: formData.blocoId,
      numero: formData.numero,
      andar: parseInt(formData.andar),
      tipo: formData.tipo,
      area: parseFloat(formData.area),
      vagas: parseInt(formData.vagas)
    };
    
    setUnidades(prev => [...prev, newUnidade]);
    setFormData({ blocoId: '', numero: '', andar: '', tipo: '', area: '', vagas: '' });
    setShowForm(false);
  };

  const handleRemoveUnidade = (id: string) => {
    setUnidades(prev => prev.filter(unidade => unidade.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aqui você faria a chamada para a API para cadastrar as unidades
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulando uma chamada à API
      toast.success('Unidades cadastradas com sucesso!');
      router.push('/condominios/cadastro/moradores');
    } catch (error) {
      console.error('Erro ao cadastrar unidades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBlocoNome = (blocoId: string) => {
    const bloco = blocos.find(b => b.id === blocoId);
    return bloco ? bloco.nome : '';
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
        <h1 className="text-2xl font-bold text-gray-800">Cadastro de Unidades</h1>
      </div>
      
      {/* Componente de Steps */}
      <CondominioSteps currentStep="unidades" />
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm"
          >
            <RiHomeLine className="mr-1.5 text-lg" />
            {showForm ? 'Cancelar' : 'Adicionar Unidade'}
          </button>
        </div>
        
        {showForm && (
          <form onSubmit={handleAddUnidade} className="mb-6 p-4 border border-gray-200 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="blocoId" className="block text-sm font-medium text-gray-700 mb-1">
                  Bloco
                </label>
                <select
                  id="blocoId"
                  name="blocoId"
                  value={formData.blocoId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                >
                  <option value="">Selecione um bloco</option>
                  {blocos.map(bloco => (
                    <option key={bloco.id} value={bloco.id}>
                      {bloco.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                  Número da Unidade
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 101"
                />
              </div>
              
              <div>
                <label htmlFor="andar" className="block text-sm font-medium text-gray-700 mb-1">
                  Andar
                </label>
                <input
                  type="number"
                  id="andar"
                  name="andar"
                  value={formData.andar}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 1"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                >
                  <option value="">Selecione um tipo</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="cobertura">Cobertura</option>
                  <option value="flat">Flat</option>
                  <option value="loft">Loft</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                  Área (m²)
                </label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 75.5"
                />
              </div>
              
              <div>
                <label htmlFor="vagas" className="block text-sm font-medium text-gray-700 mb-1">
                  Vagas de Garagem
                </label>
                <input
                  type="number"
                  id="vagas"
                  name="vagas"
                  value={formData.vagas}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 2"
                />
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
                    <span>Salvando...</span>
                  </div>
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </form>
        )}
        
        {unidades.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Unidades Cadastradas</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bloco
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Número
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Andar
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Área (m²)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vagas
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {unidades.map(unidade => (
                      <tr key={unidade.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {getBlocoNome(unidade.blocoId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {unidade.numero}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {unidade.andar}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {unidade.tipo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {unidade.area}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {unidade.vagas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveUnidade(unidade.id)}
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
                  <RiArrowRightLine className="text-xl" />
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <RiBuilding2Line className="mx-auto text-gray-400 text-5xl mb-4" />
            <p className="text-gray-500">Nenhuma unidade cadastrada. Adicione uma unidade para continuar.</p>
          </div>
        )}
      </div>
    </div>
  );
} 