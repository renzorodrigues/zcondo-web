'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  RiMoneyDollarCircleLine, 
  RiFileList3Line,
  RiBankLine,
  RiArrowRightLine
} from 'react-icons/ri';

interface FinanceiroCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export default function FinanceiroPage() {
  const router = useRouter();
  const [cards] = useState<FinanceiroCard[]>([
    {
      id: 'boletos',
      title: 'Configuração de Boletos',
      description: 'Configure os dados do banco e as opções de geração de boletos',
      icon: <RiBankLine className="w-8 h-8 text-purple-600" />,
      href: '/financeiro/boletos'
    },
    {
      id: 'cobrancas',
      title: 'Cobranças',
      description: 'Gerencie as cobranças e boletos dos moradores',
      icon: <RiMoneyDollarCircleLine className="w-8 h-8 text-purple-600" />,
      href: '/financeiro/cobrancas'
    },
    {
      id: 'relatorios',
      title: 'Relatórios',
      description: 'Visualize relatórios financeiros e extrato de pagamentos',
      icon: <RiFileList3Line className="w-8 h-8 text-purple-600" />,
      href: '/financeiro/relatorios'
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Financeiro</h1>
        <p className="text-gray-600 mt-1">Gerencie as finanças do condomínio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => router.push(card.href)}
            className="flex flex-col items-start p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between w-full mb-4">
              {card.icon}
              <RiArrowRightLine className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">{card.title}</h2>
            <p className="text-sm text-gray-500">{card.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
} 