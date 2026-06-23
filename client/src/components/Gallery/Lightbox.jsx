import { useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.addEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNext, onPrev]);

  // Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStartX - touchEndX > 50) onNext();
    if (touchEndX - touchStartX > 50) onPrev();
  };

  return (
    <div className="lightbox-overlay" onClick={onClose} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <FaTimes className="lightbox-close" onClick={onClose} />
      
      {images.length > 1 && (
        <FaChevronLeft className="lightbox-prev" onClick={(e) => { e.stopPropagation(); onPrev(); }} />
      )}
      
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img 
          src={images[currentIndex].image} 
          alt={images[currentIndex].title} 
          className="lightbox-img" 
        />
      </div>

      {images.length > 1 && (
        <FaChevronRight className="lightbox-next" onClick={(e) => { e.stopPropagation(); onNext(); }} />
      )}
    </div>
  );
};

export default Lightbox;
