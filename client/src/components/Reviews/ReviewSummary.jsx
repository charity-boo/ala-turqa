const ReviewSummary = ({ reviews }) => {
  const totalReviews = reviews.length;

  return (
    <div className="card-luxury p-4 mb-4">
      <h4 className="text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Review Summary</h4>
      <div className="text-center">
        <h1 className="display-4 fw-bold text-light mb-0">{totalReviews}</h1>
        <small className="text-muted">{totalReviews === 1 ? 'review' : 'reviews'}</small>
      </div>
    </div>
  );
};

export default ReviewSummary;
