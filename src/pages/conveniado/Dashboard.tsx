import { useState } from 'react'
import { Store, CreditCard, DollarSign, Eye, CheckCircle, XCircle } from 'lucide-react'

interface Transacao {
  id: string
  beneficiario: string
  valor: number
  horario: string
  status: 'aprovada' | 'recusada' | 'pendente'
}

export default function ConveniadoDashboard() {
  const [valorPagamento, setValorPagamento] = useState('')
  const [transacaoAtual, setTransacaoAtual] = useState<Transacao | null>(null)
  const [modoPagamento, setModoPagamento] = useState<'nfc' | 'manual'>('nfc')
  const [aguardandoNFC, setAguardandoNFC] = useState(false)

  const [transacoesRecentes] = useState<Transacao[]>([
    {
      id: '1',
      beneficiario: 'João Silva',
      valor: 150.50,
      horario: '14:30',
      status: 'aprovada'
    },
    {
      id: '2',
      beneficiario: 'Maria Santos',
      valor: 89.90,
      horario: '13:45',
      status: 'aprovada'
    },
    {
      id: '3',
      beneficiario: 'Pedro Oliveira',
      valor: 234.80,
      horario: '12:20',
      status: 'recusada'
    }
  ])

  const handleProcessarPagamento = async () => {
    if (!valorPagamento || parseFloat(valorPagamento) <= 0) {
      alert('Por favor, insira um valor válido')
      return
    }

    if (modoPagamento === 'nfc') {
      setAguardandoNFC(true)
      // Simula aguardando aproximação do cartão/celular
      setTimeout(() => {
        setAguardandoNFC(false)
        const novaTransacao: Transacao = {
          id: Date.now().toString(),
          beneficiario: 'Beneficiário Teste',
          valor: parseFloat(valorPagamento),
          horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'aprovada'
        }
        setTransacaoAtual(novaTransacao)
        setValorPagamento('')
      }, 3000)
    } else {
      // Pagamento manual - simulação
      const novaTransacao: Transacao = {
        id: Date.now().toString(),
        beneficiario: 'Beneficiário Manual',
        valor: parseFloat(valorPagamento),
        horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'aprovada'
      }
      setTransacaoAtual(novaTransacao)
      setValorPagamento('')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovada':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'recusada':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Eye className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada':
        return 'bg-green-100 text-green-800'
      case 'recusada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Supermercado ABC</h1>
                <p className="text-sm text-gray-500">Portal Conveniado - ACIEICard</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <button className="text-purple-600 hover:text-purple-700 font-medium">Dashboard</button>
              <button className="text-gray-500 hover:text-gray-700">Vendas</button>
              <button className="text-gray-500 hover:text-gray-700">Relatórios</button>
              <button className="text-gray-500 hover:text-gray-700">Configurações</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Painel de Pagamento */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recebimento de Pagamentos</h3>
              
              {/* Modo de Pagamento */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modo de Pagamento
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setModoPagamento('nfc')}
                    className={`flex-1 py-2 px-4 border rounded-md text-sm font-medium ${
                      modoPagamento === 'nfc'
                        ? 'border-purple-500 text-purple-700 bg-purple-50'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className="h-4 w-4 inline mr-2" />
                    NFC
                  </button>
                  <button
                    onClick={() => setModoPagamento('manual')}
                    className={`flex-1 py-2 px-4 border rounded-md text-sm font-medium ${
                      modoPagamento === 'manual'
                        ? 'border-purple-500 text-purple-700 bg-purple-50'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <DollarSign className="h-4 w-4 inline mr-2" />
                    Manual
                  </button>
                </div>
              </div>

              {/* Valor do Pagamento */}
              <div className="mb-6">
                <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-2">
                  Valor do Pagamento (R$)
                </label>
                <input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={valorPagamento}
                  onChange={(e) => setValorPagamento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="0,00"
                  disabled={aguardandoNFC}
                />
              </div>

              {/* Botão de Processar */}
              <button
                onClick={handleProcessarPagamento}
                disabled={aguardandoNFC || !valorPagamento}
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aguardandoNFC ? (
                  <>
                    <CreditCard className="h-4 w-4 inline mr-2 animate-pulse" />
                    Aguardando aproximação do cartão...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 inline mr-2" />
                    Processar Pagamento
                  </>
                )}
              </button>

              {/* Resultado da Transação */}
              {transacaoAtual && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Pagamento de R$ {transacaoAtual.valor.toLocaleString('pt-BR')} aprovado!
                      </p>
                      <p className="text-xs text-green-600">
                        {transacaoAtual.beneficiario} - {transacaoAtual.horario}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transações Recentes */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transações Recentes</h3>
              
              <div className="space-y-4">
                {transacoesRecentes.map((transacao) => (
                  <div key={transacao.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {transacao.beneficiario}
                      </span>
                      {getStatusIcon(transacao.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        R$ {transacao.valor.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-sm text-gray-500">{transacao.horario}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(transacao.status)}`}>
                      {transacao.status}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Ver todas as transações
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Vendas Hoje</p>
                <p className="text-2xl font-semibold text-gray-900">R$ 2.340,50</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Transações Hoje</p>
                <p className="text-2xl font-semibold text-gray-900">18</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Store className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ticket Médio</p>
                <p className="text-2xl font-semibold text-gray-900">R$ 130,03</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}