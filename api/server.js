// Servidor simples para testes do ACIEIcard
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Configuração CORS para produção
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://aciei-card.vercel.app', 'https://traei3h5kaag.vercel.app', 'https://acieicard.vercel.app']
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota de login simulada
app.post('/api/auth/login', (req, res) => {
  const { cpf_cnpj, senha, tipo_usuario } = req.body;
  
  console.log('Tentativa de login:', { cpf_cnpj, tipo_usuario });
  
  if (senha === 'admin123') {
    res.json({
      token: 'mock-jwt-token-' + Date.now(),
      usuario: {
        id: '123',
        nome: tipo_usuario === 'admin' ? 'Administrador ACIEI' : 
              tipo_usuario === 'empresa' ? 'Empresa XYZ Ltda' :
              tipo_usuario === 'conveniado' ? 'Supermercado ABC' :
              'João Silva - Beneficiário',
        tipo: tipo_usuario,
        status: 'ativo'
      },
      message: 'Login realizado com sucesso!'
    });
  } else {
    res.status(401).json({ 
      error: 'Credenciais inválidas',
      message: 'CPF/CNPJ ou senha incorretos'
    });
  }
});

// Rota de logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout realizado com sucesso' });
});

// Rota de teste para empresas
app.get('/api/empresas', (req, res) => {
  res.json({ 
    empresas: [
      {
        id: '1',
        cnpj: '12345678000195',
        razao_social: 'Empresa XYZ Ltda',
        nome_fantasia: 'Empresa XYZ',
        email: 'empresa@xyz.com.br',
        telefone: '(35) 1234-5678',
        endereco: 'Rua Principal, 123 - Itajubá/MG',
        saldo_total: 10000.00,
        status: 'ativo'
      }
    ]
  });
});

// Rota de teste para beneficiários
app.get('/api/beneficiarios/empresa/1', (req, res) => {
  res.json({ 
    beneficiarios: [
      {
        id: '1',
        nome: 'João Silva',
        cpf: '12345678900',
        email: 'joao@email.com',
        limite_diario: 200.00,
        limite_semanal: 1000.00,
        limite_mensal: 3000.00,
        saldo_atual: 1500.00,
        status: 'ativo'
      },
      {
        id: '2',
        nome: 'Maria Santos',
        cpf: '98765432100',
        email: 'maria@email.com',
        limite_diario: 150.00,
        limite_semanal: 800.00,
        limite_mensal: 2500.00,
        saldo_atual: 1200.00,
        status: 'ativo'
      }
    ]
  });
});

// Rota de teste para transações
app.get('/api/transacoes', (req, res) => {
  res.json({ 
    transacoes: [
      {
        id: '1',
        beneficiario: 'João Silva',
        conveniado: 'Supermercado ABC',
        valor: 150.50,
        tipo_pagamento: 'nfc',
        status: 'aprovado',
        data_transacao: '2024-01-15T14:30:00Z'
      },
      {
        id: '2',
        beneficiario: 'Maria Santos',
        conveniado: 'Farmácia XYZ',
        valor: 89.90,
        tipo_pagamento: 'nfc',
        status: 'aprovado',
        data_transacao: '2024-01-15T13:45:00Z'
      }
    ]
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ACIEIcard rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Teste API: http://localhost:${PORT}/api/test`);
});