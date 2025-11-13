import express from 'express'
import { supabase } from '../server.js'

const router = express.Router()

// Middleware de autenticação
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação é obrigatório' })
  }

  // Verificar token (simplificado - usar JWT completo em produção)
  next()
}

// Listar todas as empresas (admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    res.json({ empresas: data })
  } catch (error) {
    console.error('Erro ao buscar empresas:', error)
    res.status(500).json({ 
      error: 'Erro ao buscar empresas',
      message: 'Ocorreu um erro ao buscar as empresas associadas'
    })
  }
})

// Obter empresa específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      return res.status(404).json({ error: 'Empresa não encontrada' })
    }

    res.json({ empresa: data })
  } catch (error) {
    console.error('Erro ao buscar empresa:', error)
    res.status(500).json({ 
      error: 'Erro ao buscar empresa',
      message: 'Ocorreu um erro ao buscar os dados da empresa'
    })
  }
})

// Cadastrar nova empresa (admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { cnpj, razao_social, nome_fantasia, email, telefone, endereco } = req.body

    // Validações básicas
    if (!cnpj || !razao_social || !email) {
      return res.status(400).json({ 
        error: 'Dados incompletos',
        message: 'CNPJ, razão social e email são obrigatórios'
      })
    }

    // Verificar se CNPJ já existe
    const { data: existingEmpresa } = await supabase
      .from('empresas')
      .select('id')
      .eq('cnpj', cnpj.replace(/\D/g, ''))
      .single()

    if (existingEmpresa) {
      return res.status(400).json({ 
        error: 'CNPJ já cadastrado',
        message: 'Já existe uma empresa cadastrada com este CNPJ'
      })
    }

    // Criar nova empresa
    const { data, error } = await supabase
      .from('empresas')
      .insert([{
        cnpj: cnpj.replace(/\D/g, ''),
        razao_social,
        nome_fantasia,
        email,
        telefone,
        endereco,
        saldo_total: 0.00,
        status: 'ativo',
        password_hash: '$2a$12$KIXxP7vQLuJHLUv6f8mX.O6K8gG5kZpH7zCZbJ3K7vQ9f6m8N4w2q' // Senha padrão: senha123
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    res.status(201).json({ 
      empresa: data,
      message: 'Empresa cadastrada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao cadastrar empresa:', error)
    res.status(500).json({ 
      error: 'Erro ao cadastrar empresa',
      message: 'Ocorreu um erro ao cadastrar a empresa'
    })
  }
})

// Atualizar empresa
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { razao_social, nome_fantasia, email, telefone, endereco, status } = req.body

    const { data, error } = await supabase
      .from('empresas')
      .update({
        razao_social,
        nome_fantasia,
        email,
        telefone,
        endereco,
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
      return res.status(404).json({ error: 'Empresa não encontrada' })
    }

    res.json({ 
      empresa: data,
      message: 'Empresa atualizada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao atualizar empresa:', error)
    res.status(500).json({ 
      error: 'Erro ao atualizar empresa',
      message: 'Ocorreu um erro ao atualizar os dados da empresa'
    })
  }
})

// Obter saldo da empresa
router.get('/:id/saldo', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('empresas')
      .select('saldo_total')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      return res.status(404).json({ error: 'Empresa não encontrada' })
    }

    res.json({ saldo: data.saldo_total })
  } catch (error) {
    console.error('Erro ao buscar saldo:', error)
    res.status(500).json({ 
      error: 'Erro ao buscar saldo',
      message: 'Ocorreu um erro ao buscar o saldo da empresa'
    })
  }
})

export default router