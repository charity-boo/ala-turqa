import { FaStar, FaRegStar } from 'react-icons/fa';

const RatingStars = ({ rating, maxStars = 5, onRatingChange, interactive = false }) => {
  const stars = [];
  
  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <span 
        key={i} 
        onClick={() => interactive && onRatingChange(i)}
        style={{ 
          cursor: interactive ? 'pointer' : 'default',
          color: '#C9A227',
          fontSize: '1.2rem',
          marginRight: '2px',
          transition: 'transform 0.2s ease'
        }}
        className={interactive ? "star-interactive" : ""}
      >
        {i <= rating ? <FaStar /> : <FaRegStar />}
      </span>
    );
  }

  return <div className="rating-stars d-flex align-items-center">{stars}</div>;
};

export default RatingStars;
