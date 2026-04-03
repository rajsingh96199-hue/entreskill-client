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

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [recommended, setRecommended] = useState([])
  const [savedIdeas, setSavedIdeas] = useState([])
  const [loading, setLoading] = useState(true)

  const completedSteps = ROADMAP_STEPS.filter(s => s.done).length
  const progressPct = Math.round((completedSteps / ROADMAP_STEPS.length) * 100)
  const topIdea = recommended[0] || null

  const hasProfile = user?.skills?.length > 0

  useEffect(() => {
    const load = async () => {
      try {
        const [recRes, savedRes] = await Promise.all([
          ideasAPI.getRecommended(),
          ideasAPI.getSaved(),
        ])
        setRecommended(recRes.data.data)
        setSavedIdeas(savedRes.data.data)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    load()
  }, [])

  const diffColor = { beginner: COLORS.success, intermediate: COLORS.warning, expert: COLORS.danger }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'roadmap', label: 'My Roadmap' },
    { id: 'saved', label: `Saved (${savedIdeas.length})` },
  ]

  return (
    <div style={{ minHeight: '100vh', background: COLORS.gray50, fontFamily: FONTS.body }}>

      {/* Tab Bar */}
      <div style={{
        background: COLORS.white,
        borderBottom: `1px solid ${COLORS.gray200}`,
        padding: '0 40px', display: 'flex', gap: 0,
      }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: 'transparent',
            color: activeTab === tab.id ? COLORS.navy900 : COLORS.gray400,
            border: 'none',
            borderBottom: activeTab === tab.id ? `2px solid ${COLORS.gold500}` : '2px solid transparent',
            padding: '16px 20px', fontSize: 13,
            fontWeight: activeTab === tab.id ? 700 : 500,
            cursor: 'pointer', fontFamily: FONTS.body,
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>

            {/* No profile yet — push to onboarding */}
            {!hasProfile && (
              <div style={{
                background: `linear-gradient(135deg, ${COLORS.navy900}, ${COLORS.navy700})`,
                borderRadius: 18, padding: '36px 40px', marginBottom: 24,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: 24,
              }}>
                <div>
                  <p style={{ fontSize: 11, color: COLORS.gold400, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
                    You're almost there
                  </p>
                  <h2 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 800, color: COLORS.white, marginBottom: 8 }}>
                    Tell us your skills to get started
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>
                    Takes 2 minutes. We'll find the best business ideas for you.
                  </p>
                </div>
                <button onClick={() => navigate('/onboarding')} style={{
                  background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
                  color: COLORS.navy900, border: 'none',
                  borderRadius: 10, padding: '14px 32px',
                  fontSize: 14, fontWeight: 800,
                  cursor: 'pointer', fontFamily: FONTS.body,
                  boxShadow: SHADOWS.gold, whiteSpace: 'nowrap',
                }}>Find My Business Ideas →</button>
              </div>
            )}

            {/* Has profile — show top match */}
            {hasProfile && (
              <>
                {/* Welcome */}
                <div style={{ marginBottom: 28 }}>
                  <h1 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 800, color: COLORS.navy900, marginBottom: 4 }}>
                    Good to see you, {user?.name?.split(' ')[0]} 👋
                  </h1>
                  <p style={{ fontSize: 14, color: COLORS.gray500 }}>
                    Here's what's recommended for you based on your skills in <b style={{ color: COLORS.navy700 }}>{user?.skills?.slice(0,2).join(', ')}</b>
                  </p>
                </div>

                {/* Progress */}
                <div style={{ ...CARD, marginBottom: 20, padding: '20px 24px', borderLeft: `4px solid ${COLORS.gold500}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.navy900 }}>
                      {topIdea ? `${topIdea.title} Roadmap` : 'Your Roadmap'}
                    </span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: COLORS.gold500, fontFamily: FONTS.display }}>{progressPct}% done</span>
                  </div>
                  <div style={{ height: 6, background: COLORS.gray100, borderRadius: 3, marginBottom: 8 }}>
                    <div style={{
                      width: `${progressPct}%`, height: '100%',
                      background: `linear-gradient(90deg, ${COLORS.gold500}, ${COLORS.gold400})`,
                      borderRadius: 3, transition: 'width 0.8s ease',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: COLORS.gray400 }}>{completedSteps} of {ROADMAP_STEPS.length} steps complete</span>
                    <button onClick={() => setActiveTab('roadmap')} style={{
                      background: 'transparent', color: COLORS.gold500,
                      border: 'none', fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', fontFamily: FONTS.body,
                    }}>Continue →</button>
                  </div>
                </div>

                {/* Top Match */}
                {loading ? (
                  <div style={{ ...CARD, textAlign: 'center', color: COLORS.gray400, padding: '32px' }}>⏳ Loading your recommendations...</div>
                ) : topIdea ? (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                      Recommended for you based on your skills
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                      {recommended.slice(0, 3).map((idea, idx) => (
                        <div key={idea._id} style={{
                          ...CARD, padding: '20px',
                          borderTop: idx === 0 ? `3px solid ${COLORS.gold500}` : `3px solid ${COLORS.gray200}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                          onClick={() => navigate(`/roadmap/${idea._id}`)}
                          onMouseEnter={e => e.currentTarget.style.boxShadow = SHADOWS.lg}
                          onMouseLeave={e => e.currentTarget.style.boxShadow = SHADOWS.md}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                            <div style={{
                              width: 44, height: 44, borderRadius: 12,
                              background: idx === 0 ? COLORS.gold50 : COLORS.navy50,
                              border: `1px solid ${idx === 0 ? COLORS.gold200 : COLORS.navy100}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                            }}>{idea.icon || '💡'}</div>
                            {idx === 0 && (
                              <span style={{ background: COLORS.gold100, color: COLORS.gold600, borderRadius: 100, padding: '3px 10px', fontSize: 10, fontWeight: 700 }}>
                                Best Match
                              </span>
                            )}
                          </div>
                          <h3 style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: COLORS.navy900, marginBottom: 6 }}>{idea.title}</h3>
                          <p style={{ fontSize: 12, color: COLORS.gray500, lineHeight: 1.6, marginBottom: 14 }}>{idea.description}</p>
                          {idea.matchPercentage && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                              <div style={{ flex: 1, height: 4, background: COLORS.gray100, borderRadius: 2 }}>
                                <div style={{ width: `${idea.matchPercentage}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS.gold500}, ${COLORS.gold400})`, borderRadius: 2 }} />
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold500 }}>{idea.matchPercentage}% match</span>
                            </div>
                          )}
                          <button style={{
                            width: '100%', padding: '9px',
                            background: idx === 0 ? `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})` : COLORS.gray50,
                            color: idx === 0 ? COLORS.white : COLORS.navy700,
                            border: `1px solid ${idx === 0 ? 'transparent' : COLORS.gray200}`,
                            borderRadius: 8, fontSize: 12, fontWeight: 700,
                            cursor: 'pointer', fontFamily: FONTS.body,
                          }}>Open Roadmap →</button>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                      <button onClick={() => navigate('/ideas')} style={{
                        background: COLORS.white, color: COLORS.navy700,
                        border: `1px solid ${COLORS.gray200}`, borderRadius: 8,
                        padding: '10px 20px', fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', fontFamily: FONTS.body,
                      }}>View All Ideas →</button>
                      <button onClick={() => navigate('/mentors')} style={{
                        background: COLORS.white, color: COLORS.navy700,
                        border: `1px solid ${COLORS.gray200}`, borderRadius: 8,
                        padding: '10px 20px', fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', fontFamily: FONTS.body,
                      }}>Find a Mentor →</button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}

        {/* ROADMAP TAB */}
        {activeTab === 'roadmap' && (
          <div style={{ maxWidth: 640 }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 800, color: COLORS.navy900, marginBottom: 4 }}>
                {topIdea ? `${topIdea.title} Roadmap` : 'Your Business Roadmap'}
              </h2>
              <p style={{ fontSize: 13, color: COLORS.gray500 }}>
                Complete each step to launch your business.
              </p>
            </div>

            <div style={{ ...CARD, marginBottom: 16, padding: '16px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: COLORS.gray600, fontWeight: 600 }}>Progress</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: COLORS.gold500, fontFamily: FONTS.display }}>{progressPct}%</span>
              </div>
              <div style={{ height: 6, background: COLORS.gray100, borderRadius: 3 }}>
                <div style={{ width: `${progressPct}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS.gold500}, ${COLORS.gold400})`, borderRadius: 3 }} />
              </div>
            </div>

            <div style={{ ...CARD }}>
              {ROADMAP_STEPS.map((step, idx) => (
                <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: step.done ? COLORS.navy800 : COLORS.gray100,
                      border: `2px solid ${step.done ? COLORS.navy800 : COLORS.gray200}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: step.done ? COLORS.gold400 : COLORS.gray400,
                      fontSize: 12, fontWeight: 800, flexShrink: 0,
                    }}>{step.done ? '✓' : idx + 1}</div>
                    {idx < ROADMAP_STEPS.length - 1 && (
                      <div style={{ width: 2, height: 32, background: step.done ? COLORS.navy200 : COLORS.gray200, margin: '4px 0' }} />
                    )}
                  </div>
                  <div style={{ paddingTop: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: step.done ? COLORS.navy800 : COLORS.gray700, marginBottom: 3 }}>{step.title}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray400, marginBottom: 24 }}>
                      {step.done ? '✅ Completed' : idx === completedSteps ? '👉 Up next — click to start' : '⏳ Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {topIdea && (
              <button onClick={() => navigate(`/roadmap/${topIdea._id}`)} style={{
                width: '100%', marginTop: 16, padding: '14px',
                background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
                color: COLORS.navy900, border: 'none', borderRadius: 10,
                fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: FONTS.body,
                boxShadow: SHADOWS.gold,
              }}>Open Full Roadmap →</button>
            )}
          </div>
        )}

        {/* SAVED TAB */}
        {activeTab === 'saved' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 800, color: COLORS.navy900, marginBottom: 4 }}>
                Saved Ideas
              </h2>
              <p style={{ fontSize: 13, color: COLORS.gray500 }}>Business ideas you've bookmarked</p>
            </div>

            {savedIdeas.length === 0 ? (
              <div style={{ ...CARD, textAlign: 'center', padding: '48px', border: `2px dashed ${COLORS.gray200}` }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔖</div>
                <p style={{ fontWeight: 700, color: COLORS.navy900, marginBottom: 8 }}>No saved ideas yet</p>
                <p style={{ fontSize: 13, color: COLORS.gray500, marginBottom: 20 }}>Browse ideas and save the ones that interest you.</p>
                <button onClick={() => navigate('/ideas')} style={{
                  background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
                  color: COLORS.navy900, border: 'none', borderRadius: 8,
                  padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body, fontSize: 13,
                }}>Browse Ideas →</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {savedIdeas.map((idea, idx) => (
                  <div key={idea._id} style={{ ...CARD, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: COLORS.navy50, border: `1px solid ${COLORS.navy100}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{idea.icon || '💡'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.navy900, marginBottom: 3 }}>{idea.title}</div>
                      <div style={{ fontSize: 12, color: COLORS.gray500 }}>{idea.category}</div>
                    </div>
                    <button onClick={() => navigate(`/roadmap/${idea._id}`)} style={{
                      background: `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`,
                      color: COLORS.white, border: 'none', borderRadius: 8,
                      padding: '8px 16px', fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', fontFamily: FONTS.body,
                    }}>Open →</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}