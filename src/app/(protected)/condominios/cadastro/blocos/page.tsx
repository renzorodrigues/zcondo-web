'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiBuilding2Line, RiArrowLeftLine, RiAddLine, RiDeleteBinLine } from 'react-icons/ri';
import { CondominioSteps } from '@/components/ui/Steps';

interface Bloco {
  id: string;
  nome: string;
  andares: number;
  unidadesPorAndar: number;
}

export default function CadastroBlocosPage() {
  const router = useRouter();
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    andares: '',
    unidadesPorAndar: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBloco = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBloco: Bloco = {
      id: Date.now().toString(),
      nome: formData.nome,
      andares: parseInt(formData.andares),
      unidadesPorAndar: parseInt(formData.unidadesPorAndar)
    };
    
    setBlocos(prev => [...prev, newBloco]);
    setFormData({ nome: '', andares: '', unidadesPorAndar: '' });
    setShowForm(false);
  };

  const handleRemoveBloco = (id: string) => {
    setBlocos(prev => prev.filter(bloco => bloco.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implementar a chamada à API para salvar os blocos
      console.log('Dados dos blocos:', blocos);
      
      // Simular um delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar para a página de cadastro de unidades
      router.push('/condominios/cadastro/unidades');
    } catch (error) {
      console.error('Erro ao cadastrar blocos:', error);
    } finally {
      setIsSubmitting(false);
    }
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
        <h1 className="text-2xl font-bold text-gray-800">Cadastro de Blocos</h1>
      </div>
      
      {/* Componente de Steps */}
      <CondominioSteps currentStep="blocos" />
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <RiAddLine className="mr-2" />
            {showForm ? 'Cancelar' : 'Adicionar Bloco'}
          </button>
        </div>
        
        {showForm && (
          <form onSubmit={handleAddBloco} className="mb-6 p-4 border border-gray-200 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Bloco
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Bloco A"
                />
              </div>
              
              <div>
                <label htmlFor="andares" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Andares
                </label>
                <input
                  type="number"
                  id="andares"
                  name="andares"
                  value={formData.andares}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 10"
                />
              </div>
              
              <div>
                <label htmlFor="unidadesPorAndar" className="block text-sm font-medium text-gray-700 mb-1">
                  Unidades por Andar
                </label>
                <input
                  type="number"
                  id="unidadesPorAndar"
                  name="unidadesPorAndar"
                  value={formData.unidadesPorAndar}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 4"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Adicionar
              </button>
            </div>
          </form>
        )}
        
        {blocos.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Blocos Cadastrados</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Andares
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unidades por Andar
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total de Unidades
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {blocos.map(bloco => (
                      <tr key={bloco.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {bloco.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bloco.andares}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bloco.unidadesPorAndar}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bloco.andares * bloco.unidadesPorAndar}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveBloco(bloco.id)}
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
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Salvando...' : 'Próximo: Cadastrar Unidades'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <RiBuilding2Line className="mx-auto text-gray-400 text-5xl mb-4" />
            <p className="text-gray-500">Nenhum bloco cadastrado. Adicione um bloco para continuar.</p>
          </div>
        )}
      </div>
    </div>
  );
} 