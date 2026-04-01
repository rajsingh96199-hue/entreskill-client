import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COLORS, FONTS, SHADOWS, CARD } from '../styles/theme'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1' })

const CATEGORIES = ['All', 'Food & Beverages', 'Fashion & Apparel', 'Technology', 'Home Services', 'Education', 'Health & Wellness', 'Arts & Crafts', 'Digital & Media']
const DIFFICULTIES = ['All', 'beginner', 'intermediate', 'expert']
const DIFF_COLORS = { beginner: '#059669', intermediate: '#D97706', expert: '#DC2626' }

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

  useEffect(() => { loadIdeas() }, [category, difficulty])

  const loadIdeas = async () => {
    setLoading(true)
    try {
      const params = {}
      if (category !== 'All') params.category = category
      if (difficulty !== 'All') params.difficulty = difficulty
      const res = await api.get('/ideas', { params })
      setIdeas(res.data.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000) }

  const handleSave = async (ideaId) => {
    if (!token) { navigate('/login'); return }
    setSaving(ideaId)
    try {
      const res = await api.post(`/ideas/${ideaId}/save`, {}, { headers })
      showMsg(res.data.saved ? '✅ Idea saved!' : '🗑️ Idea removed!')
    } catch (err) { showMsg('❌ Failed to save') }
    setSaving(null)
  }

  const filtered = ideas.filter(idea =>
    idea.title.toLowerCase().includes(search.toLowerCase()) ||
    idea.description.toLowerCase().includes(search.toLowerCase()) ||
    idea.requiredSkills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ minHeight: '100vh', background: COLORS.gray50, fontFamily: FONTS.body }}>

      {/* Toast */}
      {message && (
        <div style={{
          position: 'fixed', top: 80, right: 24,
          background: COLORS.navy900, color: COLORS.white,
          padding: '12px 20px', borderRadius: 10,
          fontSize: 13, fontWeight: 600, zIndex: 1000,
          boxShadow: SHADOWS.xl,
        }}>{message}</div>
      )}

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.navy900} 0%, ${COLORS.navy700} 100%)`,
        padding: '56px 60px 80px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold400, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
            Business Ideas
          </p>
          <h1 style={{ fontFamily: FONTS.display, fontSize: 40, fontWeight: 800, color: COLORS.white, marginBottom: 12 }}>
            Find Your Perfect Business
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 32, maxWidth: 480 }}>
            Browse our curated collection of business ideas matched to real skills and market opportunities.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 560 }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: COLORS.gray400, fontSize: 16 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by idea, skill, or keyword..."
              style={{
                width: '100%', padding: '14px 16px 14px 46px',
                borderRadius: 10, border: 'none',
                fontSize: 14, outline: 'none', fontFamily: FONTS.body,
                boxShadow: SHADOWS.lg,
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '-32px auto 40px', padding: '0 24px' }}>

        {/* Filter Card */}
        <div style={{ ...CARD, marginBottom: 20, padding: '20px 24px' }}>
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Category
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)} style={{
                  background: category === c ? COLORS.navy800 : COLORS.gray50,
                  color: category === c ? COLORS.white : COLORS.gray600,
                  border: `1px solid ${category === c ? COLORS.navy800 : COLORS.gray200}`,
                  borderRadius: 100, padding: '6px 16px', fontSize: 12,
                  fontWeight: 600, cursor: 'pointer', fontFamily: FONTS.body,
                  transition: 'all 0.2s',
                }}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Difficulty Level
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setDifficulty(d)} style={{
                  background: difficulty === d ? COLORS.gold500 : COLORS.gray50,
                  color: difficulty === d ? COLORS.navy900 : COLORS.gray600,
                  border: `1px solid ${difficulty === d ? COLORS.gold500 : COLORS.gray200}`,
                  borderRadius: 100, padding: '6px 16px', fontSize: 12,
                  fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                  fontFamily: FONTS.body,
                }}>{d}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: COLORS.gray500 }}>
            Showing <b style={{ color: COLORS.navy900 }}>{filtered.length}</b> idea{filtered.length !== 1 ? 's' : ''}
            {search && ` for "${search}"`}
          </p>
          <button onClick={() => { setSearch(''); setCategory('All'); setDifficulty('All') }} style={{
            background: 'transparent', color: COLORS.gray500,
            border: `1px solid ${COLORS.gray200}`, borderRadius: 8,
            padding: '5px 14px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: FONTS.body,
          }}>Clear Filters</button>
        </div>

        {/* Ideas Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: COLORS.gray400 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p>Loading ideas...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: COLORS.gray400 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontWeight: 700, fontSize: 16, color: COLORS.navy900, marginBottom: 8 }}>No ideas found</p>
            <p style={{ fontSize: 13 }}>Try different search terms or filters</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
            {filtered.map((idea, idx) => (
              <div key={idea._id} style={{
                background: COLORS.white,
                borderRadius: 16,
                border: `1px solid ${COLORS.gray200}`,
                boxShadow: SHADOWS.sm,
                overflow: 'hidden',
                transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = SHADOWS.lg; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = SHADOWS.sm; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {/* Card Top */}
                <div style={{
                  background: idx % 3 === 0 ? COLORS.navy900 : idx % 3 === 1 ? COLORS.navy800 : COLORS.navy700,
                  padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'rgba(201,168,76,0.15)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24,
                  }}>{idea.icon || '💡'}</div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: 0.5, color: DIFF_COLORS[idea.difficulty],
                    background: DIFF_COLORS[idea.difficulty] + '20',
                    border: `1px solid ${DIFF_COLORS[idea.difficulty]}30`,
                    borderRadius: 100, padding: '3px 10px',
                  }}>{idea.difficulty}</span>
                </div>

                {/* Card Body */}
                <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: COLORS.navy900, marginBottom: 6 }}>
                    {idea.title}
                  </h3>
                  <p style={{ fontSize: 12, color: COLORS.gray500, lineHeight: 1.6, marginBottom: 12, flex: 1 }}>
                    {idea.description}
                  </p>

                  {/* Category */}
                  <div style={{ marginBottom: 10 }}>
                    <span style={{
                      background: COLORS.navy50, color: COLORS.navy700,
                      borderRadius: 100, padding: '3px 10px',
                      fontSize: 11, fontWeight: 600,
                    }}>{idea.category}</span>
                  </div>

                  {/* Skills */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                    {idea.requiredSkills?.slice(0, 3).map(skill => (
                      <span key={skill} style={{
                        background: COLORS.gray100, color: COLORS.gray600,
                        borderRadius: 100, padding: '2px 8px', fontSize: 10, fontWeight: 600,
                      }}>🔧 {skill}</span>
                    ))}
                  </div>

                  {/* Cost */}
                  <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 16 }}>
                    💰 <b style={{ color: COLORS.navy800 }}>{idea.estimatedCost}</b>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => navigate(`/roadmap/${idea._id}`)} style={{
                      flex: 2, background: `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`,
                      color: COLORS.white, border: 'none', borderRadius: 8,
                      padding: '10px', fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', fontFamily: FONTS.body,
                    }}>View Roadmap →</button>
                    <button onClick={() => handleSave(idea._id)} disabled={saving === idea._id} style={{
                      flex: 1, background: COLORS.gold50,
                      color: COLORS.gold600,
                      border: `1px solid ${COLORS.gold200}`,
                      borderRadius: 8, padding: '10px', fontSize: 12,
                      fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body,
                    }}>{saving === idea._id ? '...' : '🔖'}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}