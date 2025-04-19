'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiBuilding2Line, RiArrowLeftLine, RiDeleteBinLine } from 'react-icons/ri';
import { TbLoader3 } from 'react-icons/tb';
import { toast } from 'react-hot-toast';

interface Condominio {
  id: number;
  name: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  telefone: string;
  email: string;
}

export default function CondominiosPage() {
  const router = useRouter();
  const [condominios, setCondominios] = useState<Condominio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados dos condomínios (simulando uma chamada à API)
  useEffect(() => {
    // Em um ambiente real, isso viria da API
    const mockCondominios: Condominio[] = [
      { 
        id: 1, 
        name: 'Residencial Parque Verde', 
        cnpj: '12.345.678/0001-90',
        endereco: 'Rua das Flores, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        telefone: '(11) 3456-7890',
        email: 'contato@parqueverde.com'
      },
      { 
        id: 2, 
        name: 'Edifício Central', 
        cnpj: '98.765.432/0001-10',
        endereco: 'Av. Principal, 456',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        telefone: '(21) 2345-6789',
        email: 'contato@edificiocentral.com'
      },
      { 
        id: 3, 
        name: 'Condomínio Solar', 
        cnpj: '45.678.901/0001-23',
        endereco: 'Rua do Sol, 789',
        cidade: 'Belo Horizonte',
        estado: 'MG',
        telefone: '(31) 4567-8901',
        email: 'contato@condominiosolar.com'
      },
      { 
        id: 4, 
        name: 'Residencial Horizonte', 
        cnpj: '78.901.234/0001-45',
        endereco: 'Av. Horizonte, 321',
        cidade: 'Curitiba',
        estado: 'PR',
        telefone: '(41) 5678-9012',
        email: 'contato@residencialhorizonte.com'
      }
    ];
    
    // Simular um delay para mostrar o loading
    setTimeout(() => {
      setCondominios(mockCondominios);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleAddCondominio = () => {
    router.push('/condominios/cadastro');
  };

  const handleEdit = (id: number) => {
    router.push(`/condominios/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este condomínio?')) {
      try {
        // Aqui você faria a chamada para a API para excluir o condomínio
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulando uma chamada à API
        toast.success('Condomínio excluído com sucesso!');
        // Atualizar a lista de condomínios
        setCondominios(condominios.filter(cond => cond.id !== id));
      } catch (error) {
        toast.error('Erro ao excluir condomínio');
        console.error('Erro ao excluir condomínio:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <TbLoader3 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Condomínios</h1>
        <button
          onClick={handleAddCondominio}
          className="flex items-center justify-center px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm w-full sm:w-auto"
        >
          <RiBuilding2Line className="mr-1.5 text-lg" />
          Novo Condomínio
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  CNPJ
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Endereço
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Cidade/Estado
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Contato
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {condominios.map(condominio => (
                <tr key={condominio.id}>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {condominio.name}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {condominio.cnpj}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {condominio.endereco}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {condominio.cidade}/{condominio.estado}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    <div>{condominio.telefone}</div>
                    <div className="text-xs text-gray-400">{condominio.email}</div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(condominio.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <RiArrowLeftLine className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDelete(condominio.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <RiDeleteBinLine className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 