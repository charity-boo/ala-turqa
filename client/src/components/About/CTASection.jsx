import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-5 position-relative" style={{
      backgroundImage: 'linear-gradient(rgba(17, 17, 17, 0.8), rgba(17, 17, 17, 0.9)), url("https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="container py-5 text-center slide-up">
        <h2 className="display-4 text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Experience Ala Turqa</h2>
        <p className="lead text-light mb-5 mx-auto" style={{ maxWidth: '700px' }}>
          Ready to embark on a culinary journey to Turkey? Book your table or explore our authentic menu right from home.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/reservations" className="btn btn-gold btn-lg px-4 py-3 shadow-sm">Reserve Table</Link>
          <Link to="/menu" className="btn btn-outline-gold btn-lg px-4 py-3 shadow-sm bg-dark text-gold border-gold">View Menu</Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
