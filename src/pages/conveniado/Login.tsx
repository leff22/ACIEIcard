import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../hooks/useAuth'

export default function ConveniadoLogin() {
  const [cnpj, setCnpj] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔍 Tentando login conveniado:', { cnpj, password: '***' })

    try {
      const cleanCnpj = cnpj.replace(/\D/g, '')
      console.log('🔍 CNPJ limpo:', cleanCnpj)
      
      await login({
        cpf_cnpj: cleanCnpj,
        senha: password,
        tipo_usuario: 'conveniado'
      })
      
      console.log('✅ Login conveniado bem-sucedido!')
    } catch (error) {
      console.error('❌ Erro no login conveniado:', error)
      // O erro já é tratado no hook useAuth com toast
    }
  }

  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const limited = cleaned.slice(0, 14)
    
    if (limited.length <= 14) {
      return limited.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
    return limited
  }

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value)
    setCnpj(formatted)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Store className="h-12 w-12 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Portal Conveniados
          </h2>
          <p className="text-gray-600">
            Acesso para estabelecimentos conveniados ACIEI
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
                CNPJ
              </label>
              <input
                id="cnpj"
                type="text"
                value={cnpj}
                onChange={handleCnpjChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="00.000.000/0000-00"
                maxLength={18}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Ainda não é conveniado? Cadastre-se na ACIEI
            </p>
          </div>
        </div>

        <div className="flex justify-between text-center text-sm">
          <a href="/" className="text-purple-600 hover:text-purple-500">
            Voltar para página inicial
          </a>
          <a href="/empresa/login" className="text-purple-600 hover:text-purple-500">
            Sou empresa associada
          </a>
        </div>
      </div>
    </div>
  )
}