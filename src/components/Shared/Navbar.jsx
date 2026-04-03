import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { COLORS, FONTS } from '../../styles/theme'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) => location.pathname === path

  const navLinks = isAuthenticated ? [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/ideas', label: 'Ideas' },
    { path: '/resources', label: 'Resources' },
    { path: '/mentors', label: 'Mentors' },
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin' }] : []),
  ] : []

  return (
    <nav style={{
      background: COLORS.navy900,
      padding: '0 40px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>

      {/* Logo */}
      <div
        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <div style={{
          width: 34, height: 34, borderRadius: '8px',
          background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: COLORS.navy900
        }}>E</div>
        <span style={{
          fontFamily: FONTS.display,
          fontSize: '18px', fontWeight: 700,
          color: COLORS.white, letterSpacing: '0.3px'
        }}>EntreSkill</span>
        <span style={{
          fontSize: '11px', fontWeight: 700,
          color: COLORS.gold500, letterSpacing: '2px',
          textTransform: 'uppercase', marginTop: '2px'
        }}>HUB</span>
      </div>

      {/* Nav Links */}
      {isAuthenticated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navLinks.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              background: isActive(item.path)
                ? 'rgba(201,168,76,0.12)'
                : 'transparent',
              color: isActive(item.path) ? COLORS.gold400 : 'rgba(255,255,255,0.65)',
              border: 'none',
              borderBottom: isActive(item.path) ? `2px solid ${COLORS.gold500}` : '2px solid transparent',
              padding: '0 16px',
              height: '64px',
              fontSize: '13px',
              fontWeight: isActive(item.path) ? 700 : 500,
              fontFamily: FONTS.body,
              cursor: 'pointer',
              letterSpacing: '0.3px',
              transition: 'all 0.2s',
            }}>{item.label}</button>
          ))}
        </div>
      )}

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isAuthenticated ? (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '8px', padding: '6px 12px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 800, color: COLORS.navy900
              }}>{user?.name?.[0]?.toUpperCase()}</div>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 500 }}>
                {user?.name?.split(' ')[0]}
              </span>
            </div>
            <button onClick={handleLogout} style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px', padding: '7px 16px',
              fontSize: '12px', fontWeight: 600,
              fontFamily: FONTS.body, cursor: 'pointer',
            }}>Sign Out</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px', padding: '8px 18px',
              fontSize: '13px', fontWeight: 600,
              fontFamily: FONTS.body, cursor: 'pointer',
            }}>Sign In</button>
            <button onClick={() => navigate('/register')} style={{
              background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
              color: COLORS.navy900,
              border: 'none', borderRadius: '8px',
              padding: '8px 18px', fontSize: '13px',
              fontWeight: 700, fontFamily: FONTS.body, cursor: 'pointer',
            }}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  )
}