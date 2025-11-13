import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Progress } from '../../components/ui/Progress'
import { 
  CreditCard, 
  DollarSign, 
  Clock, 
 
  User, 
  Smartphone,
  Wifi,
  Settings,
  LogOut,
  History,
  QrCode
} from 'lucide-react'

interface Transacao {
  id: string
  conveniado: string
  valor: number
  data_transacao: string
  status: 'aprovado' | 'pendente' | 'recusado'
}

interface BeneficiarioData {
  nome: string
  cpf: string
  email: string
  saldo_atual: number
  limite_diario: number
  limite_semanal: number
  limite_mensal: number
  gasto_diario: number
  gasto_semanal: number
  gasto_mensal: number
  status: 'ativo' | 'inativo'
}

export default function BeneficiarioDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [dadosBeneficiario, setDadosBeneficiario] = useState<BeneficiarioData | null>(null)
  const [transacoesRecentes, setTransacoesRecentes] = useState<Transacao[]>([])
  const [loading, setLoading] = useState(true)
  const [nfcAtivo, setNfcAtivo] = useState(false)

  useEffect(() => {
    // Carregar dados do beneficiário
    carregarDados()
    
    // Simular verificação de NFC disponível
    if ('NDEFReader' in window) {
      setNfcAtivo(true)
    }
  }, [])

  const carregarDados = async () => {
    try {
      // Simular dados do beneficiário
      const mockData: BeneficiarioData = {
        nome: 'João Silva',
        cpf: '123.456.789-00',
        email: 'joao.silva@email.com',
        saldo_atual: 1250.00,
        limite_diario: 200.00,
        limite_semanal: 1000.00,
        limite_mensal: 3000.00,
        gasto_diario: 75.50,
        gasto_semanal: 450.00,
        gasto_mensal: 1750.00,
        status: 'ativo'
      }

      const mockTransacoes: Transacao[] = [
        {
          id: '1',
          conveniado: 'Supermercado ABC',
          valor: 75.50,
          data_transacao: '2024-01-15T14:30:00Z',
          status: 'aprovado'
        },
        {
          id: '2',
          conveniado: 'Farmácia XYZ',
          valor: 45.90,
          data_transacao: '2024-01-15T10:15:00Z',
          status: 'aprovado'
        },
        {
          id: '3',
          conveniado: 'Restaurante Bom Sabor',
          valor: 120.00,
          data_transacao: '2024-01-14T12:45:00Z',
          status: 'aprovado'
        }
      ]

      setDadosBeneficiario(mockData)
      setTransacoesRecentes(mockTransacoes)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calcularProgresso = (gasto: number, limite: number) => {
    return Math.min((gasto / limite) * 100, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  if (!dadosBeneficiario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar dados do beneficiário</p>
          <Button onClick={carregarDados} className="mt-4">
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">ACIEIcard</h1>
              <p className="text-blue-100 text-sm">Beneficiário</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {nfcAtivo && <Wifi className="h-5 w-5 text-green-300" />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/configuracoes')}
              className="text-white hover:text-blue-100"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-white hover:text-blue-100"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-blue-100 text-sm">Olá, {dadosBeneficiario.nome}</p>
          <p className="text-xs text-blue-200">CPF: {dadosBeneficiario.cpf}</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Saldo Atual - Card Principal */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Saldo Disponível</p>
              <p className="text-3xl font-bold">{formatarMoeda(dadosBeneficiario.saldo_atual)}</p>
            </div>
            <DollarSign className="h-12 w-12 text-blue-200" />
          </div>
        </Card>

        {/* Botões de Ação Rápida */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white p-4 h-auto"
            onClick={() => navigate('/pagamento-nfc')}
          >
            <div className="flex flex-col items-center space-y-2">
              <Smartphone className="h-8 w-8" />
              <span className="text-sm font-medium">Pagar com NFC</span>
            </div>
          </Button>
          
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 h-auto"
            onClick={() => navigate('/qr-code')}
          >
            <div className="flex flex-col items-center space-y-2">
              <QrCode className="h-8 w-8" />
              <span className="text-sm font-medium">Pagar com QR</span>
            </div>
          </Button>
        </div>

        {/* Limites de Uso */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-600" />
            Limites de Uso
          </h3>
          
          <div className="space-y-4">
            {/* Limite Diário */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Diário</span>
                <span className="font-medium">
                  {formatarMoeda(dadosBeneficiario.gasto_diario)} / {formatarMoeda(dadosBeneficiario.limite_diario)}
                </span>
              </div>
              <Progress 
                value={calcularProgresso(dadosBeneficiario.gasto_diario, dadosBeneficiario.limite_diario)}
                className="h-2"
              />
            </div>

            {/* Limite Semanal */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Semanal</span>
                <span className="font-medium">
                  {formatarMoeda(dadosBeneficiario.gasto_semanal)} / {formatarMoeda(dadosBeneficiario.limite_semanal)}
                </span>
              </div>
              <Progress 
                value={calcularProgresso(dadosBeneficiario.gasto_semanal, dadosBeneficiario.limite_semanal)}
                className="h-2"
              />
            </div>

            {/* Limite Mensal */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Mensal</span>
                <span className="font-medium">
                  {formatarMoeda(dadosBeneficiario.gasto_mensal)} / {formatarMoeda(dadosBeneficiario.limite_mensal)}
                </span>
              </div>
              <Progress 
                value={calcularProgresso(dadosBeneficiario.gasto_mensal, dadosBeneficiario.limite_mensal)}
                className="h-2"
              />
            </div>
          </div>
        </Card>

        {/* Transações Recentes */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <History className="h-5 w-5 mr-2 text-gray-600" />
              Transações Recentes
            </h3>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => navigate('/extrato')}
            >
              Ver todas
            </Button>
          </div>
          
          <div className="space-y-3">
            {transacoesRecentes.map((transacao) => (
              <div key={transacao.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transacao.conveniado}</p>
                    <p className="text-xs text-gray-500">{formatarData(transacao.data_transacao)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatarMoeda(transacao.valor)}</p>
                  <Badge 
                    variant={transacao.status === 'aprovado' ? 'success' : 'destructive'}
                    className="text-xs"
                  >
                    {transacao.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Status do Cartão */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-6 w-6 text-gray-600" />
              <div>
                <p className="font-medium">Cartão Físico</p>
                <p className="text-sm text-gray-500">NFC {nfcAtivo ? 'Disponível' : 'Indisponível'}</p>
              </div>
            </div>
            <Badge 
              variant={dadosBeneficiario.status === 'ativo' ? 'success' : 'destructive'}
            >
              {dadosBeneficiario.status === 'ativo' ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          <Button variant="ghost" size="sm" className="flex flex-col items-center">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs mt-1">Início</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center"
            onClick={() => navigate('/extrato')}
          >
            <History className="h-5 w-5" />
            <span className="text-xs mt-1">Extrato</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center"
            onClick={() => navigate('/perfil')}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Perfil</span>
          </Button>
        </div>
      </div>
    </div>
  )
}