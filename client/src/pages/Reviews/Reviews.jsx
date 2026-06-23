import { useState, useEffect } from 'react';
import ReviewForm from '../../components/Reviews/ReviewForm';
import ReviewCard from '../../components/Reviews/ReviewCard';
import ReviewSummary from '../../components/Reviews/ReviewSummary';
import { getReviews } from '../../services/reviewService';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        setLoading(true);
        const data = await getReviews();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviewsData();
  }, []);

  const handleReviewAdded = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  return (
    <div className="reviews-page bg-primary-dark py-5" style={{ minHeight: '100vh', marginTop: '76px' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-4 text-gold" style={{ fontFamily: 'Playfair Display, serif' }}>Guest Experiences</h1>
          <div className="divider mx-auto mb-3" style={{ width: '60px', height: '3px', backgroundColor: '#C9A227' }}></div>
          <p className="lead text-light opacity-75">Discover what our guests have to say about Ala Turqa.</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          <div className="col-lg-4 order-lg-2">
            <div className="position-sticky" style={{ top: '100px' }}>
              <ReviewSummary reviews={reviews} />
              <ReviewForm onReviewAdded={handleReviewAdded} />
            </div>
          </div>
          
          <div className="col-lg-8 order-lg-1">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="card-luxury p-4 mb-4 skeleton-card" style={{ height: '150px' }}></div>
              ))
            ) : reviews.length === 0 ? (
              <div className="card-luxury p-5 text-center">
                <h4 className="text-light" style={{ fontFamily: 'Playfair Display, serif' }}>No reviews yet</h4>
                <p className="text-muted">Be the first to share your experience!</p>
              </div>
            ) : (
              reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
