import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '../stores/auth'
import { getApiUrl } from '../config/api'

interface LoginData {
  cpf_cnpj: string
  senha: string
  tipo_usuario: 'admin' | 'empresa' | 'beneficiario' | 'conveniado'
}



export function useAuth() {
  const navigate = useNavigate()
  const { login: loginStore, logout: logoutStore, user } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (data: LoginData) => {
    setLoading(true)
    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao fazer login')
      }

      loginStore(result.usuario, result.token)
      toast.success(result.message || 'Login realizado com sucesso!')

      // Redirecionar baseado no tipo de usuário
      switch (data.tipo_usuario) {
        case 'admin':
          navigate('/admin/dashboard')
          break
        case 'empresa':
          navigate('/empresa/dashboard')
          break
        case 'conveniado':
          navigate('/conveniado/dashboard')
          break
        case 'beneficiario':
          navigate('/beneficiario/dashboard')
          break
      }

      return result
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login')
      throw error
    } finally {
      setLoading(false)
    }
  }, [loginStore, navigate])

  const logout = useCallback(() => {
    logoutStore()
    toast.success('Logout realizado com sucesso!')
    navigate('/')
  }, [logoutStore, navigate])

  const isAuthenticated = !!user

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  }
}