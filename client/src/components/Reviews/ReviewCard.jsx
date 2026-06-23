import RatingStars from './RatingStars';
import { FaUserCircle } from 'react-icons/fa';

const ReviewCard = ({ review }) => {
  // Format date safely
  const dateStr = review.createdAt?.toDate 
    ? review.createdAt.toDate().toLocaleDateString() 
    : new Date().toLocaleDateString();

  return (
    <div className="card-luxury p-4 mb-4 review-card">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex align-items-center gap-2">
          <FaUserCircle className="text-gold" style={{ fontSize: '2rem' }} />
          <div>
            <h5 className="mb-0 text-light fw-bold">{review.userName}</h5>
            <small className="text-muted">{dateStr}</small>
          </div>
        </div>
        <RatingStars rating={review.rating} />
      </div>
      
      <p className="text-light opacity-75 mb-0" style={{ lineHeight: '1.6' }}>
        "{review.comment}"
      </p>
      
      {review.foodId && (
        <div className="mt-3">
          <span className="badge bg-dark border border-secondary text-gold">
            Recommended: {review.foodId}
          </span>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
