import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import LandingPage from './pages/LandingPage'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import EmpresaLogin from './pages/empresa/Login'
import EmpresaDashboard from './pages/empresa/Dashboard'
import ConveniadoLogin from './pages/conveniado/Login'
import ConveniadoDashboard from './pages/conveniado/Dashboard'
import BeneficiarioLogin from './pages/beneficiario/Login'
import BeneficiarioDashboard from './pages/beneficiario/Dashboard'
import PagamentoNFC from './pages/beneficiario/PagamentoNFC'
import { useEffect, useState } from 'react'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Debug inicial
    console.log('🚀 ACIEIcard App iniciado')
    console.log('📍 Environment:', {
      PROD: import.meta.env.PROD,
      DEV: import.meta.env.DEV,
      VITE_API_URL: import.meta.env.VITE_API_URL
    })
    
    // Simular carregamento inicial
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-blue-600 mb-2">ACIEIcard</h2>
          <p className="text-gray-600">Carregando sistema...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Rotas Admin ACIEI */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Rotas Empresas Associadas */}
          <Route path="/empresa/login" element={<EmpresaLogin />} />
          <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
          
          {/* Rotas Conveniados */}
          <Route path="/conveniado/login" element={<ConveniadoLogin />} />
          <Route path="/conveniado/dashboard" element={<ConveniadoDashboard />} />
          
          {/* Rotas Beneficiários */}
          <Route path="/beneficiario/login" element={<BeneficiarioLogin />} />
          <Route path="/beneficiario/dashboard" element={<BeneficiarioDashboard />} />
          <Route path="/pagamento-nfc" element={<PagamentoNFC />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  )
}

export default App