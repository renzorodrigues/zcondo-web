'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { registerService } from '@/services/auth/register.service';
import { tokenService } from '@/services/auth/token.service';
import { RiBuilding2Line, RiCheckboxCircleLine, RiErrorWarningLine } from 'react-icons/ri';
import { TbLoader3 } from 'react-icons/tb';

export default function ActivatePage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const activationAttempted = useRef(false);
  const redirectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Se já tentou ativar, não tenta novamente
    if (activationAttempted.current) return;
    
    const abortController = new AbortController();
    
    const activateAccount = async () => {
      try {
        activationAttempted.current = true;
        console.log('Making API request for activation code:', params.code);
        
        const response = await registerService.activateAccount(params.code);
        
        // Se a ativação retornou tokens, armazena-os
        if (response.access_token) {
          tokenService.setTokens({
            access_token: response.access_token,
            refresh_token: response.refresh_token,
            expires_in: response.expires_in
          });
        }

        setStatus('success');
        setMessage('Conta ativada com sucesso!');
        
        // Redireciona para o login após 3 segundos
        redirectTimeout.current = setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (error: any) {
        // Ignora erros de abort
        if (error.name === 'AbortError') return;
        
        setStatus('error');
        setMessage('O código de ativação não está mais válido ou expirou.');
        console.error('Erro na ativação:', error);
      }
    };

    activateAccount();

    return () => {
      abortController.abort();
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
    };
  }, [params.code, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Ativação de Conta
          </h2>
          <div className="mt-4">
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <TbLoader3 className="w-12 h-12 text-purple-600 animate-spin" />
                <p className="text-gray-600">Ativando sua conta...</p>
                <p className="text-sm text-gray-500">Por favor, aguarde enquanto processamos sua ativação.</p>
              </div>
            )}
            {status === 'success' && (
              <div className="space-y-4">
                <div className="text-green-600">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="mt-2 text-lg font-medium">{message}</p>
                  <p className="text-sm text-gray-500">Você será redirecionado para o login em alguns segundos.</p>
                </div>
                <button
                  onClick={() => router.push('/login')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Ir para o Login
                </button>
              </div>
            )}
            {status === 'error' && (
              <div className="space-y-4">
                <div className="text-red-600">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="mt-2 text-lg font-medium">{message}</p>
                </div>
                <button
                  onClick={() => router.push('/login')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Ir para o Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 