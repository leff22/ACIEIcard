import { useState } from 'react'
import { Building2, Users, CreditCard, DollarSign, Eye, Plus, Edit, Trash2 } from 'lucide-react'

interface Beneficiario {
  id: string
  nome: string
  cpf: string
  limiteDiario: number
  limiteSemanal: number
  limiteMensal: number
  saldoAtual: number
  status: 'ativo' | 'inativo'
}

export default function EmpresaDashboard() {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([
    {
      id: '1',
      nome: 'João Silva',
      cpf: '123.456.789-00',
      limiteDiario: 200.00,
      limiteSemanal: 1000.00,
      limiteMensal: 3000.00,
      saldoAtual: 1500.00,
      status: 'ativo'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      cpf: '987.654.321-00',
      limiteDiario: 150.00,
      limiteSemanal: 800.00,
      limiteMensal: 2500.00,
      saldoAtual: 1200.00,
      status: 'ativo'
    }
  ])

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [novoBeneficiario, setNovoBeneficiario] = useState({
    nome: '',
    cpf: '',
    limiteDiario: 200,
    limiteSemanal: 1000,
    limiteMensal: 3000
  })

  const formatarCPF = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '')
    const limited = cleaned.slice(0, 11)
    
    return limited.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const handleAdicionarBeneficiario = (e: React.FormEvent) => {
    e.preventDefault()
    
    const beneficiario: Beneficiario = {
      id: Date.now().toString(),
      nome: novoBeneficiario.nome,
      cpf: novoBeneficiario.cpf,
      limiteDiario: novoBeneficiario.limiteDiario,
      limiteSemanal: novoBeneficiario.limiteSemanal,
      limiteMensal: novoBeneficiario.limiteMensal,
      saldoAtual: 0,
      status: 'ativo'
    }

    setBeneficiarios([...beneficiarios, beneficiario])
    setNovoBeneficiario({
      nome: '',
      cpf: '',
      limiteDiario: 200,
      limiteSemanal: 1000,
      limiteMensal: 3000
    })
    setMostrarFormulario(false)
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatarCPF(e.target.value)
    setNovoBeneficiario({...novoBeneficiario, cpf: formatted})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Empresa XYZ Ltda</h1>
                <p className="text-sm text-gray-500">Portal Empresarial - ACIEICard</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <button className="text-green-600 hover:text-green-700 font-medium">Dashboard</button>
              <button className="text-gray-500 hover:text-gray-700">Beneficiários</button>
              <button className="text-gray-500 hover:text-gray-700">Extrato</button>
              <button className="text-gray-500 hover:text-gray-700">Configurações</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Beneficiários Ativos</p>
                <p className="text-2xl font-semibold text-gray-900">{beneficiarios.filter(b => b.status === 'ativo').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Saldo Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  R$ {beneficiarios.reduce((sum, b) => sum + b.saldoAtual, 0).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Transações Mês</p>
                <p className="text-2xl font-semibold text-gray-900">342</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Limite Mensal Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  R$ {beneficiarios.reduce((sum, b) => sum + b.limiteMensal, 0).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Beneficiários Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Beneficiários</h3>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Beneficiário
            </button>
          </div>

          {/* Formulário de Novo Beneficiário */}
          {mostrarFormulario && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h4 className="text-md font-medium text-gray-900 mb-4">Novo Beneficiário</h4>
              <form onSubmit={handleAdicionarBeneficiario} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={novoBeneficiario.nome}
                    onChange={(e) => setNovoBeneficiario({...novoBeneficiario, nome: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input
                    type="text"
                    value={novoBeneficiario.cpf}
                    onChange={handleCpfChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Limite Diário</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoBeneficiario.limiteDiario}
                    onChange={(e) => setNovoBeneficiario({...novoBeneficiario, limiteDiario: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Limite Semanal</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoBeneficiario.limiteSemanal}
                    onChange={(e) => setNovoBeneficiario({...novoBeneficiario, limiteSemanal: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Limite Mensal</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoBeneficiario.limiteMensal}
                    onChange={(e) => setNovoBeneficiario({...novoBeneficiario, limiteMensal: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </button>
                  <button
                    type="button"
                    onClick={() => setMostrarFormulario(false)}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Beneficiários */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limites</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {beneficiarios.map((beneficiario) => (
                    <tr key={beneficiario.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{beneficiario.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{beneficiario.cpf}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          R$ {beneficiario.saldoAtual.toLocaleString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-500">
                          D: R$ {beneficiario.limiteDiario.toLocaleString('pt-BR')}<br/>
                          S: R$ {beneficiario.limiteSemanal.toLocaleString('pt-BR')}<br/>
                          M: R$ {beneficiario.limiteMensal.toLocaleString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          beneficiario.status === 'ativo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {beneficiario.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}