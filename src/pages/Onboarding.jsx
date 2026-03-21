import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { profileAPI, ideasAPI } from '../services/api'

// ── Mock Data ────────────────────────────────────────────────────────────────
const SKILLS = [
  { id: 'tailoring', label: 'Tailoring', icon: '🧵' },
  { id: 'baking', label: 'Baking', icon: '🍞' },
  { id: 'cooking', label: 'Cooking', icon: '🍳' },
  { id: 'coding', label: 'Coding', icon: '💻' },
  { id: 'design', label: 'Graphic Design', icon: '🎨' },
  { id: 'repair', label: 'Electronics Repair', icon: '🔧' },
  { id: 'teaching', label: 'Teaching', icon: '📚' },
  { id: 'photography', label: 'Photography', icon: '📷' },
  { id: 'handicrafts', label: 'Handicrafts', icon: '🪡' },
  { id: 'beauty', label: 'Beauty & Makeup', icon: '💄' },
  { id: 'fitness', label: 'Fitness Training', icon: '🏋️' },
  { id: 'writing', label: 'Content Writing', icon: '✍️' },
]

const INTERESTS = [
  { id: 'food', label: 'Food & Beverages', icon: '🍽️', color: '#F97316' },
  { id: 'fashion', label: 'Fashion & Apparel', icon: '👗', color: '#EC4899' },
  { id: 'tech', label: 'Technology', icon: '⚡', color: '#3B82F6' },
  { id: 'home', label: 'Home Services', icon: '🏠', color: '#10B981' },
  { id: 'education', label: 'Education', icon: '🎓', color: '#8B5CF6' },
  { id: 'wellness', label: 'Health & Wellness', icon: '🌿', color: '#14B8A6' },
  { id: 'art', label: 'Arts & Crafts', icon: '🖼️', color: '#F59E0B' },
  { id: 'media', label: 'Digital & Media', icon: '📱', color: '#6366F1' },
]

const EXPERIENCE = [
  { id: 'beginner', label: 'Just Starting Out', desc: 'New to this, learning the basics', icon: '🌱' },
  { id: 'intermediate', label: 'Some Experience', desc: 'Practiced for 1–2 years', icon: '🌿' },
  { id: 'expert', label: 'Experienced Pro', desc: '3+ years of hands-on work', icon: '🌳' },
]

// ── Step 1: Welcome ──────────────────────────────────────────────────────────
function StepWelcome({ onNext, userName }) {
  return (
    <div style={{ textAlign: 'center', padding: '10px 0' }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>🚀</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: '#14213D', marginBottom: 12 }}>
        Hey {userName}! Let's Find Your
        <span style={{ color: '#0D7377' }}> Business Idea</span>
      </h1>
      <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 32, lineHeight: 1.7 }}>
        Answer 3 quick questions and we'll match you with
        the best business ideas for your skills.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
        {['🎯 Personalised matches', '🗺️ Step-by-step roadmap', '👥 Mentor support'].map(t => (
          <div key={t} style={{
            background: '#E0F2F1', color: '#0D7377',
            borderRadius: 20, padding: '8px 16px',
            fontSize: 13, fontWeight: 600
          }}>{t}</div>
        ))}
      </div>
      <button onClick={onNext} style={{
        background: '#F4A261', color: '#fff',
        border: 'none', borderRadius: 12,
        padding: '14px 40px', fontSize: 16,
        fontWeight: 700, cursor: 'pointer'
      }}>
        Let's Get Started →
      </button>
    </div>
  )
}

// ── Step 2: Skills ───────────────────────────────────────────────────────────
function StepSkills({ selected, onToggle, onNext, onBack }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#0D7377', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Step 1 of 3</p>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#14213D', marginBottom: 6 }}>What are your skills?</h2>
      <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 20 }}>Select all that apply.</p>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10, marginBottom: 24
      }}>
        {SKILLS.map(s => {
          const active = selected.includes(s.id)
          return (
            <div key={s.id} onClick={() => onToggle(s.id)} style={{
              border: `2px solid ${active ? '#0D7377' : '#E5E7EB'}`,
              background: active ? '#E0F2F1' : '#fff',
              borderRadius: 12, padding: '12px 8px',
              cursor: 'pointer', textAlign: 'center',
              transition: 'all 0.2s'
            }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: active ? '#0D7377' : '#14213D' }}>
                {s.label}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#6B7280', fontSize: 13 }}>{selected.length} selected</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onBack} style={{
            background: 'transparent', color: '#0D7377',
            border: '2px solid #0D7377', borderRadius: 10,
            padding: '10px 22px', fontWeight: 700, cursor: 'pointer'
          }}>← Back</button>
          <button onClick={onNext} disabled={selected.length === 0} style={{
            background: selected.length === 0 ? '#E5E7EB' : '#0D7377',
            color: selected.length === 0 ? '#9CA3AF' : '#fff',
            border: 'none', borderRadius: 10,
            padding: '10px 22px', fontWeight: 700,
            cursor: selected.length === 0 ? 'not-allowed' : 'pointer'
          }}>Next →</button>
        </div>
      </div>
    </div>
  )
}

// ── Step 3: Interests ────────────────────────────────────────────────────────
function StepInterests({ selected, onToggle, onNext, onBack }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#F4A261', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Step 2 of 3</p>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#14213D', marginBottom: 6 }}>What excites you?</h2>
      <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 20 }}>Choose industries that interest you.</p>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 10, marginBottom: 24
      }}>
        {INTERESTS.map(i => {
          const active = selected.includes(i.id)
          return (
            <div key={i.id} onClick={() => onToggle(i.id)} style={{
              border: `2px solid ${active ? i.color : '#E5E7EB'}`,
              background: active ? i.color + '15' : '#fff',
              borderRadius: 12, padding: '14px 16px',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: 12,
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: 26 }}>{i.icon}</span>
              <div style={{ fontWeight: 700, fontSize: 13, color: active ? i.color : '#14213D' }}>
                {i.label}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#6B7280', fontSize: 13 }}>{selected.length} selected</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onBack} style={{
            background: 'transparent', color: '#0D7377',
            border: '2px solid #0D7377', borderRadius: 10,
            padding: '10px 22px', fontWeight: 700, cursor: 'pointer'
          }}>← Back</button>
          <button onClick={onNext} disabled={selected.length === 0} style={{
            background: selected.length === 0 ? '#E5E7EB' : '#0D7377',
            color: selected.length === 0 ? '#9CA3AF' : '#fff',
            border: 'none', borderRadius: 10,
            padding: '10px 22px', fontWeight: 700,
            cursor: selected.length === 0 ? 'not-allowed' : 'pointer'
          }}>Next →</button>
        </div>
      </div>
    </div>
  )
}

// ── Step 4: Experience ───────────────────────────────────────────────────────
function StepExperience({ selected, onSelect, onNext, onBack }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#E76F51', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Step 3 of 3</p>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#14213D', marginBottom: 6 }}>Your experience level?</h2>
      <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 20 }}>We'll tailor your roadmap to match.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {EXPERIENCE.map(e => {
          const active = selected === e.id
          return (
            <div key={e.id} onClick={() => onSelect(e.id)} style={{
              border: `2px solid ${active ? '#0D7377' : '#E5E7EB'}`,
              background: active ? '#E0F2F1' : '#fff',
              borderRadius: 14, padding: '16px 20px',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: 16,
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: 30 }}>{e.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: active ? '#0D7377' : '#14213D' }}>
                  {e.label}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{e.desc}</div>
              </div>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                border: `2px solid ${active ? '#0D7377' : '#E5E7EB'}`,
                background: active ? '#0D7377' : 'transparent',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff', fontSize: 11
              }}>
                {active ? '✓' : ''}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{
          background: 'transparent', color: '#0D7377',
          border: '2px solid #0D7377', borderRadius: 10,
          padding: '10px 22px', fontWeight: 700, cursor: 'pointer'
        }}>← Back</button>
        <button onClick={onNext} disabled={!selected} style={{
          background: !selected ? '#E5E7EB' : '#F4A261',
          color: !selected ? '#9CA3AF' : '#fff',
          border: 'none', borderRadius: 10,
          padding: '10px 22px', fontWeight: 700,
          cursor: !selected ? 'not-allowed' : 'pointer'
        }}>Show My Ideas 🎯</button>
      </div>
    </div>
  )
}

// ── Step 5: Results ──────────────────────────────────────────────────────────
function StepResults({ ideas, loading, onRestart }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <p style={{ color: '#6B7280', fontSize: 15 }}>Finding your best matches...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#14213D', marginBottom: 6 }}>
          Your Business Matches
        </h2>
        <p style={{ color: '#6B7280', fontSize: 14 }}>
          {ideas.length} ideas found based on your profile!
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {ideas.map((idea, idx) => (
          <div key={idea._id || idx} style={{
            border: `2px solid ${idx === 0 ? '#F4A261' : '#E5E7EB'}`,
            borderRadius: 14, padding: '14px 16px',
            background: idx === 0 ? '#FFF7ED' : '#fff',
            display: 'flex', alignItems: 'center', gap: 14
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12,
              background: idx === 0 ? '#F4A26120' : '#E0F2F1',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 24, flexShrink: 0
            }}>
              {idea.icon || '💡'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#14213D' }}>{idea.title}</span>
                {idx === 0 && (
                  <span style={{
                    background: '#F4A26120', color: '#F4A261',
                    border: '1px solid #F4A26140', borderRadius: 20,
                    padding: '1px 8px', fontSize: 10, fontWeight: 700
                  }}>Best Match</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>{idea.description}</div>
              {idea.matchPercentage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ height: 5, width: 80, background: '#F3F4F6', borderRadius: 3 }}>
                    <div style={{
                      height: '100%', width: `${idea.matchPercentage}%`,
                      background: 'linear-gradient(90deg, #0D7377, #F4A261)',
                      borderRadius: 3
                    }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0D7377' }}>
                    {idea.matchPercentage}% match
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mentor Banner */}
      <div style={{
        background: '#E0F2F1', borderRadius: 12,
        padding: '16px', marginBottom: 20,
        display: 'flex', gap: 12, alignItems: 'center'
      }}>
        <span style={{ fontSize: 28 }}>👥</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#0D7377' }}>Connect with a Mentor</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Get personalised guidance for your top idea.</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button onClick={onRestart} style={{
          background: 'transparent', color: '#0D7377',
          border: '2px solid #0D7377', borderRadius: 10,
          padding: '10px 22px', fontWeight: 700, cursor: 'pointer'
        }}>↺ Start Over</button>
        <button onClick={() => navigate('/dashboard')} style={{
          background: '#0D7377', color: '#fff',
          border: 'none', borderRadius: 10,
          padding: '10px 22px', fontWeight: 700, cursor: 'pointer'
        }}>Go to Dashboard →</button>
      </div>
    </div>
  )
}

// ── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step, total }) {
  const pct = ((step - 1) / (total - 1)) * 100
  return (
    <div style={{ width: '100%', height: 4, background: '#E5E7EB', borderRadius: 4 }}>
      <div style={{
        width: `${pct}%`, height: '100%',
        background: 'linear-gradient(90deg, #0D7377, #F4A261)',
        borderRadius: 4, transition: 'width 0.5s ease'
      }} />
    </div>
  )
}

// ── Main Wizard ──────────────────────────────────────────────────────────────
const STEPS = ['Welcome', 'Skills', 'Interests', 'Experience', 'Results']

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [step, setStep] = useState(0)
  const [skills, setSkills] = useState([])
  const [interests, setInterests] = useState([])
  const [experience, setExperience] = useState('')
  const [ideas, setIdeas] = useState([])
  const [resultsLoading, setResultsLoading] = useState(false)

  const toggleSkill = (id) =>
    setSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

  const toggleInterest = (id) =>
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)

  // ── Save to MongoDB & get recommendations ────────────────────────────────
  const saveAndGetIdeas = async () => {
    setResultsLoading(true)
    setStep(4)
    try {
      // Save skills, interests, experience to MongoDB
      await profileAPI.updateSkills({ skills })
      await profileAPI.updateInterests({ interests })
      await profileAPI.updateExperience({ experience })

      // Update user in context
      updateUser({ skills, interests, experience })

      // Get recommended ideas
      const res = await ideasAPI.getRecommended()
      setIdeas(res.data.data)
    } catch (err) {
      console.error('Error saving profile:', err)
      setIdeas([])
    }
    setResultsLoading(false)
  }

  const restart = () => {
    setStep(0)
    setSkills([])
    setInterests([])
    setExperience('')
    setIdeas([])
  }

  const screens = [
    <StepWelcome onNext={next} userName={user?.name?.split(' ')[0] || 'there'} />,
    <StepSkills selected={skills} onToggle={toggleSkill} onNext={next} onBack={back} />,
    <StepInterests selected={interests} onToggle={toggleInterest} onNext={next} onBack={back} />,
    <StepExperience selected={experience} onSelect={setExperience} onNext={saveAndGetIdeas} onBack={back} />,
    <StepResults ideas={ideas} loading={resultsLoading} onRestart={restart} />,
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #14213D 0%, #0D7377 100%)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        width: '100%', maxWidth: 480,
        background: '#fff', borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #14213D, #0D7377)',
          padding: '16px 24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🌱</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>EntreSkill Hub</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: i < step ? '#0D7377' : i === step ? '#14213D' : '#ffffff30',
                  border: i === step ? '2px solid #F4A261' : 'none',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff',
                  fontSize: 11, fontWeight: 700
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </div>
          <ProgressBar step={step + 1} total={STEPS.length} />
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {screens[step]}
        </div>
      </div>
    </div>
  )
}