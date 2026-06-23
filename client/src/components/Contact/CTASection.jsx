import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-5 bg-dark-secondary border-top border-secondary" style={{ borderColor: 'rgba(201,162,39,0.2) !important' }}>
      <div className="container py-4 text-center slide-up">
        <h2 className="text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Craving Turkish food?</h2>
        <p className="text-light mb-5 fs-5">Visit us or order instantly on WhatsApp to enjoy the best of Anatolia.</p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/menu" className="btn btn-outline-gold px-4 py-2">View Menu</Link>
          <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="btn btn-success px-4 py-2 border-0" style={{ backgroundColor: '#25D366' }}>Order Now</a>
          <Link to="/reservations" className="btn btn-gold px-4 py-2">Reserve Table</Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
