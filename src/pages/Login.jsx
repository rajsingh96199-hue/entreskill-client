import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { COLORS, FONTS, SHADOWS, INPUT, LABEL } from '../styles/theme'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('All fields are required!'); return }
    setLoading(true); setError('')
    const result = await login(form.email, form.password)
    if (result.success) { navigate('/dashboard') } else { setError(result.message) }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', fontFamily: FONTS.body,
      display: 'flex', background: COLORS.gray50,
    }}>

      {/* Left Panel */}
      <div style={{
        flex: 1, background: `linear-gradient(145deg, ${COLORS.navy900} 0%, #0D1F3C 100%)`,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: 'rgba(201,168,76,0.05)',
          border: '1px solid rgba(201,168,76,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 240, height: 240, borderRadius: '50%',
          background: 'rgba(44,79,124,0.15)',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 800, color: COLORS.navy900,
          }}>E</div>
          <span style={{ fontFamily: FONTS.display, fontSize: 20, color: COLORS.white, fontWeight: 700 }}>EntreSkill</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.gold500, letterSpacing: 2, textTransform: 'uppercase' }}>HUB</span>
        </div>

        <h2 style={{
          fontFamily: FONTS.display, fontSize: 38,
          fontWeight: 800, color: COLORS.white,
          lineHeight: 1.15, marginBottom: 16,
        }}>
          Welcome back to your{' '}
          <span style={{ color: COLORS.gold400 }}>entrepreneurship journey</span>
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 48, maxWidth: 380 }}>
          Pick up right where you left off. Your roadmaps, ideas, and mentor connections are waiting.
        </p>

        {/* Testimonial */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding: '20px 24px',
          maxWidth: 400,
        }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 14, fontStyle: 'italic' }}>
            "EntreSkill Hub helped me validate my bakery idea and launch within 3 months. The roadmap was a game changer!"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: COLORS.navy900,
            }}>P</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.white }}>Priya Sharma</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Home Bakery Owner, Mumbai</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{
        width: 480, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 56px',
        background: COLORS.white,
        boxShadow: '-20px 0 60px rgba(10,22,40,0.08)',
      }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{
            fontFamily: FONTS.display, fontSize: 30,
            fontWeight: 800, color: COLORS.navy900, marginBottom: 8,
          }}>Sign In</h1>
          <p style={{ fontSize: 14, color: COLORS.gray500 }}>
            Don't have an account?{' '}
            <span onClick={() => navigate('/register')} style={{
              color: COLORS.gold500, fontWeight: 700, cursor: 'pointer',
            }}>Create one free</span>
          </p>
        </div>

        {error && (
          <div style={{
            background: COLORS.dangerLight, color: COLORS.danger,
            borderRadius: 10, padding: '12px 16px',
            fontSize: 13, marginBottom: 20,
            border: `1px solid ${COLORS.danger}30`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={LABEL}>Email Address</label>
            <input
              type="email" name="email"
              placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              style={{ ...INPUT, fontFamily: FONTS.body }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={LABEL}>Password</label>
            <input
              type="password" name="password"
              placeholder="Enter your password"
              value={form.password} onChange={handleChange}
              style={{ ...INPUT, fontFamily: FONTS.body }}
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: 28 }}>
            <span style={{ fontSize: 12, color: COLORS.gold500, fontWeight: 600, cursor: 'pointer' }}>
              Forgot password?
            </span>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? COLORS.gray300 : `linear-gradient(135deg, ${COLORS.navy700}, ${COLORS.navy900})`,
            color: COLORS.white, border: 'none',
            borderRadius: 10, fontSize: 15,
            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: FONTS.body, letterSpacing: '0.3px',
            boxShadow: loading ? 'none' : SHADOWS.md,
            marginBottom: 16,
          }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: COLORS.gray200 }} />
            <span style={{ fontSize: 12, color: COLORS.gray400 }}>or</span>
            <div style={{ flex: 1, height: 1, background: COLORS.gray200 }} />
          </div>

          <button type="button" onClick={() => navigate('/register')} style={{
            width: '100%', padding: '13px',
            background: COLORS.navy50,
            color: COLORS.navy700,
            border: `1.5px solid ${COLORS.navy100}`,
            borderRadius: 10, fontSize: 14,
            fontWeight: 600, cursor: 'pointer',
            fontFamily: FONTS.body,
          }}>
            Create New Account
          </button>
        </form>
      </div>
    </div>
  )
}