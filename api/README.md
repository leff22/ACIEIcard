# ACIEIcard Backend

Backend API para o sistema ACIEIcard - Cartão Empresarial da ACIEI.

## Configuração

Este backend foi configurado para deploy no Render com as seguintes variáveis de ambiente:

- `NODE_ENV=production` (automaticamente configurado pelo Render)
- `PORT` (automaticamente configurado pelo Render)

## Endpoints

### Health Check
- `GET /health` - Verifica se o servidor está funcionando

### Autenticação
- `POST /api/auth/login` - Realiza login de usuários
- `POST /api/auth/logout` - Realiza logout

### Dados de Teste
Use as seguintes credenciais para testar:
- **Senha padrão**: `admin123`
- **Empresa**: CNPJ `11.222.333/0001-44`
- **Conveniado**: CNPJ `99.888.777/0001-55`

## Tecnologias
- Express.js
- CORS
- Dotenv