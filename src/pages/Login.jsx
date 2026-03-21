import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('All fields are required!')
      return
    }

    setLoading(true)
    setError('')

    const result = await login(form.email, form.password)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #14213D 0%, #0D7377 100%)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: '#fff', borderRadius: 20,
        padding: '40px 36px', width: '100%',
        maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>👋</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#14213D', marginBottom: 6 }}>
            Welcome Back
          </h2>
          <p style={{ color: '#6B7280', fontSize: 14 }}>
            Login to continue your journey
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#FEE2E2', color: '#B91C1C',
            borderRadius: 10, padding: '10px 14px',
            fontSize: 13, marginBottom: 16,
            border: '1px solid #FECACA'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block', fontSize: 13,
              fontWeight: 600, color: '#14213D', marginBottom: 6
            }}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. raj@email.com"
              value={form.email}
              onChange={handleChange}
              style={{
                width: '100%', padding: '12px 14px',
                borderRadius: 10, fontSize: 14,
                border: '2px solid #E5E7EB',
                outline: 'none', color: '#14213D',
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 10 }}>
            <label style={{
              display: 'block', fontSize: 13,
              fontWeight: 600, color: '#14213D', marginBottom: 6
            }}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              style={{
                width: '100%', padding: '12px 14px',
                borderRadius: 10, fontSize: 14,
                border: '2px solid #E5E7EB',
                outline: 'none', color: '#14213D',
              }}
            />
          </div>

          {/* Forgot Password */}
          <div style={{ textAlign: 'right', marginBottom: 24 }}>
            <span style={{
              fontSize: 12, color: '#0D7377',
              fontWeight: 600, cursor: 'pointer'
            }}>Forgot Password?</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? '#9CA3AF' : '#0D7377',
              color: '#fff', border: 'none',
              borderRadius: 12, fontSize: 16,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: 16
            }}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 10, marginBottom: 16
          }}>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          </div>

          {/* Register Link */}
          <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280' }}>
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              style={{ color: '#0D7377', fontWeight: 700, cursor: 'pointer' }}>
              Register here
            </span>
          </p>

        </form>
      </div>
    </div>
  )
}