'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  console.log('Current pathname:', pathname); // Temporary log to debug

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo className="h-8 w-auto" />
            </div>
            
            <div className="flex items-center space-x-4">
              {pathname === '/dashboard' && (
                <Card className="p-2">
                  <select 
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>Selecione um condomínio</option>
                    <option value="1">Residencial Parque Verde</option>
                    <option value="2">Condomínio Solar</option>
                  </select>
                </Card>
              )}
              
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-700">
                  {user?.name}
                </div>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="text-sm"
                >
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 