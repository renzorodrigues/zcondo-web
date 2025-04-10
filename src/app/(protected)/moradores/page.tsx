'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { RiGroupLine, RiSearchLine, RiEditLine, RiDeleteBinLine, RiArrowLeftSLine, RiArrowRightSLine, RiBuilding2Line } from 'react-icons/ri';
import { FaChevronDown } from 'react-icons/fa';

// Mock data para condomínios - em uma aplicação real, isso viria de uma API
const mockCondominiums = [
  { id: 1, name: 'Residencial Parque Verde' },
  { id: 2, name: 'Edifício Central' },
  { id: 3, name: 'Condomínio Solar' },
  { id: 4, name: 'Residencial Horizonte' }
];

// Mock data para moradores - em uma aplicação real, isso viria de uma API
const mockUsers = [
  { id: 1, condominiumId: 1, name: 'João Silva', email: 'joao.silva@example.com', role: 'Morador', status: 'Ativo', residentType: 'Proprietário' },
  { id: 2, condominiumId: 1, name: 'Maria Oliveira', email: 'maria.oliveira@example.com', role: 'Síndico', status: 'Ativo', residentType: 'Proprietário' },
  { id: 3, condominiumId: 2, name: 'Carlos Santos', email: 'carlos.santos@example.com', role: 'Morador', status: 'Inativo', residentType: 'Inquilino' },
  { id: 4, condominiumId: 2, name: 'Ana Pereira', email: 'ana.pereira@example.com', role: 'Administrador', status: 'Ativo', residentType: 'Proprietário' },
  { id: 5, condominiumId: 3, name: 'Pedro Oliveira', email: 'pedro.oliveira@example.com', role: 'Morador', status: 'Ativo', residentType: 'Inquilino' },
  { id: 6, condominiumId: 3, name: 'Juliana Costa', email: 'juliana.costa@example.com', role: 'Morador', status: 'Ativo', residentType: 'Proprietário' },
  { id: 7, condominiumId: 4, name: 'Roberto Almeida', email: 'roberto.almeida@example.com', role: 'Morador', status: 'Inativo', residentType: 'Inquilino' },
  { id: 8, condominiumId: 4, name: 'Fernanda Lima', email: 'fernanda.lima@example.com', role: 'Morador', status: 'Ativo', residentType: 'Proprietário' },
  { id: 9, condominiumId: 1, name: 'Lucas Mendes', email: 'lucas.mendes@example.com', role: 'Morador', status: 'Ativo', residentType: 'Inquilino' },
  { id: 10, condominiumId: 2, name: 'Carla Souza', email: 'carla.souza@example.com', role: 'Morador', status: 'Ativo', residentType: 'Proprietário' },
  { id: 11, condominiumId: 3, name: 'Ricardo Ferreira', email: 'ricardo.ferreira@example.com', role: 'Morador', status: 'Ativo', residentType: 'Inquilino' },
  { id: 12, condominiumId: 4, name: 'Patrícia Santos', email: 'patricia.santos@example.com', role: 'Morador', status: 'Inativo', residentType: 'Proprietário' },
];

export default function ResidentsPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(Math.ceil(mockUsers.length / 5));
  const [selectedCondominium, setSelectedCondominium] = useState(mockCondominiums[0]);
  const [isCondominiumDropdownOpen, setIsCondominiumDropdownOpen] = useState(false);
  const condominiumDropdownRef = useRef<HTMLDivElement>(null);
  
  // Opções para o select de itens por página
  const itemsPerPageOptions = [5, 10, 25, 50];

  // Load selected condominium from localStorage on mount
  useEffect(() => {
    const storedId = localStorage.getItem('selectedCondominiumId');
    if (storedId) {
      const id = parseInt(storedId, 10);
      const condominium = mockCondominiums.find(c => c.id === id);
      if (condominium) {
        setSelectedCondominium(condominium);
      }
    }
  }, []);

  // Handle clicks outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isCondominiumDropdownOpen && 
        condominiumDropdownRef.current && 
        !condominiumDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCondominiumDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCondominiumDropdownOpen]);

  const toggleCondominiumDropdown = () => {
    setIsCondominiumDropdownOpen(!isCondominiumDropdownOpen);
  };

  const handleCondominiumSelect = (condominium: typeof mockCondominiums[0]) => {
    setSelectedCondominium(condominium);
    setIsCondominiumDropdownOpen(false);
    setCurrentPage(1); // Reset to first page when changing condominium
  };

  // Filtrar moradores quando o termo de busca ou condomínio selecionado mudar
  useEffect(() => {
    let filtered = users;
    
    // Filter by condominium
    if (selectedCondominium.id !== 0) { // 0 represents "Todos os condomínios"
      filtered = filtered.filter(user => user.condominiumId === selectedCondominium.id);
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.residentType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchTerm, users, selectedCondominium, itemsPerPage]);

  const handleDeleteUser = (userId: number) => {
    // Em uma aplicação real, isso seria uma chamada à API
    setUsers(users.filter(user => user.id !== userId));
  };

  // Calcular os índices de início e fim para a página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Funções para navegação entre páginas
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Gerar array de números de página para exibição
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Se houver 5 ou menos páginas, mostre todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Caso contrário, mostre um subconjunto com a página atual no meio
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        // Ajuste o startPage se necessário
        const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1);
        for (let i = adjustedStartPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
      }
    }
    
    return pageNumbers;
  };

  // Função para lidar com a mudança no número de itens por página
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Moradores</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os moradores do condomínio
          </p>
        </div>
        <Link
          href="/moradores/cadastro"
          className="flex items-center justify-center px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none text-sm"
        >
          <RiGroupLine className="mr-1.5 text-lg" />
          Novo Morador
        </Link>
      </div>

      {/* Condominium Selector */}
      <div className="mb-6">
        <div className="relative" ref={condominiumDropdownRef}>
          <button 
            onClick={toggleCondominiumDropdown}
            className="flex items-center space-x-2 px-3 py-2 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <RiBuilding2Line className="text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              {selectedCondominium.id === 0 ? "Todos os condomínios" : selectedCondominium.name}
            </span>
            <FaChevronDown className="text-gray-500 text-xs" />
          </button>
          
          {isCondominiumDropdownOpen && (
            <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  onClick={() => handleCondominiumSelect({ id: 0, name: "Todos os condomínios" })}
                  className={`${
                    selectedCondominium.id === 0 ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                  } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
                  role="menuitem"
                >
                  Todos os condomínios
                </button>
                {mockCondominiums.map((condominium) => (
                  <button
                    key={condominium.id}
                    onClick={() => handleCondominiumSelect(condominium)}
                    className={`${
                      selectedCondominium.id === condominium.id ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                    } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
                    role="menuitem"
                  >
                    {condominium.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra de pesquisa */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <RiSearchLine className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar moradores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        />
      </div>

      {/* Tabela de moradores */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.residentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {}}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <RiEditLine className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <RiDeleteBinLine className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum morador encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginação */}
        {filteredUsers.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Anterior
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredUsers.length)}
                  </span>{' '}
                  de <span className="font-medium">{filteredUsers.length}</span> resultados
                </p>
              </div>
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <label htmlFor="items-per-page" className="text-sm text-gray-700 mr-2">
                    Por página:
                  </label>
                  <select
                    id="items-per-page"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="block w-20 pl-2 pr-6 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                  >
                    {itemsPerPageOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Anterior</span>
                    <RiArrowLeftSLine className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {getPageNumbers().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNumber
                          ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Próximo</span>
                    <RiArrowRightSLine className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 