'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineMailOpen } from 'react-icons/hi';
import { MdOutlineMarkEmailRead } from 'react-icons/md';

export default function RegisterConfirmationPage() {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <HiOutlineMailOpen className="w-24 h-24 text-purple-600" />
            <div className="absolute -right-2 -bottom-2 bg-green-500 rounded-full p-2">
              <MdOutlineMarkEmailRead className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verifique seu email
          </h2>
        </div>

        <div className="mt-2 text-center text-gray-600">
          <p className="text-lg">
            Enviamos um link de ativação para:
          </p>
          <p className="mt-1 text-xl font-medium text-purple-600">
            {email}
          </p>
          <p className="mt-4">
            Por favor, verifique sua caixa de entrada e clique no link de ativação para confirmar sua conta.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              Não recebeu o email? Verifique sua pasta de spam ou aguarde alguns minutos.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Link
              href="/login"
              className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Ir para o login
            </Link>
            <Link
              href="/"
              className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Voltar para a página inicial
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Precisa de ajuda?{' '}
            <a href="mailto:suporte@zcondo.com.br" className="font-medium text-purple-600 hover:text-purple-500">
              Entre em contato com o suporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 