import { useState, useEffect } from 'react';
import { getReviews, deleteReview } from '../../services/reviewService';
import { FaTrash, FaUserCircle } from 'react-icons/fa';

const ReviewsAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);


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



  return (
    <div className="container-fluid p-4">
      <h2 className="text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Manage Reviews</h2>
      


      {loading ? (
        <div className="text-light">Loading reviews...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>User</th>

                <th>Comment</th>
                <th>Food Item</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">No reviews found</td>
                </tr>
              ) : (
                reviews.map(review => (
                  <tr key={review.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <FaUserCircle className="text-gold fs-4" />
                        <span>{review.userName}</span>
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
