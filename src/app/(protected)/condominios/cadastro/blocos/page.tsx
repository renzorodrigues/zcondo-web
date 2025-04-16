'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiBuilding2Line, RiArrowLeftLine, RiDeleteBinLine } from 'react-icons/ri';
import { CondominioSteps } from '@/components/ui/Steps';
import { Button } from '@/components/ui/Button';

interface Bloco {
  nome: string;
  numeroAndares: string;
  unidadesPorAndar: string;
}

export default function CadastroBlocosPage() {
  const router = useRouter();
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Bloco>({
    nome: '',
    numeroAndares: '1',
    unidadesPorAndar: '1'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'numeroAndares' || name === 'unidadesPorAndar') {
      const numValue = parseInt(value);
      if (numValue < 1) return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddBloco = () => {
    const numAndares = parseInt(formData.numeroAndares);
    const numUnidades = parseInt(formData.unidadesPorAndar);
    
    if (formData.nome && numAndares > 0 && numUnidades > 0) {
      setBlocos([...blocos, {
        ...formData,
        numeroAndares: String(numAndares),
        unidadesPorAndar: String(numUnidades)
      }]);
      setFormData({
        nome: '',
        numeroAndares: '1',
        unidadesPorAndar: '1'
      });
    }
  };

  const handleRemoveBloco = (index: number) => {
    setBlocos(blocos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement API call to save blocks
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleAddBloco();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar o bloco');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <CondominioSteps currentStep="2" />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Cadastro de Blocos</h1>
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <RiArrowLeftLine className="mr-1" />
            Voltar
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm"
          >
            <RiBuilding2Line className="mr-1.5 text-lg" />
            {showForm ? 'Cancelar' : 'Adicionar Bloco'}
          </button>
        </div>
        
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                  Nome do Bloco
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="numeroAndares" className="block text-sm font-medium text-gray-700">
                  Número de Andares
                </label>
                <input
                  type="number"
                  id="numeroAndares"
                  name="numeroAndares"
                  value={formData.numeroAndares.toString()}
                  onChange={handleChange}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="unidadesPorAndar" className="block text-sm font-medium text-gray-700">
                  Unidades por Andar
                </label>
                <input
                  type="number"
                  id="unidadesPorAndar"
                  name="unidadesPorAndar"
                  value={formData.unidadesPorAndar.toString()}
                  onChange={handleChange}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Adicionar Bloco'}
              </Button>
            </div>
          </form>
        )}
        
        {blocos.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Blocos Adicionados</h2>
            <div className="space-y-4">
              {blocos.map((bloco, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{bloco.nome}</p>
                    <p className="text-sm text-gray-500">
                      {bloco.numeroAndares} andares • {bloco.unidadesPorAndar} unidades por andar
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveBloco(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <RiDeleteBinLine className="text-xl" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 