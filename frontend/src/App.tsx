import { Routes, Route } from 'react-router-dom'
import SignupPage from './pages/auth/Signup'
import VerifyPage from './pages/auth/VerifyPage'

function App() {
  return (
    <Routes>
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  )
}

export default App
