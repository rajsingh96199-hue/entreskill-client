import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import MentorDirectory from './pages/MentorDirectory'
import ProtectedRoute from './components/Shared/ProtectedRoute'
import PublicRoute from './components/Shared/PublicRoute'
import MentorRegister from './pages/MentorRegister'
import RoadmapPage from './pages/RoadmapPage'
import IdeasPage from './pages/IdeasPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="/mentors" element={<ProtectedRoute><MentorDirectory /></ProtectedRoute>} />
        <Route path="/mentor/register" element={
  <ProtectedRoute><MentorRegister /></ProtectedRoute>
} />
        <Route path="/ideas" element={<ProtectedRoute><IdeasPage /></ProtectedRoute>} />

        <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
        <Route path="/roadmap/:ideaId" element={
  <ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
        <Route path="*" element={
          <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #14213D, #0D7377)',
            fontFamily: 'sans-serif', textAlign: 'center', color: '#fff'
          }}>
            <div>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
              <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Page Not Found</h1>
              <a href="/" style={{
                background: '#F4A261', color: '#fff',
                padding: '12px 28px', borderRadius: 10,
                fontWeight: 700, textDecoration: 'none'
              }}>Go Home →</a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}
