'use client';

import { useState } from 'react';
import { RiVipCrownLine, RiCheckLine, RiIdCardLine, RiHistoryLine, RiLockLine, RiArrowRightLine } from 'react-icons/ri';
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Configurações da Assinatura</h1>
        <p className="text-gray-600 mt-1">Gerencie seu plano, histórico de cobranças e métodos de pagamento</p>
      </div>
      
      <div className="space-y-6">
        {/* Seleção de Plano */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Selecione seu Plano</h2>
          
          <div className="mb-6 flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => handleBillingPeriodChange('mensal')}
              className={`px-4 py-2 rounded-md ${
                billingPeriod === 'mensal'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mensal
            </button>
            <button
              type="button"
              onClick={() => handleBillingPeriodChange('anual')}
              className={`px-4 py-2 rounded-md ${
                billingPeriod === 'anual'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Anual <span className="text-xs">(Economize 20%)</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-lg p-6 ${
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
                  type="button"
                  onClick={() => handlePlanChange(plan.id)}
                  className={`w-full py-2 rounded-md ${
                    selectedPlan === plan.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Plano Atual' : 'Selecionar'}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Histórico de Cobranças */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800">Histórico de Cobranças</h2>
            <RiHistoryLine className="text-gray-400" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billingHistory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.data)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.valor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.metodo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
        
        {/* Métodos de Pagamento */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800">Métodos de Pagamento</h2>
            <button
              type="button"
              className="text-purple-600 hover:text-purple-900 flex items-center"
            >
              Adicionar Método
              <RiArrowRightLine className="ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  {method.tipo === 'cartao' ? (
                    <RiIdCardLine className="text-2xl text-gray-400 mr-4" />
                  ) : (
                    <RiLockLine className="text-2xl text-gray-400 mr-4" />
                  )}
                  
                  <div>
                    {method.tipo === 'cartao' ? (
                      <>
                        <p className="text-sm font-medium text-gray-900">
                          {method.bandeira} •••• {method.ultimosDigitos}
                        </p>
                        <p className="text-xs text-gray-500">
                          Expira em {method.vencimento}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-medium text-gray-900">
                        Boleto Bancário
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  {method.padrao && (
                    <span className="mr-4 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Padrão
                    </span>
                  )}
                  
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Botão de Salvar */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 