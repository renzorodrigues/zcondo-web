'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiBuilding2Line, RiAddLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri';

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

  const handleEditCondominio = (id: number) => {
    // TODO: Implementar edição de condomínio
    console.log('Editar condomínio:', id);
  };

  const handleDeleteCondominio = (id: number) => {
    // TODO: Implementar exclusão de condomínio
    console.log('Excluir condomínio:', id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Condomínios</h1>
        <button
          onClick={handleAddCondominio}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <RiAddLine className="mr-2" />
          Novo Condomínio
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CNPJ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cidade/Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {condominios.map(condominio => (
                <tr key={condominio.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {condominio.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {condominio.cnpj}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {condominio.endereco}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {condominio.cidade}/{condominio.estado}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{condominio.telefone}</div>
                    <div className="text-xs text-gray-400">{condominio.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditCondominio(condominio.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <RiEditLine className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDeleteCondominio(condominio.id)}
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