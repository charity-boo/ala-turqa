import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

const CTA = () => {
  const whatsappMsg = encodeURIComponent("Hello Ala Turqa! I'd like to place an order.");

  return (
    <section className="py-5 position-relative text-center" style={{ minHeight: '400px', display: 'flex', alignItems: 'center' }}>
      <div 
        className="position-absolute w-100 h-100 top-0 start-0" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: 0
        }}
      ></div>
      <div className="position-absolute w-100 h-100 top-0 start-0" style={{ backgroundColor: 'rgba(17,17,17,0.85)', zIndex: 1 }}></div>
      
      <div className="container position-relative slide-up py-5" style={{ zIndex: 2 }}>
        <h2 className="display-4 text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Ready to experience real Turkish flavor?
        </h2>
        <div className="divider mx-auto mb-5" style={{ width: '60px', height: '3px', backgroundColor: '#C9A227' }}></div>
        
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/menu" className="btn btn-gold btn-lg px-5 py-3 fw-bold shadow-lg">
            View Menu
          </Link>
          <Link to="/reservations" className="btn btn-outline-light btn-lg px-5 py-3 fw-bold shadow-lg">
            Reserve Table
          </Link>
          <a href={`https://wa.me/254140628102?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-lg px-5 py-3 fw-bold d-flex align-items-center justify-content-center shadow-lg border-0" style={{ backgroundColor: '#25D366' }}>
            <FaWhatsapp className="me-2 fs-4" /> Order Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
