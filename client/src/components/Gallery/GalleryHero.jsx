
import './GalleryHero.css';

const GalleryHero = () => {
  return (
    <div className="gallery-hero">
      <div className="gallery-hero-overlay"></div>
      <div className="container position-relative z-1 h-100 d-flex flex-column justify-content-center align-items-center text-center">
        <h1 className="display-3 text-gold fw-bold mb-3 fade-in" style={{ fontFamily: 'Playfair Display, serif' }}>
          A Taste of Ala Turqa
        </h1>
        <p className="lead text-light mb-0 slide-up" style={{ maxWidth: '800px', fontSize: '1.2rem' }}>
          Explore our authentic Turkish cuisine, elegant dining spaces, and unforgettable moments.
        </p>
      </div>
    </div>
  );
};

export default GalleryHero;
