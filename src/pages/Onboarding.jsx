import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { profileAPI, ideasAPI } from '../services/api'
import { COLORS, FONTS, SHADOWS } from '../styles/theme'

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
  { id: 'beginner', label: 'Just Starting Out', desc: 'New to this skill, learning the basics', icon: '🌱' },
  { id: 'intermediate', label: 'Some Experience', desc: '1–2 years of hands-on practice', icon: '🌿' },
  { id: 'expert', label: 'Experienced Pro', desc: '3+ years of deep expertise', icon: '🌳' },
]

const STEPS = ['Welcome', 'Skills', 'Interests', 'Experience', 'Results']

function StepWelcome({ onNext, userName }) {
  return (
    <div style={{ textAlign: 'center', padding: '10px 0' }}>
      <div style={{
        width: 80, height: 80, borderRadius: 20,
        background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, margin: '0 auto 24px', boxShadow: SHADOWS.gold,
      }}>🚀</div>
      <h1 style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 800, color: COLORS.navy900, marginBottom: 12, lineHeight: 1.2 }}>
        Welcome, {userName}!
        <br /><span style={{ color: COLORS.gold500 }}>Let's find your business</span>
      </h1>
      <p style={{ color: COLORS.gray500, fontSize: 14, marginBottom: 32, lineHeight: 1.7, maxWidth: 340, margin: '0 auto 32px' }}>
        Answer 3 quick questions and we'll match you with the perfect business ideas for your unique skills.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
        {['🎯 Personalised matches', '🗺️ Step-by-step roadmap', '👥 Mentor support'].map(t => (
          <div key={t} style={{
            background: COLORS.navy50, color: COLORS.navy700,
            border: `1px solid ${COLORS.navy100}`,
            borderRadius: 100, padding: '7px 16px', fontSize: 12, fontWeight: 600,
          }}>{t}</div>
        ))}
      </div>
      <button onClick={onNext} style={{
        background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
        color: COLORS.navy900, border: 'none', borderRadius: 10,
        padding: '14px 40px', fontSize: 15, fontWeight: 700,
        cursor: 'pointer', fontFamily: FONTS.body, boxShadow: SHADOWS.gold,
      }}>Get Started →</button>
    </div>
  )
}

function StepSkills({ selected, onToggle, onNext, onBack }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold500, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Step 1 of 3</p>
      <h2 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 800, color: COLORS.navy900, marginBottom: 6 }}>What are your skills?</h2>
      <p style={{ color: COLORS.gray500, fontSize: 13, marginBottom: 20 }}>Select all that apply.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
        {SKILLS.map(s => {
          const active = selected.includes(s.id)
          return (
            <div key={s.id} onClick={() => onToggle(s.id)} style={{
              border: `1.5px solid ${active ? COLORS.gold500 : COLORS.gray200}`,
              background: active ? COLORS.gold50 : COLORS.white,
              borderRadius: 12, padding: '14px 10px',
              cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
              boxShadow: active ? SHADOWS.gold : SHADOWS.xs,
            }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: active ? COLORS.gold600 : COLORS.navy800 }}>{s.label}</div>
              {active && <div style={{ fontSize: 10, color: COLORS.gold500, marginTop: 3, fontWeight: 700 }}>✓</div>}
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: COLORS.gray400, fontWeight: 600 }}>{selected.length} selected</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onBack} style={{ background: COLORS.gray50, color: COLORS.gray600, border: `1.5px solid ${COLORS.gray200}`, borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body, fontSize: 13 }}>← Back</button>
          <button onClick={onNext} disabled={selected.length === 0} style={{
            background: selected.length === 0 ? COLORS.gray100 : `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`,
            color: selected.length === 0 ? COLORS.gray400 : COLORS.white,
            border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700,
            cursor: selected.length === 0 ? 'not-allowed' : 'pointer', fontFamily: FONTS.body, fontSize: 13,
          }}>Continue →</button>
        </div>
      </div>
    </div>
  )
}

function StepInterests({ selected, onToggle, onNext, onBack }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold500, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Step 2 of 3</p>
      <h2 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 800, color: COLORS.navy900, marginBottom: 6 }}>What industries excite you?</h2>
      <p style={{ color: COLORS.gray500, fontSize: 13, marginBottom: 20 }}>Choose sectors that align with your passion.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
        {INTERESTS.map(i => {
          const active = selected.includes(i.id)
          return (
            <div key={i.id} onClick={() => onToggle(i.id)} style={{
              border: `1.5px solid ${active ? i.color : COLORS.gray200}`,
              background: active ? i.color + '10' : COLORS.white,
              borderRadius: 12, padding: '14px 16px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
              transition: 'all 0.2s', boxShadow: active ? `0 4px 12px ${i.color}20` : SHADOWS.xs,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: active ? i.color + '20' : COLORS.gray50,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>{i.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: active ? i.color : COLORS.navy900 }}>{i.label}</div>
                {active && <div style={{ fontSize: 10, color: i.color, fontWeight: 700 }}>✓ Selected</div>}
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: COLORS.gray400, fontWeight: 600 }}>{selected.length} selected</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onBack} style={{ background: COLORS.gray50, color: COLORS.gray600, border: `1.5px solid ${COLORS.gray200}`, borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body, fontSize: 13 }}>← Back</button>
          <button onClick={onNext} disabled={selected.length === 0} style={{
            background: selected.length === 0 ? COLORS.gray100 : `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`,
            color: selected.length === 0 ? COLORS.gray400 : COLORS.white,
            border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700,
            cursor: selected.length === 0 ? 'not-allowed' : 'pointer', fontFamily: FONTS.body, fontSize: 13,
          }}>Continue →</button>
        </div>
      </div>
    </div>
  )
}

function StepExperience({ selected, onSelect, onNext, onBack }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold500, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Step 3 of 3</p>
      <h2 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 800, color: COLORS.navy900, marginBottom: 6 }}>Your experience level?</h2>
      <p style={{ color: COLORS.gray500, fontSize: 13, marginBottom: 20 }}>We'll tailor your roadmap accordingly.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {EXPERIENCE.map(e => {
          const active = selected === e.id
          return (
            <div key={e.id} onClick={() => onSelect(e.id)} style={{
              border: `1.5px solid ${active ? COLORS.gold500 : COLORS.gray200}`,
              background: active ? COLORS.gold50 : COLORS.white,
              borderRadius: 14, padding: '18px 20px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
              transition: 'all 0.2s', boxShadow: active ? SHADOWS.gold : SHADOWS.xs,
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                background: active ? COLORS.gold100 : COLORS.gray50,
                border: `1px solid ${active ? COLORS.gold200 : COLORS.gray200}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>{e.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: active ? COLORS.gold600 : COLORS.navy900, marginBottom: 3 }}>{e.label}</div>
                <div style={{ fontSize: 12, color: COLORS.gray500 }}>{e.desc}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${active ? COLORS.gold500 : COLORS.gray300}`,
                background: active ? COLORS.gold500 : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: active ? COLORS.navy900 : 'transparent', fontSize: 11, fontWeight: 800,
              }}>{active ? '✓' : ''}</div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ background: COLORS.gray50, color: COLORS.gray600, border: `1.5px solid ${COLORS.gray200}`, borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body, fontSize: 13 }}>← Back</button>
        <button onClick={onNext} disabled={!selected} style={{
          background: !selected ? COLORS.gray100 : `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
          color: !selected ? COLORS.gray400 : COLORS.navy900,
          border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700,
          cursor: !selected ? 'not-allowed' : 'pointer', fontFamily: FONTS.body, fontSize: 13,
          boxShadow: selected ? SHADOWS.gold : 'none',
        }}>Show My Matches 🎯</button>
      </div>
    </div>
  )
}

function StepResults({ ideas, loading, onRestart }) {
  const navigate = useNavigate()
  if (loading) return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
      <p style={{ color: COLORS.gray500, fontSize: 14, fontWeight: 600 }}>Finding your best matches...</p>
    </div>
  )
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 60, height: 60, borderRadius: 14,
          background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, margin: '0 auto 14px', boxShadow: SHADOWS.gold,
        }}>🎉</div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 800, color: COLORS.navy900, marginBottom: 4 }}>Your Business Matches</h2>
        <p style={{ color: COLORS.gray500, fontSize: 12 }}>{ideas.length} personalised ideas for your profile</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {ideas.map((idea, idx) => (
          <div key={idea._id || idx} style={{
            border: `1.5px solid ${idx === 0 ? COLORS.gold400 : COLORS.gray200}`,
            borderRadius: 14, padding: '14px 16px',
            background: idx === 0 ? COLORS.gold50 : COLORS.white,
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: idx === 0 ? SHADOWS.gold : SHADOWS.xs,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: idx === 0 ? COLORS.gold100 : COLORS.navy50,
              border: `1px solid ${idx === 0 ? COLORS.gold200 : COLORS.navy100}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0,
            }}>{idea.icon || '💡'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: COLORS.navy900 }}>{idea.title}</span>
                {idx === 0 && <span style={{ background: COLORS.gold100, color: COLORS.gold600, borderRadius: 100, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>Top Match</span>}
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray500, marginBottom: 5 }}>{idea.description}</div>
              {idea.matchPercentage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ height: 4, width: 70, background: COLORS.gray100, borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${idea.matchPercentage}%`, background: `linear-gradient(90deg, ${COLORS.gold500}, ${COLORS.gold400})`, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.gold500 }}>{idea.matchPercentage}%</span>
                </div>
              )}
            </div>
            <button onClick={() => navigate(`/roadmap/${idea._id}`)} style={{
              background: idx === 0 ? `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})` : `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`,
              color: idx === 0 ? COLORS.navy900 : COLORS.white,
              border: 'none', borderRadius: 8, padding: '7px 12px',
              fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body, flexShrink: 0,
            }}>View →</button>
          </div>
        ))}
      </div>
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`,
        borderRadius: 14, padding: '14px 18px', marginBottom: 18,
        display: 'flex', gap: 12, alignItems: 'center',
      }}>
        <div style={{ fontSize: 24 }}>👥</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: COLORS.white }}>Connect with a Mentor</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Get personalised guidance for your top idea.</div>
        </div>
        <button onClick={() => navigate('/mentors')} style={{
          background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
          color: COLORS.navy900, border: 'none', borderRadius: 8,
          padding: '7px 14px', fontSize: 11, fontWeight: 700,
          cursor: 'pointer', fontFamily: FONTS.body, flexShrink: 0,
        }}>Browse →</button>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button onClick={onRestart} style={{ background: COLORS.gray50, color: COLORS.gray600, border: `1.5px solid ${COLORS.gray200}`, borderRadius: 8, padding: '10px 18px', fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body, fontSize: 12 }}>↺ Start Over</button>
        <button onClick={() => navigate('/dashboard')} style={{ background: `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`, color: COLORS.white, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body, fontSize: 12 }}>Dashboard →</button>
      </div>
    </div>
  )
}

export default function Onboarding() {
  const { user, updateUser } = useAuth()
  const [step, setStep] = useState(0)
  const [skills, setSkills] = useState([])
  const [interests, setInterests] = useState([])
  const [experience, setExperience] = useState('')
  const [ideas, setIdeas] = useState([])
  const [resultsLoading, setResultsLoading] = useState(false)

  const toggleSkill = id => setSkills(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id])
  const toggleInterest = id => setInterests(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])
  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)

  const saveAndGetIdeas = async () => {
    setResultsLoading(true); setStep(4)
    try {
      await profileAPI.updateSkills({ skills })
      await profileAPI.updateInterests({ interests })
      await profileAPI.updateExperience({ experience })
      updateUser({ skills, interests, experience })
      const res = await ideasAPI.getRecommended()
      setIdeas(res.data.data)
    } catch { setIdeas([]) }
    setResultsLoading(false)
  }

  const restart = () => { setStep(0); setSkills([]); setInterests([]); setExperience(''); setIdeas([]) }

  const screens = [
    <StepWelcome onNext={next} userName={user?.name?.split(' ')[0] || 'there'} />,
    <StepSkills selected={skills} onToggle={toggleSkill} onNext={next} onBack={back} />,
    <StepInterests selected={interests} onToggle={toggleInterest} onNext={next} onBack={back} />,
    <StepExperience selected={experience} onSelect={setExperience} onNext={saveAndGetIdeas} onBack={back} />,
    <StepResults ideas={ideas} loading={resultsLoading} onRestart={restart} />,
  ]

  return (
    <div style={{
      minHeight: '100vh', fontFamily: FONTS.body,
      background: `linear-gradient(145deg, ${COLORS.navy900} 0%, #0D1F3C 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(44,79,124,0.12)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 520, background: COLORS.white, borderRadius: 24, boxShadow: '0 32px 80px rgba(10,22,40,0.4)', overflow: 'hidden', position: 'relative' }}>

        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${COLORS.navy900}, ${COLORS.navy700})`, padding: '20px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: COLORS.navy900 }}>E</div>
              <span style={{ fontFamily: FONTS.display, color: COLORS.white, fontSize: 14, fontWeight: 700 }}>EntreSkill Hub</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: i < step ? COLORS.gold500 : i === step ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
                  border: i === step ? `2px solid ${COLORS.gold500}` : i < step ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: i < step ? COLORS.navy900 : i === step ? COLORS.gold400 : 'rgba(255,255,255,0.25)',
                  fontSize: 10, fontWeight: 800,
                }}>{i < step ? '✓' : i + 1}</div>
              ))}
            </div>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
            <div style={{ width: `${(step / (STEPS.length - 1)) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS.gold500}, ${COLORS.gold400})`, borderRadius: 2, transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px' }}>{screens[step]}</div>
      </div>
    </div>
  )
}