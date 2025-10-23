import { Routes, Route } from 'react-router-dom'
import SignupPage from './pages/auth/Signup'

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  )
}

export default App
