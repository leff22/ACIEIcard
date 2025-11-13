-- Configuração de permissões e RLS (Row Level Security) para o sistema ACIEIcard

-- Habilitar RLS nas tabelas
ALTER TABLE administradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE conveniados ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartoes_fisicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recargas ENABLE ROW LEVEL SECURITY;
ALTER TABLE extratos ENABLE ROW LEVEL SECURITY;

-- Permissões básicas para usuários anônimos (apenas leitura de dados públicos)
GRANT SELECT ON empresas TO anon;
GRANT SELECT ON conveniados TO anon;

-- Permissões completas para usuários autenticados (serão restringidas por RLS)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Políticas de segurança para empresas
CREATE POLICY "Empresas podem ver seus próprios dados" ON empresas
    FOR ALL TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Admin pode ver todas as empresas" ON empresas
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM administradores 
        WHERE administradores.id = auth.uid()
    ));

-- Políticas de segurança para beneficiários
CREATE POLICY "Empresas podem gerenciar seus beneficiários" ON beneficiarios
    FOR ALL TO authenticated
    USING (beneficiarios.empresa_id = auth.uid());

CREATE POLICY "Beneficiários podem ver seus próprios dados" ON beneficiarios
    FOR SELECT TO authenticated
    USING (beneficiarios.id = auth.uid());

CREATE POLICY "Admin pode ver todos os beneficiários" ON beneficiarios
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM administradores 
        WHERE administradores.id = auth.uid()
    ));

-- Políticas de segurança para conveniados
CREATE POLICY "Conveniados podem ver seus próprios dados" ON conveniados
    FOR ALL TO authenticated
    USING (conveniados.id = auth.uid());

CREATE POLICY "Admin pode ver todos os conveniados" ON conveniados
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM administradores 
        WHERE administradores.id = auth.uid()
    ));

-- Políticas de segurança para transações
CREATE POLICY "Transações visíveis por empresa" ON transacoes
    FOR ALL TO authenticated
    USING (transacoes.empresa_id = auth.uid());

CREATE POLICY "Transações visíveis por beneficiário" ON transacoes
    FOR SELECT TO authenticated
    USING (transacoes.beneficiario_id = auth.uid());

CREATE POLICY "Transações visíveis por conveniado" ON transacoes
    FOR SELECT TO authenticated
    USING (transacoes.conveniado_id = auth.uid());

CREATE POLICY "Admin pode ver todas as transações" ON transacoes
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM administradores 
        WHERE administradores.id = auth.uid()
    ));

-- Políticas de segurança para recargas
CREATE POLICY "Empresas podem ver suas recargas" ON recargas
    FOR SELECT TO authenticated
    USING (recargas.empresa_id = auth.uid());

CREATE POLICY "Admin pode gerenciar todas as recargas" ON recargas
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM administradores 
        WHERE administradores.id = auth.uid()
    ));

-- Políticas de segurança para extratos
CREATE POLICY "Extratos visíveis por empresa" ON extratos
    FOR SELECT TO authenticated
    USING (extratos.empresa_id = auth.uid());

CREATE POLICY "Extratos visíveis por beneficiário" ON extratos
    FOR SELECT TO authenticated
    USING (extratos.beneficiario_id = auth.uid());

CREATE POLICY "Extratos visíveis por conveniado" ON extratos
    FOR SELECT TO authenticated
    USING (extratos.conveniado_id = auth.uid());

CREATE POLICY "Admin pode ver todos os extratos" ON extratos
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM administradores 
        WHERE administradores.id = auth.uid()
    ));

-- Criar função para verificar tipo de usuário
CREATE OR REPLACE FUNCTION verificar_tipo_usuario(user_id UUID)
RETURNS TEXT AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM administradores WHERE id = user_id) THEN
        RETURN 'admin';
    ELSIF EXISTS (SELECT 1 FROM empresas WHERE id = user_id) THEN
        RETURN 'empresa';
    ELSIF EXISTS (SELECT 1 FROM beneficiarios WHERE id = user_id) THEN
        RETURN 'beneficiario';
    ELSIF EXISTS (SELECT 1 FROM conveniados WHERE id = user_id) THEN
        RETURN 'conveniado';
    ELSE
        RETURN 'desconhecido';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar função para registrar transações com validações
CREATE OR REPLACE FUNCTION registrar_transacao(
    p_beneficiario_id UUID,
    p_conveniado_id UUID,
    p_valor DECIMAL(10,2),
    p_tipo_pagamento VARCHAR(20),
    p_dados_nfc JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_empresa_id UUID;
    v_saldo_atual DECIMAL(10,2);
    v_limite_diario DECIMAL(10,2);
    v_transacao_id UUID;
    v_status VARCHAR(20) := 'aprovado';
BEGIN
    -- Obter dados do beneficiário
    SELECT empresa_id, saldo_atual, limite_diario
    INTO v_empresa_id, v_saldo_atual, v_limite_diario
    FROM beneficiarios 
    WHERE id = p_beneficiario_id AND status = 'ativo';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Beneficiário não encontrado ou inativo';
    END IF;

    -- Validar saldo
    IF v_saldo_atual < p_valor THEN
        v_status := 'recusado';
    END IF;

    -- Validar limite diário (simplificado - em produção verificar histórico)
    IF p_valor > v_limite_diario THEN
        v_status := 'recusado';
    END IF;

    -- Inserir transação
    INSERT INTO transacoes (
        beneficiario_id, 
        conveniado_id, 
        empresa_id, 
        valor, 
        tipo_pagamento, 
        status, 
        dados_nfc
    ) VALUES (
        p_beneficiario_id,
        p_conveniado_id,
        v_empresa_id,
        p_valor,
        p_tipo_pagamento,
        v_status,
        p_dados_nfc
    ) RETURNING id INTO v_transacao_id;

    -- Se aprovado, atualizar saldo
    IF v_status = 'aprovado' THEN
        UPDATE beneficiarios 
        SET saldo_atual = saldo_atual - p_valor 
        WHERE id = p_beneficiario_id;

        UPDATE empresas 
        SET saldo_total = saldo_total - p_valor 
        WHERE id = v_empresa_id;
    END IF;

    RETURN v_transacao_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;