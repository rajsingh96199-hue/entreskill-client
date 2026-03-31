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
    <div style={{ minHeight: '100vh', fontFamily: FONTS.body, background: COLORS.navy900 }}>

      {/* Hero Section */}
      <div style={{
        minHeight: '100vh',
        background: `radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 60%),
                     radial-gradient(ellipse at 80% 20%, rgba(44,79,124,0.3) 0%, transparent 50%),
                     linear-gradient(180deg, ${COLORS.navy900} 0%, #0D1F3C 100%)`,
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Navbar */}
        <nav style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '0 60px', height: '72px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(10,22,40,0.8)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 800, color: COLORS.navy900
            }}>E</div>
            <span style={{ fontFamily: FONTS.display, fontSize: 20, color: COLORS.white, fontWeight: 700 }}>
              EntreSkill
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.gold500, letterSpacing: 2, textTransform: 'uppercase' }}>
              HUB
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('/login')} style={{
              background: 'transparent', color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8, padding: '9px 22px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: FONTS.body,
            }}>Sign In</button>
            <button onClick={() => navigate('/register')} style={{
              background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
              color: COLORS.navy900, border: 'none',
              borderRadius: 8, padding: '9px 22px',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: FONTS.body, boxShadow: SHADOWS.gold,
            }}>Get Started Free</button>
          </div>
        </nav>

        {/* Hero Content */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '80px 60px',
          maxWidth: 1200, margin: '0 auto', width: '100%',
          gap: 80,
        }}>
          {/* Left */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 100, padding: '6px 16px',
              marginBottom: 28,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.gold500, display: 'inline-block' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.gold400, letterSpacing: 1, textTransform: 'uppercase' }}>
                Skill-to-Startup Platform
              </span>
            </div>

            <h1 style={{
              fontFamily: FONTS.display,
              fontSize: '56px', lineHeight: 1.1,
              fontWeight: 800, color: COLORS.white,
              marginBottom: 24,
            }}>
              Turn Your Skills Into a{' '}
              <span style={{
                background: `linear-gradient(135deg, ${COLORS.gold400}, ${COLORS.gold500})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Thriving Business</span>
            </h1>

            <p style={{
              fontSize: 18, color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.8, marginBottom: 40, maxWidth: 480,
            }}>
              Discover personalised business ideas, follow structured roadmaps,
              access expert resources, and connect with mentors who've built it before.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 52, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')} style={{
                background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
                color: COLORS.navy900, border: 'none',
                borderRadius: 10, padding: '15px 36px',
                fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: FONTS.body,
                boxShadow: SHADOWS.gold,
              }}>Start For Free →</button>
              <button onClick={() => navigate('/ideas')} style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10, padding: '15px 36px',
                fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: FONTS.body,
              }}>Explore Ideas</button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 40 }}>
              {[
                { value: '500+', label: 'Entrepreneurs' },
                { value: '50+', label: 'Business Ideas' },
                { value: '100+', label: 'Expert Mentors' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{
                    fontFamily: FONTS.display,
                    fontSize: 28, fontWeight: 700,
                    color: COLORS.white,
                  }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Feature Cards */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '🎯', title: 'Personalised Matching', desc: 'AI-powered recommendations based on your unique skills and interests', tag: 'Smart' },
              { icon: '🗺️', title: 'Step-by-Step Roadmaps', desc: 'Structured 6-step guides from idea validation to launch', tag: 'Guided' },
              { icon: '👥', title: 'Expert Mentorship', desc: 'Connect with verified entrepreneurs who have done it before', tag: 'Verified' },
              { icon: '📚', title: 'Learning Resources', desc: 'Curated videos, articles and checklists for every stage', tag: 'Free' },
            ].map((f, i) => (
              <div key={f.title} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '18px 20px',
                display: 'flex', alignItems: 'center', gap: 16,
                backdropFilter: 'blur(8px)',
                transform: i % 2 === 1 ? 'translateX(20px)' : 'none',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: `rgba(201,168,76,0.12)`,
                  border: '1px solid rgba(201,168,76,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>{f.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.white, marginBottom: 3 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 1,
                  color: COLORS.gold500, textTransform: 'uppercase',
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: 100, padding: '3px 10px',
                }}>{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div style={{ background: COLORS.white, padding: '100px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.gold500, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              How It Works
            </p>
            <h2 style={{
              fontFamily: FONTS.display, fontSize: 40,
              fontWeight: 800, color: COLORS.navy900, marginBottom: 16,
            }}>From Skill to Success in 4 Steps</h2>
            <p style={{ fontSize: 16, color: COLORS.gray500, maxWidth: 480, margin: '0 auto' }}>
              Our structured approach takes you from idea discovery to business launch.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { step: '01', icon: '✨', title: 'Profile Your Skills', desc: 'Tell us your skills, interests and experience level in 2 minutes' },
              { step: '02', icon: '💡', title: 'Discover Ideas', desc: 'Get personalised business ideas matched to your unique profile' },
              { step: '03', icon: '🗺️', title: 'Follow Roadmap', desc: 'Execute your plan with step-by-step guidance and tasks' },
              { step: '04', icon: '🚀', title: 'Launch & Grow', desc: 'Connect with mentors and resources to scale your business' },
            ].map((s, i) => (
              <div key={s.step} style={{
                padding: '28px 24px',
                borderRadius: 16,
                border: `1px solid ${COLORS.gray200}`,
                background: COLORS.white,
                position: 'relative',
                boxShadow: SHADOWS.sm,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 800,
                  color: COLORS.gold500, letterSpacing: 2,
                  marginBottom: 16, fontFamily: FONTS.mono,
                }}>{s.step}</div>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy900, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: COLORS.gray500, lineHeight: 1.6 }}>{s.desc}</p>
                {i < 3 && (
                  <div style={{
                    position: 'absolute', right: -13, top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 18, color: COLORS.gray300, zIndex: 1,
                  }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.navy900}, #0D1F3C)`,
        padding: '100px 60px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: FONTS.display, fontSize: 42,
            fontWeight: 800, color: COLORS.white,
            marginBottom: 16,
          }}>Ready to Start Your Journey?</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 36, lineHeight: 1.7 }}>
            Join hundreds of entrepreneurs who turned their skills into successful businesses.
          </p>
          <button onClick={() => navigate('/register')} style={{
            background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
            color: COLORS.navy900, border: 'none',
            borderRadius: 12, padding: '16px 48px',
            fontSize: 16, fontWeight: 700,
            cursor: 'pointer', fontFamily: FONTS.body,
            boxShadow: SHADOWS.gold,
          }}>Create Free Account →</button>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: COLORS.navy900,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 60px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: COLORS.navy900,
          }}>E</div>
          <span style={{ fontFamily: FONTS.display, fontSize: 15, color: COLORS.white, fontWeight: 700 }}>
            EntreSkill Hub
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          © 2025 EntreSkill Hub. Empowering Entrepreneurs.
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Ideas', 'Resources', 'Mentors'].map(l => (
            <span key={l} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}