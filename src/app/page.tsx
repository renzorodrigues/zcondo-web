'use client';

import Link from 'next/link';
import Image from 'next/image';
import { RiArrowRightLine, RiTeamLine, RiBuildingLine, RiShieldCheckLine } from 'react-icons/ri';
import ContactForm from '@/components/ContactForm';

export default function Page() {
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
                Proteja os dados do seu condomínio com as mais avançadas medidas de segurança.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Por que escolher o ZCONDO?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Economia de tempo e recursos
              </h3>
              <p className="text-gray-600">
                Automatize tarefas repetitivas e reduza o tempo gasto com processos manuais.
                Nossa plataforma ajuda você a fazer mais com menos.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Transparência total
              </h3>
              <p className="text-gray-600">
                Mantenha todos os moradores informados sobre as decisões e ações do condomínio.
                Acesso fácil a documentos e informações importantes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-purple-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para transformar a gestão do seu condomínio?
            </h2>
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
              Comece agora mesmo e descubra como podemos ajudar você a administrar seu condomínio
              de forma mais eficiente e transparente.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors"
            >
              Criar conta gratuita
              <RiArrowRightLine className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Entre em contato
              </h2>
              <p className="text-gray-600 mb-8">
                Tem alguma dúvida? Nossa equipe está pronta para ajudar você a encontrar
                a melhor solução para o seu condomínio.
              </p>
              <div className="space-y-4">
                <p className="flex items-center text-gray-600">
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">contato@zcondo.com.br</span>
                </p>
                <p className="flex items-center text-gray-600">
                  <span className="font-medium">Telefone:</span>
                  <span className="ml-2">(11) 9999-9999</span>
                </p>
              </div>
            </div>
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/images/zcondologo.jpg"
                alt="ZCONDO - Gestão Condominial"
                width={120}
                height={64}
                className="h-12 w-auto mb-4"
              />
              <p className="text-sm">
                Transformando a gestão condominial com tecnologia e inovação.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Produto</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm hover:text-white">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-white">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-white">
                    Casos de uso
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm hover:text-white">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-white">
                    Carreiras
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm hover:text-white">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-white">
                    Termos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-white">
                    Segurança
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} ZCONDO. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 