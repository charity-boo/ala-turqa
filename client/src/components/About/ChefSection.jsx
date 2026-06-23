import { FaQuoteLeft } from 'react-icons/fa';

const ChefSection = () => {
  return (
    <section className="py-5 position-relative" style={{ backgroundColor: '#111111' }}>
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-5 mb-5 mb-lg-0 slide-up order-lg-2">
            <img 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Master Chef" 
              className="img-fluid rounded shadow-lg object-fit-cover w-100"
              style={{ height: '450px', border: '1px solid rgba(201, 162, 39, 0.2)' }}
            />
          </div>
          <div className="col-lg-7 px-lg-5 slide-up order-lg-1">
            <FaQuoteLeft className="text-gold mb-4 opacity-50" style={{ fontSize: '3rem' }} />
            <h2 className="text-white mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', lineHeight: '1.4' }}>
              "Food should feel like travel, not just a meal."
            </h2>
            <div className="divider mb-4" style={{ width: '60px', height: '3px', backgroundColor: '#C9A227' }}></div>
            
            <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Our culinary philosophy is deeply rooted in the traditions of Anatolia. We believe in preserving time-honored cooking methods, from our charcoal-grilled meats to our delicate pastries.
            </p>
            <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              By blending authentic spices with exceptional culinary craftsmanship, we aim to offer a cultural experience that transcends the dining table—bringing the soul of Turkey straight to you.
            </p>
            <h5 className="text-gold mt-4 mb-0" style={{ fontFamily: 'Playfair Display, serif' }}>Executive Chef</h5>
            <small className="text-muted text-uppercase tracking-widest" style={{ letterSpacing: '2px' }}>Ala Turqa Kitchen</small>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChefSection;
