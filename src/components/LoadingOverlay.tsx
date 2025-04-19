'use client';

import { TbLoader3 } from 'react-icons/tb';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingOverlay({ isLoading, message = 'Carregando...' }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <TbLoader3 className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
} 