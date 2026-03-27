import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
})

const TYPES = ['All', 'video', 'article', 'checklist', 'pdf', 'tool']
const CATEGORIES = [
  'All', 'General', 'Food & Beverages', 'Fashion & Apparel',
  'Technology', 'Home Services', 'Education',
  'Health & Wellness', 'Arts & Crafts', 'Digital & Media'
]
const TYPE_ICONS = { video: '🎬', article: '📄', checklist: '✅', pdf: '📑', tool: '🔧' }
const TYPE_COLORS = { video: '#EF4444', article: '#3B82F6', checklist: '#10B981', pdf: '#F59E0B', tool: '#8B5CF6' }

export default function ResourcesPage() {
  const navigate = useNavigate()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [message, setMessage] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '', description: '', type: 'video',
    url: '', category: 'General', duration: '', tags: ''
  })

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => { loadResources() }, [typeFilter, categoryFilter])

  const loadResources = async () => {
    setLoading(true)
    try {
      const params = {}
      if (typeFilter !== 'All') params.type = typeFilter
      if (categoryFilter !== 'All') params.category = categoryFilter
      const res = await api.get('/resources', { params })
      setResources(res.data.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const showMsg = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleLike = async (id) => {
    try {
      await api.post(`/resources/${id}/like`)
      setResources(resources.map(r => r._id === id ? { ...r, likes: r.likes + 1 } : r))
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setUploadLoading(true)
    try {
      await api.post('/resources', {
        ...uploadForm,
        tags: uploadForm.tags.split(',').map(t => t.trim())
      }, { headers })
      showMsg('✅ Resource submitted for approval!')
      setShowUpload(false)
      setUploadForm({ title: '', description: '', type: 'video', url: '', category: 'General', duration: '', tags: '' })
      loadResources()
    } catch (err) {
      showMsg('❌ Failed to upload. Please login as mentor/admin.')
    }
    setUploadLoading(false)
  }

  const filtered = resources.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAF9', fontFamily: 'sans-serif' }}>

      {/* Toast */}
      {message && (
        <div style={{
          position: 'fixed', top: 80, right: 20, background: '#14213D',
          color: '#fff', padding: '12px 20px', borderRadius: 10,
          fontSize: 13, fontWeight: 600, zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>{message}</div>
      )}

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #14213D, #0D7377)',
        padding: '32px 24px 50px', textAlign: 'center', color: '#fff'
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Learning Resources</h1>
        <p style={{ color: '#94A3B8', fontSize: 15, marginBottom: 24 }}>
          Videos, articles, checklists and tools to help you succeed
        </p>
        <div style={{ maxWidth: 500, margin: '0 auto 16px' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search resources..."
            style={{
              width: '100%', padding: '14px 20px', borderRadius: 12,
              border: 'none', fontSize: 14, outline: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}
          />
        </div>
        {token && (
          <button onClick={() => setShowUpload(true)} style={{
            background: '#F4A261', color: '#fff', border: 'none',
            borderRadius: 10, padding: '10px 24px', fontSize: 13,
            fontWeight: 700, cursor: 'pointer'
          }}>+ Upload Resource</button>
        )}
      </div>

      <div style={{ maxWidth: 1000, margin: '-24px auto 40px', padding: '0 20px' }}>

        {/* Filters */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '20px',
          marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              Resource Type
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TYPES.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)} style={{
                  background: typeFilter === t ? (t === 'All' ? '#14213D' : TYPE_COLORS[t]) : '#F3F4F6',
                  color: typeFilter === t ? '#fff' : '#6B7280',
                  border: 'none', borderRadius: 20, padding: '6px 14px',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize'
                }}>{t !== 'All' && TYPE_ICONS[t]} {t}</button>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              Category
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategoryFilter(c)} style={{
                  background: categoryFilter === c ? '#0D7377' : '#F3F4F6',
                  color: categoryFilter === c ? '#fff' : '#6B7280',
                  border: 'none', borderRadius: 20, padding: '6px 14px',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer'
                }}>{c}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ color: '#6B7280', fontSize: 13 }}>
            <b>{filtered.length}</b> resource{filtered.length !== 1 ? 's' : ''} found
          </p>
          <button onClick={() => { setSearch(''); setTypeFilter('All'); setCategoryFilter('All') }} style={{
            background: 'transparent', color: '#0D7377', border: '1px solid #0D7377',
            borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}>Clear Filters</button>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>⏳ Loading resources...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p>No resources found!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filtered.map(resource => (
              <div key={resource._id} style={{
                background: '#fff', borderRadius: 16, padding: '20px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex',
                flexDirection: 'column', gap: 10, border: '2px solid transparent',
                transition: 'border 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.border = '2px solid #0D7377'}
                onMouseLeave={e => e.currentTarget.style.border = '2px solid transparent'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    background: TYPE_COLORS[resource.type] + '20', color: TYPE_COLORS[resource.type],
                    borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase'
                  }}>{TYPE_ICONS[resource.type]} {resource.type}</span>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>👁️ {resource.views}</span>
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#14213D', margin: 0 }}>{resource.title}</h3>
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{resource.description}</p>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {resource.duration && <span style={{ fontSize: 11, color: '#6B7280' }}>⏱️ {resource.duration}</span>}
                  <span style={{ fontSize: 11, color: '#6B7280' }}>📂 {resource.category}</span>
                </div>

                <div style={{ fontSize: 11, color: '#9CA3AF' }}>By {resource.uploadedBy?.name || 'Admin'}</div>

                {resource.tags?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {resource.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{
                        background: '#F3F4F6', color: '#6B7280',
                        borderRadius: 20, padding: '2px 8px', fontSize: 10
                      }}>#{tag}</span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  {resource.url ? (
                    <a href={resource.url} target="_blank" rel="noreferrer" style={{
                      flex: 2, background: '#0D7377', color: '#fff', border: 'none',
                      borderRadius: 8, padding: '10px', fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', textDecoration: 'none', textAlign: 'center'
                    }}>Open {TYPE_ICONS[resource.type]}</a>
                  ) : (
                    <button style={{
                      flex: 2, background: '#0D7377', color: '#fff', border: 'none',
                      borderRadius: 8, padding: '10px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                    }}>View {TYPE_ICONS[resource.type]}</button>
                  )}
                  <button onClick={() => handleLike(resource._id)} style={{
                    flex: 1, background: '#FEE2E2', color: '#EF4444', border: 'none',
                    borderRadius: 8, padding: '10px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                  }}>❤️ {resource.likes}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: 20, padding: '32px',
            width: '100%', maxWidth: 520,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#14213D', margin: 0 }}>📤 Upload Resource</h3>
              <button onClick={() => setShowUpload(false)} style={{
                background: '#F3F4F6', border: 'none', borderRadius: '50%',
                width: 32, height: 32, fontSize: 16, cursor: 'pointer', fontWeight: 700
              }}>✕</button>
            </div>

            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>Title *</label>
                <input
                  value={uploadForm.title}
                  onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="e.g. How to Start a Bakery Business"
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '2px solid #E5E7EB', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>Description *</label>
                <textarea
                  value={uploadForm.description}
                  onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="What will users learn from this resource?"
                  required rows={3}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '2px solid #E5E7EB', fontSize: 13, outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>Type *</label>
                  <select
                    value={uploadForm.type}
                    onChange={e => setUploadForm({ ...uploadForm, type: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '2px solid #E5E7EB', fontSize: 13, outline: 'none' }}>
                    {['video', 'article', 'checklist', 'pdf', 'tool'].map(t => (
                      <option key={t} value={t}>{TYPE_ICONS[t]} {t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>Category *</label>
                  <select
                    value={uploadForm.category}
                    onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '2px solid #E5E7EB', fontSize: 13, outline: 'none' }}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>Duration</label>
                  <input
                    value={uploadForm.duration}
                    onChange={e => setUploadForm({ ...uploadForm, duration: e.target.value })}
                    placeholder="e.g. 15 min"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '2px solid #E5E7EB', fontSize: 13, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>Tags (comma separated)</label>
                  <input
                    value={uploadForm.tags}
                    onChange={e => setUploadForm({ ...uploadForm, tags: e.target.value })}
                    placeholder="e.g. food, startup"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '2px solid #E5E7EB', fontSize: 13, outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>URL (YouTube, Blog, PDF link)</label>
                <input
                  value={uploadForm.url}
                  onChange={e => setUploadForm({ ...uploadForm, url: e.target.value })}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '2px solid #E5E7EB', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowUpload(false)} style={{
                  flex: 1, padding: '12px', background: 'transparent', color: '#6B7280',
                  border: '2px solid #E5E7EB', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer'
                }}>Cancel</button>
                <button type="submit" disabled={uploadLoading} style={{
                  flex: 2, padding: '12px',
                  background: uploadLoading ? '#9CA3AF' : '#0D7377',
                  color: '#fff', border: 'none', borderRadius: 10,
                  fontSize: 14, fontWeight: 700,
                  cursor: uploadLoading ? 'not-allowed' : 'pointer'
                }}>{uploadLoading ? 'Uploading...' : '📤 Submit Resource'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}