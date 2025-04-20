'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RiCheckboxCircleLine, RiErrorWarningLine, RiArrowLeftLine } from 'react-icons/ri';
import Link from 'next/link';
import { registerService } from '@/services/auth/register.service';

export default function ActivatePage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activationAttempted = useRef(false);

  useEffect(() => {
    const activateAccount = async () => {
      // Se já tentou ativar, não tenta novamente
      if (activationAttempted.current) return;
      
      try {
        activationAttempted.current = true;
        console.log('Tentando ativar conta com código:', params.code);
        await registerService.activateAccount(params.code);
        setIsSuccess(true);
        setError(null);
      } catch (err) {
        console.error('Erro ao ativar conta:', err);
        setError('Não foi possível ativar sua conta. Por favor, tente novamente.');
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    activateAccount();
  }, [params.code]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600">Ativando sua conta...</p>
              </div>
            ) : isSuccess ? (
              <div className="flex flex-col items-center">
                <RiCheckboxCircleLine className="h-12 w-12 text-green-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Conta Ativada!</h2>
                <p className="mt-2 text-gray-600">
                  Sua conta foi ativada com sucesso. Você já pode fazer login.
                </p>
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Ir para o Login
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <RiErrorWarningLine className="h-12 w-12 text-red-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Erro na Ativação</h2>
                <p className="mt-2 text-gray-600">{error}</p>
                <div className="mt-6 space-y-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Ir para o Login
                  </Link>
                  <div>
                    <Link
                      href="/"
                      className="inline-flex items-center text-sm text-purple-600 hover:text-purple-500"
                    >
                      <RiArrowLeftLine className="mr-1" />
                      Voltar para a página inicial
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 