import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COLORS, FONTS, SHADOWS, CARD } from '../styles/theme'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1' })

export default function RoadmapPage() {
  const { ideaId } = useParams()
  const navigate = useNavigate()
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completedSteps, setCompletedSteps] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => { loadRoadmap() }, [ideaId])

  const loadRoadmap = async () => {
    try {
      const res = await api.get(`/roadmaps/${ideaId}`)
      setRoadmap(res.data.data)
      try {
        const progressRes = await api.get(`/roadmaps/${res.data.data._id}/progress`, { headers })
        setCompletedSteps(progressRes.data.data.completedSteps || [])
      } catch { setCompletedSteps([]) }
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const toggleStep = async (stepNumber) => {
    const updated = completedSteps.includes(stepNumber)
      ? completedSteps.filter(s => s !== stepNumber)
      : [...completedSteps, stepNumber]
    setCompletedSteps(updated)
    setSaving(true)
    try {
      await api.put(`/roadmaps/${roadmap._id}/progress`, { completedSteps: updated }, { headers })
      setMessage('✅ Progress saved!')
      setTimeout(() => setMessage(''), 2000)
    } catch { setMessage('❌ Failed to save') }
    setSaving(false)
  }

  const progressPct = roadmap ? Math.round((completedSteps.length / roadmap.steps.length) * 100) : 0

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.gray50, fontFamily: FONTS.body }}>
      <div style={{ textAlign: 'center', color: COLORS.gray400 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
        <p style={{ fontWeight: 600 }}>Loading roadmap...</p>
      </div>
    </div>
  )

  if (!roadmap) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.gray50, fontFamily: FONTS.body }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
        <p style={{ fontWeight: 700, fontSize: 16, color: COLORS.navy900, marginBottom: 16 }}>No roadmap found for this idea yet</p>
        <button onClick={() => navigate('/dashboard')} style={{
          background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
          color: COLORS.navy900, border: 'none', borderRadius: 10,
          padding: '12px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body,
        }}>← Back to Dashboard</button>
      </div>
    </div>
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
        background: `linear-gradient(135deg, ${COLORS.navy900}, ${COLORS.navy700})`,
        padding: '40px 60px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
            padding: '7px 16px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: FONTS.body, marginBottom: 24,
          }}>← Dashboard</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
            }}>{roadmap.ideaId?.icon || '💡'}</div>
            <div>
              <p style={{ fontSize: 11, color: COLORS.gold400, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
                {roadmap.ideaId?.category}
              </p>
              <h1 style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 800, color: COLORS.white }}>{roadmap.title}</h1>
            </div>
          </div>

          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24, maxWidth: 500 }}>{roadmap.description}</p>

          {/* Meta Pills */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            {[
              { icon: '⏱️', label: roadmap.totalDuration },
              { icon: '💰', label: roadmap.estimatedCost },
              { icon: '📊', label: roadmap.difficulty },
              { icon: '📋', label: `${roadmap.steps.length} Steps` },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 100, padding: '6px 14px',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ fontSize: 12 }}>{s.icon}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'capitalize' }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                {completedSteps.length} of {roadmap.steps.length} steps complete
              </span>
              <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.gold400, fontFamily: FONTS.display }}>{progressPct}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
              <div style={{
                width: `${progressPct}%`, height: '100%',
                background: `linear-gradient(90deg, ${COLORS.gold500}, ${COLORS.gold400})`,
                borderRadius: 3, transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>

          {/* Sidebar */}
          <div style={{
            ...CARD, height: 'fit-content',
            position: 'sticky', top: 24, padding: '20px',
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
              Steps Overview
            </p>
            {roadmap.steps.map((step, idx) => {
              const done = completedSteps.includes(step.stepNumber)
              const active = activeStep === idx
              return (
                <div key={step.stepNumber} onClick={() => setActiveStep(idx)} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                  background: active ? COLORS.navy50 : 'transparent',
                  border: active ? `1px solid ${COLORS.navy100}` : '1px solid transparent',
                  marginBottom: 4, transition: 'all 0.2s',
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: done ? COLORS.navy800 : active ? COLORS.gold500 : COLORS.gray100,
                    border: `2px solid ${done ? COLORS.navy800 : active ? COLORS.gold500 : COLORS.gray200}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: done ? COLORS.gold400 : active ? COLORS.navy900 : COLORS.gray400,
                    fontSize: 10, fontWeight: 800,
                  }}>{done ? '✓' : step.stepNumber}</div>
                  <span style={{
                    fontSize: 12, fontWeight: active ? 700 : 500,
                    color: done ? COLORS.navy800 : active ? COLORS.navy900 : COLORS.gray500,
                    lineHeight: 1.3,
                  }}>{step.title}</span>
                </div>
              )
            })}

            {progressPct === 100 && (
              <div style={{
                marginTop: 16, background: COLORS.gold50,
                border: `1px solid ${COLORS.gold200}`,
                borderRadius: 10, padding: '12px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>🏆</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gold600 }}>Roadmap Complete!</div>
              </div>
            )}
          </div>

          {/* Step Detail */}
          <div>
            {roadmap.steps.map((step, idx) => {
              const done = completedSteps.includes(step.stepNumber)
              if (activeStep !== idx) return null

              return (
                <div key={step.stepNumber}>
                  {/* Step Header */}
                  <div style={{ ...CARD, marginBottom: 16, borderTop: `3px solid ${done ? COLORS.gold500 : COLORS.navy800}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold500, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
                          Step {step.stepNumber} of {roadmap.steps.length}
                        </p>
                        <h2 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 800, color: COLORS.navy900, marginBottom: 4 }}>
                          {step.title}
                        </h2>
                        <p style={{ fontSize: 12, color: COLORS.gray500 }}>⏱️ Estimated: {step.estimatedTime}</p>
                      </div>
                      <button onClick={() => toggleStep(step.stepNumber)} disabled={saving} style={{
                        background: done ? COLORS.navy800 : COLORS.gray50,
                        color: done ? COLORS.gold400 : COLORS.gray600,
                        border: `1.5px solid ${done ? COLORS.navy800 : COLORS.gray200}`,
                        borderRadius: 8, padding: '8px 18px', fontSize: 12,
                        fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body,
                        flexShrink: 0,
                      }}>{done ? '✓ Completed' : 'Mark Complete'}</button>
                    </div>
                    <p style={{ fontSize: 14, color: COLORS.gray600, lineHeight: 1.7 }}>{step.description}</p>
                  </div>

                  {/* Tasks */}
                  <div style={{ ...CARD, marginBottom: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.navy900, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 24, height: 24, borderRadius: 6,
                        background: COLORS.navy50, border: `1px solid ${COLORS.navy100}`,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12,
                      }}>✅</span>
                      Tasks to Complete
                    </h3>
                    {step.tasks.map((task, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '10px 0',
                        borderBottom: i < step.tasks.length - 1 ? `1px solid ${COLORS.gray100}` : 'none',
                      }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                          background: done ? COLORS.gold50 : COLORS.navy50,
                          border: `1px solid ${done ? COLORS.gold200 : COLORS.navy100}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 800,
                          color: done ? COLORS.gold600 : COLORS.navy500, marginTop: 1,
                        }}>{done ? '✓' : i + 1}</div>
                        <span style={{ fontSize: 13, color: COLORS.gray700, lineHeight: 1.6 }}>{task}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tips */}
                  {step.tips && step.tips.length > 0 && (
                    <div style={{
                      background: COLORS.gold50,
                      border: `1px solid ${COLORS.gold200}`,
                      borderRadius: 14, padding: '20px 24px', marginBottom: 16,
                    }}>
                      <h3 style={{ fontSize: 13, fontWeight: 700, color: COLORS.gold600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        💡 Pro Tips
                      </h3>
                      {step.tips.map((tip, i) => (
                        <div key={i} style={{
                          display: 'flex', gap: 10,
                          marginBottom: i < step.tips.length - 1 ? 10 : 0,
                        }}>
                          <span style={{ color: COLORS.gold500, flexShrink: 0, fontWeight: 800 }}>→</span>
                          <span style={{ fontSize: 13, color: COLORS.gold700, lineHeight: 1.6 }}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Navigation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <button onClick={() => setActiveStep(idx - 1)} disabled={idx === 0} style={{
                      background: idx === 0 ? COLORS.gray50 : COLORS.white,
                      color: idx === 0 ? COLORS.gray300 : COLORS.navy700,
                      border: `1.5px solid ${idx === 0 ? COLORS.gray200 : COLORS.navy200}`,
                      borderRadius: 10, padding: '11px 22px',
                      fontWeight: 700, cursor: idx === 0 ? 'not-allowed' : 'pointer',
                      fontFamily: FONTS.body, fontSize: 13,
                    }}>← Previous</button>

                    <button onClick={() => toggleStep(step.stepNumber)} style={{
                      background: done
                        ? `linear-gradient(135deg, #059669, #047857)`
                        : `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
                      color: done ? COLORS.white : COLORS.navy900,
                      border: 'none', borderRadius: 10, padding: '11px 22px',
                      fontWeight: 700, cursor: 'pointer',
                      fontFamily: FONTS.body, fontSize: 13,
                      boxShadow: done ? '0 4px 12px rgba(5,150,105,0.3)' : SHADOWS.gold,
                    }}>{done ? '✓ Completed' : 'Mark Complete ✓'}</button>

                    <button onClick={() => setActiveStep(idx + 1)} disabled={idx === roadmap.steps.length - 1} style={{
                      background: idx === roadmap.steps.length - 1
                        ? COLORS.gray50
                        : `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`,
                      color: idx === roadmap.steps.length - 1 ? COLORS.gray300 : COLORS.white,
                      border: 'none', borderRadius: 10, padding: '11px 22px',
                      fontWeight: 700,
                      cursor: idx === roadmap.steps.length - 1 ? 'not-allowed' : 'pointer',
                      fontFamily: FONTS.body, fontSize: 13,
                    }}>Next →</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}