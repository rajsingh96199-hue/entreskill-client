import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import ReviewModal from '../components/Mentor/ReviewModal'
import { COLORS, FONTS, SHADOWS, CARD } from '../styles/theme'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1' })

export default function MentorDirectory() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [showBooking, setShowBooking] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [bookingForm, setBookingForm] = useState({ topic: '', message: '' })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('All')

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const FILTERS = ['All', 'Food & Beverages', 'Technology', 'Fashion & Apparel', 'Education', 'Health & Wellness', 'Digital & Media']

  useEffect(() => { loadMentors() }, [])

  const loadMentors = async () => {
    try {
      const res = await api.get('/mentors')
      setMentors(res.data.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000) }

  const handleBook = async (e) => {
    e.preventDefault()
    if (!bookingForm.topic) { showMsg('❌ Please enter a topic!'); return }
    setBookingLoading(true)
    try {
      await api.post(`/mentors/${selectedMentor._id}/book`, bookingForm, { headers })
      showMsg('✅ Session booked successfully!')
      setShowBooking(false)
      setBookingForm({ topic: '', message: '' })
    } catch (err) { showMsg(`❌ ${err.response?.data?.message || 'Booking failed'}`) }
    setBookingLoading(false)
  }

  const filteredMentors = filter === 'All' ? mentors : mentors.filter(m => m.expertise.includes(filter))

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
        padding: '56px 60px 80px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold400, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
            Expert Mentors
          </p>
          <h1 style={{ fontFamily: FONTS.display, fontSize: 40, fontWeight: 800, color: COLORS.white, marginBottom: 12 }}>
            Learn From Those Who've Done It
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 32, maxWidth: 480 }}>
            Connect with verified entrepreneurs who have built successful businesses in your field.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32 }}>
            {[
              { value: `${mentors.length}+`, label: 'Verified Mentors' },
              { value: '500+', label: 'Sessions Completed' },
              { value: '4.8', label: 'Average Rating' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 700, color: COLORS.gold400 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '-32px auto 40px', padding: '0 24px' }}>

        {/* Filter */}
        <div style={{ ...CARD, marginBottom: 20, padding: '16px 20px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 1, marginRight: 4 }}>
            Filter:
          </span>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? COLORS.navy800 : COLORS.gray50,
              color: filter === f ? COLORS.white : COLORS.gray600,
              border: `1px solid ${filter === f ? COLORS.navy800 : COLORS.gray200}`,
              borderRadius: 100, padding: '6px 16px', fontSize: 12,
              fontWeight: 600, cursor: 'pointer', fontFamily: FONTS.body,
            }}>{f}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: COLORS.gray400 }}>
            {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Mentor Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: COLORS.gray400 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p>Loading mentors...</p>
          </div>
        ) : filteredMentors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: COLORS.gray400 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p>No mentors found for this category.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredMentors.map((mentor, idx) => (
              <div key={mentor._id} style={{
                ...CARD, padding: '28px 32px',
                borderLeft: idx === 0 ? `4px solid ${COLORS.gold500}` : `4px solid transparent`,
                display: 'flex', gap: 24, alignItems: 'flex-start',
              }}>

                {/* Avatar */}
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`,
                  border: idx === 0 ? `3px solid ${COLORS.gold400}` : `2px solid ${COLORS.gray200}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 34, flexShrink: 0,
                }}>{mentor.avatar}</div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: COLORS.navy900 }}>
                      {mentor.userId?.name}
                    </h3>
                    {mentor.verified && (
                      <span style={{
                        background: '#D1FAE5', color: '#065F46',
                        borderRadius: 100, padding: '2px 10px',
                        fontSize: 11, fontWeight: 700,
                      }}>✅ Verified</span>
                    )}
                    {idx === 0 && (
                      <span style={{
                        background: COLORS.gold100, color: COLORS.gold600,
                        borderRadius: 100, padding: '2px 10px',
                        fontSize: 11, fontWeight: 700,
                      }}>⭐ Top Rated</span>
                    )}
                  </div>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {'⭐'.repeat(Math.round(mentor.rating))}
                      <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.gold500, marginLeft: 4 }}>{mentor.rating}</span>
                    </div>
                    <span style={{ fontSize: 12, color: COLORS.gray400 }}>{mentor.totalSessions} sessions</span>
                    <span style={{ fontSize: 12, color: COLORS.gray400 }}>{mentor.experience} experience</span>
                  </div>

                  <p style={{ fontSize: 13, color: COLORS.gray600, lineHeight: 1.7, marginBottom: 14, maxWidth: 560 }}>{mentor.bio}</p>

                  {/* Expertise */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    {mentor.expertise.map(e => (
                      <span key={e} style={{
                        background: COLORS.navy50, color: COLORS.navy700,
                        border: `1px solid ${COLORS.navy100}`,
                        borderRadius: 100, padding: '4px 12px',
                        fontSize: 11, fontWeight: 600,
                      }}>{e}</span>
                    ))}
                  </div>

                  <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 20 }}>
                    🌐 {mentor.languages?.join(', ')}
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 800, color: COLORS.navy900 }}>
                      {mentor.sessionPrice === 0
                        ? <span style={{ color: COLORS.success, fontSize: 16 }}>Free Session</span>
                        : `₹${mentor.sessionPrice}`}
                      {mentor.sessionPrice > 0 && <span style={{ fontSize: 12, fontWeight: 400, color: COLORS.gray400, fontFamily: FONTS.body }}> / session</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => setSelectedReview(mentor)} style={{
                        background: COLORS.gold50, color: COLORS.gold600,
                        border: `1.5px solid ${COLORS.gold200}`,
                        borderRadius: 8, padding: '10px 18px',
                        fontSize: 12, fontWeight: 700,
                        cursor: 'pointer', fontFamily: FONTS.body,
                      }}>⭐ Reviews</button>
                      <button
                        onClick={() => { setSelectedMentor(mentor); setShowBooking(true) }}
                        disabled={!mentor.available}
                        style={{
                          background: mentor.available
                            ? `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`
                            : COLORS.gray100,
                          color: mentor.available ? COLORS.white : COLORS.gray400,
                          border: 'none', borderRadius: 8,
                          padding: '10px 22px', fontSize: 12, fontWeight: 700,
                          cursor: mentor.available ? 'pointer' : 'not-allowed',
                          fontFamily: FONTS.body,
                          boxShadow: mentor.available ? SHADOWS.md : 'none',
                        }}>
                        {mentor.available ? 'Book Session →' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Become a Mentor */}
        <div style={{
          marginTop: 32,
          background: `linear-gradient(135deg, ${COLORS.navy900}, ${COLORS.navy700})`,
          borderRadius: 18, padding: '40px 48px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 24,
        }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold400, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
              Share Your Expertise
            </p>
            <h3 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 800, color: COLORS.white, marginBottom: 8 }}>
              Become a Mentor
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, maxWidth: 400 }}>
              Help aspiring entrepreneurs succeed by sharing your experience and knowledge.
            </p>
          </div>
          <button onClick={() => navigate('/mentor/register')} style={{
            background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
            color: COLORS.navy900, border: 'none',
            borderRadius: 10, padding: '14px 32px',
            fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: FONTS.body,
            boxShadow: SHADOWS.gold, whiteSpace: 'nowrap',
          }}>Apply as Mentor →</button>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && selectedMentor && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: COLORS.white, borderRadius: 20,
            padding: '32px', width: '100%', maxWidth: 480,
            boxShadow: SHADOWS.xxl,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 800, color: COLORS.navy900 }}>
                Book a Session
              </h3>
              <button onClick={() => setShowBooking(false)} style={{
                background: COLORS.gray100, border: 'none', borderRadius: '50%',
                width: 34, height: 34, fontSize: 16, cursor: 'pointer', fontWeight: 700,
                color: COLORS.gray600,
              }}>✕</button>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: COLORS.navy50, border: `1px solid ${COLORS.navy100}`,
              borderRadius: 12, padding: '14px 16px', marginBottom: 24,
            }}>
              <span style={{ fontSize: 32 }}>{selectedMentor.avatar}</span>
              <div>
                <div style={{ fontWeight: 700, color: COLORS.navy900, fontSize: 15 }}>{selectedMentor.userId?.name}</div>
                <div style={{ fontSize: 12, color: COLORS.gray500 }}>
                  {selectedMentor.sessionPrice === 0 ? 'Free Session' : `₹${selectedMentor.sessionPrice} / session`}
                </div>
              </div>
            </div>

            <form onSubmit={handleBook}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                  Topic *
                </label>
                <input
                  value={bookingForm.topic}
                  onChange={e => setBookingForm({ ...bookingForm, topic: e.target.value })}
                  placeholder="e.g. How to start a home bakery business"
                  required
                  style={{
                    width: '100%', padding: '12px 14px',
                    borderRadius: 10, border: `1.5px solid ${COLORS.gray200}`,
                    fontSize: 13, outline: 'none', fontFamily: FONTS.body,
                  }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                  Message (optional)
                </label>
                <textarea
                  value={bookingForm.message}
                  onChange={e => setBookingForm({ ...bookingForm, message: e.target.value })}
                  placeholder="Tell the mentor about your goals..."
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 14px',
                    borderRadius: 10, border: `1.5px solid ${COLORS.gray200}`,
                    fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: FONTS.body,
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowBooking(false)} style={{
                  flex: 1, padding: '12px', background: COLORS.gray50,
                  color: COLORS.gray600, border: `1.5px solid ${COLORS.gray200}`,
                  borderRadius: 10, fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: FONTS.body,
                }}>Cancel</button>
                <button type="submit" disabled={bookingLoading} style={{
                  flex: 2, padding: '12px',
                  background: bookingLoading ? COLORS.gray200 : `linear-gradient(135deg, ${COLORS.navy800}, ${COLORS.navy900})`,
                  color: bookingLoading ? COLORS.gray400 : COLORS.white,
                  border: 'none', borderRadius: 10, fontSize: 14,
                  fontWeight: 700, cursor: bookingLoading ? 'not-allowed' : 'pointer',
                  fontFamily: FONTS.body,
                }}>{bookingLoading ? 'Booking...' : 'Confirm Booking →'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedReview && (
        <ReviewModal mentor={selectedReview} onClose={() => setSelectedReview(null)} />
      )}
    </div>
  )
}