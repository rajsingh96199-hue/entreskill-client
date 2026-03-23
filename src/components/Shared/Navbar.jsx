import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div style={{
      background: 'linear-gradient(135deg, #14213D, #0D7377)',
      padding: '14px 24px',
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', position: 'sticky',
      top: 0, zIndex: 100
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
        style={{
          display: 'flex', alignItems: 'center',
          gap: 8, cursor: 'pointer'
        }}>
        <span style={{ fontSize: 22 }}>🌱</span>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>
          EntreSkill Hub
        </span>
      </div>

      {/* Nav Links */}
      {isAuthenticated && (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[
            { path: '/dashboard', label: '🏠 Home' },
            { path: '/mentors', label: '👥 Mentors' },
            { path: '/onboarding', label: '🎯 Find Ideas' },
            ...(user?.role === 'admin' ? [{ path: '/admin', label: '⚙️ Admin' }] : []),
          ].map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                background: isActive(item.path)
                  ? 'rgba(255,255,255,0.2)'
                  : 'transparent',
                color: '#fff', border: 'none',
                borderRadius: 8, padding: '6px 12px',
                fontSize: 12, fontWeight: 600,
                cursor: 'pointer'
              }}>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isAuthenticated ? (
          <>
            <span style={{ color: '#94A3B8', fontSize: 13 }}>
              👋 {user?.name?.split(' ')[0]}
            </span>
            <button onClick={handleLogout} style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8, padding: '6px 14px',
              fontSize: 12, fontWeight: 600, cursor: 'pointer'
            }}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} style={{
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 8, padding: '6px 14px',
              fontSize: 12, fontWeight: 600, cursor: 'pointer'
            }}>Login</button>
            <button onClick={() => navigate('/register')} style={{
              background: '#F4A261', color: '#fff',
              border: 'none', borderRadius: 8,
              padding: '6px 14px', fontSize: 12,
              fontWeight: 600, cursor: 'pointer'
            }}>Register</button>
          </>
        )}
      </div>
    </div>
  )
}