import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #14213D 0%, #0D7377 100%)',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌱</div>
          <p style={{ fontSize: 16, color: '#94A3B8' }}>Loading...</p>
        </div>
      </div>
    )
  }

  // Already logged in → redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // Not logged in → show the page
  return children
}