-- Inserir usuários de teste com senhas corretas

-- Administrador de teste
INSERT INTO public.administradores (id, nome, email, password_hash, nivel_acesso, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Administrador ACIEI',
  'admin@aciei.com.br',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- senha: password
  'admin',
  'ativo',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  updated_at = NOW();

-- Empresa de teste
INSERT INTO public.empresas (id, cnpj, razao_social, nome_fantasia, email, telefone, endereco, saldo_total, status, password_hash, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  '12345678000190',
  'Empresa Teste Ltda',
  'Empresa Teste',
  'empresa@teste.com.br',
  '(35) 1234-5678',
  'Rua Teste, 123 - Itajubá/MG',
  10000.00,
  'ativo',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- senha: password
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKo9llC/.og/at2.uheWG/igi',
  updated_at = NOW();

-- Conveniado de teste
INSERT INTO public.conveniados (id, cnpj, razao_social, nome_fantasia, email, telefone, endereco, taxa_transacao, status, password_hash, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  '98765432000110',
  'Conveniado Teste Ltda',
  'Conveniado Teste',
  'conveniado@teste.com.br',
  '(35) 8765-4321',
  'Av. Teste, 456 - Itajubá/MG',
  2.50,
  'ativo',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- senha: password
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  updated_at = NOW();

-- Beneficiário de teste
INSERT INTO public.beneficiarios (id, empresa_id, cpf, nome, email, limite_diario, limite_semanal, limite_mensal, saldo_atual, status, password_hash, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM public.empresas WHERE email = 'empresa@teste.com.br' LIMIT 1),
  '12345678901',
  'João da Silva Teste',
  'beneficiario@teste.com.br',
  200.00,
  1000.00,
  3000.00,
  500.00,
  'ativo',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- senha: password
  NOW(),
  NOW()
) ON CONFLICT (cpf) DO UPDATE SET
  password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  updated_at = NOW();