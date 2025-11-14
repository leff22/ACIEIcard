// Backend ACIEIcard com Supabase
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Configurar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Configuração CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://traei3h5kaag.vercel.app', 'https://acieicard.vercel.app', 'https://aciei-card.vercel.app']
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    supabase: !!supabase
  });
});

// Login com Supabase
app.post('/api/auth/login', async (req, res) => {
  const { cpf_cnpj, senha, tipo_usuario } = req.body;
  
  console.log('Tentativa de login:', { cpf_cnpj, tipo_usuario });
  
  try {
    let user = null;
    let userType = '';
    
    // Buscar em diferentes tabelas baseado no tipo de usuário
    switch (tipo_usuario) {
      case 'admin':
        const { data: admin } = await supabase
          .from('administradores')
          .select('*')
          .eq('email', cpf_cnpj)
          .eq('status', 'ativo')
          .single();
        user = admin;
        userType = 'admin';
        break;
        
      case 'empresa':
        const { data: empresa } = await supabase
          .from('empresas')
          .select('*')
          .eq('cnpj', cpf_cnpj)
          .eq('status', 'ativo')
          .single();
        user = empresa;
        userType = 'empresa';
        break;
        
      case 'conveniado':
        const { data: conveniado } = await supabase
          .from('conveniados')
          .select('*')
          .eq('cnpj', cpf_cnpj)
          .eq('status', 'ativo')
          .single();
        user = conveniado;
        userType = 'conveniado';
        break;
        
      case 'beneficiario':
        const { data: beneficiario } = await supabase
          .from('beneficiarios')
          .select('*')
          .eq('cpf', cpf_cnpj)
          .eq('status', 'ativo')
          .single();
        user = beneficiario;
        userType = 'beneficiario';
        break;
    }
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Usuário não encontrado ou inativo' 
      });
    }
    
    // Verificar senha usando bcrypt
    const isPasswordValid = await bcrypt.compare(senha, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Senha incorreta' 
      });
    }
    
    // Criar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        tipo: userType,
        cpf_cnpj: cpf_cnpj 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Preparar resposta do usuário
    const userResponse = {
      id: user.id,
      nome: user.nome || user.razao_social || user.nome_fantasia,
      tipo: userType,
      status: user.status,
      email: user.email,
      ...(userType === 'beneficiario' && {
        saldo_atual: user.saldo_atual,
        limite_diario: user.limite_diario,
        limite_semanal: user.limite_semanal,
        limite_mensal: user.limite_mensal
      }),
      ...(userType === 'empresa' && {
        saldo_total: user.saldo_total
      })
    };
    
    res.json({
      token: token,
      usuario: userResponse,
      message: 'Login realizado com sucesso!'
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      error: 'Erro ao processar login',
      message: error.message 
    });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout realizado com sucesso' });
});

// Buscar dados do usuário autenticado
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const { id, tipo } = req.user;
    let userData = null;
    
    switch (tipo) {
      case 'admin':
        const { data: admin } = await supabase
          .from('administradores')
          .select('*')
          .eq('id', id)
          .single();
        userData = admin;
        break;
        
      case 'empresa':
        const { data: empresa } = await supabase
          .from('empresas')
          .select('*')
          .eq('id', id)
          .single();
        userData = empresa;
        break;
        
      case 'conveniado':
        const { data: conveniado } = await supabase
          .from('conveniados')
          .select('*')
          .eq('id', id)
          .single();
        userData = conveniado;
        break;
        
      case 'beneficiario':
        const { data: beneficiario } = await supabase
          .from('beneficiarios')
          .select('*')
          .eq('id', id)
          .single();
        userData = beneficiario;
        break;
    }
    
    if (!userData) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json({ usuario: userData });
  } catch (error) {
    res.status(500).json({ 
      error: 'Erro ao buscar dados do usuário',
      message: error.message 
    });
  }
});

// Rotas para empresas (protegidas)
app.get('/api/empresas', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({ empresas: data });
  } catch (error) {
    res.status(500).json({ 
      error: 'Erro ao buscar empresas',
      message: error.message 
    });
  }
});

// Rotas para beneficiários (protegidas)
app.get('/api/beneficiarios/empresa/:empresaId', authenticateToken, async (req, res) => {
  try {
    const { empresaId } = req.params;
    
    const { data, error } = await supabase
      .from('beneficiarios')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('nome', { ascending: true });
    
    if (error) throw error;
    
    res.json({ beneficiarios: data });
  } catch (error) {
    res.status(500).json({ 
      error: 'Erro ao buscar beneficiários',
      message: error.message 
    });
  }
});

// Rotas para transações (protegidas)
app.get('/api/transacoes', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transacoes')
      .select(`
        *,
        beneficiarios(nome, cpf),
        conveniados(nome_fantasia, cnpj)
      `)
      .order('data_transacao', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    res.json({ transacoes: data });
  } catch (error) {
    res.status(500).json({ 
      error: 'Erro ao buscar transações',
      message: error.message 
    });
  }
});

// Criar nova transação (protegida)
app.post('/api/transacoes', authenticateToken, async (req, res) => {
  try {
    const { beneficiario_id, valor, tipo_pagamento, dados_nfc } = req.body;
    
    // Verificar se beneficiário existe e tem saldo
    const { data: beneficiario, error: benefError } = await supabase
      .from('beneficiarios')
      .select('saldo_atual, limite_diario, limite_semanal, limite_mensal, empresa_id')
      .eq('id', beneficiario_id)
      .single();
    
    if (benefError || !beneficiario) {
      return res.status(404).json({ error: 'Beneficiário não encontrado' });
    }
    
    // Verificar limites e saldo (simplificado para exemplo)
    if (beneficiario.saldo_atual < valor) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }
    
    // Criar transação
    const { data: transacao, error: transError } = await supabase
      .from('transacoes')
      .insert([{
        beneficiario_id,
        empresa_id: beneficiario.empresa_id,
        conveniado_id: req.user.id, // Assumindo que usuário autenticado é o conveniado
        valor,
        tipo_pagamento,
        status: 'aprovado',
        dados_nfc
      }])
      .select()
      .single();
    
    if (transError) throw transError;
    
    // Atualizar saldo do beneficiário
    const { error: updateError } = await supabase
      .from('beneficiarios')
      .update({ saldo_atual: beneficiario.saldo_atual - valor })
      .eq('id', beneficiario_id);
    
    if (updateError) throw updateError;
    
    // Criar registro no extrato
    await supabase
      .from('extratos')
      .insert([{
        beneficiario_id,
        empresa_id: beneficiario.empresa_id,
        conveniado_id: req.user.id,
        tipo_transacao: 'debito',
        valor,
        saldo_anterior: beneficiario.saldo_atual,
        saldo_atual: beneficiario.saldo_atual - valor,
        descricao: `Pagamento ${tipo_pagamento.toUpperCase()}`
      }]);
    
    res.json({
      transacao,
      message: 'Transação realizada com sucesso!'
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Erro ao processar transação',
      message: error.message 
    });
  }
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ACIEIcard com Supabase rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Supabase URL: ${process.env.SUPABASE_URL}`);
});