-- Atualizar senhas com hash correto para 'password'

-- Administrador
UPDATE public.administradores 
SET password_hash = '$2a$10$iru54wPZF.u0rLJwXIC.genmR/hbU9HwF/AA54DIjLOQ8VZG1LkUm'
WHERE email = 'admin@aciei.com.br';

-- Empresa
UPDATE public.empresas 
SET password_hash = '$2a$10$iru54wPZF.u0rLJwXIC.genmR/hbU9HwF/AA54DIjLOQ8VZG1LkUm'
WHERE email = 'empresa@teste.com.br';

-- Conveniado
UPDATE public.conveniados 
SET password_hash = '$2a$10$iru54wPZF.u0rLJwXIC.genmR/hbU9HwF/AA54DIjLOQ8VZG1LkUm'
WHERE email = 'conveniado@teste.com.br';

-- Beneficiário
UPDATE public.beneficiarios 
SET password_hash = '$2a$10$iru54wPZF.u0rLJwXIC.genmR/hbU9HwF/AA54DIjLOQ8VZG1LkUm'
WHERE email = 'beneficiario@teste.com.br';