'use client';

import { useAuth } from '@/hooks/useAuth';

export default function UserAvatar() {
  const { user } = useAuth();
  console.log('Avatar - User data:', user);

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
          {user.email?.substring(0, 2).toUpperCase()}
        </div>
        <span className="text-sm text-gray-700">{user.email}</span>
      </div>
    </div>
  );
} 