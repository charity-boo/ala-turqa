import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

const images = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1599858639891-b3846cd5d137?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
];

const Hero = () => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const whatsappMsg = encodeURIComponent("Hello Ala Turqa! I'd like to place an order.");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="position-relative d-flex align-items-center overflow-hidden" style={{ minHeight: '100vh', marginTop: '0' }}>
      
      {/* Background Slideshow */}
      {images.map((img, idx) => (
        <div 
          key={idx}
          className="position-absolute w-100 h-100 top-0 start-0 hero-slide" 
          style={{ 
            backgroundImage: `url("${img}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            zIndex: 0,
            opacity: currentImageIdx === idx ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out'
          }}
        ></div>
      ))}

      {/* Dark Overlay Gradient */}
      <div 
        className="position-absolute w-100 h-100 top-0 start-0" 
        style={{ 
          background: 'linear-gradient(to right, rgba(17,17,17,0.95) 0%, rgba(17,17,17,0.7) 50%, rgba(17,17,17,0.4) 100%)', 
          zIndex: 1 
        }}
      ></div>
      
      <div className="container position-relative slide-up" style={{ zIndex: 2, paddingTop: '80px' }}>
        <div className="row">
          <div className="col-lg-8">
            <span className="text-gold fw-bold text-uppercase tracking-widest mb-3 d-block" style={{ letterSpacing: '3px' }}>
              Welcome to Ala Turqa
            </span>
            <h1 className="display-1 fw-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif', lineHeight: '1.1' }}>
              Authentic Turkish <br /> Cuisine
            </h1>
            <p className="lead text-light mb-5 fs-4" style={{ maxWidth: '600px', opacity: 0.9 }}>
              Fresh ingredients. Traditional recipes. Unforgettable taste.
            </p>
            

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
