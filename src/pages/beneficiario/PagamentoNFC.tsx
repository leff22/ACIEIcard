import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Alert, AlertDescription } from '../../components/ui/Alert'
import { 
  Smartphone, 
  Wifi, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Loader2
} from 'lucide-react'

interface NFCPaymentData {
  valor: number
  conveniado: string
  categoria: string
}

export default function PagamentoNFC() {
  const navigate = useNavigate()
  const [nfcSuportado, setNfcSuportado] = useState(false)
  const [status, setStatus] = useState<'aguardando' | 'lendo' | 'processando' | 'sucesso' | 'erro'>('aguardando')
  const [valor, setValor] = useState('')
  const [error, setError] = useState('')
  const [dadosPagamento, setDadosPagamento] = useState<NFCPaymentData | null>(null)

  useEffect(() => {
    // Verificar suporte a NFC
    if ('NDEFReader' in window) {
      setNfcSuportado(true)
    }
  }, [])

  const iniciarPagamento = async () => {
    if (!valor || parseFloat(valor) <= 0) {
      setError('Por favor, insira um valor válido')
      return
    }

    setError('')
    setStatus('lendo')

    try {
      // Simular leitura NFC
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular dados do cartão
      const mockData: NFCPaymentData = {
        valor: parseFloat(valor),
        conveniado: 'Supermercado ABC',
        categoria: 'Alimentação'
      }

      setDadosPagamento(mockData)
      setStatus('processando')

      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simular resultado aleatório (90% sucesso)
      const sucesso = Math.random() > 0.1
      
      if (sucesso) {
        setStatus('sucesso')
        // Registrar transação (mock)
        console.log('Transação aprovada:', mockData)
      } else {
        setStatus('erro')
        setError('Cartão recusado ou saldo insuficiente')
      }
    } catch (error) {
      setStatus('erro')
      setError('Erro ao processar pagamento')
    }
  }

  const resetarPagamento = () => {
    setStatus('aguardando')
    setValor('')
    setError('')
    setDadosPagamento(null)
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  if (!nfcSuportado) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <Card className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">NFC Não Disponível</h2>
            <p className="text-gray-600 mb-4">
              Seu dispositivo não suporta pagamentos NFC ou o recurso está desabilitado.
            </p>
            <Button onClick={() => navigate('/beneficiario/dashboard')}>
              Voltar ao Dashboard
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pagamento NFC</h1>
          <div className="flex items-center space-x-2">
            <Wifi className="h-5 w-5 text-green-500" />
            <Badge variant="success">NFC Ativo</Badge>
          </div>
        </div>

        {status === 'aguardando' && (
          <Card className="p-6">
            <div className="text-center mb-6">
              <Smartphone className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Aproxime o Cartão</h2>
              <p className="text-gray-600">
                Digite o valor e aproxime seu cartão do dispositivo para realizar o pagamento.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor do Pagamento
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="1000"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0,00"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={iniciarPagamento}
                className="w-full"
                disabled={!valor}
              >
                Iniciar Pagamento
              </Button>
            </div>
          </Card>
        )}

        {status === 'lendo' && (
          <Card className="p-6 text-center">
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Lendo Cartão...</h2>
            <p className="text-gray-600">
              Aproxime seu cartão do dispositivo.
            </p>
          </Card>
        )}

        {status === 'processando' && (
          <Card className="p-6 text-center">
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Processando...</h2>
            <p className="text-gray-600">
              Aguarde enquanto processamos seu pagamento.
            </p>
          </Card>
        )}

        {status === 'sucesso' && dadosPagamento && (
          <Card className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-green-600">Pagamento Aprovado!</h2>
            <div className="space-y-2 mb-6">
              <p className="text-2xl font-bold text-gray-900">
                {formatarMoeda(dadosPagamento.valor)}
              </p>
              <p className="text-gray-600">
                {dadosPagamento.conveniado}
              </p>
              <Badge variant="secondary">
                {dadosPagamento.categoria}
              </Badge>
            </div>
            <div className="space-y-2">
              <Button onClick={resetarPagamento} variant="outline" className="w-full">
                Novo Pagamento
              </Button>
              <Button onClick={() => navigate('/beneficiario/dashboard')} className="w-full">
                Voltar ao Dashboard
              </Button>
            </div>
          </Card>
        )}

        {status === 'erro' && (
          <Card className="p-6 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">Pagamento Recusado</h2>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Button onClick={resetarPagamento} variant="outline" className="w-full">
                Tentar Novamente
              </Button>
              <Button onClick={() => navigate('/beneficiario/dashboard')} className="w-full">
                Voltar ao Dashboard
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}