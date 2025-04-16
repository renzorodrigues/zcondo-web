'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  RiHome4Line,
  RiLogoutBoxLine,
  RiMenuLine,
  RiBuilding2Line,
  RiUserSettingsLine,
  RiLockPasswordLine,
  RiGroupLine,
  RiMoneyDollarCircleLine
} from 'react-icons/ri';
import { FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// Mock data for condominiums - in a real app, this would come from an API
const mockCondominiums = [
  { id: 1, name: 'Residencial Parque Verde' },
  { id: 2, name: 'Edifício Central' },
  { id: 3, name: 'Condomínio Solar' },
  { id: 4, name: 'Residencial Horizonte' }
];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname() || '';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCondominium, setSelectedCondominium] = useState(mockCondominiums[0]);
  const [isCondominiumDropdownOpen, setIsCondominiumDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const isDashboard = pathname === '/dashboard';
  
  // Refs para os dropdowns
  const condominiumDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Get username from email (part before @)
  const username = user?.email ? user.email.split('@')[0] : '';
  
  // Get initials for avatar
  const initials = username ? username.substring(0, 2).toUpperCase() : '';

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

  // Handle clicks outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close condominium dropdown if click is outside
      if (
        isCondominiumDropdownOpen && 
        condominiumDropdownRef.current && 
        !condominiumDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCondominiumDropdownOpen(false);
      }
      
      // Close user dropdown if click is outside
      if (
        isUserDropdownOpen && 
        userDropdownRef.current && 
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCondominiumDropdownOpen, isUserDropdownOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCondominiumDropdown = () => {
    setIsCondominiumDropdownOpen(!isCondominiumDropdownOpen);
  };

  const handleCondominiumSelect = (condominium: typeof mockCondominiums[0]) => {
    setSelectedCondominium(condominium);
    setIsCondominiumDropdownOpen(false);
    
    // Store the selected condominium ID in localStorage
    localStorage.setItem('selectedCondominiumId', condominium.id.toString());
    
    // Dispatch a storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-30">
        <div className="w-full">
          <div className="flex items-center h-20">
            {/* Left side - Logo */}
            <div className="w-64 flex justify-center items-center">
              <Image
                src="/images/zcondologo.jpg"
                alt="ZCondo Logo"
                width={120}
                height={64}
                className="h-16 w-auto"
                priority
              />
            </div>
            
            {/* Center - Condominium Selector */}
            <div className="flex-1 flex justify-center items-center">
              {isDashboard && (
                <div className="relative" ref={condominiumDropdownRef}>
                  <button 
                    onClick={toggleCondominiumDropdown}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <RiBuilding2Line className="text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">{selectedCondominium.name}</span>
                    <FaChevronDown className="text-gray-500 text-xs" />
                  </button>
                  
                  {isCondominiumDropdownOpen && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 rounded-md shadow-lg bg-white z-10">
                      <div className="py-1" role="menu" aria-orientation="vertical">
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
              )}
            </div>
            
            {/* Right side - User Menu */}
            <div className="w-64 flex justify-end items-center pr-8">
              <div ref={userDropdownRef}>
                <button 
                  onClick={toggleUserDropdown}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition-colors text-center"
                >
                  {initials}
                </button>
                
                {isUserDropdownOpen && (
                  <div className="absolute right-8 mt-2 w-56 rounded-md shadow-lg bg-white z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{username}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      
                      <Link 
                        href="/configuracoes/perfil" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <RiUserSettingsLine className="mr-3 text-gray-500" />
                        Configurações
                      </Link>
                      
                      <Link 
                        href="/change-password" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <RiLockPasswordLine className="mr-3 text-gray-500" />
                        Alterar Senha
                      </Link>
                      
                      <div className="border-t border-gray-100">
                        <button
                          onClick={logout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <RiLogoutBoxLine className="mr-3 text-gray-500" />
                          Sair
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-sm h-[calc(100vh-5rem)] transition-all duration-300 fixed left-0 top-20 z-20`}>
          <div className="p-4">
            <nav className="space-y-1">
              <button 
                onClick={toggleSidebar}
                className={`w-full flex items-center ${
                  isSidebarOpen ? 'px-2' : 'justify-center'
                } py-2 mb-6 text-sm font-medium rounded-md text-gray-600`}
              >
                <RiMenuLine className={`${isSidebarOpen ? 'text-base' : 'text-lg'} transition-all duration-300`} />
              </button>

              <Link
                href="/dashboard"
                className={`flex items-center ${
                  isSidebarOpen ? 'px-2' : 'justify-center'
                } py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                  pathname === '/dashboard'
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-gray-600'
                }`}
              >
                <RiHome4Line className={`${isSidebarOpen ? 'text-base' : 'text-lg'} transition-all duration-300`} />
                <span className={`ml-3 transition-all ${isSidebarOpen ? 'duration-500' : 'duration-300'} ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>Dashboard</span>
              </Link>

              <Link
                href="/condominios"
                className={`flex items-center ${
                  isSidebarOpen ? 'px-2' : 'justify-center'
                } py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                  pathname.startsWith('/condominios')
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-gray-600'
                }`}
              >
                <RiBuilding2Line className={`${isSidebarOpen ? 'text-base' : 'text-lg'} transition-all duration-300`} />
                <span className={`ml-3 transition-all ${isSidebarOpen ? 'duration-500' : 'duration-300'} ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>Condomínios</span>
              </Link>

              <Link
                href="/moradores"
                className={`flex items-center ${
                  isSidebarOpen ? 'px-2' : 'justify-center'
                } py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                  pathname.startsWith('/moradores')
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-gray-600'
                }`}
              >
                <RiGroupLine className={`${isSidebarOpen ? 'text-base' : 'text-lg'} transition-all duration-300`} />
                <span className={`ml-3 transition-all ${isSidebarOpen ? 'duration-500' : 'duration-300'} ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>Moradores</span>
              </Link>

              <Link
                href="/financeiro"
                className={`flex items-center ${
                  isSidebarOpen ? 'px-2' : 'justify-center'
                } py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                  pathname.startsWith('/financeiro')
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-gray-600'
                }`}
              >
                <RiMoneyDollarCircleLine className={`${isSidebarOpen ? 'text-base' : 'text-lg'} transition-all duration-300`} />
                <span className={`ml-3 transition-all ${isSidebarOpen ? 'duration-500' : 'duration-300'} ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>Financeiro</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        } flex-1 p-6 transition-all duration-300`}>
          {children}
        </main>
      </div>
    </div>
  );
} 