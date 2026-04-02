import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { COLORS, FONTS, SHADOWS, CARD } from '../styles/theme'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1' })

export default function AdminPanel() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('stats')
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [newIdea, setNewIdea] = useState({
    title: '', description: '', icon: '💡',
    category: 'Food & Beverages', difficulty: 'beginner',
    estimatedCost: '', requiredSkills: '', interests: ''
  })

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/dashboard'); return }
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, ideasRes] = await Promise.all([
        api.get('/admin/stats', { headers }),
        api.get('/admin/users', { headers }),
        api.get('/admin/ideas', { headers }),
      ])
      setStats(statsRes.data.data)
      setUsers(usersRes.data.data)
      setIdeas(ideasRes.data.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const showMessage = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000) }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`, { headers })
      setUsers(users.filter(u => u._id !== id))
      showMessage('✅ User deleted!')
    } catch { showMessage('❌ Error deleting user') }
  }

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role }, { headers })
      setUsers(users.map(u => u._id === id ? { ...u, role } : u))
      showMessage('✅ Role updated!')
    } catch { showMessage('❌ Error updating role') }
  }

  const handleDeleteIdea = async (id) => {
    if (!window.confirm('Delete this idea?')) return
    try {
      await api.delete(`/admin/ideas/${id}`, { headers })
      setIdeas(ideas.filter(i => i._id !== id))
      showMessage('✅ Idea deleted!')
    } catch { showMessage('❌ Error deleting idea') }
  }

  const handleToggleIdea = async (id) => {
    try {
      const res = await api.put(`/admin/ideas/${id}/toggle`, {}, { headers })
      setIdeas(ideas.map(i => i._id === id ? res.data.data : i))
      showMessage('✅ Status updated!')
    } catch { showMessage('❌ Error toggling status') }
  }

  const handleCreateIdea = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...newIdea,
        requiredSkills: newIdea.requiredSkills.split(',').map(s => s.trim()),
        interests: newIdea.interests.split(',').map(s => s.trim()),
      }
      const res = await api.post('/admin/ideas', payload, { headers })
      setIdeas([res.data.data, ...ideas])
      setNewIdea({ title: '', description: '', icon: '💡', category: 'Food & Beverages', difficulty: 'beginner', estimatedCost: '', requiredSkills: '', interests: '' })
      showMessage('✅ Idea created!')
      setActiveTab('ideas')
    } catch { showMessage('❌ Error creating idea') }
  }

  const roleColors = { admin: COLORS.danger, mentor: COLORS.success, user: COLORS.gray500 }
  const roleBg = { admin: '#FEE2E2', mentor: '#D1FAE5', user: COLORS.gray100 }

  const tabs = [
    { id: 'stats', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'ideas', label: 'Ideas', icon: '💡' },
    { id: 'create', label: 'Add Idea', icon: '➕' },
  ]

  const statCards = [
    { icon: '👥', label: 'Total Users', value: stats.totalUsers, color: COLORS.navy500 },
    { icon: '💡', label: 'Business Ideas', value: stats.totalIdeas, color: COLORS.gold500 },
    { icon: '🎓', label: 'Mentors', value: stats.totalMentors, color: '#8B5CF6' },
    { icon: '✅', label: 'Active Ideas', value: ideas.filter(i => i.isActive).length, color: COLORS.success },
  ]

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

      {/* Top Bar */}
      <div style={{
        background: COLORS.navy900,
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: COLORS.navy900,
            }}>E</div>
            <span style={{ fontFamily: FONTS.display, fontSize: 17, color: COLORS.white, fontWeight: 700 }}>EntreSkill Hub</span>
          </div>
          <div style={{
            background: COLORS.danger + '20',
            border: `1px solid ${COLORS.danger}40`,
            borderRadius: 100, padding: '3px 12px',
            fontSize: 11, fontWeight: 700, color: COLORS.danger,
            letterSpacing: 1, textTransform: 'uppercase',
          }}>Admin</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
            padding: '7px 16px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: FONTS.body,
          }}>← Dashboard</button>
          <button onClick={() => { logout(); navigate('/') }} style={{
            background: 'transparent', color: 'rgba(255,255,255,0.45)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
            padding: '7px 16px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: FONTS.body,
          }}>Sign Out</button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{
        background: COLORS.white,
        borderBottom: `1px solid ${COLORS.gray200}`,
        padding: '0 32px', display: 'flex', gap: 0,
      }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: 'transparent',
            color: activeTab === tab.id ? COLORS.navy900 : COLORS.gray500,
            border: 'none',
            borderBottom: activeTab === tab.id ? `2px solid ${COLORS.gold500}` : '2px solid transparent',
            padding: '16px 20px', fontSize: 13,
            fontWeight: activeTab === tab.id ? 700 : 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: FONTS.body,
          }}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: COLORS.gray400 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p>Loading admin data...</p>
          </div>
        ) : (
          <>

            {/* STATS */}
            {activeTab === 'stats' && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 800, color: COLORS.navy900, marginBottom: 4 }}>Platform Overview</h2>
                  <p style={{ fontSize: 13, color: COLORS.gray500 }}>Real-time statistics and recent activity</p>
                </div>

                {/* Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                  {statCards.map(s => (
                    <div key={s.label} style={{
                      ...CARD, textAlign: 'center',
                      borderTop: `3px solid ${s.color}`,
                      position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute', top: -24, right: -24,
                        width: 80, height: 80, borderRadius: '50%',
                        background: s.color + '08',
                      }} />
                      <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                      <div style={{ fontFamily: FONTS.display, fontSize: 32, fontWeight: 800, color: COLORS.navy900, marginBottom: 6 }}>{s.value ?? '—'}</div>
                      <div style={{ fontSize: 12, color: COLORS.gray500, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Users */}
                <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  Recent Users
                </h3>
                <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
                  {users.slice(0, 5).map((u, idx) => (
                    <div key={u._id} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 24px',
                      borderBottom: idx < 4 ? `1px solid ${COLORS.gray100}` : 'none',
                    }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: `linear-gradient(135deg, ${COLORS.navy700}, ${COLORS.navy900})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 800, color: COLORS.gold400,
                        fontFamily: FONTS.display, flexShrink: 0,
                      }}>{u.name?.[0]?.toUpperCase()}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.navy900 }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: COLORS.gray400 }}>{u.email}</div>
                      </div>
                      <span style={{
                        background: roleBg[u.role], color: roleColors[u.role],
                        borderRadius: 100, padding: '3px 12px',
                        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                      }}>{u.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 800, color: COLORS.navy900, marginBottom: 4 }}>
                      Manage Users
                    </h2>
                    <p style={{ fontSize: 13, color: COLORS.gray500 }}>{users.length} registered users</p>
                  </div>
                </div>
                <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
                  {/* Table Header */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 160px 120px 80px',
                    padding: '12px 24px', background: COLORS.gray50,
                    borderBottom: `1px solid ${COLORS.gray200}`,
                  }}>
                    {['Name', 'Email', 'Skills', 'Role', 'Action'].map(h => (
                      <span key={h} style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</span>
                    ))}
                  </div>
                  {users.map((u, idx) => (
                    <div key={u._id} style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr 160px 120px 80px',
                      padding: '14px 24px', alignItems: 'center',
                      borderBottom: idx < users.length - 1 ? `1px solid ${COLORS.gray100}` : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: `linear-gradient(135deg, ${COLORS.navy700}, ${COLORS.navy900})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 800, color: COLORS.gold400, flexShrink: 0,
                        }}>{u.name?.[0]?.toUpperCase()}</div>
                        <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.navy900 }}>{u.name}</span>
                      </div>
                      <span style={{ fontSize: 12, color: COLORS.gray500 }}>{u.email}</span>
                      <span style={{ fontSize: 11, color: COLORS.gray400 }}>{u.skills?.slice(0,2).join(', ') || 'None'}</span>
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u._id, e.target.value)}
                        style={{
                          padding: '5px 10px', borderRadius: 100,
                          border: `1.5px solid ${roleColors[u.role]}`,
                          color: roleColors[u.role], fontWeight: 700,
                          fontSize: 11, cursor: 'pointer',
                          background: roleBg[u.role],
                          fontFamily: FONTS.body, textTransform: 'uppercase',
                        }}>
                        <option value="user">User</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                      {u._id !== user._id ? (
                        <button onClick={() => handleDeleteUser(u._id)} style={{
                          background: '#FEE2E2', color: COLORS.danger,
                          border: 'none', borderRadius: 8,
                          padding: '6px 12px', fontSize: 11,
                          fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body,
                        }}>Delete</button>
                      ) : (
                        <span style={{ fontSize: 11, color: COLORS.gray300, fontWeight: 600 }}>You</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IDEAS */}
            {activeTab === 'ideas' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 800, color: COLORS.navy900, marginBottom: 4 }}>
                      Manage Ideas
                    </h2>
                    <p style={{ fontSize: 13, color: COLORS.gray500 }}>{ideas.length} business ideas</p>
                  </div>
                  <button onClick={() => setActiveTab('create')} style={{
                    background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
                    color: COLORS.navy900, border: 'none', borderRadius: 8,
                    padding: '9px 18px', fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', fontFamily: FONTS.body, boxShadow: SHADOWS.gold,
                  }}>+ Add New Idea</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {ideas.map(idea => (
                    <div key={idea._id} style={{
                      ...CARD, padding: '16px 20px',
                      display: 'flex', alignItems: 'center', gap: 16,
                      opacity: idea.isActive ? 1 : 0.5,
                      borderLeft: `4px solid ${idea.isActive ? COLORS.gold500 : COLORS.gray300}`,
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: COLORS.navy50, border: `1px solid ${COLORS.navy100}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, flexShrink: 0,
                      }}>{idea.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.navy900, marginBottom: 2 }}>{idea.title}</div>
                        <div style={{ fontSize: 12, color: COLORS.gray500 }}>{idea.category} • {idea.difficulty}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button onClick={() => handleToggleIdea(idea._id)} style={{
                          background: idea.isActive ? '#FEF3C7' : '#D1FAE5',
                          color: idea.isActive ? '#92400E' : '#065F46',
                          border: 'none', borderRadius: 8,
                          padding: '6px 14px', fontSize: 11,
                          fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body,
                        }}>{idea.isActive ? 'Deactivate' : 'Activate'}</button>
                        <button onClick={() => handleDeleteIdea(idea._id)} style={{
                          background: '#FEE2E2', color: COLORS.danger,
                          border: 'none', borderRadius: 8,
                          padding: '6px 14px', fontSize: 11,
                          fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body,
                        }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CREATE IDEA */}
            {activeTab === 'create' && (
              <div style={{ maxWidth: 720 }}>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 800, color: COLORS.navy900, marginBottom: 4 }}>
                    Add New Business Idea
                  </h2>
                  <p style={{ fontSize: 13, color: COLORS.gray500 }}>Create a new idea for the platform</p>
                </div>
                <div style={{ ...CARD }}>
                  <form onSubmit={handleCreateIdea}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                      {[
                        { label: 'Title *', key: 'title', placeholder: 'e.g. Home Bakery' },
                        { label: 'Icon (emoji)', key: 'icon', placeholder: '🍰' },
                        { label: 'Estimated Cost', key: 'estimatedCost', placeholder: '₹5,000 - ₹15,000' },
                        { label: 'Required Skills (comma separated)', key: 'requiredSkills', placeholder: 'baking, cooking' },
                        { label: 'Interests (comma separated)', key: 'interests', placeholder: 'food, home' },
                      ].map(f => (
                        <div key={f.key} style={f.key === 'requiredSkills' || f.key === 'interests' ? { gridColumn: 'span 2' } : {}}>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                            {f.label}
                          </label>
                          <input
                            value={newIdea[f.key]}
                            onChange={e => setNewIdea({ ...newIdea, [f.key]: e.target.value })}
                            placeholder={f.placeholder}
                            required={f.key === 'title'}
                            style={{
                              width: '100%', padding: '11px 14px',
                              borderRadius: 8, border: `1.5px solid ${COLORS.gray200}`,
                              fontSize: 13, outline: 'none', fontFamily: FONTS.body,
                            }}
                          />
                        </div>
                      ))}

                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Category *</label>
                        <select value={newIdea.category} onChange={e => setNewIdea({ ...newIdea, category: e.target.value })} style={{
                          width: '100%', padding: '11px 14px', borderRadius: 8,
                          border: `1.5px solid ${COLORS.gray200}`, fontSize: 13,
                          outline: 'none', fontFamily: FONTS.body,
                        }}>
                          {['Food & Beverages', 'Fashion & Apparel', 'Technology', 'Home Services', 'Education', 'Health & Wellness', 'Arts & Crafts', 'Digital & Media'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Difficulty *</label>
                        <select value={newIdea.difficulty} onChange={e => setNewIdea({ ...newIdea, difficulty: e.target.value })} style={{
                          width: '100%', padding: '11px 14px', borderRadius: 8,
                          border: `1.5px solid ${COLORS.gray200}`, fontSize: 13,
                          outline: 'none', fontFamily: FONTS.body,
                        }}>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Description *</label>
                      <textarea
                        value={newIdea.description}
                        onChange={e => setNewIdea({ ...newIdea, description: e.target.value })}
                        placeholder="Describe the business idea..."
                        required rows={3}
                        style={{
                          width: '100%', padding: '11px 14px', borderRadius: 8,
                          border: `1.5px solid ${COLORS.gray200}`, fontSize: 13,
                          outline: 'none', resize: 'vertical', fontFamily: FONTS.body,
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="button" onClick={() => setActiveTab('ideas')} style={{
                        flex: 1, padding: '12px', background: COLORS.gray50,
                        color: COLORS.gray600, border: `1.5px solid ${COLORS.gray200}`,
                        borderRadius: 10, fontSize: 14, fontWeight: 700,
                        cursor: 'pointer', fontFamily: FONTS.body,
                      }}>Cancel</button>
                      <button type="submit" style={{
                        flex: 2, padding: '12px',
                        background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
                        color: COLORS.navy900, border: 'none',
                        borderRadius: 10, fontSize: 14, fontWeight: 700,
                        cursor: 'pointer', fontFamily: FONTS.body, boxShadow: SHADOWS.gold,
                      }}>Create Idea →</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}