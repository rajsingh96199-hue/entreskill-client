import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import ReviewModal from '../components/Mentor/ReviewModal'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
})

export default function MentorDirectory() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [showBooking, setShowBooking] = useState(false)
  const [bookingForm, setBookingForm] = useState({ topic: '', message: '' })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('All')
  const [selectedReview, setSelectedReview] = useState(null)

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const FILTERS = ['All', 'Food & Beverages', 'Technology', 'Fashion & Apparel', 'Education', 'Health & Wellness', 'Digital & Media']

  useEffect(() => {
    loadMentors()
  }, [])

  const loadMentors = async () => {
    try {
      const res = await api.get('/mentors')
      setMentors(res.data.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const showMsg = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleBook = async (e) => {
    e.preventDefault()
    if (!bookingForm.topic) {
      showMsg('❌ Please enter a topic!')
      return
    }
    setBookingLoading(true)
    try {
      await api.post(
        `/mentors/${selectedMentor._id}/book`,
        bookingForm,
        { headers }
      )
      showMsg('✅ Session booked successfully!')
      setShowBooking(false)
      setBookingForm({ topic: '', message: '' })
      setSelectedMentor(null)
    } catch (err) {
      showMsg(`❌ ${err.response?.data?.message || 'Booking failed'}`)
    }
    setBookingLoading(false)
  }

  const filteredMentors = filter === 'All'
    ? mentors
    : mentors.filter(m => m.expertise.includes(filter))

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
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'rgba(255,255,255,0.1)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8, padding: '6px 14px',
            fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}>← Dashboard</button>
          <button onClick={() => { logout(); navigate('/') }} style={{
            background: 'rgba(255,255,255,0.1)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8, padding: '6px 14px',
            fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}>Logout</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #14213D, #0D7377)',
        padding: '32px 24px 40px', textAlign: 'center', color: '#fff'
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Find Your Mentor
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 15 }}>
          Connect with experienced entrepreneurs who've been where you want to go.
        </p>
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

      <div style={{ maxWidth: 900, margin: '-20px auto 0', padding: '0 20px 40px' }}>

        {/* Filter Pills */}
        <div style={{
          background: '#fff', borderRadius: 16,
          padding: '16px 20px', marginBottom: 20,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          display: 'flex', gap: 8, flexWrap: 'wrap'
        }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? '#0D7377' : '#F3F4F6',
              color: filter === f ? '#fff' : '#6B7280',
              border: 'none', borderRadius: 20,
              padding: '6px 16px', fontSize: 12,
              fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s'
            }}>{f}</button>
          ))}
        </div>

        {/* Mentor Count */}
        <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 16 }}>
          Showing <b>{filteredMentors.length}</b> mentor{filteredMentors.length !== 1 ? 's' : ''}
          {filter !== 'All' ? ` in ${filter}` : ''}
        </p>

        {/* Mentor Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
            ⏳ Loading mentors...
          </div>
        ) : filteredMentors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p>No mentors found for this category.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredMentors.map((mentor, idx) => (
              <div key={mentor._id} style={{
                background: '#fff', borderRadius: 16,
                padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: idx === 0 ? '2px solid #0D7377' : '2px solid transparent'
              }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                  {/* Avatar */}
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #14213D, #0D7377)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 32, flexShrink: 0
                  }}>{mentor.avatar}</div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#14213D', margin: 0 }}>
                        {mentor.userId?.name}
                      </h3>
                      {mentor.verified && (
                        <span style={{
                          background: '#D1FAE5', color: '#065F46',
                          borderRadius: 20, padding: '2px 10px',
                          fontSize: 11, fontWeight: 700
                        }}>✅ Verified</span>
                      )}
                      {idx === 0 && (
                        <span style={{
                          background: '#E0F2F1', color: '#0D7377',
                          borderRadius: 20, padding: '2px 10px',
                          fontSize: 11, fontWeight: 700
                        }}>⭐ Top Rated</span>
                      )}
                    </div>

                    {/* Rating & Sessions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {'⭐'.repeat(Math.round(mentor.rating))}
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#F4A261' }}>
                          {mentor.rating}
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: '#6B7280' }}>
                        {mentor.totalSessions} sessions
                      </span>
                      <span style={{ fontSize: 12, color: '#6B7280' }}>
                        {mentor.experience} exp
                      </span>
                    </div>

                    {/* Bio */}
                    <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12, lineHeight: 1.6 }}>
                      {mentor.bio}
                    </p>

                    {/* Expertise Tags */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                      {mentor.expertise.map(e => (
                        <span key={e} style={{
                          background: '#E0F2F1', color: '#0D7377',
                          borderRadius: 20, padding: '3px 10px',
                          fontSize: 11, fontWeight: 600
                        }}>{e}</span>
                      ))}
                    </div>

                    {/* Languages */}
                    <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 16 }}>
                      🌐 {mentor.languages.join(', ')}
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#14213D' }}>
                        {mentor.sessionPrice === 0
                          ? <span style={{ color: '#10B981' }}>Free Session</span>
                          : `₹${mentor.sessionPrice} / session`}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => {
                            setSelectedMentor(mentor)
                            setShowBooking(true)
                          }}
                          disabled={!mentor.available}
                          style={{
                            background: mentor.available ? '#0D7377' : '#E5E7EB',
                            color: mentor.available ? '#fff' : '#9CA3AF',
                            border: 'none', borderRadius: 8,
                            padding: '10px 20px', fontSize: 13,
                            fontWeight: 700,
                            cursor: mentor.available ? 'pointer' : 'not-allowed'
                          }}>
                          {mentor.available ? 'Book Session →' : 'Unavailable'}
                        </button>
                        <button
  onClick={() => setSelectedReview(mentor)}
  style={{
    background: '#FFF7ED', color: '#F4A261',
    border: '2px solid #F4A261', borderRadius: 8,
    padding: '10px 16px', fontSize: 13,
    fontWeight: 700, cursor: 'pointer'
  }}>
  ⭐ Reviews
</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Become a Mentor Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #14213D, #0D7377)',
          borderRadius: 16, padding: '28px',
          marginTop: 32, textAlign: 'center', color: '#fff'
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
            Want to Become a Mentor?
          </h3>
          <p style={{ color: '#94A3B8', fontSize: 14, marginBottom: 20 }}>
            Share your expertise and help others start their entrepreneurship journey.
          </p>
          <button onClick={() => navigate('/mentor/register')} style={{
            background: '#F4A261', color: '#fff',
            border: 'none', borderRadius: 10,
            padding: '12px 28px', fontSize: 14,
            fontWeight: 700, cursor: 'pointer'
          }}>Apply as Mentor →</button>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && selectedMentor && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000,
          padding: '20px'
        }}>
          
          <div style={{
            background: '#fff', borderRadius: 20,
            padding: '32px', width: '100%', maxWidth: 480,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>

          {selectedReview && (
        <ReviewModal
          mentor={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#14213D', margin: 0 }}>
                Book a Session
              </h3>
              <button onClick={() => setShowBooking(false)} style={{
                background: '#F3F4F6', border: 'none',
                borderRadius: '50%', width: 32, height: 32,
                fontSize: 16, cursor: 'pointer', fontWeight: 700
              }}>✕</button>
            </div>

            {/* Mentor Info */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#E0F2F1', borderRadius: 12,
              padding: '14px', marginBottom: 20
            }}>
              <span style={{ fontSize: 32 }}>{selectedMentor.avatar}</span>
              <div>
                <div style={{ fontWeight: 700, color: '#14213D' }}>
                  {selectedMentor.userId?.name}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>
                  {selectedMentor.sessionPrice === 0
                    ? 'Free Session'
                    : `₹${selectedMentor.sessionPrice} / session`}
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBook}>
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 700, color: '#14213D', marginBottom: 6
                }}>What do you want to discuss? *</label>
                <input
                  value={bookingForm.topic}
                  onChange={e => setBookingForm({ ...bookingForm, topic: e.target.value })}
                  placeholder="e.g. How to start a home bakery business"
                  required
                  style={{
                    width: '100%', padding: '12px 14px',
                    borderRadius: 10, border: '2px solid #E5E7EB',
                    fontSize: 13, outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 700, color: '#14213D', marginBottom: 6
                }}>Message (optional)</label>
                <textarea
                  value={bookingForm.message}
                  onChange={e => setBookingForm({ ...bookingForm, message: e.target.value })}
                  placeholder="Tell the mentor a bit about yourself and your goals..."
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 14px',
                    borderRadius: 10, border: '2px solid #E5E7EB',
                    fontSize: 13, outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowBooking(false)} style={{
                  flex: 1, padding: '12px',
                  background: 'transparent', color: '#6B7280',
                  border: '2px solid #E5E7EB', borderRadius: 10,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer'
                }}>Cancel</button>
                <button type="submit" disabled={bookingLoading} style={{
                  flex: 2, padding: '12px',
                  background: bookingLoading ? '#9CA3AF' : '#0D7377',
                  color: '#fff', border: 'none',
                  borderRadius: 10, fontSize: 14,
                  fontWeight: 700, cursor: bookingLoading ? 'not-allowed' : 'pointer'
                }}>
                  {bookingLoading ? 'Booking...' : 'Confirm Booking →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}