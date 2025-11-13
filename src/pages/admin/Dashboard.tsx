import { useState } from 'react'
import { Building2, Users, CreditCard, TrendingUp, DollarSign } from 'lucide-react'

interface DashboardStats {
  totalEmpresas: number
  totalBeneficiarios: number
  totalConveniados: number
  totalTransacoesMes: number
  valorTransacoesMes: number
}

export default function AdminDashboard() {
  const [stats] = useState<DashboardStats>({
    totalEmpresas: 25,
    totalBeneficiarios: 342,
    totalConveniados: 89,
    totalTransacoesMes: 1250,
    valorTransacoesMes: 187500.00
  })

  const [transacoesRecentes] = useState([
    { id: 1, beneficiario: 'João Silva', conveniado: 'Supermercado XYZ', valor: 150.50, data: '2024-01-15' },
    { id: 2, beneficiario: 'Maria Santos', conveniado: 'Farmácia ABC', valor: 89.90, data: '2024-01-15' },
    { id: 3, beneficiario: 'Pedro Oliveira', conveniado: 'Restaurante Bom Sabor', valor: 234.80, data: '2024-01-14' },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ACIEIcard Admin</h1>
                <p className="text-sm text-gray-500">Painel Administrativo</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <button className="text-blue-600 hover:text-blue-700 font-medium">Dashboard</button>
              <button className="text-gray-500 hover:text-gray-700">Empresas</button>
              <button className="text-gray-500 hover:text-gray-700">Conveniados</button>
              <button className="text-gray-500 hover:text-gray-700">Relatórios</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Empresas Associadas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalEmpresas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Beneficiários</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBeneficiarios}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Conveniados</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalConveniados}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Transações Mês</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalTransacoesMes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Valor Mês</p>
                <p className="text-2xl font-semibold text-gray-900">
                  R$ {stats.valorTransacoesMes.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transações Recentes */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Transações Recentes</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {transacoesRecentes.map((transacao) => (
                  <div key={transacao.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{transacao.beneficiario}</p>
                      <p className="text-sm text-gray-500">{transacao.conveniado}</p>
                      <p className="text-xs text-gray-400">{transacao.data}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        R$ {transacao.valor.toLocaleString('pt-BR')}
                      </p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aprovado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gráfico de Vendas */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Volume de Transações</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Gráfico de transações será implementado</p>
                  <p className="text-sm">Com integração de biblioteca de charts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}