import { Navigate, Route, Routes } from 'react-router-dom'
import { ContratsPage } from './pages/ContratsPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { OrganizationsPage } from './pages/OrganizationsPage'
import { RegisterPage } from './pages/RegisterPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/organizations" element={<OrganizationsPage />} />
      <Route path="/contrats" element={<ContratsPage />} />
    </Routes>
  )
}

export default App
