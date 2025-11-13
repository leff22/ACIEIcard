import express from 'express'
import { supabase } from '../server.js'

const router = express.Router()

// Middleware de autenticação simplificado
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação é obrigatório' })
  }

  // Em produção, validar JWT aqui
  next()
}

// Listar beneficiários de uma empresa
router.get('/empresa/:empresaId', authenticateToken, async (req, res) => {
  try {
    const { empresaId } = req.params

    const { data, error } = await supabase
      .from('beneficiarios')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('nome', { ascending: true })

    if (error) {
      throw error
    }

    res.json({ beneficiarios: data })
  } catch (error) {
    console.error('Erro ao buscar beneficiários:', error)
    res.status(500).json({ 
      error: 'Erro ao buscar beneficiários',
      message: 'Ocorreu um erro ao buscar os beneficiários da empresa'
    })
  }
})

// Obter beneficiário específico
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('beneficiarios')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      return res.status(404).json({ error: 'Beneficiário não encontrado' })
    }

    res.json({ beneficiario: data })
  } catch (error) {
    console.error('Erro ao buscar beneficiário:', error)
    res.status(500).json({ 
      error: 'Erro ao buscar beneficiário',
      message: 'Ocorreu um erro ao buscar os dados do beneficiário'
    })
  }
})

// Cadastrar novo beneficiário
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { empresa_id, nome, cpf, email, limite_diario, limite_semanal, limite_mensal } = req.body

    // Validações básicas
    if (!empresa_id || !nome || !cpf) {
      return res.status(400).json({ 
        error: 'Dados incompletos',
        message: 'Empresa, nome e CPF são obrigatórios'
      })
    }

    // Verificar se CPF já existe
    const { data: existingBeneficiario } = await supabase
      .from('beneficiarios')
      .select('id')
      .eq('cpf', cpf.replace(/\D/g, ''))
      .single()

    if (existingBeneficiario) {
      return res.status(400).json({ 
        error: 'CPF já cadastrado',
        message: 'Já existe um beneficiário cadastrado com este CPF'
      })
    }

    // Verificar se empresa existe
    const { data: empresa } = await supabase
      .from('empresas')
      .select('id')
      .eq('id', empresa_id)
      .single()

    if (!empresa) {
      return res.status(400).json({ 
        error: 'Empresa inválida',
        message: 'A empresa especificada não foi encontrada'
      })
    }

    // Criar novo beneficiário
    const { data, error } = await supabase
      .from('beneficiarios')
      .insert([{
        empresa_id,
        cpf: cpf.replace(/\D/g, ''),
        nome,
        email,
        limite_diario: limite_diario || 200.00,
        limite_semanal: limite_semanal || 1000.00,
        limite_mensal: limite_mensal || 3000.00,
        saldo_atual: 0.00,
        status: 'ativo',
        password_hash: '$2a$12$KIXxP7vQLuJHLUv6f8mX.O6K8gG5kZpH7zCZbJ3K7vQ9f6m8N4w2q' // Senha padrão: senha123
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    res.status(201).json({ 
      beneficiario: data,
      message: 'Beneficiário cadastrado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao cadastrar beneficiário:', error)
    res.status(500).json({ 
      error: 'Erro ao cadastrar beneficiário',
      message: 'Ocorreu um erro ao cadastrar o beneficiário'
    })
  }
})

// Atualizar beneficiário
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { nome, email, limite_diario, limite_semanal, limite_mensal, status } = req.body

    const { data, error } = await supabase
      .from('beneficiarios')
      .update({
        nome,
        email,
        limite_diario,
        limite_semanal,
        limite_mensal,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      return res.status(404).json({ error: 'Beneficiário não encontrado' })
    }

    res.json({ 
      beneficiario: data,
      message: 'Beneficiário atualizado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao atualizar beneficiário:', error)
    res.status(500).json({ 
      error: 'Erro ao atualizar beneficiário',
      message: 'Ocorreu um erro ao atualizar os dados do beneficiário'
    })
  }
})

// Obter saldo do beneficiário
router.get('/:id/saldo', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('beneficiarios')
      .select('saldo_atual, limite_diario, limite_semanal, limite_mensal')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      return res.status(404).json({ error: 'Beneficiário não encontrado' })
    }

    res.json({ 
      saldo_atual: data.saldo_atual,
      limite_diario: data.limite_diario,
      limite_semanal: data.limite_semanal,
      limite_mensal: data.limite_mensal
    })
  } catch (error) {
    console.error('Erro ao buscar saldo:', error)
    res.status(500).json({ 
      error: 'Erro ao buscar saldo',
      message: 'Ocorreu um erro ao buscar o saldo do beneficiário'
    })
  }
})

export default router