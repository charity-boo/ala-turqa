import { FaImage, FaSync } from 'react-icons/fa';

const EmptyGallery = ({ onRefresh }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
      <FaImage className="text-gold mb-3" style={{ fontSize: '4rem', opacity: 0.5 }} />
      <h3 className="text-light mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
        No gallery images available
      </h3>
      <p className="text-muted mb-4" style={{ maxWidth: '400px' }}>
        We are currently updating our visual experience. Please check back later or refresh the page.
      </p>
      {onRefresh && (
        <button className="btn btn-outline-gold d-flex align-items-center gap-2" onClick={onRefresh}>
          <FaSync /> Refresh Gallery
        </button>
      )}
    </div>
  );
};

export default EmptyGallery;
