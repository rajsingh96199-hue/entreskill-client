import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
})

const CATEGORIES = [
  'All', 'Food & Beverages', 'Fashion & Apparel',
  'Technology', 'Home Services', 'Education',
  'Health & Wellness', 'Arts & Crafts', 'Digital & Media'
]

const DIFFICULTIES = ['All', 'beginner', 'intermediate', 'expert']

export default function IdeasPage() {
  const navigate = useNavigate()
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const [saving, setSaving] = useState(null)
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    loadIdeas()
  }, [category, difficulty])

  const loadIdeas = async () => {
    setLoading(true)
    try {
      const params = {}
      if (category !== 'All') params.category = category
      if (difficulty !== 'All') params.difficulty = difficulty
      const res = await api.get('/ideas', { params })
      setIdeas(res.data.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const showMsg = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleSave = async (ideaId) => {
    setSaving(ideaId)
    try {
      const res = await api.post(`/ideas/${ideaId}/save`, {}, { headers })
      showMsg(res.data.saved ? '✅ Idea saved!' : '🗑️ Idea removed!')
    } catch (err) {
      showMsg('❌ Please login to save ideas')
    }
    setSaving(null)
  }

  // Filter by search locally
  const filtered = ideas.filter(idea =>
    idea.title.toLowerCase().includes(search.toLowerCase()) ||
    idea.description.toLowerCase().includes(search.toLowerCase()) ||
    idea.requiredSkills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  const difficultyColor = {
    beginner: '#10B981',
    intermediate: '#F59E0B',
    expert: '#EF4444'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAF9', fontFamily: 'sans-serif' }}>

      {/* Toast */}
      {message && (
        <div style={{
          position: 'fixed', top: 80, right: 20,
          background: '#14213D', color: '#fff',
          padding: '12px 20px', borderRadius: 10,
          fontSize: 13, fontWeight: 600, zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>{message}</div>
      )}

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #14213D, #0D7377)',
        padding: '32px 24px 50px', textAlign: 'center', color: '#fff'
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>💡</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Explore Business Ideas
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 15, marginBottom: 24 }}>
          Find the perfect business idea that matches your skills
        </p>

        {/* Search Bar */}
        <div style={{
          maxWidth: 500, margin: '0 auto',
          position: 'relative'
        }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search ideas, skills, categories..."
            style={{
              width: '100%', padding: '14px 20px',
              borderRadius: 12, border: 'none',
              fontSize: 14, outline: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '-24px auto 40px', padding: '0 20px' }}>

        {/* Filters */}
        <div style={{
          background: '#fff', borderRadius: 16,
          padding: '20px', marginBottom: 20,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          {/* Category Filter */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              Category
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)} style={{
                  background: category === c ? '#0D7377' : '#F3F4F6',
                  color: category === c ? '#fff' : '#6B7280',
                  border: 'none', borderRadius: 20,
                  padding: '6px 14px', fontSize: 12,
                  fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              Difficulty
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setDifficulty(d)} style={{
                  background: difficulty === d ? '#14213D' : '#F3F4F6',
                  color: difficulty === d ? '#fff' : '#6B7280',
                  border: 'none', borderRadius: 20,
                  padding: '6px 14px', fontSize: 12,
                  fontWeight: 600, cursor: 'pointer',
                  textTransform: 'capitalize'
                }}>{d}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ color: '#6B7280', fontSize: 13 }}>
            Showing <b>{filtered.length}</b> idea{filtered.length !== 1 ? 's' : ''}
            {search && ` for "${search}"`}
          </p>
          <button onClick={() => {
            setSearch('')
            setCategory('All')
            setDifficulty('All')
          }} style={{
            background: 'transparent', color: '#0D7377',
            border: '1px solid #0D7377', borderRadius: 8,
            padding: '4px 12px', fontSize: 12,
            fontWeight: 600, cursor: 'pointer'
          }}>Clear Filters</button>
        </div>

        {/* Ideas Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
            ⏳ Loading ideas...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontWeight: 700, marginBottom: 8 }}>No ideas found!</p>
            <p style={{ fontSize: 13 }}>Try different search terms or filters</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16
          }}>
            {filtered.map((idea, idx) => (
              <div key={idea._id} style={{
                background: '#fff', borderRadius: 16,
                padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '2px solid transparent',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.border = '2px solid #0D7377'}
                onMouseLeave={e => e.currentTarget.style.border = '2px solid transparent'}
              >
                {/* Idea Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: '#E0F2F1', fontSize: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{idea.icon || '💡'}</div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#14213D', margin: 0 }}>
                      {idea.title}
                    </h3>
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      color: difficultyColor[idea.difficulty],
                      textTransform: 'uppercase', letterSpacing: 0.5
                    }}>{idea.difficulty}</span>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12, lineHeight: 1.6 }}>
                  {idea.description}
                </p>

                {/* Category */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{
                    background: '#E0F2F1', color: '#0D7377',
                    borderRadius: 20, padding: '3px 10px',
                    fontSize: 11, fontWeight: 600
                  }}>{idea.category}</span>
                </div>

                {/* Skills */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {idea.requiredSkills?.map(skill => (
                    <span key={skill} style={{
                      background: '#F3F4F6', color: '#374151',
                      borderRadius: 20, padding: '2px 8px',
                      fontSize: 10, fontWeight: 600
                    }}>🔧 {skill}</span>
                  ))}
                </div>

                {/* Cost */}
                <div style={{
                  fontSize: 12, color: '#6B7280',
                  marginBottom: 14, display: 'flex',
                  alignItems: 'center', gap: 4
                }}>
                  💰 {idea.estimatedCost}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => navigate(`/roadmap/${idea._id}`)}
                    style={{
                      flex: 2, background: '#0D7377', color: '#fff',
                      border: 'none', borderRadius: 8,
                      padding: '10px', fontSize: 12,
                      fontWeight: 700, cursor: 'pointer'
                    }}>
                    View Roadmap →
                  </button>
                  <button
                    onClick={() => handleSave(idea._id)}
                    disabled={saving === idea._id}
                    style={{
                      flex: 1, background: '#F3F4F6', color: '#374151',
                      border: 'none', borderRadius: 8,
                      padding: '10px', fontSize: 12,
                      fontWeight: 700, cursor: 'pointer'
                    }}>
                    {saving === idea._id ? '...' : '🔖 Save'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}