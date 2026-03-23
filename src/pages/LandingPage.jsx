import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  // If already logged in → go to dashboard
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #14213D 0%, #0D7377 100%)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontFamily: 'sans-serif',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', color: '#fff', maxWidth: 600 }}>

        {/* Logo */}
        <div style={{ fontSize: 64, marginBottom: 16 }}>🌱</div>

        {/* Title */}
        <h1 style={{
          fontSize: 42, fontWeight: 800,
          marginBottom: 12, lineHeight: 1.2
        }}>
          Turn Your Skill Into a
          <span style={{ color: '#F4A261' }}> Business</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 16, color: '#94A3B8',
          marginBottom: 36, lineHeight: 1.8
        }}>
          Discover business ideas matched to your skills,
          get step-by-step roadmaps, and connect with mentors
          who've been there.
        </p>

        {/* Features */}
        <div style={{
          display: 'flex', gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: 40
        }}>
          {[
            '🎯 Personalised Ideas',
            '🗺️ Business Roadmaps',
            '👥 Mentor Support'
          ].map(f => (
            <div key={f} style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 20, padding: '8px 18px',
              fontSize: 13, fontWeight: 600
            }}>{f}</div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 32,
          justifyContent: 'center', marginBottom: 40
        }}>
          {[
            { value: '500+', label: 'Entrepreneurs' },
            { value: '50+', label: 'Business Ideas' },
            { value: '100+', label: 'Mentors' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#F4A261' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: '#F4A261', color: '#fff',
              border: 'none', borderRadius: 12,
              padding: '14px 36px', fontSize: 16,
              fontWeight: 700, cursor: 'pointer'
            }}>
            Get Started Free →
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent', color: '#fff',
              border: '2px solid rgba(255,255,255,0.4)',
              borderRadius: 12, padding: '14px 36px',
              fontSize: 16, fontWeight: 700, cursor: 'pointer'
            }}>
               💡 Explore Ideas
  </button>
  <button
    onClick={() => navigate('/login')}
    style={{
      background: 'transparent', color: '#fff',
      border: '2px solid rgba(255,255,255,0.4)',
      borderRadius: 12, padding: '14px 36px',
      fontSize: 16, fontWeight: 700, cursor: 'pointer'
    }}>
            Login
          </button>
        </div>

      </div>
    </div>
  )
}