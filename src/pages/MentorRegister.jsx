import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
})

const EXPERTISE_OPTIONS = [
  'Food & Beverages', 'Fashion & Apparel', 'Technology',
  'Home Services', 'Education', 'Health & Wellness',
  'Arts & Crafts', 'Digital & Media', 'Marketing',
  'Finance', 'Operations', 'E-commerce'
]

export default function MentorRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    bio: '', experience: '', sessionPrice: 0,
    languages: 'English', avatar: '👤', linkedIn: ''
  })
  const [expertise, setExpertise] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const token = localStorage.getItem('token')

  const toggleExpertise = (item) => {
    setExpertise(prev =>
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.bio || !form.experience || expertise.length === 0) {
      setError('Please fill all required fields and select at least one expertise!')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.post('/mentors/register', {
        ...form,
        expertise,
        languages: form.languages.split(',').map(l => l.trim()),
        sessionPrice: Number(form.sessionPrice)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #14213D, #0D7377)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: 'sans-serif'
      }}>
        <div style={{
          background: '#fff', borderRadius: 20,
          padding: '40px', maxWidth: 480,
          width: '100%', textAlign: 'center'
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#14213D', marginBottom: 12 }}>
            Application Submitted!
          </h2>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>
            Your mentor application is under review. We'll notify you once verified!
          </p>
          <button onClick={() => navigate('/dashboard')} style={{
            background: '#0D7377', color: '#fff',
            border: 'none', borderRadius: 10,
            padding: '12px 28px', fontSize: 14,
            fontWeight: 700, cursor: 'pointer'
          }}>Go to Dashboard →</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #14213D, #0D7377)',
      fontFamily: 'sans-serif', padding: '30px 20px'
    }}>
      <div style={{
        maxWidth: 600, margin: '0 auto',
        background: '#fff', borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #14213D, #0D7377)',
          padding: '28px 32px', color: '#fff'
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎓</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            Become a Mentor
          </h2>
          <p style={{ color: '#94A3B8', fontSize: 14 }}>
            Share your expertise and help aspiring entrepreneurs succeed.
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '32px' }}>

          {error && (
            <div style={{
              background: '#FEE2E2', color: '#B91C1C',
              borderRadius: 10, padding: '10px 14px',
              fontSize: 13, marginBottom: 16,
              border: '1px solid #FECACA'
            }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Avatar */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#14213D', marginBottom: 8 }}>
                Choose Avatar
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['👨‍💼', '👩‍💼', '👨‍🍳', '👩‍🍳', '👨‍🏫', '👩‍🏫', '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨'].map(a => (
                  <div key={a} onClick={() => setForm({ ...form, avatar: a })} style={{
                    fontSize: 28, cursor: 'pointer',
                    padding: '8px', borderRadius: 10,
                    border: `2px solid ${form.avatar === a ? '#0D7377' : '#E5E7EB'}`,
                    background: form.avatar === a ? '#E0F2F1' : '#fff'
                  }}>{a}</div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>
                Bio * <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(max 500 chars)</span>
              </label>
              <textarea
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell us about your entrepreneurship journey..."
                required rows={4} maxLength={500}
                style={{
                  width: '100%', padding: '12px 14px',
                  borderRadius: 10, border: '2px solid #E5E7EB',
                  fontSize: 13, outline: 'none', resize: 'vertical'
                }}
              />
              <div style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'right' }}>
                {form.bio.length}/500
              </div>
            </div>

            {/* Expertise */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#14213D', marginBottom: 8 }}>
                Areas of Expertise * <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(select all that apply)</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {EXPERTISE_OPTIONS.map(item => (
                  <div key={item} onClick={() => toggleExpertise(item)} style={{
                    padding: '6px 14px', borderRadius: 20,
                    border: `2px solid ${expertise.includes(item) ? '#0D7377' : '#E5E7EB'}`,
                    background: expertise.includes(item) ? '#E0F2F1' : '#fff',
                    color: expertise.includes(item) ? '#0D7377' : '#6B7280',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer'
                  }}>{item}</div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

              {/* Experience */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>
                  Years of Experience *
                </label>
                <input
                  value={form.experience}
                  onChange={e => setForm({ ...form, experience: e.target.value })}
                  placeholder="e.g. 5 years"
                  required
                  style={{
                    width: '100%', padding: '12px 14px',
                    borderRadius: 10, border: '2px solid #E5E7EB',
                    fontSize: 13, outline: 'none'
                  }}
                />
              </div>

              {/* Session Price */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>
                  Session Price (₹)
                </label>
                <input
                  type="number"
                  value={form.sessionPrice}
                  onChange={e => setForm({ ...form, sessionPrice: e.target.value })}
                  placeholder="0 for free"
                  min={0}
                  style={{
                    width: '100%', padding: '12px 14px',
                    borderRadius: 10, border: '2px solid #E5E7EB',
                    fontSize: 13, outline: 'none'
                  }}
                />
              </div>

              {/* Languages */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>
                  Languages
                </label>
                <input
                  value={form.languages}
                  onChange={e => setForm({ ...form, languages: e.target.value })}
                  placeholder="e.g. English, Hindi"
                  style={{
                    width: '100%', padding: '12px 14px',
                    borderRadius: 10, border: '2px solid #E5E7EB',
                    fontSize: 13, outline: 'none'
                  }}
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>
                  LinkedIn URL
                </label>
                <input
                  value={form.linkedIn}
                  onChange={e => setForm({ ...form, linkedIn: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  style={{
                    width: '100%', padding: '12px 14px',
                    borderRadius: 10, border: '2px solid #E5E7EB',
                    fontSize: 13, outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? '#9CA3AF' : '#0D7377',
              color: '#fff', border: 'none',
              borderRadius: 12, fontSize: 16,
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? 'Submitting...' : 'Submit Application →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 12 }}>
              Your application will be reviewed by our team before going live.
            </p>

          </form>
        </div>
      </div>
    </div>
  )
}