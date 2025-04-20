'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import UserAvatar from '../dashboard/components/UserAvatar';

export default function CadastroLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex justify-center items-center">
              <Image
                src="/images/zcondologo.jpg"
                alt="ZCondo Logo"
                width={120}
                height={64}
                className="h-16 w-auto"
                priority
              />
            </div>
            <div>
              <UserAvatar />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 