import { Navigate, Route, Routes } from 'react-router-dom'
import { ContratsPage } from './pages/ContratsPage'
import { InstitutionsPage } from './pages/InstitutionsPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { PublicOnlyRoute } from './routes/PublicOnlyRoute'

function LandingRedirect() {
  const { token } = useAuth()
  return <Navigate to={token ? '/institutions' : '/login'} replace />
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/landing" element={<LandingRedirect />} />
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/institutions" element={<InstitutionsPage />} />
        <Route path="/contrats" element={<ContratsPage />} />
      </Route>
      <Route path="*" element={<LandingRedirect />} />
    </Routes>
  )
}

export default App
