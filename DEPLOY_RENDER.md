# Deploy ACIEIcard Backend no Render

## Passos para Deploy Manual no Render:

### 1. Preparar o Backend
O backend já está configurado com:
- ✅ `api/package.json` com dependências
- ✅ `api/server.js` com servidor Express
- ✅ CORS configurado para produção
- ✅ Health check endpoint

### 2. Fazer Deploy no Render

1. Acesse: https://render.com
2. Clique em "New" → "Web Service"
3. Conecte seu repositório do GitHub
4. Configure as seguintes opções:
   - **Name**: `acieicard-backend`
   - **Environment**: Node
   - **Build Command**: `cd api && npm install`
   - **Start Command**: `cd api && node server.js`
   - **Instance Type**: Free (para começar)

### 3. Variáveis de Ambiente
Adicione no dashboard do Render:
```
NODE_ENV=production
```

### 4. Após o Deploy
O Render fornecerá uma URL como:
`https://acieicard-backend.onrender.com`

### 5. Testar o Backend
Teste os endpoints:
- Health Check: `https://acieicard-backend.onrender.com/health`
- Login: `https://acieicard-backend.onrender.com/api/auth/login`

### 6. Atualizar Frontend
Após o backend estar no ar, atualize o frontend para apontar para a nova URL do backend.