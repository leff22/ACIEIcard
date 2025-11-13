-- Criação das tabelas do sistema ACIEIcard
-- Sistema de gestão e pagamentos NFC para ACIEI

-- Tabela de Administradores ACIEI
CREATE TABLE IF NOT EXISTS administradores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nivel_acesso VARCHAR(50) DEFAULT 'admin' CHECK (nivel_acesso IN ('admin', 'super_admin')),
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Empresas Associadas
CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    saldo_total DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Beneficiários
CREATE TABLE IF NOT EXISTS beneficiarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    foto_url TEXT,
    limite_diario DECIMAL(10,2) DEFAULT 200.00,
    limite_semanal DECIMAL(10,2) DEFAULT 1000.00,
    limite_mensal DECIMAL(10,2) DEFAULT 3000.00,
    saldo_atual DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    password_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Conveniados
CREATE TABLE IF NOT EXISTS conveniados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    taxa_transacao DECIMAL(5,2) DEFAULT 2.50,
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Cartões Físicos
CREATE TABLE IF NOT EXISTS cartoes_fisicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiario_id UUID NOT NULL REFERENCES beneficiarios(id) ON DELETE CASCADE,
    numero_cartao VARCHAR(16) UNIQUE NOT NULL,
    codigo_chip VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'emitido' CHECK (status IN ('emitido', 'ativo', 'bloqueado', 'cancelado')),
    data_ativacao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Transações
CREATE TABLE IF NOT EXISTS transacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiario_id UUID NOT NULL REFERENCES beneficiarios(id) ON DELETE CASCADE,
    conveniado_id UUID NOT NULL REFERENCES conveniados(id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    valor DECIMAL(10,2) NOT NULL,
    tipo_pagamento VARCHAR(20) NOT NULL CHECK (tipo_pagamento IN ('nfc', 'qr_code', 'manual')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('aprovado', 'recusado', 'pendente', 'cancelado')),
    dados_nfc JSONB,
    data_transacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Recargas
CREATE TABLE IF NOT EXISTS recargas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    valor DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'recusada', 'cancelada')),
    aprovado_por UUID REFERENCES administradores(id),
    data_solicitacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_aprovacao TIMESTAMP WITH TIME ZONE
);

-- Tabela de Extratos/Relatórios
CREATE TABLE IF NOT EXISTS extratos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiario_id UUID REFERENCES beneficiarios(id) ON DELETE CASCADE,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    conveniado_id UUID REFERENCES conveniados(id) ON DELETE CASCADE,
    tipo_transacao VARCHAR(50) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    saldo_anterior DECIMAL(10,2) NOT NULL,
    saldo_atual DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    data_transacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_administradores_email ON administradores(email);
CREATE INDEX IF NOT EXISTS idx_administradores_status ON administradores(status);

CREATE INDEX IF NOT EXISTS idx_empresas_cnpj ON empresas(cnpj);
CREATE INDEX IF NOT EXISTS idx_empresas_status ON empresas(status);
CREATE INDEX IF NOT EXISTS idx_empresas_email ON empresas(email);

CREATE INDEX IF NOT EXISTS idx_beneficiarios_empresa ON beneficiarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_beneficiarios_cpf ON beneficiarios(cpf);
CREATE INDEX IF NOT EXISTS idx_beneficiarios_status ON beneficiarios(status);

CREATE INDEX IF NOT EXISTS idx_conveniados_cnpj ON conveniados(cnpj);
CREATE INDEX IF NOT EXISTS idx_conveniados_status ON conveniados(status);
CREATE INDEX IF NOT EXISTS idx_conveniados_email ON conveniados(email);

CREATE INDEX IF NOT EXISTS idx_cartoes_beneficiario ON cartoes_fisicos(beneficiario_id);
CREATE INDEX IF NOT EXISTS idx_cartoes_numero ON cartoes_fisicos(numero_cartao);
CREATE INDEX IF NOT EXISTS idx_cartoes_status ON cartoes_fisicos(status);

CREATE INDEX IF NOT EXISTS idx_transacoes_beneficiario ON transacoes(beneficiario_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_conveniado ON transacoes(conveniado_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_empresa ON transacoes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON transacoes(data_transacao);
CREATE INDEX IF NOT EXISTS idx_transacoes_status ON transacoes(status);

CREATE INDEX IF NOT EXISTS idx_recargas_empresa ON recargas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_recargas_status ON recargas(status);
CREATE INDEX IF NOT EXISTS idx_recargas_data ON recargas(data_solicitacao);

CREATE INDEX IF NOT EXISTS idx_extratos_beneficiario ON extratos(beneficiario_id);
CREATE INDEX IF NOT EXISTS idx_extratos_empresa ON extratos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_extratos_data ON extratos(data_transacao);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_administradores_updated_at BEFORE UPDATE ON administradores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beneficiarios_updated_at BEFORE UPDATE ON beneficiarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conveniados_updated_at BEFORE UPDATE ON conveniados
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cartoes_updated_at BEFORE UPDATE ON cartoes_fisicos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir administrador padrão
INSERT INTO administradores (nome, email, password_hash, nivel_acesso) VALUES 
('Administrador ACIEI', 'admin@aciei.com.br', '$2a$12$KIXxP7vQLuJHLUv6f8mX.O6K8gG5kZpH7zCZbJ3K7vQ9f6m8N4w2q', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Inserir empresa de exemplo
INSERT INTO empresas (cnpj, razao_social, nome_fantasia, email, telefone, endereco, saldo_total, status, password_hash) VALUES 
('12345678000195', 'Empresa XYZ Ltda', 'Empresa XYZ', 'empresa@xyz.com.br', '(35) 1234-5678', 'Rua Principal, 123 - Itajubá/MG', 10000.00, 'ativo', '$2a$12$KIXxP7vQLuJHLUv6f8mX.O6K8gG5kZpH7zCZbJ3K7vQ9f6m8N4w2q')
ON CONFLICT (cnpj) DO NOTHING;

-- Inserir conveniado de exemplo
INSERT INTO conveniados (cnpj, razao_social, nome_fantasia, email, telefone, endereco, taxa_transacao, status, password_hash) VALUES 
('98765432000158', 'Supermercado ABC Ltda', 'Supermercado ABC', 'contato@abc.com.br', '(35) 8765-4321', 'Av. Central, 456 - Itajubá/MG', 2.50, 'ativo', '$2a$12$KIXxP7vQLuJHLUv6f8mX.O6K8gG5kZpH7zCZbJ3K7vQ9f6m8N4w2q')
ON CONFLICT (cnpj) DO NOTHING;