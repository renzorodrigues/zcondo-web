'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  RiMoneyDollarCircleLine, 
  RiCalendarCheckLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiNotification3Line,
  RiFileList3Line,
  RiGroupLine
} from 'react-icons/ri';

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
}

interface Occurrence {
  id: number;
  type: 'resident' | 'reservation' | 'occurrence';
  title: string;
  description: string;
  time: string;
}

interface CondominiumStats {
  residents: { total: number; change: number };
  revenue: { total: number; change: number };
  reservations: { total: number; change: number };
}

interface CondominiumData {
  name: string;
  stats: CondominiumStats;
  notifications: Notification[];
  occurrences: Occurrence[];
}

interface DashboardData {
  [key: number]: CondominiumData;
}

// Mock data for dashboard - in a real app, this would come from an API
const mockDashboardData: DashboardData = {
  1: {
    name: 'Residencial Parque Verde',
    stats: {
      residents: { total: 120, change: 5 },
      revenue: { total: 45000, change: -2 },
      reservations: { total: 45, change: 12 }
    },
    notifications: [
      {
        id: 1,
        title: 'Manutenção Programada',
        description: 'Manutenção do elevador programada para amanhã',
        time: '2 horas atrás'
      },
      {
        id: 2,
        title: 'Nova Reserva',
        description: 'Salão de festas reservado para o próximo sábado',
        time: '3 horas atrás'
      }
    ],
    occurrences: [
      {
        id: 1,
        type: 'resident',
        title: 'Novo Morador',
        description: 'João Silva se mudou para o apartamento 101',
        time: '1 dia atrás'
      },
      {
        id: 2,
        type: 'reservation',
        title: 'Reserva de Área',
        description: 'Área de lazer reservada para o próximo fim de semana',
        time: '2 dias atrás'
      }
    ]
  },
  2: {
    name: 'Edifício Central',
    stats: {
      residents: { total: 85, change: 3 },
      revenue: { total: 32000, change: 8 },
      reservations: { total: 30, change: 5 }
    },
    notifications: [
      {
        id: 1,
        title: 'Reunião de Condomínio',
        description: 'Reunião extraordinária marcada para próxima semana',
        time: '1 hora atrás'
      }
    ],
    occurrences: [
      {
        id: 1,
        type: 'occurrence',
        title: 'Manutenção Concluída',
        description: 'Manutenção do sistema de segurança concluída',
        time: '3 dias atrás'
      }
    ]
  },
  3: {
    name: 'Condomínio Solar',
    stats: {
      residents: { total: 95, change: 0 },
      revenue: { total: 38000, change: 4 },
      reservations: { total: 25, change: -3 }
    },
    notifications: [],
    occurrences: []
  },
  4: {
    name: 'Residencial Horizonte',
    stats: {
      residents: { total: 150, change: 8 },
      revenue: { total: 55000, change: 15 },
      reservations: { total: 60, change: 20 }
    },
    notifications: [],
    occurrences: []
  }
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCondominiumId, setSelectedCondominiumId] = useState(1);
  const [dashboardData, setDashboardData] = useState<CondominiumData | null>(null);

  // Update dashboard data when component mounts or when selectedCondominiumId changes
  useEffect(() => {
    // Get the selected condominium ID from localStorage
    const storedId = localStorage.getItem('selectedCondominiumId');
    if (storedId) {
      const id = parseInt(storedId, 10);
      setSelectedCondominiumId(id);
    }
  }, []);

  // Update dashboard data when selectedCondominiumId changes
  useEffect(() => {
    // In a real app, this would be an API call
    setDashboardData(mockDashboardData[selectedCondominiumId]);
    
    // Log to verify the effect is running
    console.log('Dashboard updated for condominium:', selectedCondominiumId);
  }, [selectedCondominiumId]);

  // Listen for condominium selection changes from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const storedId = localStorage.getItem('selectedCondominiumId');
      if (storedId) {
        const id = parseInt(storedId, 10);
        if (id !== selectedCondominiumId) {
          setSelectedCondominiumId(id);
        }
      }
    };

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [selectedCondominiumId]);

  if (!dashboardData) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{dashboardData.name}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral do condomínio
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Residents */}
        <Card variant="elevated" padding="lg">
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-purple-600">Total de Moradores</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {dashboardData.stats.residents.total}
                </p>
                <div className="mt-2 flex items-center">
                  {dashboardData.stats.residents.change > 0 ? (
                    <RiArrowUpLine className="text-green-500" />
                  ) : (
                    <RiArrowDownLine className="text-red-500" />
                  )}
                  <span className={`ml-1 text-sm ${
                    dashboardData.stats.residents.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {Math.abs(dashboardData.stats.residents.change)}% este mês
                  </span>
                </div>
              </div>
              <div className="ml-auto">
                <RiGroupLine className="h-12 w-12 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>

        {/* Monthly Revenue */}
        <Card variant="elevated" padding="lg">
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-purple-600">Receita Mensal</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  R$ {dashboardData.stats.revenue.total.toLocaleString()}
                </p>
                <div className="mt-2 flex items-center">
                  {dashboardData.stats.revenue.change > 0 ? (
                    <RiArrowUpLine className="text-green-500" />
                  ) : (
                    <RiArrowDownLine className="text-red-500" />
                  )}
                  <span className={`ml-1 text-sm ${
                    dashboardData.stats.revenue.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {Math.abs(dashboardData.stats.revenue.change)}% este mês
                  </span>
                </div>
              </div>
              <div className="ml-auto">
                <RiMoneyDollarCircleLine className="h-12 w-12 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>

        {/* Active Reservations */}
        <Card variant="elevated" padding="lg">
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-purple-600">Reservas Ativas</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {dashboardData.stats.reservations.total}
                </p>
                <div className="mt-2 flex items-center">
                  {dashboardData.stats.reservations.change > 0 ? (
                    <RiArrowUpLine className="text-green-500" />
                  ) : (
                    <RiArrowDownLine className="text-red-500" />
                  )}
                  <span className={`ml-1 text-sm ${
                    dashboardData.stats.reservations.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {Math.abs(dashboardData.stats.reservations.change)}% este mês
                  </span>
                </div>
              </div>
              <div className="ml-auto">
                <RiCalendarCheckLine className="h-12 w-12 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`${
              activeTab === 'notifications'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Notificações
          </button>
          <button
            onClick={() => setActiveTab('occurrences')}
            className={`${
              activeTab === 'occurrences'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Ocorrências
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Notifications */}
            <Card variant="elevated" padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Notificações Recentes</h3>
                <RiNotification3Line className="h-5 w-5 text-purple-600" />
              </div>
              <div className="space-y-4">
                {dashboardData.notifications.map((notification) => (
                  <div key={notification.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                    <p className="mt-1 text-sm text-gray-500">{notification.description}</p>
                    <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                  </div>
                ))}
                {dashboardData.notifications.length === 0 && (
                  <p className="text-sm text-gray-500">Nenhuma notificação recente</p>
                )}
              </div>
            </Card>

            {/* Recent Occurrences */}
            <Card variant="elevated" padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Ocorrências Recentes</h3>
                <RiFileList3Line className="h-5 w-5 text-purple-600" />
              </div>
              <div className="space-y-4">
                {dashboardData.occurrences.map((occurrence) => (
                  <div key={occurrence.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <h4 className="text-sm font-medium text-gray-900">{occurrence.title}</h4>
                    <p className="mt-1 text-sm text-gray-500">{occurrence.description}</p>
                    <p className="mt-1 text-xs text-gray-400">{occurrence.time}</p>
                  </div>
                ))}
                {dashboardData.occurrences.length === 0 && (
                  <p className="text-sm text-gray-500">Nenhuma ocorrência recente</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
          <Card variant="elevated" padding="lg">
            <div className="space-y-4">
              {dashboardData.notifications.map((notification) => (
                <div key={notification.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                  <p className="mt-1 text-sm text-gray-500">{notification.description}</p>
                  <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                </div>
              ))}
              {dashboardData.notifications.length === 0 && (
                <p className="text-sm text-gray-500">Nenhuma notificação</p>
              )}
            </div>
          </Card>
        )}

        {activeTab === 'occurrences' && (
          <Card variant="elevated" padding="lg">
            <div className="space-y-4">
              {dashboardData.occurrences.map((occurrence) => (
                <div key={occurrence.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <h4 className="text-sm font-medium text-gray-900">{occurrence.title}</h4>
                  <p className="mt-1 text-sm text-gray-500">{occurrence.description}</p>
                  <p className="mt-1 text-xs text-gray-400">{occurrence.time}</p>
                </div>
              ))}
              {dashboardData.occurrences.length === 0 && (
                <p className="text-sm text-gray-500">Nenhuma ocorrência</p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 