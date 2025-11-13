# Deploy Script para Vercel com novo domínio

echo "🚀 Iniciando deploy para Vercel com domínio aciei-card.vercel.app..."

# Fazer build local
echo "📦 Fazendo build do projeto..."
npm run build

# Deploy para Vercel com alias
echo "☁️ Fazendo deploy para Vercel..."
npx vercel --prod --yes

# Configurar alias (domínio personalizado)
echo "🔗 Configurando domínio aciei-card.vercel.app..."
npx vercel alias aciei-card.vercel.app

echo "✅ Deploy concluído!"
echo "🌐 URL: https://aciei-card.vercel.app"