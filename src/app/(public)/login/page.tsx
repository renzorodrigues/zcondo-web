'use client';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Email ou senha inválidos');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <LoadingOverlay isLoading={isLoading} message="Autenticando..." />
      {/* Lado Esquerdo - Imagem */}
      <div className="hidden lg:flex w-[70%] relative bg-gradient-to-br from-purple-600 to-purple-800 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Modern city skyline with skyscrapers"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/80 to-purple-800/80 z-10"></div>
        </div>
        
        <div className="relative z-20 w-full flex flex-col items-center justify-center px-24 text-white">
          <h1 className="text-6xl font-bold mb-8">Bem-vindo de volta</h1>
          <p className="text-xl text-primary-100 text-center max-w-2xl">
            Acesse sua conta para gerenciar seu condomínio com eficiência e segurança.
          </p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex-1 flex flex-col justify-center py-12 px-8 bg-gray-50">
        <div className="w-full max-w-sm mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Login
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Entre com suas credenciais
            </p>
          </div>

          {searchParams?.get('registered') && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              Conta criada com sucesso! Faça login para continuar.
            </div>
          )}

          {/* Botões de Login Social */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <FcGoogle size={20} />
              <span className="text-gray-700 text-center">Continuar com Google</span>
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl shadow-sm bg-[#1877F2] hover:bg-[#1864D9] text-white transition-colors duration-200"
            >
              <FaFacebook size={20} />
              <span className="text-center">Continuar com Facebook</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500">
                Ou continue com email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link href="/register" className="font-medium text-purple-600 hover:text-purple-500">
                Registre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 