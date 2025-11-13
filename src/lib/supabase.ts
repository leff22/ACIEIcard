import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Configurações de autenticação
export const authConfig = {
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true
}

// Tipos de usuário do sistema
export type UserType = 'admin' | 'empresa' | 'beneficiario' | 'conveniado'

export interface User {
  id: string
  nome: string
  email: string
  tipo: UserType
  status: 'ativo' | 'inativo'
}

export interface EmpresaUser extends User {
  cnpj: string
  razao_social: string
  nome_fantasia?: string
  saldo_total: number
}

export interface BeneficiarioUser extends User {
  cpf: string
  empresa_id: string
  saldo_atual: number
  limite_diario: number
  limite_semanal: number
  limite_mensal: number
}

export interface ConveniadoUser extends User {
  cnpj: string
  razao_social: string
  nome_fantasia?: string
  taxa_transacao: number
}