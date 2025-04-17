'use client';

import { RiLoader4Line } from 'react-icons/ri';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingOverlay({ isLoading, message = 'Carregando...' }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 flex flex-col items-center space-y-4">
        <RiLoader4Line className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
} 