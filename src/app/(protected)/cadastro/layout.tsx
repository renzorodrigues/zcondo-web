'use client';

import { ReactNode } from 'react';

export default function CadastroLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 