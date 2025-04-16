'use client';

import Link from 'next/link';
import { RiShieldCheckLine, RiFlashlightLine, RiBarChartLine } from 'react-icons/ri';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full bg-white border-b border-gray-100 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="ZCondo Logo"
                width={120}
                height={64}
                className="h-16 w-auto"
                priority
              />
              <span className="ml-3 text-lg font-semibold text-gray-900">ZCondo</span>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-6">
              <a href="#features" className="text-base font-medium text-gray-600 hover:text-gray-900">
                Recursos
              </a>
              <a href="#benefits" className="text-base font-medium text-gray-600 hover:text-gray-900">
                Benefícios
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Começar agora
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative pt-16 overflow-hidden">
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-32">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block">Gestão inteligente</span>
                <span className="block text-purple-600">para seu condomínio</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
                Simplifique a administração do seu condomínio com uma plataforma moderna e intuitiva.
                Tudo que você precisa em um só lugar.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:text-lg md:px-8"
                >
                  Começar gratuitamente
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 md:text-lg md:px-8"
                >
                  Saiba mais
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="relative bg-gray-50 py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Tudo que você precisa em uma única plataforma
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Gerencie seu condomínio de forma eficiente e moderna
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-purple-600 rounded-md shadow-lg">
                        <RiShieldCheckLine className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Segurança Avançada</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Controle de acesso, monitoramento em tempo real e registro de ocorrências para maior segurança.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-purple-600 rounded-md shadow-lg">
                        <RiFlashlightLine className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Gestão Automatizada</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Automatize tarefas rotineiras, agendamentos e comunicações com os moradores.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-purple-600 rounded-md shadow-lg">
                        <RiBarChartLine className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Controle Financeiro</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Gestão completa de receitas, despesas e prestação de contas transparente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="relative bg-white py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Benefícios que fazem a diferença
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Nossa plataforma foi desenvolvida pensando nas necessidades reais de síndicos e moradores.
              </p>
              <div className="mt-8 space-y-6">
                {[
                  {
                    title: 'Economia de tempo',
                    description: 'Automatize processos e reduza o tempo gasto com tarefas administrativas.'
                  },
                  {
                    title: 'Transparência',
                    description: 'Acesso fácil a relatórios e prestação de contas para todos os moradores.'
                  },
                  {
                    title: 'Facilidade de uso',
                    description: 'Interface intuitiva que não exige conhecimento técnico para operar.'
                  }
                ].map((benefit) => (
                  <div key={benefit.title} className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
                        <RiShieldCheckLine className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{benefit.title}</h4>
                      <p className="mt-2 text-base text-gray-500">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:pl-8">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <Image
                  src="/features/feature-1.png"
                  alt="Gestão de Moradores"
                  width={400}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Pronto para começar?</span>
            <span className="block text-purple-200">Experimente gratuitamente por 14 dias.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50"
              >
                Começar agora
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={64}
                className="h-8"
              />
              <span className="ml-2 text-xl font-semibold">ZCondo</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 ZCondo. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 