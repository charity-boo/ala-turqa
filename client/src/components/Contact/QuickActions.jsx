import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

const QuickActions = () => {
  const phoneNumber = '+254700000000';
  const whatsappMsg = encodeURIComponent("Hello Ala Turqa! I'd like to make an inquiry.");
  
  return (
    <section className="py-5" style={{ backgroundColor: '#111111', marginTop: '-30px', zIndex: 10, position: 'relative' }}>
      <div className="container">
        <div className="row g-4 justify-content-center">
          
          <div className="col-12 col-md-4 slide-up" style={{ animationDelay: '0.1s' }}>
            <a href={`tel:${phoneNumber}`} className="text-decoration-none w-100">
              <div className="card card-luxury h-100 text-center p-4 border-0 d-flex flex-column justify-content-center align-items-center transition-hover">
                <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center mb-3 border border-secondary" style={{ width: '70px', height: '70px' }}>
                  <FaPhoneAlt className="text-gold fs-3" />
                </div>
                <h4 className="text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Call Us Now</h4>
                <p className="text-gold fw-bold mb-0">{phoneNumber}</p>
              </div>
            </a>
          </div>

          <div className="col-12 col-md-4 slide-up" style={{ animationDelay: '0.2s' }}>
            <a href={`https://wa.me/${phoneNumber.replace('+', '')}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none w-100">
              <div className="card card-luxury h-100 text-center p-4 border-0 d-flex flex-column justify-content-center align-items-center transition-hover" style={{ border: '1px solid rgba(37, 211, 102, 0.3) !important' }}>
                <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center mb-3 border border-secondary" style={{ width: '70px', height: '70px' }}>
                  <FaWhatsapp style={{ color: '#25D366' }} className="fs-3" />
                </div>
                <h4 className="text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>WhatsApp</h4>
                <p className="text-muted small mb-0">Message us instantly</p>
              </div>
            </a>
          </div>

          <div className="col-12 col-md-4 slide-up" style={{ animationDelay: '0.3s' }}>
            <a href="https://maps.google.com/?q=Safari+Park+Business+Arcade+Nairobi" target="_blank" rel="noopener noreferrer" className="text-decoration-none w-100">
              <div className="card card-luxury h-100 text-center p-4 border-0 d-flex flex-column justify-content-center align-items-center transition-hover">
                <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center mb-3 border border-secondary" style={{ width: '70px', height: '70px' }}>
                  <FaMapMarkerAlt className="text-gold fs-3" />
                </div>
                <h4 className="text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Get Directions</h4>
                <p className="text-muted small mb-0">Navigate via Google Maps</p>
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default QuickActions;
