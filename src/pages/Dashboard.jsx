import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ideasAPI } from '../services/api'
import { COLORS, FONTS, SHADOWS, CARD } from '../styles/theme'

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

function StatCard({ icon, label, value, color, trend }) {
  return (
    <div style={{
      ...CARD, flex: 1, minWidth: 140,
      borderTop: `3px solid ${color}`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: color + '08',
      }} />
      <div style={{ fontSize: 22, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy900, fontFamily: FONTS.display, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: COLORS.gray500, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      {trend && <div style={{ fontSize: 11, color: COLORS.success, fontWeight: 600, marginTop: 4 }}>{trend}</div>}
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
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [allIdeas, setAllIdeas] = useState([])

  const completedSteps = ROADMAP_STEPS.filter(s => s.done).length
  const progressPct = Math.round((completedSteps / ROADMAP_STEPS.length) * 100)
  const topIdea = recommended[0] || null

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        const [recRes, savedRes, allRes] = await Promise.all([
          ideasAPI.getRecommended(),
          ideasAPI.getSaved(),
          ideasAPI.getAllIdeas(),
        ])
        setRecommended(recRes.data.data)
        setSavedIdeas(savedRes.data.data)
        setAllIdeas(allRes.data.data)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    loadIdeas()
  }, [])

  const filteredIdeas = allIdeas.filter(idea => {
    const matchSearch = searchQuery === '' ||
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.requiredSkills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchCat = categoryFilter === 'All' || idea.category === categoryFilter
    const matchDiff = difficultyFilter === 'All' || idea.difficulty === difficultyFilter
    return matchSearch && matchCat && matchDiff
  })

  const diffColor = { beginner: COLORS.success, intermediate: COLORS.warning, expert: COLORS.danger }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '⬡' },
    { id: 'ideas', label: 'Ideas', icon: '💡' },
    { id: 'roadmap', label: 'Roadmap', icon: '🗺️' },
    { id: 'resources', label: 'Resources', icon: '📚' },
    { id: 'mentors', label: 'Mentors', icon: '👥' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: COLORS.gray50, fontFamily: FONTS.body }}>

      {/* Top Stats Bar */}
      <div style={{
        background: COLORS.navy900,
        padding: '12px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'Ideas Explored', value: allIdeas.length },
            { label: 'Roadmap Progress', value: `${progressPct}%` },
            { label: 'Saved Ideas', value: savedIdeas.length },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.gold400, fontFamily: FONTS.display }}>{s.value}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, color: COLORS.navy900,
            }}>{user?.name?.[0]?.toUpperCase()}</div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{user?.name?.split(' ')[0]}</span>
          </div>
          <button onClick={() => { logout(); navigate('/') }} style={{
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '5px 12px',
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
            fontFamily: FONTS.body,
          }}>Sign Out</button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{
        background: COLORS.white,
        borderBottom: `1px solid ${COLORS.gray200}`,
        padding: '0 32px',
        display: 'flex', gap: 0,
      }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: 'transparent',
            color: activeTab === tab.id ? COLORS.navy800 : COLORS.gray500,
            border: 'none',
            borderBottom: activeTab === tab.id ? `2px solid ${COLORS.gold500}` : '2px solid transparent',
            padding: '16px 20px',
            fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: FONTS.body, whiteSpace: 'nowrap',
            transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 14 }}>{tab.icon}</span> {tab.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => navigate('/onboarding')} style={{
          background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
          color: COLORS.navy900, border: 'none',
          borderRadius: 8, padding: '8px 18px',
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
          fontFamily: FONTS.body, margin: '10px 0',
          boxShadow: SHADOWS.gold,
        }}>🎯 Update Profile</button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* Welcome Banner */}
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.navy900} 0%, ${COLORS.navy700} 100%)`,
              borderRadius: 18, padding: '28px 32px',
              marginBottom: 24, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', right: -40, top: -40,
                width: 200, height: 200, borderRadius: '50%',
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.08)',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: 11, color: COLORS.gold400, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                  Welcome Back
                </p>
                <h2 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 800, color: COLORS.white, marginBottom: 8 }}>
                  {user?.name?.split(' ')[0]}, ready to build today? 🚀
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 20 }}>
                  {user?.skills?.length > 0
                    ? `You have ${user.skills.length} skills — your roadmap is ${progressPct}% complete.`
                    : 'Complete your skill profile to get personalised recommendations.'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, maxWidth: 300, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                    <div style={{
                      width: `${progressPct}%`, height: '100%',
                      background: `linear-gradient(90deg, ${COLORS.gold500}, ${COLORS.gold400})`,
                      borderRadius: 3, transition: 'width 0.8s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.gold400 }}>{progressPct}% Complete</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
              <StatCard icon="💡" label="Saved Ideas" value={savedIdeas.length} color={COLORS.navy500} trend="↑ Growing" />
              <StatCard icon="🗺️" label="Steps Done" value={`${completedSteps}/${ROADMAP_STEPS.length}`} color={COLORS.gold500} />
              <StatCard icon="🎯" label="Skills" value={user?.skills?.length || 0} color="#8B5CF6" />
              <StatCard icon="👥" label="Mentors" value={MENTORS.length} color={COLORS.success} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
              {/* Top Idea */}
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  Top Match
                </h3>
                {loading ? (
                  <div style={{ ...CARD, textAlign: 'center', color: COLORS.gray400 }}>⏳ Loading...</div>
                ) : topIdea ? (
                  <div style={{
                    ...CARD, border: `1.5px solid ${COLORS.gold300}`,
                    boxShadow: SHADOWS.gold, padding: '24px',
                  }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: 14,
                        background: COLORS.gold50,
                        border: `1px solid ${COLORS.gold200}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28, flexShrink: 0,
                      }}>{topIdea.icon || '💡'}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <h3 style={{ fontSize: 17, fontWeight: 800, color: COLORS.navy900, fontFamily: FONTS.display }}>{topIdea.title}</h3>
                          {topIdea.matchPercentage && (
                            <span style={{
                              background: COLORS.gold100, color: COLORS.gold600,
                              borderRadius: 100, padding: '2px 10px',
                              fontSize: 11, fontWeight: 700,
                            }}>{topIdea.matchPercentage}% Match</span>
                          )}
                        </div>
                        <p style={{ fontSize: 13, color: COLORS.gray500, marginBottom: 16, lineHeight: 1.6 }}>{topIdea.description}</p>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button onClick={() => navigate(`/roadmap/${topIdea._id}`)} style={{
                            background: `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`,
                            color: COLORS.white, border: 'none', borderRadius: 8,
                            padding: '9px 18px', fontSize: 12, fontWeight: 700,
                            cursor: 'pointer', fontFamily: FONTS.body,
                          }}>View Roadmap →</button>
                          <button onClick={() => navigate('/mentors')} style={{
                            background: COLORS.navy50, color: COLORS.navy700,
                            border: `1px solid ${COLORS.navy100}`, borderRadius: 8,
                            padding: '9px 18px', fontSize: 12, fontWeight: 600,
                            cursor: 'pointer', fontFamily: FONTS.body,
                          }}>Find Mentor</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ ...CARD, textAlign: 'center', border: `2px dashed ${COLORS.gray200}` }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
                    <p style={{ fontWeight: 700, color: COLORS.navy900, marginBottom: 8 }}>No recommendations yet</p>
                    <button onClick={() => navigate('/onboarding')} style={{
                      background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
                      color: COLORS.navy900, border: 'none', borderRadius: 8,
                      padding: '10px 22px', fontWeight: 700, cursor: 'pointer',
                      fontFamily: FONTS.body, fontSize: 13,
                    }}>Complete Profile →</button>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  Quick Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Explore Business Ideas', icon: '💡', path: '/ideas', color: COLORS.navy500 },
                    { label: 'Browse Resources', icon: '📚', path: '/resources', color: '#8B5CF6' },
                    { label: 'Find a Mentor', icon: '👥', path: '/mentors', color: COLORS.success },
                    { label: 'Continue Roadmap', icon: '🗺️', tab: 'roadmap', color: COLORS.gold500 },
                  ].map(a => (
                    <button key={a.label} onClick={() => a.path ? navigate(a.path) : setActiveTab(a.tab)} style={{
                      background: COLORS.white,
                      border: `1px solid ${COLORS.gray200}`,
                      borderRadius: 10, padding: '13px 16px',
                      display: 'flex', alignItems: 'center', gap: 12,
                      cursor: 'pointer', fontFamily: FONTS.body,
                      boxShadow: SHADOWS.xs, textAlign: 'left',
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 8,
                        background: a.color + '15',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, flexShrink: 0,
                      }}>{a.icon}</div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy800 }}>{a.label}</span>
                      <span style={{ marginLeft: 'auto', color: COLORS.gray400, fontSize: 14 }}>→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IDEAS TAB */}
        {activeTab === 'ideas' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 800, color: COLORS.navy900, marginBottom: 4 }}>Business Ideas</h2>
              <p style={{ fontSize: 13, color: COLORS.gray500 }}>Search and filter from our curated collection</p>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: COLORS.gray400, fontSize: 15 }}>🔍</span>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search ideas, skills, categories..."
                style={{
                  width: '100%', padding: '12px 16px 12px 42px',
                  borderRadius: 10, border: `1.5px solid ${COLORS.gray200}`,
                  fontSize: 14, outline: 'none', fontFamily: FONTS.body,
                  background: COLORS.white, boxShadow: SHADOWS.xs,
                }}
              />
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              {['All', 'Food & Beverages', 'Fashion & Apparel', 'Technology', 'Home Services', 'Education', 'Health & Wellness', 'Arts & Crafts', 'Digital & Media'].map(c => (
                <button key={c} onClick={() => setCategoryFilter(c)} style={{
                  background: categoryFilter === c ? COLORS.navy800 : COLORS.white,
                  color: categoryFilter === c ? COLORS.white : COLORS.gray600,
                  border: `1px solid ${categoryFilter === c ? COLORS.navy800 : COLORS.gray200}`,
                  borderRadius: 100, padding: '5px 14px', fontSize: 12,
                  fontWeight: 600, cursor: 'pointer', fontFamily: FONTS.body,
                }}>{c}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['All', 'beginner', 'intermediate', 'expert'].map(d => (
                <button key={d} onClick={() => setDifficultyFilter(d)} style={{
                  background: difficultyFilter === d ? COLORS.gold500 : COLORS.white,
                  color: difficultyFilter === d ? COLORS.navy900 : COLORS.gray600,
                  border: `1px solid ${difficultyFilter === d ? COLORS.gold500 : COLORS.gray200}`,
                  borderRadius: 100, padding: '5px 14px', fontSize: 12,
                  fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                  fontFamily: FONTS.body,
                }}>{d}</button>
              ))}
            </div>

            <p style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 16 }}>
              Showing <b style={{ color: COLORS.navy900 }}>{filteredIdeas.length}</b> ideas
            </p>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: COLORS.gray400 }}>⏳ Loading...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredIdeas.map((idea, idx) => (
                  <div key={idea._id} style={{
                    ...CARD, padding: '18px 20px',
                    display: 'flex', alignItems: 'center', gap: 16,
                    borderLeft: idx === 0 ? `4px solid ${COLORS.gold500}` : `4px solid transparent`,
                  }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: 12,
                      background: COLORS.navy50,
                      border: `1px solid ${COLORS.navy100}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22, flexShrink: 0,
                    }}>{idea.icon || '💡'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: COLORS.navy900 }}>{idea.title}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                          color: diffColor[idea.difficulty],
                          background: diffColor[idea.difficulty] + '15',
                          borderRadius: 100, padding: '2px 8px',
                        }}>{idea.difficulty}</span>
                      </div>
                      <p style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 6 }}>{idea.description}</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {idea.requiredSkills?.slice(0, 3).map(skill => (
                          <span key={skill} style={{
                            background: COLORS.gray100, color: COLORS.gray600,
                            borderRadius: 100, padding: '2px 8px', fontSize: 10, fontWeight: 600,
                          }}>🔧 {skill}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => navigate(`/roadmap/${idea._id}`)} style={{
                        background: `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`,
                        color: COLORS.white, border: 'none', borderRadius: 8,
                        padding: '8px 16px', fontSize: 12, fontWeight: 700,
                        cursor: 'pointer', fontFamily: FONTS.body,
                      }}>Roadmap →</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ROADMAP TAB */}
        {activeTab === 'roadmap' && (
          <div style={{ maxWidth: 700 }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 800, color: COLORS.navy900, marginBottom: 4 }}>Your Roadmap</h2>
              <p style={{ fontSize: 13, color: COLORS.gray500 }}>Track your progress from idea to launch</p>
            </div>

            {/* Progress */}
            <div style={{ ...CARD, marginBottom: 24, padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Overall Progress</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.gold500, fontFamily: FONTS.display }}>{progressPct}%</span>
              </div>
              <div style={{ height: 8, background: COLORS.gray100, borderRadius: 4 }}>
                <div style={{
                  width: `${progressPct}%`, height: '100%',
                  background: `linear-gradient(90deg, ${COLORS.gold500}, ${COLORS.gold400})`,
                  borderRadius: 4, transition: 'width 0.8s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 11, color: COLORS.gray400 }}>{completedSteps} of {ROADMAP_STEPS.length} steps completed</span>
                <span style={{ fontSize: 11, color: COLORS.gray400 }}>{ROADMAP_STEPS.length - completedSteps} remaining</span>
              </div>
            </div>

            {/* Steps */}
            <div style={{ ...CARD }}>
              {ROADMAP_STEPS.map((step, idx) => (
                <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: step.done ? COLORS.navy800 : COLORS.gray100,
                      border: `2px solid ${step.done ? COLORS.navy800 : COLORS.gray200}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: step.done ? COLORS.gold400 : COLORS.gray400,
                      fontSize: 13, fontWeight: 800, flexShrink: 0,
                    }}>{step.done ? '✓' : idx + 1}</div>
                    {idx < ROADMAP_STEPS.length - 1 && (
                      <div style={{ width: 2, height: 32, background: step.done ? COLORS.navy200 : COLORS.gray200, margin: '4px 0' }} />
                    )}
                  </div>
                  <div style={{ paddingTop: 7, paddingBottom: idx < ROADMAP_STEPS.length - 1 ? 0 : 0 }}>
                    <div style={{
                      fontWeight: 700, fontSize: 14,
                      color: step.done ? COLORS.navy800 : COLORS.gray700, marginBottom: 3,
                    }}>{step.title}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray400, marginBottom: 28 }}>
                      {step.done ? '✅ Completed' : idx === completedSteps ? '👉 Current step' : '⏳ Pending'}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 800, color: COLORS.navy900, marginBottom: 4 }}>Learning Resources</h2>
                <p style={{ fontSize: 13, color: COLORS.gray500 }}>Curated content for your entrepreneurship journey</p>
              </div>
              <button onClick={() => navigate('/resources')} style={{
                background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
                color: COLORS.navy900, border: 'none', borderRadius: 8,
                padding: '9px 18px', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: FONTS.body,
              }}>Browse All →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {RESOURCES.map(r => (
                <div key={r.id} style={{ ...CARD, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: COLORS.navy50, border: `1px solid ${COLORS.navy100}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  }}>{r.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.navy900, marginBottom: 3 }}>{r.title}</div>
                    <div style={{ fontSize: 12, color: COLORS.gray500 }}>
                      <span style={{ textTransform: 'uppercase', fontWeight: 700, fontSize: 10, color: COLORS.gray400 }}>{r.type}</span>
                      {' • '}{r.duration}
                    </div>
                  </div>
                  <button style={{
                    background: COLORS.navy800, color: COLORS.white,
                    border: 'none', borderRadius: 8,
                    padding: '8px 16px', fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', fontFamily: FONTS.body,
                  }}>Open →</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MENTORS TAB */}
        {activeTab === 'mentors' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 800, color: COLORS.navy900, marginBottom: 4 }}>Expert Mentors</h2>
                <p style={{ fontSize: 13, color: COLORS.gray500 }}>Connect with verified entrepreneurs</p>
              </div>
              <button onClick={() => navigate('/mentors')} style={{
                background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
                color: COLORS.navy900, border: 'none', borderRadius: 8,
                padding: '9px 18px', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: FONTS.body,
              }}>View All →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {MENTORS.map(m => (
                <div key={m.id} style={{ ...CARD, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: COLORS.navy50, border: `1px solid ${COLORS.navy100}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, flexShrink: 0,
                  }}>{m.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: COLORS.navy900, fontFamily: FONTS.display, marginBottom: 3 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 6 }}>{m.expertise} • {m.sessions} sessions</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {'⭐'.repeat(5)}
                      <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gold500, marginLeft: 4 }}>{m.rating}</span>
                    </div>
                  </div>
                  <button onClick={() => navigate('/mentors')} style={{
                    background: `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`,
                    color: COLORS.white, border: 'none', borderRadius: 8,
                    padding: '10px 20px', fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', fontFamily: FONTS.body,
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