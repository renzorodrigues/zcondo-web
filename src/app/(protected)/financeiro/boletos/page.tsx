'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  RiArrowLeftLine,
  RiSaveLine
} from 'react-icons/ri';
import { TbLoader3 } from 'react-icons/tb';

interface BoletoConfig {
  banco: string;
  agencia: string;
  conta: string;
  carteira: string;
  convenio: string;
  cedente: string;
  cedenteDocumento: string;
  localPagamento: string;
  instrucoes: string;
  multa: number;
  juros: number;
  desconto: number;
}

export default function ConfiguracaoBoletosPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BoletoConfig>({
    banco: '',
    agencia: '',
    conta: '',
    carteira: '',
    convenio: '',
    cedente: '',
    cedenteDocumento: '',
    localPagamento: 'Pagável em qualquer banco até o vencimento',
    instrucoes: 'Após o vencimento cobrar multa de 2% e juros de 0,033% ao dia.',
    multa: 2,
    juros: 0.033,
    desconto: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implementar a chamada à API para salvar as configurações
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação de chamada à API
      router.push('/financeiro');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Configuração de Boletos</h1>
        <p className="text-gray-600 mt-1">Configure os dados do banco e as opções de geração de boletos</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Banco */}
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Dados do Banco</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="banco" className="block text-sm font-medium text-gray-700 mb-1">
                  Banco
                </label>
                <select
                  id="banco"
                  name="banco"
                  value={formData.banco}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecione o banco</option>
                  <option value="001">Banco do Brasil</option>
                  <option value="341">Itaú</option>
                  <option value="033">Santander</option>
                  <option value="104">Caixa Econômica Federal</option>
                  <option value="237">Bradesco</option>
                </select>
              </div>

              <div>
                <label htmlFor="agencia" className="block text-sm font-medium text-gray-700 mb-1">
                  Agência
                </label>
                <input
                  type="text"
                  id="agencia"
                  name="agencia"
                  value={formData.agencia}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0000-0"
                />
              </div>

              <div>
                <label htmlFor="conta" className="block text-sm font-medium text-gray-700 mb-1">
                  Conta
                </label>
                <input
                  type="text"
                  id="conta"
                  name="conta"
                  value={formData.conta}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="00000-0"
                />
              </div>

              <div>
                <label htmlFor="carteira" className="block text-sm font-medium text-gray-700 mb-1">
                  Carteira
                </label>
                <input
                  type="text"
                  id="carteira"
                  name="carteira"
                  value={formData.carteira}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="17"
                />
              </div>

              <div>
                <label htmlFor="convenio" className="block text-sm font-medium text-gray-700 mb-1">
                  Convênio
                </label>
                <input
                  type="text"
                  id="convenio"
                  name="convenio"
                  value={formData.convenio}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="123456"
                />
              </div>
            </div>
          </div>

          {/* Dados do Cedente */}
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Dados do Cedente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cedente" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Cedente
                </label>
                <input
                  type="text"
                  id="cedente"
                  name="cedente"
                  value={formData.cedente}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nome do condomínio"
                />
              </div>

              <div>
                <label htmlFor="cedenteDocumento" className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ do Cedente
                </label>
                <input
                  type="text"
                  id="cedenteDocumento"
                  name="cedenteDocumento"
                  value={formData.cedenteDocumento}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>
          </div>

          {/* Configurações do Boleto */}
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Configurações do Boleto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="localPagamento" className="block text-sm font-medium text-gray-700 mb-1">
                  Local de Pagamento
                </label>
                <input
                  type="text"
                  id="localPagamento"
                  name="localPagamento"
                  value={formData.localPagamento}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="instrucoes" className="block text-sm font-medium text-gray-700 mb-1">
                  Instruções
                </label>
                <textarea
                  id="instrucoes"
                  name="instrucoes"
                  value={formData.instrucoes}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="multa" className="block text-sm font-medium text-gray-700 mb-1">
                  Multa por Atraso (%)
                </label>
                <input
                  type="number"
                  id="multa"
                  name="multa"
                  value={formData.multa}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="juros" className="block text-sm font-medium text-gray-700 mb-1">
                  Juros por Dia (%)
                </label>
                <input
                  type="number"
                  id="juros"
                  name="juros"
                  value={formData.juros}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="desconto" className="block text-sm font-medium text-gray-700 mb-1">
                  Desconto por Antecipação (%)
                </label>
                <input
                  type="number"
                  id="desconto"
                  name="desconto"
                  value={formData.desconto}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <RiArrowLeftLine className="text-xl" />
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <TbLoader3 className="w-5 h-5 text-white animate-spin mr-2" />
                  <span>Carregando...</span>
                </div>
              ) : (
                <RiSaveLine className="text-xl" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 