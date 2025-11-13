import { Building2, CreditCard, Users, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">ACIEIcard</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#sobre" className="text-gray-500 hover:text-gray-900">Sobre</a>
              <a href="#funcionalidades" className="text-gray-500 hover:text-gray-900">Funcionalidades</a>
              <a href="#contato" className="text-gray-500 hover:text-gray-900">Contato</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Sistema de Pagamentos
              <span className="block text-blue-600">NFC para ACIEI</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Modernize a gestão de benefícios e pagamentos da sua associação comercial. 
              Cartões físicos, app móvel e controle total em tempo real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/admin/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Acesso Administrativo
              </a>
              <a
                href="/empresa/login"
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Portal Empresas
              </a>
              <a
                href="/beneficiario/login"
                className="inline-flex items-center px-6 py-3 border border-green-600 text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
              >
                App Beneficiários
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="funcionalidades" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Funcionalidades Principais</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tudo o que você precisa para gerenciar pagamentos e benefícios com tecnologia de ponta.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Pagamentos NFC</h4>
                <p className="text-gray-600">Pagamentos rápidos e seguros com aproximação do cartão ou celular.</p>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Gestão de Beneficiários</h4>
                <p className="text-gray-600">Controle completo sobre limites, saldos e cadastro de beneficiários.</p>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Relatórios em Tempo Real</h4>
                <p className="text-gray-600">Acompanhe transações, extratos e análises detalhadas instantaneamente.</p>
              </div>

              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <Building2 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Multiplos Perfis</h4>
                <p className="text-gray-600">ACIEI, empresas, beneficiários e conveniados em uma única plataforma.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Pronto para modernizar seus pagamentos?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Entre em contato com a ACIEI e comece a usar o sistema mais moderno de gestão de benefícios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/conveniado/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Acesso Conveniados
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-blue-400 mr-3" />
              <h4 className="text-xl font-bold">ACIEIcard</h4>
            </div>
            <p className="text-gray-400 mb-4">
              Sistema de pagamentos NFC desenvolvido para ACIEI - Associação Comercial e Empresarial de Itajubá-MG
            </p>
            <p className="text-sm text-gray-500">
              © 2024 ACIEICard. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}