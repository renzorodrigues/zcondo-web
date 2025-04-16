'use client';

import Link from 'next/link';
import Image from 'next/image';
import { RiArrowRightLine, RiTeamLine, RiBuildingLine, RiShieldCheckLine } from 'react-icons/ri';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Gestão condominial simplificada e eficiente
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transforme a administração do seu condomínio com nossa plataforma completa.
              Automatize processos, melhore a comunicação e tome decisões baseadas em dados.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Começar gratuitamente
                <RiArrowRightLine className="ml-2" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-medium rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
              >
                Falar com a equipe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <RiBuildingLine className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gestão Completa
              </h3>
              <p className="text-gray-600">
                Controle financeiro, reservas de áreas comuns, documentos e muito mais em uma única plataforma.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <RiTeamLine className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comunicação Eficiente
              </h3>
              <p className="text-gray-600">
                Mantenha todos informados com notificações, avisos e comunicados centralizados.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <RiShieldCheckLine className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Segurança Garantida
              </h3>
              <p className="text-gray-600">
                Seus dados protegidos com as mais avançadas tecnologias de segurança e criptografia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fale com nossa equipe
            </h2>
            <p className="text-gray-600 mb-8">
              Tire suas dúvidas e descubra como podemos ajudar na gestão do seu condomínio.
            </p>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Nome"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
              <div>
                <textarea
                  placeholder="Mensagem"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Enviar mensagem
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <Image
                src="/images/zcondologo.jpg"
                alt="ZCONDO Logo"
                width={100}
                height={32}
                className="h-8 w-auto"
              />
              <p className="mt-2 text-sm text-gray-500">
                © 2024 ZCONDO. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                Termos de Uso
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 