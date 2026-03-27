import { useState, useEffect } from 'react'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
})

export default function ReviewModal({ mentor, onClose }) {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    loadReviews()
  }, [mentor._id])

  const loadReviews = async () => {
    setLoading(true)
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        api.get(`/reviews/mentor/${mentor._id}`),
        api.get(`/reviews/mentor/${mentor._id}/stats`)
      ])
      setReviews(reviewsRes.data.data)
      setStats(statsRes.data.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const showMsg = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) {
      showMsg('❌ Please write a comment!')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/reviews', {
        mentorId: mentor._id,
        rating,
        comment
      }, { headers })
      showMsg('✅ Review submitted!')
      setShowForm(false)
      setComment('')
      setRating(5)
      loadReviews()
    } catch (err) {
      showMsg(`❌ ${err.response?.data?.message || 'Failed to submit review'}`)
    }
    setSubmitting(false)
  }

  const StarRating = ({ value, onChange, hoverable = false, size = 20 }) => (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => hoverable && setHoveredStar(star)}
          onMouseLeave={() => hoverable && setHoveredStar(0)}
          style={{
            fontSize: size, cursor: onChange ? 'pointer' : 'default',
            color: star <= (hoverable ? (hoveredStar || value) : value)
              ? '#F4A261' : '#E5E7EB',
            transition: 'color 0.1s'
          }}>★</span>
      ))}
    </div>
  )

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, padding: '20px'
    }}>
      <div style={{
        background: '#fff', borderRadius: 20,
        width: '100%', maxWidth: 560,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxHeight: '90vh', overflowY: 'auto'
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #14213D, #0D7377)',
          padding: '20px 24px', borderRadius: '20px 20px 0 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>{mentor.avatar}</span>
            <div>
              <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 16, margin: 0 }}>
                {mentor.userId?.name}
              </h3>
              <p style={{ color: '#94A3B8', fontSize: 12, margin: 0 }}>
                {mentor.expertise?.join(', ')}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none',
            borderRadius: '50%', width: 32, height: 32,
            color: '#fff', fontSize: 16, cursor: 'pointer', fontWeight: 700
          }}>✕</button>
        </div>

        <div style={{ padding: '24px' }}>

          {/* Toast */}
          {message && (
            <div style={{
              background: '#14213D', color: '#fff',
              padding: '10px 16px', borderRadius: 10,
              fontSize: 13, fontWeight: 600, marginBottom: 16
            }}>{message}</div>
          )}

          {/* Stats */}
          {stats && (
            <div style={{
              background: '#F8FAF9', borderRadius: 14,
              padding: '16px', marginBottom: 20,
              display: 'flex', gap: 20, alignItems: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#14213D' }}>
                  {stats.average}
                </div>
                <StarRating value={Math.round(stats.average)} size={16} />
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>
                  {stats.total} review{stats.total !== 1 ? 's' : ''}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#6B7280', width: 8 }}>{star}</span>
                    <span style={{ fontSize: 12 }}>★</span>
                    <div style={{ flex: 1, height: 6, background: '#E5E7EB', borderRadius: 3 }}>
                      <div style={{
                        width: stats.total > 0
                          ? `${(stats.distribution[star] / stats.total) * 100}%`
                          : '0%',
                        height: '100%',
                        background: '#F4A261', borderRadius: 3
                      }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#6B7280', width: 16 }}>
                      {stats.distribution[star]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Write Review Button */}
          {token && !showForm && (
            <button onClick={() => setShowForm(true)} style={{
              width: '100%', background: '#0D7377', color: '#fff',
              border: 'none', borderRadius: 10, padding: '12px',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              marginBottom: 20
            }}>✍️ Write a Review</button>
          )}

          {/* Review Form */}
          {showForm && (
            <div style={{
              background: '#F8FAF9', borderRadius: 14,
              padding: '20px', marginBottom: 20,
              border: '2px solid #E0F2F1'
            }}>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: '#14213D', marginBottom: 14 }}>
                ✍️ Write Your Review
              </h4>
              <form onSubmit={handleSubmit}>

                {/* Star Rating */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 8 }}>
                    Your Rating *
                  </label>
                  <StarRating
                    value={rating}
                    onChange={setRating}
                    hoverable={true}
                    size={28}
                  />
                </div>

                {/* Comment */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#14213D', marginBottom: 6 }}>
                    Your Review * <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(max 500 chars)</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Share your experience with this mentor..."
                    required rows={3} maxLength={500}
                    style={{
                      width: '100%', padding: '10px 12px',
                      borderRadius: 8, border: '2px solid #E5E7EB',
                      fontSize: 13, outline: 'none', resize: 'vertical'
                    }}
                  />
                  <div style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'right' }}>
                    {comment.length}/500
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{
                    flex: 1, padding: '10px', background: 'transparent',
                    color: '#6B7280', border: '2px solid #E5E7EB',
                    borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer'
                  }}>Cancel</button>
                  <button type="submit" disabled={submitting} style={{
                    flex: 2, padding: '10px',
                    background: submitting ? '#9CA3AF' : '#0D7377',
                    color: '#fff', border: 'none', borderRadius: 8,
                    fontSize: 13, fontWeight: 700,
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}>{submitting ? 'Submitting...' : 'Submit Review ⭐'}</button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <h4 style={{ fontSize: 15, fontWeight: 800, color: '#14213D', marginBottom: 14 }}>
            💬 Reviews ({reviews.length})
          </h4>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
              ⏳ Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>💬</div>
              <p>No reviews yet — be the first!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map(review => (
                <div key={review._id} style={{
                  background: '#F8FAF9', borderRadius: 12,
                  padding: '14px 16px',
                  border: '1px solid #E5E7EB'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: '#0D7377', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 13, fontWeight: 700
                      }}>
                        {review.reviewer?.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#14213D' }}>
                          {review.reviewer?.name}
                        </div>
                        <div style={{ fontSize: 10, color: '#9CA3AF' }}>
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    <StarRating value={review.rating} size={14} />
                  </div>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}