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

  next()
}

// Listar todos os conveniados
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, cidade } = req.query

    let query = supabase
      .from('conveniados')
      .select('*')
      .order('nome_fantasia', { ascending: true })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    res.json({ conveniados: data })
  } catch (error) {
    console.error('Erro ao buscar conveniados:', error)
    res.status(500).json({ 
      error: 'Erro ao buscar conveniados',
      message: 'Ocorreu um erro ao buscar os estabelecimentos conveniados'
    })
  }
})

// Obter conveniado específico
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('conveniados')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      return res.status(404).json({ error: 'Conveniado não encontrado' })
    }

    res.json({ conveniado: data })
  } catch (error) {
    console.error('Erro ao buscar conveniado:', error)
    res.status(500).json({ 
      error: 'Erro ao buscar conveniado',
      message: 'Ocorreu um erro ao buscar os dados do estabelecimento'
    })
  }
})

// Cadastrar novo conveniado (admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { cnpj, razao_social, nome_fantasia, email, telefone, endereco, taxa_transacao } = req.body

    // Validações básicas
    if (!cnpj || !razao_social || !email) {
      return res.status(400).json({ 
        error: 'Dados incompletos',
        message: 'CNPJ, razão social e email são obrigatórios'
      })
    }

    // Verificar se CNPJ já existe
    const { data: existingConveniado } = await supabase
      .from('conveniados')
      .select('id')
      .eq('cnpj', cnpj.replace(/\D/g, ''))
      .single()

    if (existingConveniado) {
      return res.status(400).json({ 
        error: 'CNPJ já cadastrado',
        message: 'Já existe um estabelecimento cadastrado com este CNPJ'
      })
    }

    // Criar novo conveniado
    const { data, error } = await supabase
      .from('conveniados')
      .insert([{
        cnpj: cnpj.replace(/\D/g, ''),
        razao_social,
        nome_fantasia,
        email,
        telefone,
        endereco,
        taxa_transacao: taxa_transacao || 2.50,
        status: 'ativo',
        password_hash: '$2a$12$KIXxP7vQLuJHLUv6f8mX.O6K8gG5kZpH7zCZbJ3K7vQ9f6m8N4w2q' // Senha padrão: senha123
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    res.status(201).json({ 
      conveniado: data,
      message: 'Estabelecimento cadastrado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao cadastrar conveniado:', error)
    res.status(500).json({ 
      error: 'Erro ao cadastrar estabelecimento',
      message: 'Ocorreu um erro ao cadastrar o estabelecimento conveniado'
    })
  }
})

// Atualizar conveniado
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { razao_social, nome_fantasia, email, telefone, endereco, taxa_transacao, status } = req.body

    const { data, error } = await supabase
      .from('conveniados')
      .update({
        razao_social,
        nome_fantasia,
        email,
        telefone,
        endereco,
        taxa_transacao,
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
      return res.status(404).json({ error: 'Conveniado não encontrado' })
    }

    res.json({ 
      conveniado: data,
      message: 'Estabelecimento atualizado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao atualizar conveniado:', error)
    res.status(500).json({ 
      error: 'Erro ao atualizar estabelecimento',
      message: 'Ocorreu um erro ao atualizar os dados do estabelecimento'
    })
  }
})

// Obter vendas de um conveniado
router.get('/:id/vendas', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { data_inicio, data_fim } = req.query

    let query = supabase
      .from('transacoes')
      .select(`
        *,
        beneficiarios(nome, cpf),
        empresas(razao_social, cnpj)
      `)
      .eq('conveniado_id', id)
      .eq('status', 'aprovado')
      .order('data_transacao', { ascending: false })

    if (data_inicio) {
      query = query.gte('data_transacao', data_inicio)
    }
    if (data_fim) {
      query = query.lte('data_transacao', data_fim)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    // Calcular estatísticas
    const totalVendas = data.reduce((sum, transacao) => sum + parseFloat(transacao.valor), 0)
    const totalTransacoes = data.length

    res.json({ 
      vendas: data,
      estatisticas: {
        total_vendas: totalVendas,
        total_transacoes: totalTransacoes,
        ticket_medio: totalTransacoes > 0 ? totalVendas / totalTransacoes : 0
      }
    })
  } catch (error) {
    console.error('Erro ao buscar vendas:', error)
    res.status(500).json({ 
      error: 'Erro ao buscar vendas',
      message: 'Ocorreu um erro ao buscar as vendas do estabelecimento'
    })
  }
})

// Obter dashboard de vendas do conveniado
router.get('/:id/dashboard', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    // Obter vendas do dia
    const hoje = new Date().toISOString().split('T')[0]
    const { data: vendasHoje } = await supabase
      .from('transacoes')
      .select('valor')
      .eq('conveniado_id', id)
      .eq('status', 'aprovado')
      .gte('data_transacao', hoje)

    const totalHoje = vendasHoje.reduce((sum, venda) => sum + parseFloat(venda.valor), 0)

    // Obter vendas da semana
    const semanaPassada = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data: vendasSemana } = await supabase
      .from('transacoes')
      .select('valor')
      .eq('conveniado_id', id)
      .eq('status', 'aprovado')
      .gte('data_transacao', semanaPassada)

    const totalSemana = vendasSemana.reduce((sum, venda) => sum + parseFloat(venda.valor), 0)

    // Obter vendas do mês
    const mesPassado = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: vendasMes } = await supabase
      .from('transacoes')
      .select('valor')
      .eq('conveniado_id', id)
      .eq('status', 'aprovado')
      .gte('data_transacao', mesPassado)

    const totalMes = vendasMes.reduce((sum, venda) => sum + parseFloat(venda.valor), 0)

    res.json({
      dashboard: {
        vendas_hoje: {
          valor: totalHoje,
          transacoes: vendasHoje.length
        },
        vendas_semana: {
          valor: totalSemana,
          transacoes: vendasSemana.length
        },
        vendas_mes: {
          valor: totalMes,
          transacoes: vendasMes.length
        }
      }
    })
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error)
    res.status(500).json({ 
      error: 'Erro ao buscar dashboard',
      message: 'Ocorreu um erro ao buscar os dados do dashboard'
    })
  }
})

export default router