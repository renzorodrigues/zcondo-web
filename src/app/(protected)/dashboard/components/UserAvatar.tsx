'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { RiLogoutBoxLine, RiUserSettingsLine, RiLockPasswordLine } from 'react-icons/ri';
import Link from 'next/link';

export default function UserAvatar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [displayUser, setDisplayUser] = useState(user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isCadastroPage = pathname === '/cadastro';

  // Mantém as informações do usuário durante a transição de logout
  useEffect(() => {
    if (user) {
      setDisplayUser(user);
    }
  }, [user]);

  // Fecha o dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Se não estiver autenticado e não tiver usuário para exibir, não renderiza nada
  if (!isAuthenticated && !displayUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2"
      >
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
          {displayUser?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="text-sm">
          <p className="text-gray-500">{displayUser?.email}</p>
        </div>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{displayUser?.name}</p>
            </div>
            
            {!isCadastroPage && (
              <>
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
              </>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <RiLogoutBoxLine className="mr-3 text-gray-500" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 