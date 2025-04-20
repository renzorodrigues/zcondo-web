'use client';

import { useState, useEffect, useRef } from 'react';
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
import UserAvatar from './dashboard/components/UserAvatar';
import { useAuth } from '@/hooks/useAuth';

interface Condominium {
  id: number;
  name: string;
}

// Mock data for condominiums - in a real app, this would come from an API
const mockCondominiums: Condominium[] = [
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
  const pathname = usePathname() || '';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCondominium, setSelectedCondominium] = useState<Condominium | null>(null);
  const [isCondominiumDropdownOpen, setIsCondominiumDropdownOpen] = useState(false);
  const isDashboard = pathname === '/dashboard';
  const isRegistration = pathname === '/cadastro';
  const { logout, user } = useAuth();
  
  // Refs para os dropdowns
  const condominiumDropdownRef = useRef<HTMLDivElement>(null);

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

    // Listen for condominium changes from other tabs
    const channel = new BroadcastChannel('condominium');
    const handleCondominiumChange = (event: MessageEvent) => {
      if (event.data.type === 'CONDOMINIUM_CHANGED') {
        const id = event.data.condominiumId;
        const condominium = mockCondominiums.find(c => c.id === id);
        if (condominium) {
          setSelectedCondominium(condominium);
        }
      }
    };
    
    channel.addEventListener('message', handleCondominiumChange);
    
    return () => {
      channel.removeEventListener('message', handleCondominiumChange);
      channel.close();
    };
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
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCondominiumDropdownOpen]);

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
    
    // Notify other components about the condominium change
    const channel = new BroadcastChannel('condominium');
    channel.postMessage({
      type: 'CONDOMINIUM_CHANGED',
      condominiumId: condominium.id
    });
  };

  const handleLogout = () => {
    logout();
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
              {isDashboard && !isRegistration && (
                <div className="relative" ref={condominiumDropdownRef}>
                  <button 
                    onClick={toggleCondominiumDropdown}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <RiBuilding2Line className="text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">{selectedCondominium?.name}</span>
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
                              selectedCondominium?.id === condominium.id ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
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
              <UserAvatar />
            </div>
          </div>
        </div>
      </header>
      
      <div className={`flex flex-col lg:flex-row pt-20 ${isRegistration ? 'justify-center' : ''}`}>
        {/* Sidebar */}
        {!isRegistration && (
          <aside className={`${
            isSidebarOpen ? 'w-full lg:w-64' : 'w-full lg:w-20'
          } bg-white shadow-sm h-auto lg:h-[calc(100vh-5rem)] transition-all duration-300 fixed lg:fixed left-0 top-20 z-20`}>
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
        )}

        {/* Main Content */}
        <main className={`${
          isRegistration 
            ? 'w-full max-w-4xl mx-auto' 
            : (isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20')
        } flex-1 p-4 lg:p-6 transition-all duration-300`}>
          {children}
        </main>
      </div>
    </div>
  );
} 