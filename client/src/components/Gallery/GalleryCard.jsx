import { FaSearchPlus } from 'react-icons/fa';

const GalleryCard = ({ image, onClick }) => {
  return (
    <div className="gallery-card" onClick={onClick}>
      <img src={image.image} alt={image.title} loading="lazy" />
      <div className="gallery-overlay">
        <FaSearchPlus className="zoom-icon" />
        <h3 className="gallery-title">{image.title}</h3>
      </div>
      {image.featured && (
        <div className="featured-badge">Featured</div>
      )}
    </div>
  );
};

export default GalleryCard;
