import { useState, useEffect } from 'react';
import { getReviews, deleteReview } from '../../services/reviewService';
import { FaTrash, FaUserCircle, FaStar } from 'react-icons/fa';

const ReviewsAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('All');

  const fetchReviewsData = async () => {
    try {
      setLoading(true);
      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(id);
        setReviews(reviews.filter(r => r.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredReviews = filterRating === 'All' 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(filterRating));

  return (
    <div className="container-fluid p-4">
      <h2 className="text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Manage Reviews</h2>
      
      <div className="card-luxury p-3 mb-4 d-flex align-items-center gap-3">
        <label className="text-light fw-bold">Filter by Rating:</label>
        <select 
          className="form-select bg-dark text-light border-secondary w-auto"
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
        >
          <option value="All">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {loading ? (
        <div className="text-light">Loading reviews...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>User</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Food Item</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">No reviews found</td>
                </tr>
              ) : (
                filteredReviews.map(review => (
                  <tr key={review.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <FaUserCircle className="text-gold fs-4" />
                        <span>{review.userName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-gold">
                        {review.rating} <FaStar className="ms-1" />
                      </div>
                    </td>
                    <td>
                      <p className="mb-0 text-truncate" style={{ maxWidth: '300px' }} title={review.comment}>
                        {review.comment}
                      </p>
                    </td>
                    <td>{review.foodId || '-'}</td>
                    <td>{review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(review.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewsAdmin;
