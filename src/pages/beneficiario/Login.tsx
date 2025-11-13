import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Alert, AlertDescription } from '../../components/ui/Alert'
import { CreditCard, Smartphone, User, Lock } from 'lucide-react'

export default function BeneficiarioLogin() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!cpf || !senha) {
      setError('Por favor, preencha todos os campos')
      return
    }

    try {
      await login({
        cpf_cnpj: cpf.replace(/\D/g, ''),
        senha,
        tipo_usuario: 'beneficiario'
      })
    } catch (err) {
      setError('CPF ou senha incorretos')
    }
  }

  const formatarCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ACIEIcard</h1>
          <p className="text-gray-600">Acesse sua conta de beneficiário</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                CPF
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatarCPF(e.target.value))}
                  className="pl-10"
                  maxLength={14}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="senha"
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Problemas para acessar?{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 font-medium"
                onClick={() => navigate('/recuperar-senha')}
              >
                Recupere sua senha
              </button>
            </p>
          </div>
        </Card>

        {/* Mobile App Promo */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <Smartphone className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900">App Mobile</h3>
              <p className="text-sm text-gray-600">
                Baixe nosso app para pagamentos NFC e maior praticidade
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Associação Comercial e Empresarial de Itajubá-MG
          </p>
        </div>
      </div>
    </div>
  )
}