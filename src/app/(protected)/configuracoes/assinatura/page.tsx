'use client';

import { useState } from 'react';
import { RiVipCrownLine, RiCheckLine, RiIdCardLine, RiHistoryLine, RiLockLine, RiArrowRightLine, RiBuilding2Line } from 'react-icons/ri';
import { TbLoader3 } from 'react-icons/tb';
import { toast } from 'react-hot-toast';

interface Plan {
  id: string;
  nome: string;
  preco: number;
  periodo: 'mensal' | 'anual';
  recursos: string[];
  destaque: boolean;
}

interface BillingHistory {
  id: string;
  data: string;
  valor: number;
  status: 'pago' | 'pendente' | 'falha';
  metodo: string;
}

interface PaymentMethod {
  id: string;
  tipo: 'cartao' | 'boleto';
  ultimosDigitos?: string;
  bandeira?: string;
  vencimento?: string;
  padrao: boolean;
}

export default function ConfiguracoesAssinaturaPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [billingPeriod, setBillingPeriod] = useState<'mensal' | 'anual'>('mensal');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in a real app, this would come from an API
  const plans: Plan[] = [
    {
      id: 'basic',
      nome: 'Básico',
      preco: 49.90,
      periodo: 'mensal',
      recursos: [
        'Gestão de 1 condomínio',
        'Relatórios básicos',
        'Suporte por e-mail',
        'Backup diário'
      ],
      destaque: false
    },
    {
      id: 'premium',
      nome: 'Premium',
      preco: 99.90,
      periodo: 'mensal',
      recursos: [
        'Gestão de múltiplos condomínios',
        'Relatórios avançados',
        'Suporte prioritário',
        'Backup automático',
        'API de integração'
      ],
      destaque: true
    },
    {
      id: 'enterprise',
      nome: 'Enterprise',
      preco: 199.90,
      periodo: 'mensal',
      recursos: [
        'Todos os recursos Premium',
        'Gestão ilimitada de condomínios',
        'Suporte 24/7',
        'Backup em tempo real',
        'API de integração',
        'Treinamento personalizado'
      ],
      destaque: false
    }
  ];

  const billingHistory: BillingHistory[] = [
    {
      id: '1',
      data: '2023-12-01',
      valor: 99.90,
      status: 'pago',
      metodo: 'Cartão de Crédito'
    },
    {
      id: '2',
      data: '2023-11-01',
      valor: 99.90,
      status: 'pago',
      metodo: 'Cartão de Crédito'
    },
    {
      id: '3',
      data: '2023-10-01',
      valor: 99.90,
      status: 'pago',
      metodo: 'Cartão de Crédito'
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      tipo: 'cartao',
      ultimosDigitos: '4242',
      bandeira: 'Visa',
      vencimento: '12/25',
      padrao: true
    },
    {
      id: '2',
      tipo: 'boleto',
      padrao: false
    }
  ];

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleBillingPeriodChange = (period: 'mensal' | 'anual') => {
    setBillingPeriod(period);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aqui você faria a chamada para a API para atualizar a assinatura
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulando uma chamada à API
      toast.success('Assinatura atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar assinatura:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Configurações de Assinatura</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg p-4 lg:p-6 ${
              selectedPlan === plan.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200'
            } ${plan.destaque ? 'relative' : ''}`}
          >
            {plan.destaque && (
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <span className="bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Recomendado
                </span>
              </div>
            )}
            
            <div className="flex items-center mb-4">
              <RiVipCrownLine className={`text-2xl mr-2 ${
                selectedPlan === plan.id ? 'text-purple-600' : 'text-gray-400'
              }`} />
              <h3 className="text-xl font-semibold text-gray-900">{plan.nome}</h3>
            </div>
            
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(billingPeriod === 'anual' ? plan.preco * 10 : plan.preco)}
              </span>
              <span className="text-gray-500 ml-1">
                /{billingPeriod === 'anual' ? 'ano' : 'mês'}
              </span>
            </div>
            
            <ul className="space-y-3 mb-6">
              {plan.recursos.map((recurso, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <RiCheckLine className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  {recurso}
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                selectedPlan === plan.id
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50'
              }`}
            >
              {selectedPlan === plan.id ? 'Plano Atual' : 'Selecionar Plano'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Histórico de Pagamentos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Valor
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Status
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Método
                </th>
                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billingHistory.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(item.data)}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {formatCurrency(item.valor)}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm hidden md:table-cell">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'pago'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'pago' ? 'Pago' : item.status === 'pendente' ? 'Pendente' : 'Falha'}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {item.metodo}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-purple-600 hover:text-purple-900">
                      Ver Recibo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 