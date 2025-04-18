'use client';

import { useAuth } from '@/hooks/useAuth';

export default function UserAvatar() {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
        {user?.name?.charAt(0).toUpperCase() || 'U'}
      </div>
      <div className="text-sm">
        <p className="font-medium text-gray-700">{user?.name || 'Usuário'}</p>
        <p className="text-gray-500">{user?.email}</p>
      </div>
    </div>
  );
} 