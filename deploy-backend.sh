# Script de Deploy do Backend para Render

echo "🚀 Preparando backend para deploy no Render..."

# Verificar estrutura
echo "📁 Verificando estrutura do backend..."
ls -la api/

# Criar arquivo de ambiente se não existir
if [ ! -f api/.env ]; then
    echo "📝 Criando arquivo .env de exemplo..."
    cp api/.env.example api/.env 2>/dev/null || echo "Arquivo .env.example não encontrado"
fi

echo "✅ Backend preparado para deploy!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse: https://render.com"
echo "2. Crie um novo Web Service"
echo "3. Configure:"
echo "   - Build Command: cd api && npm install"
echo "   - Start Command: cd api && node server.js"
echo "4. Adicione a variável: NODE_ENV=production"
echo ""
echo "🎯 Após o deploy, atualize a URL no arquivo:"
echo "   - .env.production (frontend)"
echo "   - Ou re-deploy do frontend com nova URL"