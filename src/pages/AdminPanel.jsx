import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
})

export default function AdminPanel() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('stats')
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  // New idea form
  const [newIdea, setNewIdea] = useState({
    title: '', description: '', icon: '💡',
    category: 'Food & Beverages', difficulty: 'beginner',
    estimatedCost: '', requiredSkills: '', interests: ''
  })

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard')
      return
    }
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
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`, { headers })
      setUsers(users.filter(u => u._id !== id))
      showMessage('✅ User deleted!')
    } catch (err) {
      showMessage('❌ Error deleting user')
    }
  }

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role }, { headers })
      setUsers(users.map(u => u._id === id ? { ...u, role } : u))
      showMessage('✅ Role updated!')
    } catch (err) {
      showMessage('❌ Error updating role')
    }
  }

  const handleDeleteIdea = async (id) => {
    if (!window.confirm('Delete this idea?')) return
    try {
      await api.delete(`/admin/ideas/${id}`, { headers })
      setIdeas(ideas.filter(i => i._id !== id))
      showMessage('✅ Idea deleted!')
    } catch (err) {
      showMessage('❌ Error deleting idea')
    }
  }

  const handleToggleIdea = async (id) => {
    try {
      const res = await api.put(`/admin/ideas/${id}/toggle`, {}, { headers })
      setIdeas(ideas.map(i => i._id === id ? res.data.data : i))
      showMessage('✅ Status updated!')
    } catch (err) {
      showMessage('❌ Error toggling status')
    }
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
      setNewIdea({
        title: '', description: '', icon: '💡',
        category: 'Food & Beverages', difficulty: 'beginner',
        estimatedCost: '', requiredSkills: '', interests: ''
      })
      showMessage('✅ Idea created!')
      setActiveTab('ideas')
    } catch (err) {
      showMessage('❌ Error creating idea')
    }
  }

  const roleColors = {
    admin: '#E76F51', mentor: '#0D7377', user: '#6B7280'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAF9', fontFamily: 'sans-serif' }}>

      {/* Navbar */}
      <div style={{
        background: 'linear-gradient(135deg, #14213D, #0D7377)',
        padding: '14px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🌱</span>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>EntreSkill Hub</span>
          <span style={{
            background: '#E76F51', color: '#fff',
            borderRadius: 20, padding: '2px 10px',
            fontSize: 11, fontWeight: 700, marginLeft: 8
          }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'rgba(255,255,255,0.1)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8, padding: '6px 14px',
            fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}>Dashboard</button>
          <button onClick={() => { logout(); navigate('/') }} style={{
            background: 'rgba(255,255,255,0.1)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8, padding: '6px 14px',
            fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}>Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #E5E7EB',
        padding: '0 24px', display: 'flex', gap: 4
      }}>
        {[
          { id: 'stats', label: '📊 Stats' },
          { id: 'users', label: '👥 Users' },
          { id: 'ideas', label: '💡 Ideas' },
          { id: 'create', label: '➕ Add Idea' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: 'transparent',
            color: activeTab === tab.id ? '#0D7377' : '#6B7280',
            border: 'none',
            borderBottom: activeTab === tab.id ? '3px solid #0D7377' : '3px solid transparent',
            padding: '14px 16px', fontSize: 13,
            fontWeight: activeTab === tab.id ? 700 : 500,
            cursor: 'pointer'
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Message Toast */}
      {message && (
        <div style={{
          position: 'fixed', top: 20, right: 20,
          background: '#14213D', color: '#fff',
          padding: '12px 20px', borderRadius: 10,
          fontSize: 13, fontWeight: 600,
          zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>{message}</div>
      )}

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
            ⏳ Loading admin data...
          </div>
        ) : (
          <>
            {/* STATS TAB */}
            {activeTab === 'stats' && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#14213D', marginBottom: 20 }}>
                  📊 Platform Overview
                </h2>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
                  {[
                    { icon: '👥', label: 'Total Users', value: stats.totalUsers, color: '#0D7377' },
                    { icon: '💡', label: 'Business Ideas', value: stats.totalIdeas, color: '#F4A261' },
                    { icon: '🎓', label: 'Mentors', value: stats.totalMentors, color: '#8B5CF6' },
                    { icon: '✅', label: 'Active Ideas', value: ideas.filter(i => i.isActive).length, color: '#10B981' },
                  ].map(s => (
                    <div key={s.label} style={{
                      background: '#fff', borderRadius: 16,
                      padding: '24px', flex: 1, minWidth: 160,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                      borderTop: `4px solid ${s.color}`,
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
                      <div style={{ fontSize: 32, fontWeight: 800, color: '#14213D', marginBottom: 4 }}>
                        {s.value}
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Users */}
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#14213D', marginBottom: 14 }}>
                  🕐 Recent Users
                </h3>
                <div style={{
                  background: '#fff', borderRadius: 16,
                  overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                }}>
                  {users.slice(0, 5).map((u, idx) => (
                    <div key={u._id} style={{
                      display: 'flex', alignItems: 'center',
                      gap: 14, padding: '14px 20px',
                      borderBottom: idx < 4 ? '1px solid #F3F4F6' : 'none'
                    }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: '#E0F2F1', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 700, color: '#0D7377'
                      }}>{u.name[0].toUpperCase()}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#14213D' }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>{u.email}</div>
                      </div>
                      <span style={{
                        background: roleColors[u.role] + '20',
                        color: roleColors[u.role],
                        borderRadius: 20, padding: '3px 10px',
                        fontSize: 11, fontWeight: 700,
                        textTransform: 'uppercase'
                      }}>{u.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#14213D', marginBottom: 20 }}>
                  👥 Manage Users ({users.length})
                </h2>
                <div style={{
                  background: '#fff', borderRadius: 16,
                  overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                }}>
                  {users.map((u, idx) => (
                    <div key={u._id} style={{
                      display: 'flex', alignItems: 'center',
                      gap: 14, padding: '16px 20px',
                      borderBottom: idx < users.length - 1 ? '1px solid #F3F4F6' : 'none',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: '50%',
                        background: '#E0F2F1', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 700, color: '#0D7377', flexShrink: 0
                      }}>{u.name[0].toUpperCase()}</div>
                      <div style={{ flex: 1, minWidth: 150 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#14213D' }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>{u.email}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                          Skills: {u.skills?.join(', ') || 'None'}
                        </div>
                      </div>

                      {/* Role Selector */}
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        style={{
                          padding: '6px 10px', borderRadius: 8,
                          border: `2px solid ${roleColors[u.role]}`,
                          color: roleColors[u.role], fontWeight: 700,
                          fontSize: 12, cursor: 'pointer',
                          background: roleColors[u.role] + '15'
                        }}>
                        <option value="user">User</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>

                      {/* Delete */}
                      {u._id !== user._id && (
                        <button onClick={() => handleDeleteUser(u._id)} style={{
                          background: '#FEE2E2', color: '#B91C1C',
                          border: 'none', borderRadius: 8,
                          padding: '6px 14px', fontSize: 12,
                          fontWeight: 700, cursor: 'pointer'
                        }}>Delete</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IDEAS TAB */}
            {activeTab === 'ideas' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: '#14213D' }}>
                    💡 Manage Ideas ({ideas.length})
                  </h2>
                  <button onClick={() => setActiveTab('create')} style={{
                    background: '#0D7377', color: '#fff',
                    border: 'none', borderRadius: 8,
                    padding: '8px 18px', fontSize: 13,
                    fontWeight: 700, cursor: 'pointer'
                  }}>+ Add New Idea</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {ideas.map(idea => (
                    <div key={idea._id} style={{
                      background: '#fff', borderRadius: 14,
                      padding: '16px 20px', display: 'flex',
                      alignItems: 'center', gap: 14,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      opacity: idea.isActive ? 1 : 0.5
                    }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 12,
                        background: '#E0F2F1', fontSize: 24,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0
                      }}>{idea.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#14213D', marginBottom: 2 }}>
                          {idea.title}
                        </div>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>
                          {idea.category} • {idea.difficulty}
                        </div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>
                          Skills: {idea.requiredSkills?.join(', ')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button onClick={() => handleToggleIdea(idea._id)} style={{
                          background: idea.isActive ? '#FEF3C7' : '#D1FAE5',
                          color: idea.isActive ? '#92400E' : '#065F46',
                          border: 'none', borderRadius: 8,
                          padding: '6px 12px', fontSize: 11,
                          fontWeight: 700, cursor: 'pointer'
                        }}>{idea.isActive ? 'Deactivate' : 'Activate'}</button>
                        <button onClick={() => handleDeleteIdea(idea._id)} style={{
                          background: '#FEE2E2', color: '#B91C1C',
                          border: 'none', borderRadius: 8,
                          padding: '6px 12px', fontSize: 11,
                          fontWeight: 700, cursor: 'pointer'
                        }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CREATE IDEA TAB */}
            {activeTab === 'create' && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#14213D', marginBottom: 20 }}>
                  ➕ Add New Business Idea
                </h2>
                <div style={{
                  background: '#fff', borderRadius: 16,
                  padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                }}>
                  <form onSubmit={handleCreateIdea}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

                      {/* Title */}
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>
                          Title *
                        </label>
                        <input
                          value={newIdea.title}
                          onChange={e => setNewIdea({ ...newIdea, title: e.target.value })}
                          placeholder="e.g. Home Bakery"
                          required
                          style={{
                            width: '100%', padding: '10px 12px',
                            borderRadius: 8, border: '2px solid #E5E7EB',
                            fontSize: 13, outline: 'none'
                          }}
                        />
                      </div>

                      {/* Icon */}
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>
                          Icon (emoji)
                        </label>
                        <input
                          value={newIdea.icon}
                          onChange={e => setNewIdea({ ...newIdea, icon: e.target.value })}
                          placeholder="e.g. 🍰"
                          style={{
                            width: '100%', padding: '10px 12px',
                            borderRadius: 8, border: '2px solid #E5E7EB',
                            fontSize: 20, outline: 'none'
                          }}
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>
                          Category *
                        </label>
                        <select
                          value={newIdea.category}
                          onChange={e => setNewIdea({ ...newIdea, category: e.target.value })}
                          style={{
                            width: '100%', padding: '10px 12px',
                            borderRadius: 8, border: '2px solid #E5E7EB',
                            fontSize: 13, outline: 'none'
                          }}>
                          {['Food & Beverages', 'Fashion & Apparel', 'Technology', 'Home Services', 'Education', 'Health & Wellness', 'Arts & Crafts', 'Digital & Media'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Difficulty */}
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>
                          Difficulty *
                        </label>
                        <select
                          value={newIdea.difficulty}
                          onChange={e => setNewIdea({ ...newIdea, difficulty: e.target.value })}
                          style={{
                            width: '100%', padding: '10px 12px',
                            borderRadius: 8, border: '2px solid #E5E7EB',
                            fontSize: 13, outline: 'none'
                          }}>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>

                      {/* Required Skills */}
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>
                          Required Skills (comma separated)
                        </label>
                        <input
                          value={newIdea.requiredSkills}
                          onChange={e => setNewIdea({ ...newIdea, requiredSkills: e.target.value })}
                          placeholder="e.g. baking, cooking"
                          style={{
                            width: '100%', padding: '10px 12px',
                            borderRadius: 8, border: '2px solid #E5E7EB',
                            fontSize: 13, outline: 'none'
                          }}
                        />
                      </div>

                      {/* Interests */}
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>
                          Interests (comma separated)
                        </label>
                        <input
                          value={newIdea.interests}
                          onChange={e => setNewIdea({ ...newIdea, interests: e.target.value })}
                          placeholder="e.g. food, home"
                          style={{
                            width: '100%', padding: '10px 12px',
                            borderRadius: 8, border: '2px solid #E5E7EB',
                            fontSize: 13, outline: 'none'
                          }}
                        />
                      </div>

                      {/* Estimated Cost */}
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>
                          Estimated Cost
                        </label>
                        <input
                          value={newIdea.estimatedCost}
                          onChange={e => setNewIdea({ ...newIdea, estimatedCost: e.target.value })}
                          placeholder="e.g. ₹5,000 - ₹15,000"
                          style={{
                            width: '100%', padding: '10px 12px',
                            borderRadius: 8, border: '2px solid #E5E7EB',
                            fontSize: 13, outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>
                        Description *
                      </label>
                      <textarea
                        value={newIdea.description}
                        onChange={e => setNewIdea({ ...newIdea, description: e.target.value })}
                        placeholder="Describe the business idea..."
                        required
                        rows={3}
                        style={{
                          width: '100%', padding: '10px 12px',
                          borderRadius: 8, border: '2px solid #E5E7EB',
                          fontSize: 13, outline: 'none', resize: 'vertical'
                        }}
                      />
                    </div>

                    <button type="submit" style={{
                      background: '#0D7377', color: '#fff',
                      border: 'none', borderRadius: 10,
                      padding: '12px 32px', fontSize: 14,
                      fontWeight: 700, cursor: 'pointer'
                    }}>
                      ➕ Create Idea
                    </button>
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