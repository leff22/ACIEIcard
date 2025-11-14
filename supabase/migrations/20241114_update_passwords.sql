-- Atualizar senhas dos usuários de teste

-- Atualizar administrador
UPDATE public.administradores 
SET password_hash = '$2a$10$jPmLTYAVKcCd4880fgT16eBzTOXobEFdisxFOvsjMy4ak.5TlTH9i' -- senha: password
WHERE email = 'admin@aciei.com.br';

-- Atualizar empresa
UPDATE public.empresas 
SET password_hash = '$2a$10$jPmLTYAVKcCd4880fgT16eBzTOXobEFdisxFOvsjMy4ak.5TlTH9i' -- senha: password
WHERE email = 'empresa@teste.com.br';

-- Atualizar conveniado
UPDATE public.conveniados 
SET password_hash = '$2a$10$jPmLTYAVKcCd4880fgT16eBzTOXobEFdisxFOvsjMy4ak.5TlTH9i' -- senha: password
WHERE email = 'conveniado@teste.com.br';

-- Atualizar beneficiario
UPDATE public.beneficiarios 
SET password_hash = '$2a$10$jPmLTYAVKcCd4880fgT16eBzTOXobEFdisxFOvsjMy4ak.5TlTH9i' -- senha: password
WHERE email = 'beneficiario@teste.com.br';