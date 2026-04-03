import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { COLORS, FONTS, SHADOWS } from '../../styles/theme'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) => location.pathname === path

  // Hide navbar on landing, login, register, onboarding pages
  const hideOn = ['/', '/login', '/register', '/onboarding']
  if (hideOn.includes(location.pathname)) return null

  // Only 3 nav links max after login
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/ideas', label: 'Ideas' },
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin' }] : []),
  ]

  return (
    <nav style={{
      background: COLORS.navy900,
      padding: '0 40px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>

      {/* Logo */}
      <div onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7,
          background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, color: COLORS.navy900,
        }}>E</div>
        <span style={{ fontFamily: FONTS.display, fontSize: 16, color: COLORS.white, fontWeight: 700 }}>
          EntreSkill Hub
        </span>
      </div>

      {/* Nav Links — 3 max */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {navLinks.map(item => (
          <button key={item.path} onClick={() => navigate(item.path)} style={{
            background: 'transparent',
            color: isActive(item.path) ? COLORS.gold400 : 'rgba(255,255,255,0.5)',
            border: 'none',
            borderBottom: isActive(item.path) ? `2px solid ${COLORS.gold500}` : '2px solid transparent',
            padding: '0 16px',
            height: '60px',
            fontSize: '13px',
            fontWeight: isActive(item.path) ? 700 : 500,
            fontFamily: FONTS.body,
            cursor: 'pointer',
            letterSpacing: '0.3px',
            transition: 'all 0.15s',
          }}>{item.label}</button>
        ))}
      </div>

      {/* Right — User + Sign Out */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 8, padding: '5px 12px',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 800, color: COLORS.navy900,
          }}>{user?.name?.[0]?.toUpperCase()}</div>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', fontWeight: 500 }}>
            {user?.name?.split(' ')[0]}
          </span>
        </div>
        <button onClick={handleLogout} style={{
          background: 'transparent',
          color: 'rgba(255,255,255,0.35)',
          border: 'none', padding: '6px 4px',
          fontSize: '12px', fontWeight: 500,
          fontFamily: FONTS.body, cursor: 'pointer',
        }}>Sign Out</button>
      </div>
    </nav>
  )
}