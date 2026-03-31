import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { COLORS, FONTS, SHADOWS, INPUT, LABEL } from '../styles/theme'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('All fields are required!'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters!'); return }
    setLoading(true); setError('')
    const result = await register(form.name, form.email, form.password)
    if (result.success) { navigate('/onboarding') } else { setError(result.message) }
    setLoading(false)
  }

  const features = [
    { icon: '🎯', text: 'Personalised business idea matching' },
    { icon: '🗺️', text: 'Step-by-step startup roadmaps' },
    { icon: '👥', text: 'Access to verified mentors' },
    { icon: '📚', text: 'Free learning resources library' },
  ]

  return (
    <div style={{
      minHeight: '100vh', fontFamily: FONTS.body,
      display: 'flex', background: COLORS.gray50,
    }}>

      {/* Left Panel — Form */}
      <div style={{
        width: 520, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 56px',
        background: COLORS.white,
        boxShadow: '20px 0 60px rgba(10,22,40,0.08)',
      }}>

        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 44, cursor: 'pointer' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 800, color: COLORS.navy900,
          }}>E</div>
          <span style={{ fontFamily: FONTS.display, fontSize: 18, color: COLORS.navy900, fontWeight: 700 }}>EntreSkill Hub</span>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: FONTS.display, fontSize: 30,
            fontWeight: 800, color: COLORS.navy900, marginBottom: 8,
          }}>Create Your Account</h1>
          <p style={{ fontSize: 14, color: COLORS.gray500 }}>
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} style={{
              color: COLORS.gold500, fontWeight: 700, cursor: 'pointer',
            }}>Sign in</span>
          </p>
        </div>

        {error && (
          <div style={{
            background: COLORS.dangerLight, color: COLORS.danger,
            borderRadius: 10, padding: '12px 16px',
            fontSize: 13, marginBottom: 20,
            border: `1px solid ${COLORS.danger}30`,
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={LABEL}>Full Name</label>
            <input
              type="text" name="name"
              placeholder="e.g. Raj Sharma"
              value={form.name} onChange={handleChange}
              style={{ ...INPUT, fontFamily: FONTS.body }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={LABEL}>Email Address</label>
            <input
              type="email" name="email"
              placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              style={{ ...INPUT, fontFamily: FONTS.body }}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={LABEL}>Password</label>
            <input
              type="password" name="password"
              placeholder="Min. 6 characters"
              value={form.password} onChange={handleChange}
              style={{ ...INPUT, fontFamily: FONTS.body }}
            />
            {/* Password strength */}
            {form.password.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 2,
                    background: form.password.length >= i * 3
                      ? i <= 1 ? COLORS.danger
                        : i <= 2 ? COLORS.warning
                        : i <= 3 ? COLORS.gold500
                        : COLORS.success
                      : COLORS.gray200,
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? COLORS.gray300 : `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
            color: loading ? COLORS.gray500 : COLORS.navy900,
            border: 'none', borderRadius: 10, fontSize: 15,
            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: FONTS.body, letterSpacing: '0.3px',
            boxShadow: loading ? 'none' : SHADOWS.gold,
            marginBottom: 16,
          }}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>

          <p style={{ fontSize: 11, color: COLORS.gray400, textAlign: 'center', lineHeight: 1.6 }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1,
        background: `linear-gradient(145deg, ${COLORS.navy900} 0%, #0D1F3C 100%)`,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Decorations */}
        <div style={{
          position: 'absolute', top: -100, right: -100,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(201,168,76,0.04)',
          border: '1px solid rgba(201,168,76,0.06)',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(44,79,124,0.12)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.gold500, display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold400, letterSpacing: 1, textTransform: 'uppercase' }}>
              Free Forever
            </span>
          </div>

          <h2 style={{
            fontFamily: FONTS.display, fontSize: 38,
            fontWeight: 800, color: COLORS.white,
            lineHeight: 1.15, marginBottom: 16,
          }}>
            Everything you need to{' '}
            <span style={{ color: COLORS.gold400 }}>launch your business</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 44, maxWidth: 380 }}>
            Join thousands of aspiring entrepreneurs who discovered their path through EntreSkill Hub.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {features.map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0,
                }}>{f.icon}</div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div style={{
            marginTop: 48, display: 'flex', alignItems: 'center', gap: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '16px 20px',
          }}>
            <div style={{ display: 'flex' }}>
              {['P', 'R', 'A', 'S'].map((l, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: COLORS.navy900,
                  marginLeft: i > 0 ? -8 : 0,
                  border: `2px solid ${COLORS.navy900}`,
                }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.white }}>500+ entrepreneurs</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>already building their dreams</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}