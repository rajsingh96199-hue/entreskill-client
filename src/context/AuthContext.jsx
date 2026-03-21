import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

// ── Create Context ────────────────────────────────────────────────────────────
const AuthContext = createContext()

// ── Auth Provider ─────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // ── Register ────────────────────────────────────────────────────────────────
  const register = async (name, email, password) => {
    try {
      setError(null)
      const res = await authAPI.register({ name, email, password })
      const { token, ...userData } = res.data.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      setError(message)
      return { success: false, message }
    }
  }

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      setError(null)
      const res = await authAPI.login({ email, password })
      const { token, ...userData } = res.data.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      return { success: false, message }
    }
  }

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  // ── Update User in State ────────────────────────────────────────────────────
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData }
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      register,
      login,
      logout,
      updateUser,
      isAuthenticated: !!user
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// ── Custom Hook ───────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext