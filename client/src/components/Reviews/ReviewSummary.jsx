import RatingStars from './RatingStars';

const ReviewSummary = ({ reviews }) => {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : 0;

  // Calculate rating distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      distribution[r.rating]++;
    }
  });

  return (
    <div className="card-luxury p-4 mb-4">
      <h4 className="text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Review Summary</h4>
      
      <div className="d-flex align-items-center gap-4 mb-4">
        <div className="text-center">
          <h1 className="display-4 fw-bold text-light mb-0">{averageRating}</h1>
          <RatingStars rating={Math.round(averageRating)} />
          <small className="text-muted">{totalReviews} reviews</small>
        </div>
        
        <div className="flex-grow-1">
          {[5, 4, 3, 2, 1].map(star => (
            <div key={star} className="d-flex align-items-center gap-2 mb-1">
              <span className="text-muted" style={{ minWidth: '30px' }}>{star} <span className="text-gold">★</span></span>
              <div className="progress flex-grow-1 bg-dark" style={{ height: '8px' }}>
                <div 
                  className="progress-bar" 
                  style={{ 
                    backgroundColor: '#C9A227', 
                    width: totalReviews ? `${(distribution[star] / totalReviews) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
              <span className="text-muted" style={{ minWidth: '30px', textAlign: 'right' }}>{distribution[star]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
