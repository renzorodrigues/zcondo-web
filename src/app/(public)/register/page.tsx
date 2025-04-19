'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { registerService } from '@/services/auth';
import { RegisterData } from '@/types/auth';
import LoadingOverlay from '@/components/LoadingOverlay';
import { TbLoader3 } from 'react-icons/tb';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterData>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.passwordConfirmation) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      await registerService.register(formData);
      router.push(`/register/confirmation?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex">
      <LoadingOverlay isLoading={loading} message="Criando sua conta..." />
      {/* Lado Esquerdo - Imagem */}
      <div className="hidden lg:flex w-[70%] relative bg-gradient-to-br from-purple-600 to-purple-800 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2035&q=80"
            alt="Modern residential buildings"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/80 to-purple-800/80 z-10"></div>
        </div>
        
        <div className="relative z-20 w-full flex flex-col items-center justify-center px-24 text-white">
          <h1 className="text-6xl font-bold mb-8">Crie sua conta</h1>
          <p className="text-xl text-primary-100 text-center max-w-2xl">
            Gerencie seu condomínio de forma simples e eficiente. Comece seu período de teste gratuito hoje mesmo.
          </p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex-1 flex flex-col justify-center py-12 px-8 bg-gray-50">
        <div className="w-full max-w-sm mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Registro
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Preencha seus dados para criar sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  required
                  value={formData.firstname}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                  Sobrenome
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  required
                  value={formData.lastname}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="Seu sobrenome"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
                Confirmar senha
              </label>
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                autoComplete="new-password"
                required
                value={formData.passwordConfirmation}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <TbLoader3 className="w-5 h-5 text-white animate-spin mr-2" />
                    <span>Criando conta...</span>
                  </div>
                ) : (
                  'Teste grátis por 14 dias'
                )}
              </button>
              <p className="mt-2 text-xs text-center text-gray-500">
                Não é necessário cartão de crédito. Cancele a qualquer momento.
              </p>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 