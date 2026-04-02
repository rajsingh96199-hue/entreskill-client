import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COLORS, FONTS, SHADOWS, CARD } from '../styles/theme'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1' })

const EXPERTISE_OPTIONS = [
  'Food & Beverages', 'Fashion & Apparel', 'Technology',
  'Home Services', 'Education', 'Health & Wellness',
  'Arts & Crafts', 'Digital & Media', 'Marketing',
  'Finance', 'Operations', 'E-commerce'
]

const AVATARS = ['👨‍💼', '👩‍💼', '👨‍🍳', '👩‍🍳', '👨‍🏫', '👩‍🏫', '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨']

export default function MentorRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ bio: '', experience: '', sessionPrice: 0, languages: 'English', avatar: '👨‍💼', linkedIn: '' })
  const [expertise, setExpertise] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const token = localStorage.getItem('token')

  const toggleExpertise = (item) =>
    setExpertise(prev => prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.bio || !form.experience || expertise.length === 0) {
      setError('Please fill all required fields and select at least one expertise!')
      return
    }
    setLoading(true); setError('')
    try {
      await api.post('/mentors/register', {
        ...form,
        expertise,
        languages: form.languages.split(',').map(l => l.trim()),
        sessionPrice: Number(form.sessionPrice)
      }, { headers: { Authorization: `Bearer ${token}` } })
      setSuccess(true)
    } catch (err) { setError(err.response?.data?.message || 'Registration failed') }
    setLoading(false)
  }

  if (success) return (
    <div style={{
      minHeight: '100vh', fontFamily: FONTS.body,
      background: `linear-gradient(145deg, ${COLORS.navy900}, #0D1F3C)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ background: COLORS.white, borderRadius: 24, padding: '48px 40px', maxWidth: 460, width: '100%', textAlign: 'center', boxShadow: '0 32px 80px rgba(10,22,40,0.4)' }}>
        <div style={{ width: 72, height: 72, borderRadius: 18, background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 24px', boxShadow: SHADOWS.gold }}>🎉</div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 800, color: COLORS.navy900, marginBottom: 12 }}>Application Submitted!</h2>
        <p style={{ color: COLORS.gray500, fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
          Your mentor application is under review. Our team will verify your profile and notify you once approved.
        </p>
        <button onClick={() => navigate('/dashboard')} style={{
          background: `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`,
          color: COLORS.white, border: 'none', borderRadius: 10,
          padding: '13px 32px', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', fontFamily: FONTS.body,
        }}>Go to Dashboard →</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: COLORS.gray50, fontFamily: FONTS.body }}>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.navy900}, ${COLORS.navy700})`,
        padding: '48px 60px 80px',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold400, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Become a Mentor</p>
          <h1 style={{ fontFamily: FONTS.display, fontSize: 38, fontWeight: 800, color: COLORS.white, marginBottom: 12 }}>
            Share Your Expertise
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 480 }}>
            Help aspiring entrepreneurs start and grow their businesses by sharing your experience and knowledge.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '-32px auto 48px', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* Form */}
          <div style={{ ...CARD }}>
            {error && (
              <div style={{ background: '#FEE2E2', color: COLORS.danger, borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 20, border: '1px solid #FECACA' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Avatar */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                  Choose Your Avatar
                </label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {AVATARS.map(a => (
                    <div key={a} onClick={() => setForm({ ...form, avatar: a })} style={{
                      fontSize: 26, cursor: 'pointer',
                      width: 48, height: 48, borderRadius: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `2px solid ${form.avatar === a ? COLORS.gold500 : COLORS.gray200}`,
                      background: form.avatar === a ? COLORS.gold50 : COLORS.white,
                      boxShadow: form.avatar === a ? SHADOWS.gold : SHADOWS.xs,
                      transition: 'all 0.2s',
                    }}>{a}</div>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                  Bio * <span style={{ color: COLORS.gray300, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>max 500 chars</span>
                </label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell us about your entrepreneurship journey and how you can help others..."
                  required rows={4} maxLength={500}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${COLORS.gray200}`, fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: FONTS.body }}
                />
                <div style={{ fontSize: 11, color: COLORS.gray400, textAlign: 'right', marginTop: 4 }}>{form.bio.length}/500</div>
              </div>

              {/* Expertise */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                  Areas of Expertise * <span style={{ color: COLORS.gray300, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>select all that apply</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {EXPERTISE_OPTIONS.map(item => (
                    <button key={item} type="button" onClick={() => toggleExpertise(item)} style={{
                      padding: '7px 16px', borderRadius: 100,
                      border: `1.5px solid ${expertise.includes(item) ? COLORS.gold500 : COLORS.gray200}`,
                      background: expertise.includes(item) ? COLORS.gold50 : COLORS.white,
                      color: expertise.includes(item) ? COLORS.gold600 : COLORS.gray600,
                      fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONTS.body,
                      boxShadow: expertise.includes(item) ? SHADOWS.gold : 'none',
                    }}>{item}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                {[
                  { label: 'Years of Experience *', key: 'experience', placeholder: 'e.g. 5 years', type: 'text' },
                  { label: 'Session Price (₹)', key: 'sessionPrice', placeholder: '0 for free', type: 'number' },
                  { label: 'Languages', key: 'languages', placeholder: 'e.g. English, Hindi', type: 'text' },
                  { label: 'LinkedIn URL', key: 'linkedIn', placeholder: 'https://linkedin.com/in/...', type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      required={f.key === 'experience'}
                      min={f.key === 'sessionPrice' ? 0 : undefined}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: `1.5px solid ${COLORS.gray200}`, fontSize: 13, outline: 'none', fontFamily: FONTS.body }}
                    />
                  </div>
                ))}
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px',
                background: loading ? COLORS.gray200 : `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
                color: loading ? COLORS.gray400 : COLORS.navy900,
                border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: FONTS.body,
                boxShadow: loading ? 'none' : SHADOWS.gold,
              }}>{loading ? 'Submitting...' : 'Submit Application →'}</button>

              <p style={{ textAlign: 'center', fontSize: 11, color: COLORS.gray400, marginTop: 12 }}>
                Your application will be reviewed by our team before going live.
              </p>
            </form>
          </div>

          {/* Side Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Benefits */}
            <div style={{ ...CARD, borderTop: `3px solid ${COLORS.gold500}` }}>
              <h3 style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: COLORS.navy900, marginBottom: 16 }}>
                Why Become a Mentor?
              </h3>
              {[
                { icon: '💰', title: 'Earn Income', desc: 'Set your own session rates and earn from your expertise' },
                { icon: '🌍', title: 'Make Impact', desc: 'Help entrepreneurs succeed and build sustainable businesses' },
                { icon: '🏆', title: 'Build Reputation', desc: 'Get verified badge and grow your professional brand' },
                { icon: '📅', title: 'Flexible Schedule', desc: 'Mentor on your own time and at your own pace' },
              ].map(b => (
                <div key={b.title} style={{ display: 'flex', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${COLORS.gray100}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: COLORS.gold50, border: `1px solid ${COLORS.gold200}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{b.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.navy900, marginBottom: 2 }}>{b.title}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray500, lineHeight: 1.5 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ ...CARD, background: `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`, border: 'none' }}>
              <h3 style={{ fontFamily: FONTS.display, fontSize: 14, fontWeight: 700, color: COLORS.white, marginBottom: 16 }}>
                Our Mentor Community
              </h3>
              {[
                { value: '4.8★', label: 'Average Rating' },
                { value: '500+', label: 'Sessions Completed' },
                { value: '₹400', label: 'Avg Session Rate' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.gold400, fontFamily: FONTS.display }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}