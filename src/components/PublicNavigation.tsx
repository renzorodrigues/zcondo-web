'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function PublicNavigation() {
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/zcondologo.jpg"
                alt="ZCONDO - Gestão Condominial"
                width={120}
                height={64}
                className="h-16 w-auto"
                priority
              />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Começar agora
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 