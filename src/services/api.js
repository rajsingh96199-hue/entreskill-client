import axios from 'axios'

// ── Base Axios Instance ───────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})
// ── Request Interceptor ───────────────────────────────────────────────────────
// Automatically attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ──────────────────────────────────────────────────────
// Handle token expiry globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth API Calls ────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
  logout:   ()     => api.post('/auth/logout')
}

// ── Profile API Calls ─────────────────────────────────────────────────────────
export const profileAPI = {
  getProfile:       ()     => api.get('/profile'),
  updateSkills:     (data) => api.put('/profile/skills', data),
  updateInterests:  (data) => api.put('/profile/interests', data),
  updateExperience: (data) => api.put('/profile/experience', data),
  updateProfile:    (data) => api.put('/profile', data)
}

// ── Ideas API Calls ───────────────────────────────────────────────────────────
export const ideasAPI = {
  getAllIdeas:      (params) => api.get('/ideas', { params }),
  getRecommended:  ()       => api.get('/ideas/user/recommended'),
  getSaved:        ()       => api.get('/ideas/user/saved'),
  getIdeaById:     (id)     => api.get(`/ideas/${id}`),
  saveIdea:        (id)     => api.post(`/ideas/${id}/save`)
}

export default api