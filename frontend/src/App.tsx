import { Routes, Route } from 'react-router-dom'
import { useThemes } from './hooks/useThemes'
import LoginPage from './pages/auth/Login'
import SignupPage from './pages/auth/Signup'
import VerifyPage from './pages/auth/VerifyPage'

function App() {
  useThemes()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify" element={<VerifyPage />} />
    </Routes>
  )
}

export default App
