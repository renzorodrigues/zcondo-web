'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  RiHome4Line, 
  RiUserLine, 
  RiSettings4Line, 
  RiLogoutBoxLine,
  RiMenuLine,
  RiBuilding2Line,
  RiUserSettingsLine,
  RiLockPasswordLine
} from 'react-icons/ri';
import { FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCondominium, setSelectedCondominium] = useState(mockCondominiums[0]);
  const [isCondominiumDropdownOpen, setIsCondominiumDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

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
      <header className="bg-white shadow-sm relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16">
            {/* Left side - empty for balance */}
            <div className="w-[30px]"></div>
            
            {/* Center - Condominium Selector */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <button 
                  onClick={toggleCondominiumDropdown}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <RiBuilding2Line className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">{selectedCondominium.name}</span>
                  <FaChevronDown className="text-gray-500 text-xs" />
                </button>
                
                {isCondominiumDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
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
            </div>
            
            {/* Right side - empty for balance */}
            <div className="w-[30px]"></div>
          </div>
        </div>
        
        {/* User Menu - With 30px margin from the right edge */}
        <div className="absolute right-[30px] top-0 h-16 flex items-center">
          <button 
            onClick={toggleUserDropdown}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition-colors"
          >
            {initials}
          </button>
          
          {isUserDropdownOpen && (
            <div className="absolute right-0 top-16 w-56 rounded-md shadow-lg bg-white z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{username}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                
                <Link 
                  href="/profile" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <RiUserSettingsLine className="mr-3 text-gray-500" />
                  Configurações de Perfil
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
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-sm h-[calc(100vh-4rem)] transition-all duration-300 fixed left-0 top-16`}>
          <div className="p-4">
            <button 
              onClick={toggleSidebar}
              className="mb-6 p-2 rounded-md hover:bg-gray-100"
            >
              <RiMenuLine className="text-gray-500" />
            </button>
            
            <nav className="space-y-1">
              <Link 
                href="/dashboard" 
                className={`flex items-center p-2 rounded-md ${
                  pathname === '/dashboard' 
                    ? 'bg-purple-50 text-purple-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <RiHome4Line className="mr-3" />
                {isSidebarOpen && <span>Dashboard</span>}
              </Link>
              
              <Link 
                href="/condominios" 
                className={`flex items-center p-2 rounded-md ${
                  pathname === '/condominios' 
                    ? 'bg-purple-50 text-purple-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <RiBuilding2Line className="mr-3" />
                {isSidebarOpen && <span>Condomínios</span>}
              </Link>
              
              <Link 
                href="/residents" 
                className={`flex items-center p-2 rounded-md ${
                  pathname === '/residents' 
                    ? 'bg-purple-50 text-purple-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <RiUserLine className="mr-3" />
                {isSidebarOpen && <span>Moradores</span>}
              </Link>
              
              <Link 
                href="/settings" 
                className={`flex items-center p-2 rounded-md ${
                  pathname === '/settings' 
                    ? 'bg-purple-50 text-purple-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <RiSettings4Line className="mr-3" />
                {isSidebarOpen && <span>Configurações</span>}
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