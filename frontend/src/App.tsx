import { Routes, Route } from 'react-router-dom'
import { useThemes } from './hooks/useThemes'
import LoginPage from './pages/auth/Login'
import SignupPage from './pages/auth/Signup'
import VerifyPage from './pages/auth/VerifyPage'
import ForgotPasswordPage from './pages/auth/ForgotPassword'
import OAuthSuccess from './pages/auth/OAuthSuccess'
import ResetPasswordPage from './pages/auth/ResetPassword'

function App() {
  useThemes()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/oauth/success" element={<OAuthSuccess />} />
    </Routes>
  )
}

export default App
