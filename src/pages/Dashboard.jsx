import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ideasAPI } from '../services/api'

const ROADMAP_STEPS = [
  { id: 1, title: 'Idea Validation', done: true },
  { id: 2, title: 'Skills & Tools', done: true },
  { id: 3, title: 'Legal & Registration', done: false },
  { id: 4, title: 'Cost Estimation', done: false },
  { id: 5, title: 'Marketing Basics', done: false },
  { id: 6, title: 'Launch!', done: false },
]

const RESOURCES = [
  { id: 1, type: 'video', title: 'How to Start a Food Business', duration: '12 min', icon: '🎬' },
  { id: 2, type: 'article', title: 'FSSAI Registration Guide', duration: '5 min read', icon: '📄' },
  { id: 3, type: 'checklist', title: 'Home Bakery Launch Checklist', duration: '10 items', icon: '✅' },
]

const MENTORS = [
  { id: 1, name: 'Priya Mehta', expertise: 'Food Business', rating: 4.9, sessions: 120, avatar: '👩‍🍳' },
  { id: 2, name: 'Arjun Kapoor', expertise: 'Marketing', rating: 4.7, sessions: 85, avatar: '👨‍💼' },
]

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      padding: '20px', flex: 1, minWidth: 120,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      borderTop: `4px solid ${color}`
    }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#14213D', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [savedIdeas, setSavedIdeas] = useState([])
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true)

  const completedSteps = ROADMAP_STEPS.filter(s => s.done).length
  const progressPct = Math.round((completedSteps / ROADMAP_STEPS.length) * 100)

  // Load ideas on mount
  useEffect(() => {
    const loadIdeas = async () => {
      try {
        const [recRes, savedRes] = await Promise.all([
          ideasAPI.getRecommended(),
          ideasAPI.getSaved()
        ])
        setRecommended(recRes.data.data)
        setSavedIdeas(savedRes.data.data)
      } catch (err) {
        console.error('Error loading ideas:', err)
      }
      setLoading(false)
    }
    loadIdeas()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const topIdea = recommended[0] || null

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
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ color: '#94A3B8', fontSize: 13 }}>
            👋 Hi, {user?.name?.split(' ')[0]}
          </span>
          <button onClick={handleLogout} style={{
            background: 'rgba(255,255,255,0.1)',
            color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8, padding: '6px 14px',
            fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}>Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #E5E7EB',
        padding: '0 24px', display: 'flex', gap: 4,
        overflowX: 'auto'
      }}>
        {[
          { id: 'overview', label: '🏠 Overview' },
          { id: 'ideas', label: '💡 My Ideas' },
          { id: 'roadmap', label: '🗺️ Roadmap' },
          { id: 'resources', label: '📚 Resources' },
          { id: 'mentors', label: '👥 Mentors' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: 'transparent',
            color: activeTab === tab.id ? '#0D7377' : '#6B7280',
            border: 'none',
            borderBottom: activeTab === tab.id ? '3px solid #0D7377' : '3px solid transparent',
            padding: '14px 16px', fontSize: 13,
            fontWeight: activeTab === tab.id ? 700 : 500,
            cursor: 'pointer', whiteSpace: 'nowrap'
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* Welcome Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #14213D, #0D7377)',
              borderRadius: 16, padding: '24px',
              marginBottom: 24, color: '#fff'
            }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h2>
              <p style={{ color: '#94A3B8', fontSize: 14, marginBottom: 16 }}>
                {user?.skills?.length > 0
                  ? `You have ${user.skills.length} skills ready to build a business!`
                  : 'Complete your profile to get personalised recommendations.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 4 }}>
                  <div style={{
                    width: `${progressPct}%`, height: '100%',
                    background: '#F4A261', borderRadius: 4
                  }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#F4A261' }}>
                  {progressPct}% Complete
                </span>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
              <StatCard icon="💡" label="Saved Ideas" value={savedIdeas.length} color="#0D7377" />
              <StatCard icon="🗺️" label="Steps Done" value={`${completedSteps}/${ROADMAP_STEPS.length}`} color="#F4A261" />
              <StatCard icon="🎯" label="Skills" value={user?.skills?.length || 0} color="#8B5CF6" />
              <StatCard icon="👥" label="Mentors" value={MENTORS.length} color="#E76F51" />
            </div>

            {/* Top Idea */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                ⏳ Loading your recommendations...
              </div>
            ) : topIdea ? (
              <>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#14213D', marginBottom: 14 }}>
                  🏆 Your Top Match
                </h3>
                <div style={{
                  background: '#fff', borderRadius: 16,
                  padding: '20px', marginBottom: 24,
                  border: '2px solid #F4A261',
                  boxShadow: '0 2px 12px rgba(244,162,97,0.15)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 14,
                      background: '#FFF7ED', fontSize: 30,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>{topIdea.icon || '💡'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 800, fontSize: 16, color: '#14213D' }}>{topIdea.title}</span>
                        {topIdea.matchPercentage && (
                          <span style={{
                            background: '#F4A26120', color: '#F4A261',
                            borderRadius: 20, padding: '2px 10px',
                            fontSize: 10, fontWeight: 700
                          }}>{topIdea.matchPercentage}% Match</span>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
                        {topIdea.description}
                      </p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => navigate(`/roadmap/${topIdea._id}`)} style={{
                          background: '#0D7377', color: '#fff',
                          border: 'none', borderRadius: 8,
                          padding: '8px 16px', fontSize: 12,
                          fontWeight: 700, cursor: 'pointer'
                          }}>View Roadmap →</button>
                        <button onClick={() => setActiveTab('mentors')} style={{
                          background: 'transparent', color: '#0D7377',
                          border: '2px solid #0D7377', borderRadius: 8,
                          padding: '8px 16px', fontSize: 12,
                          fontWeight: 700, cursor: 'pointer'
                        }}>Find Mentor</button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{
                background: '#FFF7ED', borderRadius: 16,
                padding: '24px', textAlign: 'center',
                border: '2px dashed #F4A261', marginBottom: 24
              }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🎯</div>
                <p style={{ color: '#14213D', fontWeight: 700, marginBottom: 8 }}>
                  No recommendations yet!
                </p>
                <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 16 }}>
                  Complete your skill profile to get personalised business ideas.
                </p>
                <button onClick={() => navigate('/onboarding')} style={{
                  background: '#F4A261', color: '#fff',
                  border: 'none', borderRadius: 10,
                  padding: '10px 24px', fontWeight: 700, cursor: 'pointer'
                }}>Complete Profile →</button>
              </div>
            )}

            {/* Quick Actions */}
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#14213D', marginBottom: 14 }}>
              ⚡ Quick Actions
            </h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
  { label: '🔍 Explore Ideas', path: '/ideas' },
  { label: '📚 Browse Resources', tab: 'resources' },
  { label: '👥 Meet Mentors', path: '/mentors' },
  { label: '🗺️ Continue Roadmap', tab: 'roadmap' },
].map(a => (
  <button key={a.label} onClick={() => a.path ? navigate(a.path) : setActiveTab(a.tab)} style={{
    background: '#fff', color: '#14213D',
    border: '2px solid #E5E7EB', borderRadius: 10,
    padding: '10px 18px', fontSize: 13,
    fontWeight: 600, cursor: 'pointer'
  }}>{a.label}</button>
))}
            </div>
          </div>
        )}

        {/* IDEAS TAB */}
        {activeTab === 'ideas' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#14213D' }}>💡 Recommended Ideas</h3>
  <div style={{ display: 'flex', gap: 8 }}>
    <button onClick={() => navigate('/ideas')} style={{
      background: '#E0F2F1', color: '#0D7377',
      border: 'none', borderRadius: 8,
      padding: '8px 16px', fontSize: 12,
      fontWeight: 700, cursor: 'pointer'
    }}>Browse All →</button>
    <button onClick={() => navigate('/onboarding')} style={{
      background: '#0D7377', color: '#fff',
      border: 'none', borderRadius: 8,
      padding: '8px 16px', fontSize: 12,
      fontWeight: 700, cursor: 'pointer'
    }}>+ Update Profile</button>
  </div>
</div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>⏳ Loading...</div>
            ) : recommended.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
                <p>No ideas yet. Complete your profile first!</p>
                <button onClick={() => navigate('/onboarding')} style={{
                  background: '#0D7377', color: '#fff', border: 'none',
                  borderRadius: 10, padding: '10px 24px',
                  fontWeight: 700, cursor: 'pointer', marginTop: 12
                }}>Go to Onboarding →</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recommended.map((idea, idx) => (
                  <div key={idea._id} style={{
                    background: '#fff', borderRadius: 14,
                    padding: '16px 20px', display: 'flex',
                    alignItems: 'center', gap: 14,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: idx === 0 ? '2px solid #0D7377' : '2px solid transparent'
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: '#E0F2F1', fontSize: 26,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>{idea.icon || '💡'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#14213D', marginBottom: 2 }}>
                        {idea.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>{idea.description}</div>
                    </div>
                    {idea.matchPercentage && (
                      <span style={{
                        background: '#E0F2F1', color: '#0D7377',
                        borderRadius: 20, padding: '4px 10px',
                        fontSize: 11, fontWeight: 700
                      }}>{idea.matchPercentage}% match</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ROADMAP TAB */}
        {activeTab === 'roadmap' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#14213D', marginBottom: 16 }}>
              🗺️ Your Business Roadmap
            </h3>
            <div style={{
              background: '#fff', borderRadius: 16,
              padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              {ROADMAP_STEPS.map((step, idx) => (
                <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: step.done ? '#0D7377' : '#F3F4F6',
                      border: `2px solid ${step.done ? '#0D7377' : '#E5E7EB'}`,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center',
                      color: step.done ? '#fff' : '#9CA3AF',
                      fontSize: 14, fontWeight: 700, flexShrink: 0
                    }}>
                      {step.done ? '✓' : idx + 1}
                    </div>
                    {idx < ROADMAP_STEPS.length - 1 && (
                      <div style={{
                        width: 2, height: 32,
                        background: step.done ? '#0D7377' : '#E5E7EB',
                        margin: '4px 0'
                      }} />
                    )}
                  </div>
                  <div style={{ paddingTop: 6 }}>
                    <div style={{
                      fontWeight: 700, fontSize: 14,
                      color: step.done ? '#0D7377' : '#14213D', marginBottom: 2
                    }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 24 }}>
                      {step.done ? '✅ Completed' : idx === completedSteps ? '👉 Up next' : '⏳ Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#14213D', marginBottom: 16 }}>
              📚 Learning Resources
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {RESOURCES.map(r => (
                <div key={r.id} style={{
                  background: '#fff', borderRadius: 14,
                  padding: '16px 20px', display: 'flex',
                  alignItems: 'center', gap: 14,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: '#E0F2F1', fontSize: 24,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{r.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#14213D', marginBottom: 4 }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>
                      {r.type.toUpperCase()} • {r.duration}
                    </div>
                  </div>
                  <button style={{
                    background: '#0D7377', color: '#fff',
                    border: 'none', borderRadius: 8,
                    padding: '8px 14px', fontSize: 12,
                    fontWeight: 700, cursor: 'pointer'
                  }}>Open →</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MENTORS TAB */}
        {activeTab === 'mentors' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#14213D', marginBottom: 16 }}>
              👥 Find a Mentor
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {MENTORS.map(m => (
                <div key={m.id} style={{
                  background: '#fff', borderRadius: 14,
                  padding: '20px', display: 'flex',
                  alignItems: 'center', gap: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: '#E0F2F1', fontSize: 30,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{m.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: '#14213D', marginBottom: 2 }}>
                      {m.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>
                      {m.expertise} • {m.sessions} sessions
                    </div>
                    <div>{'⭐'.repeat(5)}
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#F4A261', marginLeft: 4 }}>
                        {m.rating}
                      </span>
                    </div>
                  </div>
                  <button style={{
                    background: '#0D7377', color: '#fff',
                    border: 'none', borderRadius: 8,
                    padding: '10px 18px', fontSize: 12,
                    fontWeight: 700, cursor: 'pointer'
                  }}>Book Session</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
