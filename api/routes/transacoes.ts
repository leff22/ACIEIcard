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

// Listar transações com filtros
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { empresa_id, beneficiario_id, conveniado_id, data_inicio, data_fim, status } = req.query

    let query = supabase
      .from('transacoes')
      .select(`
        *,
        beneficiarios(nome, cpf),
        conveniados(nome_fantasia, cnpj),
        empresas(razao_social, cnpj)
      `)
      .order('data_transacao', { ascending: false })

    // Aplicar filtros
    if (empresa_id) {
      query = query.eq('empresa_id', empresa_id)
    }
    if (beneficiario_id) {
      query = query.eq('beneficiario_id', beneficiario_id)
    }
    if (conveniado_id) {
      query = query.eq('conveniado_id', conveniado_id)
    }
    if (status) {
      query = query.eq('status', status)
    }
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

    res.json({ transacoes: data })
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
    res.status(500).json({ 
      error: 'Erro ao buscar transações',
      message: 'Ocorreu um erro ao buscar as transações'
    })
  }
})

// Obter transação específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('transacoes')
      .select(`
        *,
        beneficiarios(nome, cpf, email),
        conveniados(nome_fantasia, cnpj, telefone),
        empresas(razao_social, cnpj)
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      return res.status(404).json({ error: 'Transação não encontrada' })
    }

    res.json({ transacao: data })
  } catch (error) {
    console.error('Erro ao buscar transação:', error)
    res.status(500).json({ 
      error: 'Erro ao buscar transação',
      message: 'Ocorreu um erro ao buscar os dados da transação'
    })
  }
})

// Processar nova transação (pagamento)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { beneficiario_id, conveniado_id, valor, tipo_pagamento, dados_nfc } = req.body

    // Validações básicas
    if (!beneficiario_id || !conveniado_id || !valor || !tipo_pagamento) {
      return res.status(400).json({ 
        error: 'Dados incompletos',
        message: 'Beneficiário, conveniado, valor e tipo de pagamento são obrigatórios'
      })
    }

    if (valor <= 0) {
      return res.status(400).json({ 
        error: 'Valor inválido',
        message: 'O valor deve ser maior que zero'
      })
    }

    // Verificar se beneficiário existe e está ativo
    const { data: beneficiario, error: benefError } = await supabase
      .from('beneficiarios')
      .select('*')
      .eq('id', beneficiario_id)
      .single()

    if (benefError || !beneficiario) {
      return res.status(404).json({ error: 'Beneficiário não encontrado' })
    }

    if (beneficiario.status !== 'ativo') {
      return res.status(400).json({ 
        error: 'Beneficiário inativo',
        message: 'O beneficiário está temporariamente inativo'
      })
    }

    // Verificar se conveniado existe e está ativo
    const { data: conveniado, error: convError } = await supabase
      .from('conveniados')
      .select('*')
      .eq('id', conveniado_id)
      .single()

    if (convError || !conveniado) {
      return res.status(404).json({ error: 'Conveniado não encontrado' })
    }

    if (conveniado.status !== 'ativo') {
      return res.status(400).json({ 
        error: 'Conveniado inativo',
        message: 'O estabelecimento está temporariamente inativo'
      })
    }

    // Verificar saldo e limites
    if (beneficiario.saldo_atual < valor) {
      return res.status(400).json({ 
        error: 'Saldo insuficiente',
        message: 'O beneficiário não possui saldo suficiente para esta transação'
      })
    }

    // Validar limites (simplificado - em produção verificar histórico)
    if (valor > beneficiario.limite_diario) {
      return res.status(400).json({ 
        error: 'Limite excedido',
        message: `O valor excede o limite diário de R$ ${beneficiario.limite_diario.toFixed(2)}`
      })
    }

    // Processar transação
    const status = 'aprovado' // Simplificado - adicionar mais validações

    const { data: transacao, error: transError } = await supabase
      .from('transacoes')
      .insert([{
        beneficiario_id,
        conveniado_id,
        empresa_id: beneficiario.empresa_id,
        valor,
        tipo_pagamento,
        status,
        dados_nfc: dados_nfc || null
      }])
      .select(`
        *,
        beneficiarios(nome, cpf),
        conveniados(nome_fantasia, cnpj)
      `)
      .single()

    if (transError) {
      throw transError
    }

    // Atualizar saldos se aprovado
    if (status === 'aprovado') {
      // Atualizar saldo do beneficiário
      await supabase
        .from('beneficiarios')
        .update({ saldo_atual: beneficiario.saldo_atual - valor })
        .eq('id', beneficiario_id)

      // Atualizar saldo da empresa
      await supabase
        .from('empresas')
        .update({ saldo_total: supabase.sql`saldo_total - ${valor}` })
        .eq('id', beneficiario.empresa_id)

      // Registrar no extrato
      await supabase
        .from('extratos')
        .insert([{
          beneficiario_id,
          empresa_id: beneficiario.empresa_id,
          conveniado_id,
          tipo_transacao: 'pagamento',
          valor,
          saldo_anterior: beneficiario.saldo_atual,
          saldo_atual: beneficiario.saldo_atual - valor,
          descricao: `Pagamento em ${conveniado.nome_fantasia}`
        }])
    }

    res.status(201).json({
      transacao_id: transacao.id,
      status: transacao.status,
      mensagem: 'Pagamento realizado com sucesso',
      saldo_restante: status === 'aprovado' ? beneficiario.saldo_atual - valor : beneficiario.saldo_atual,
      timestamp: transacao.data_transacao
    })

  } catch (error) {
    console.error('Erro ao processar transação:', error)
    res.status(500).json({ 
      error: 'Erro ao processar transação',
      message: 'Ocorreu um erro ao processar o pagamento'
    })
  }
})

// Cancelar transação
router.put('/:id/cancelar', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { motivo } = req.body

    // Buscar transação
    const { data: transacao, error: transError } = await supabase
      .from('transacoes')
      .select('*')
      .eq('id', id)
      .single()

    if (transError || !transacao) {
      return res.status(404).json({ error: 'Transação não encontrada' })
    }

    // Verificar se pode ser cancelada (apenas aprovadas e dentro de 24h)
    if (transacao.status !== 'aprovado') {
      return res.status(400).json({ 
        error: 'Transação não pode ser cancelada',
        message: 'Apenas transações aprovadas podem ser canceladas'
      })
    }

    const transacaoData = new Date(transacao.data_transacao)
    const agora = new Date()
    const diffHoras = (agora.getTime() - transacaoData.getTime()) / (1000 * 60 * 60)

    if (diffHoras > 24) {
      return res.status(400).json({ 
        error: 'Prazo expirado',
        message: 'Transações só podem ser canceladas dentro de 24 horas'
      })
    }

    // Atualizar status da transação
    const { data: transacaoAtualizada, error: updateError } = await supabase
      .from('transacoes')
      .update({ 
        status: 'cancelado',
        dados_nfc: { ...transacao.dados_nfc, motivo_cancelamento: motivo }
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    // Restaurar saldo do beneficiário
    const { data: beneficiario } = await supabase
      .from('beneficiarios')
      .select('saldo_atual')
      .eq('id', transacao.beneficiario_id)
      .single()

    if (beneficiario) {
      await supabase
        .from('beneficiarios')
        .update({ saldo_atual: beneficiario.saldo_atual + transacao.valor })
        .eq('id', transacao.beneficiario_id)
    }

    // Restaurar saldo da empresa
    await supabase
      .from('empresas')
      .update({ saldo_total: supabase.sql`saldo_total + ${transacao.valor}` })
      .eq('id', transacao.empresa_id)

    res.json({
      transacao: transacaoAtualizada,
      mensagem: 'Transação cancelada com sucesso',
      saldo_restaurado: transacao.valor
    })

  } catch (error) {
    console.error('Erro ao cancelar transação:', error)
    res.status(500).json({ 
      error: 'Erro ao cancelar transação',
      message: 'Ocorreu um erro ao cancelar a transação'
    })
  }
})

export default router