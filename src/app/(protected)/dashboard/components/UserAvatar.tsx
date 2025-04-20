'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

export default function UserAvatar() {
  const { user, isAuthenticated } = useAuth();
  const [displayUser, setDisplayUser] = useState(user);

  // Mantém as informações do usuário durante a transição de logout
  useEffect(() => {
    if (user) {
      setDisplayUser(user);
    }
  }, [user]);

  // Se não estiver autenticado e não tiver usuário para exibir, não renderiza nada
  if (!isAuthenticated && !displayUser) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
        {displayUser?.name?.charAt(0).toUpperCase() || 'U'}
      </div>
      <div className="text-sm">
        <p className="text-gray-500">{displayUser?.email}</p>
      </div>
    </div>
  );
} 