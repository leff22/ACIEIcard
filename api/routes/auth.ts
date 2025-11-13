import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../server.js'

const router = express.Router()

// Login de usuários
router.post('/login', async (req, res) => {
  try {
    const { cpf_cnpj, senha, tipo_usuario } = req.body

    if (!cpf_cnpj || !senha || !tipo_usuario) {
      return res.status(400).json({ 
        error: 'Dados incompletos',
        message: 'CPF/CNPJ, senha e tipo de usuário são obrigatórios'
      })
    }

    let user = null
    let tableName = ''

    // Verificar o tipo de usuário e buscar na tabela apropriada
    switch (tipo_usuario) {
      case 'admin':
        tableName = 'administradores'
        const { data: adminData } = await supabase
          .from('administradores')
          .select('*')
          .eq('email', cpf_cnpj)
          .single()
        user = adminData
        break

      case 'empresa':
        tableName = 'empresas'
        const { data: empresaData } = await supabase
          .from('empresas')
          .select('*')
          .eq('cnpj', cpf_cnpj.replace(/\D/g, ''))
          .single()
        user = empresaData
        break

      case 'conveniado':
        tableName = 'conveniados'
        const { data: conveniadoData } = await supabase
          .from('conveniados')
          .select('*')
          .eq('cnpj', cpf_cnpj.replace(/\D/g, ''))
          .single()
        user = conveniadoData
        break

      case 'beneficiario':
        tableName = 'beneficiarios'
        const { data: beneficiarioData } = await supabase
          .from('beneficiarios')
          .select('*')
          .eq('cpf', cpf_cnpj.replace(/\D/g, ''))
          .single()
        user = beneficiarioData
        break

      default:
        return res.status(400).json({ 
          error: 'Tipo de usuário inválido',
          message: 'Tipo de usuário deve ser: admin, empresa, conveniado ou beneficiario'
        })
    }

    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciais inválidas',
        message: 'Usuário não encontrado'
      })
    }

    // Verificar se o usuário está ativo
    if (user.status !== 'ativo') {
      return res.status(401).json({ 
        error: 'Usuário inativo',
        message: 'Seu acesso está temporariamente suspenso. Entre em contato com a ACIEI.'
      })
    }

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(senha, user.password_hash)
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Credenciais inválidas',
        message: 'Senha incorreta'
      })
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        tipo: tipo_usuario,
        email: user.email || user.cpf || user.cnpj
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    )

    // Preparar resposta com dados do usuário
    const userResponse = {
      id: user.id,
      nome: user.nome || user.razao_social || user.nome_fantasia,
      email: user.email,
      tipo: tipo_usuario,
      status: user.status
    }

    // Adicionar informações específicas por tipo
    if (tipo_usuario === 'empresa') {
      userResponse.cnpj = user.cnpj
      userResponse.saldo_total = user.saldo_total
    } else if (tipo_usuario === 'conveniado') {
      userResponse.cnpj = user.cnpj
      userResponse.taxa_transacao = user.taxa_transacao
    } else if (tipo_usuario === 'beneficiario') {
      userResponse.cpf = user.cpf
      userResponse.saldo_atual = user.saldo_atual
      userResponse.limite_diario = user.limite_diario
      userResponse.limite_semanal = user.limite_semanal
      userResponse.limite_mensal = user.limite_mensal
      userResponse.empresa_id = user.empresa_id
    }

    res.json({
      token,
      usuario: userResponse,
      message: 'Login realizado com sucesso'
    })

  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: 'Ocorreu um erro ao processar seu login. Tente novamente.'
    })
  }
})

// Logout (opcional - pode ser implementado no frontend)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout realizado com sucesso' })
})

// Renovar token
router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ error: 'Token é obrigatório' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any
    
    // Gerar novo token
    const newToken = jwt.sign(
      { 
        userId: decoded.userId, 
        tipo: decoded.tipo,
        email: decoded.email
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    )

    res.json({ token: newToken })

  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' })
  }
})

export default router