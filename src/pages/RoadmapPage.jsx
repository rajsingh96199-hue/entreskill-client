import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
})

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

  useEffect(() => {
    loadRoadmap()
  }, [ideaId])

  const loadRoadmap = async () => {
    try {
      const res = await api.get(`/roadmaps/${ideaId}`)
      setRoadmap(res.data.data)

      // Load progress
      try {
        const progressRes = await api.get(
          `/roadmaps/${res.data.data._id}/progress`,
          { headers }
        )
        setCompletedSteps(progressRes.data.data.completedSteps || [])
      } catch (err) {
        setCompletedSteps([])
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const toggleStep = async (stepNumber) => {
    const updated = completedSteps.includes(stepNumber)
      ? completedSteps.filter(s => s !== stepNumber)
      : [...completedSteps, stepNumber]

    setCompletedSteps(updated)
    setSaving(true)

    try {
      await api.put(
        `/roadmaps/${roadmap._id}/progress`,
        { completedSteps: updated },
        { headers }
      )
      setMessage('✅ Progress saved!')
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      setMessage('❌ Failed to save progress')
    }
    setSaving(false)
  }

  const progressPct = roadmap
    ? Math.round((completedSteps.length / roadmap.steps.length) * 100)
    : 0

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #14213D, #0D7377)',
      color: '#fff', fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
        <p>Loading roadmap...</p>
      </div>
    </div>
  )

  if (!roadmap) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #14213D, #0D7377)',
      color: '#fff', fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
        <p>No roadmap found for this idea yet!</p>
        <button onClick={() => navigate('/dashboard')} style={{
          marginTop: 16, background: '#F4A261', color: '#fff',
          border: 'none', borderRadius: 10, padding: '10px 24px',
          fontWeight: 700, cursor: 'pointer'
        }}>← Back to Dashboard</button>
      </div>
    </div>
  )

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
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'rgba(255,255,255,0.1)', color: '#fff',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 8, padding: '6px 14px',
          fontSize: 12, fontWeight: 600, cursor: 'pointer'
        }}>← Dashboard</button>
      </div>

      {/* Toast */}
      {message && (
        <div style={{
          position: 'fixed', top: 20, right: 20,
          background: '#14213D', color: '#fff',
          padding: '12px 20px', borderRadius: 10,
          fontSize: 13, fontWeight: 600, zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>{message}</div>
      )}

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #14213D, #0D7377)',
        padding: '28px 24px 40px', color: '#fff'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 40 }}>{roadmap.ideaId?.icon || '💡'}</span>
            <div>
              <p style={{ color: '#94A3B8', fontSize: 12, marginBottom: 4 }}>
                {roadmap.ideaId?.category}
              </p>
              <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
                {roadmap.title}
              </h1>
            </div>
          </div>
          <p style={{ color: '#94A3B8', fontSize: 14, marginBottom: 20 }}>
            {roadmap.description}
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
            {[
              { icon: '⏱️', label: 'Duration', value: roadmap.totalDuration },
              { icon: '💰', label: 'Est. Cost', value: roadmap.estimatedCost },
              { icon: '📊', label: 'Difficulty', value: roadmap.difficulty },
              { icon: '📋', label: 'Total Steps', value: roadmap.steps.length },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '10px 16px'
              }}>
                <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>
                  {s.icon} {s.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, textTransform: 'capitalize' }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#94A3B8' }}>Overall Progress</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#F4A261' }}>
                {progressPct}% Complete
              </span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 4 }}>
              <div style={{
                width: `${progressPct}%`, height: '100%',
                background: 'linear-gradient(90deg, #0D7377, #F4A261)',
                borderRadius: 4, transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '-20px auto 40px', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>

          {/* Step Navigator */}
          <div style={{
            background: '#fff', borderRadius: 16,
            padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            height: 'fit-content', position: 'sticky', top: 20
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#14213D', marginBottom: 16 }}>
              📋 Steps Overview
            </h3>
            {roadmap.steps.map((step, idx) => {
              const done = completedSteps.includes(step.stepNumber)
              const active = activeStep === idx
              return (
                <div
                  key={step.stepNumber}
                  onClick={() => setActiveStep(idx)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                    background: active ? '#E0F2F1' : 'transparent',
                    marginBottom: 4, transition: 'all 0.2s'
                  }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: done ? '#0D7377' : active ? '#14213D' : '#F3F4F6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: done || active ? '#fff' : '#9CA3AF',
                    fontSize: 11, fontWeight: 700
                  }}>
                    {done ? '✓' : step.stepNumber}
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: active ? 700 : 500,
                    color: done ? '#0D7377' : active ? '#14213D' : '#6B7280'
                  }}>{step.title}</span>
                </div>
              )
            })}

            {/* Complete All Button */}
            {progressPct === 100 && (
              <div style={{
                marginTop: 16, background: '#D1FAE5',
                borderRadius: 10, padding: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>🎉</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#065F46' }}>
                  Roadmap Complete!
                </div>
              </div>
            )}
          </div>

          {/* Step Detail */}
          <div>
            {roadmap.steps.map((step, idx) => {
              const done = completedSteps.includes(step.stepNumber)
              const active = activeStep === idx
              if (!active) return null

              return (
                <div key={step.stepNumber}>

                  {/* Step Header */}
                  <div style={{
                    background: '#fff', borderRadius: 16,
                    padding: '24px', marginBottom: 16,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    border: `2px solid ${done ? '#0D7377' : '#E5E7EB'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          color: '#0D7377', textTransform: 'uppercase',
                          letterSpacing: 1
                        }}>Step {step.stepNumber} of {roadmap.steps.length}</span>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#14213D', margin: '4px 0' }}>
                          {step.title}
                        </h2>
                        <p style={{ color: '#6B7280', fontSize: 14 }}>
                          ⏱️ Estimated: {step.estimatedTime}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleStep(step.stepNumber)}
                        disabled={saving}
                        style={{
                          background: done ? '#0D7377' : '#F3F4F6',
                          color: done ? '#fff' : '#6B7280',
                          border: 'none', borderRadius: 10,
                          padding: '8px 16px', fontSize: 12,
                          fontWeight: 700, cursor: 'pointer',
                          flexShrink: 0
                        }}>
                        {done ? '✓ Completed' : 'Mark Complete'}
                      </button>
                    </div>
                    <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7 }}>
                      {step.description}
                    </p>
                  </div>

                  {/* Tasks */}
                  <div style={{
                    background: '#fff', borderRadius: 16,
                    padding: '24px', marginBottom: 16,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                  }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#14213D', marginBottom: 14 }}>
                      ✅ Tasks to Complete
                    </h3>
                    {step.tasks.map((task, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start',
                        gap: 10, padding: '10px 0',
                        borderBottom: i < step.tasks.length - 1 ? '1px solid #F3F4F6' : 'none'
                      }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: done ? '#D1FAE5' : '#E0F2F1',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 11,
                          color: done ? '#065F46' : '#0D7377',
                          flexShrink: 0, marginTop: 1
                        }}>{done ? '✓' : i + 1}</div>
                        <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>
                          {task}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tips */}
                  {step.tips && step.tips.length > 0 && (
                    <div style={{
                      background: '#FFF7ED', borderRadius: 16,
                      padding: '24px', marginBottom: 16,
                      border: '1px solid #FED7AA'
                    }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#92400E', marginBottom: 14 }}>
                        💡 Pro Tips
                      </h3>
                      {step.tips.map((tip, i) => (
                        <div key={i} style={{
                          display: 'flex', gap: 10,
                          marginBottom: i < step.tips.length - 1 ? 10 : 0
                        }}>
                          <span style={{ color: '#F4A261', flexShrink: 0 }}>→</span>
                          <span style={{ fontSize: 14, color: '#92400E', lineHeight: 1.5 }}>
                            {tip}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Navigation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <button
                      onClick={() => setActiveStep(idx - 1)}
                      disabled={idx === 0}
                      style={{
                        background: idx === 0 ? '#F3F4F6' : '#fff',
                        color: idx === 0 ? '#9CA3AF' : '#0D7377',
                        border: `2px solid ${idx === 0 ? '#E5E7EB' : '#0D7377'}`,
                        borderRadius: 10, padding: '10px 20px',
                        fontWeight: 700, cursor: idx === 0 ? 'not-allowed' : 'pointer'
                      }}>← Previous</button>

                    <button
                      onClick={() => toggleStep(step.stepNumber)}
                      style={{
                        background: done ? '#10B981' : '#F4A261',
                        color: '#fff', border: 'none',
                        borderRadius: 10, padding: '10px 20px',
                        fontWeight: 700, cursor: 'pointer'
                      }}>
                      {done ? '✓ Done' : 'Complete Step ✓'}
                    </button>

                    <button
                      onClick={() => setActiveStep(idx + 1)}
                      disabled={idx === roadmap.steps.length - 1}
                      style={{
                        background: idx === roadmap.steps.length - 1 ? '#F3F4F6' : '#0D7377',
                        color: idx === roadmap.steps.length - 1 ? '#9CA3AF' : '#fff',
                        border: 'none', borderRadius: 10,
                        padding: '10px 20px', fontWeight: 700,
                        cursor: idx === roadmap.steps.length - 1 ? 'not-allowed' : 'pointer'
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