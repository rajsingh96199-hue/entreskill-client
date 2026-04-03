import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import { COLORS, FONTS, SHADOWS } from '../styles/theme'

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated])

  return (
    <div style={{ minHeight: '100vh', fontFamily: FONTS.body, background: COLORS.navy900, overflow: 'hidden' }}>

      {/* Minimal Navbar — Sign In only */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '0 60px', height: '64px',
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: COLORS.navy900,
          }}>E</div>
          <span style={{ fontFamily: FONTS.display, fontSize: 18, color: COLORS.white, fontWeight: 700 }}>EntreSkill Hub</span>
        </div>
        <button onClick={() => navigate('/login')} style={{
          background: 'transparent', color: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '8px 20px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONTS.body,
        }}>Sign In</button>
      </nav>

      {/* Hero */}
      <div style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse at 15% 60%, rgba(201,168,76,0.07) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 20%, rgba(44,79,124,0.25) 0%, transparent 50%),
          linear-gradient(180deg, ${COLORS.navy900} 0%, #0B1A2E 100%)
        `,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 60px', textAlign: 'center',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.18)',
          borderRadius: 100, padding: '7px 18px', marginBottom: 36,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.gold500, display: 'inline-block' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.gold400, letterSpacing: 0.8 }}>
            For aspiring entrepreneurs in India
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(38px, 6vw, 68px)',
          lineHeight: 1.08, fontWeight: 800,
          color: COLORS.white, marginBottom: 24, maxWidth: 780,
        }}>
          Turn Your Skills Into a{' '}
          <span style={{
            background: `linear-gradient(135deg, ${COLORS.gold400}, ${COLORS.gold500})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Real Business</span>
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: 18, color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.75, marginBottom: 48, maxWidth: 520,
        }}>
          Get personalised business ideas based on your skills and a step-by-step roadmap to launch — in weeks, not years.
        </p>

        {/* ONE Primary CTA */}
        <button onClick={() => navigate('/register')} style={{
          background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
          color: COLORS.navy900, border: 'none',
          borderRadius: 12, padding: '18px 52px',
          fontSize: 17, fontWeight: 800,
          cursor: 'pointer', fontFamily: FONTS.body,
          boxShadow: `0 8px 32px rgba(201,168,76,0.35)`,
          letterSpacing: 0.3, marginBottom: 14, display: 'block',
        }}>Get Started — It's Free →</button>

        {/* Secondary — very subtle */}
        <button onClick={() => navigate('/ideas')} style={{
          background: 'transparent', color: 'rgba(255,255,255,0.3)',
          border: 'none', fontSize: 13, fontWeight: 500,
          cursor: 'pointer', fontFamily: FONTS.body, padding: '6px 16px',
          textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.12)',
        }}>or explore business ideas first</button>

        {/* Social Proof */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 48 }}>
          <div style={{ display: 'flex' }}>
            {['P', 'R', 'A', 'S', 'M'].map((l, i) => (
              <div key={i} style={{
                width: 30, height: 30, borderRadius: '50%',
                background: `linear-gradient(135deg, ${COLORS.navy600}, ${COLORS.navy700})`,
                border: `2px solid ${COLORS.navy900}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color: COLORS.gold400,
                marginLeft: i > 0 ? -8 : 0,
              }}>{l}</div>
            ))}
          </div>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            500+ entrepreneurs already building
          </span>
        </div>

        {/* Real Example Card */}
        <div style={{
          marginTop: 72, maxWidth: 680, width: '100%',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20, padding: '28px 32px', textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold400, letterSpacing: 2, textTransform: 'uppercase' }}>Real Example</span>
            <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
            }}>🍱</div>
            <div>
              <h3 style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: COLORS.white, marginBottom: 4 }}>
                Tiffin Service from Home
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                Start a home-cooked tiffin delivery business with minimal investment.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
            {[
              { icon: '💰', label: 'Startup Cost', value: '₹5,000–₹15,000' },
              { icon: '📅', label: 'Launch In', value: '3–4 weeks' },
              { icon: '📈', label: 'Monthly Income', value: '₹20,000–₹50,000' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, padding: '12px 14px',
              }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.white }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Your Roadmap</div>
            {[
              { week: 'Week 1', task: 'Talk to 10 potential customers. Validate demand in your area.' },
              { week: 'Week 2', task: 'Buy equipment (₹3,000). Register FSSAI license (₹100). Set menu.' },
              { week: 'Week 3', task: 'Start with 5 trial customers. Get feedback. Refine portions & pricing.' },
              { week: 'Week 4', task: 'Launch on WhatsApp & local groups. Target 20 daily tiffins.' },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, paddingBottom: 12,
                borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                marginBottom: i < 3 ? 12 : 0,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold500, minWidth: 50, fontFamily: FONTS.mono }}>{s.week}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{s.task}</span>
              </div>
            ))}
          </div>

          <button onClick={() => navigate('/register')} style={{
            width: '100%', padding: '12px',
            background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
            color: COLORS.navy900, border: 'none', borderRadius: 10,
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body,
            boxShadow: SHADOWS.gold,
          }}>Get Your Personalised Roadmap →</button>
        </div>

        {/* How it works */}
        <div style={{ marginTop: 80, maxWidth: 680, width: '100%' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 32 }}>
            How it works
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { num: '01', title: 'Add Your Skills', desc: 'Tell us what you can do' },
              { num: '02', title: 'Get Matched', desc: 'See ideas built for you' },
              { num: '03', title: 'Follow Roadmap', desc: 'Execute step by step' },
              { num: '04', title: 'Launch', desc: 'Start making money' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.gold500, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>{s.num}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.white, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 80 }}>
          <button onClick={() => navigate('/register')} style={{
            background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
            color: COLORS.navy900, border: 'none',
            borderRadius: 12, padding: '16px 44px',
            fontSize: 16, fontWeight: 800,
            cursor: 'pointer', fontFamily: FONTS.body,
            boxShadow: `0 8px 32px rgba(201,168,76,0.3)`,
          }}>Start Building Your Business →</button>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', marginTop: 12 }}>
            Free forever • No credit card required
          </p>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 72, paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          width: '100%', maxWidth: 680,
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontFamily: FONTS.display, fontSize: 14, color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>EntreSkill Hub</span>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>© 2025 EntreSkill Hub. Empowering Indian Entrepreneurs.</p>
        </div>
      </div>
    </div>
  )
}