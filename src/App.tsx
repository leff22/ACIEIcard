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

function App() {
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