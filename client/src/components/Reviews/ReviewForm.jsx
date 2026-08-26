import { useState } from 'react';

import useAuth from '../../hooks/useAuth';
import { addReview } from '../../services/reviewService';

const ReviewForm = ({ onReviewAdded }) => {
  const { currentUser } = useAuth();

  const [comment, setComment] = useState('');
  const [foodId, setFoodId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError('Please provide a comment.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const newReview = await addReview({
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email.split('@')[0],

        comment: comment.trim(),
        foodId: foodId.trim() || null
      });
      onReviewAdded(newReview);

      setComment('');
      setFoodId('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="card-luxury p-4 text-center">
        <h4 className="text-light mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Leave a Review</h4>
        <p className="text-muted">Please log in to share your experience with us.</p>
      </div>
    );
  }

  return (
    <div className="card-luxury p-4">
      <h4 className="text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Share Your Experience</h4>
      
      {error && <div className="alert alert-danger p-2">{error}</div>}
      
      <form onSubmit={handleSubmit}>

        
        <div className="mb-3">
          <label className="form-label text-light">Your Review</label>
          <textarea 
            className="form-control bg-dark text-light border-secondary" 
            rows="4"
            placeholder="Tell us about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ resize: 'none' }}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="form-label text-light">Favorite Dish (Optional)</label>
          <input 
            type="text" 
            className="form-control bg-dark text-light border-secondary" 
            placeholder="e.g. Mixed Grill, Kunefe"
            value={foodId}
            onChange={(e) => setFoodId(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-gold w-100"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
