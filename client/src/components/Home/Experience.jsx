import { Link } from 'react-router-dom';

const Experience = () => {
  return (
    <section className="py-5 bg-primary-dark">
      <div className="container py-5">
        <div className="row g-0 align-items-center shadow-lg" style={{ border: '1px solid rgba(201,162,39,0.2)' }}>
          <div className="col-lg-6">
            <img 
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Restaurant Interior" 
              className="img-fluid w-100 object-fit-cover"
              style={{ height: '400px' }}
            />
          </div>
          <div className="col-lg-6 bg-dark-secondary p-5 h-100 d-flex flex-column justify-content-center text-center text-lg-start">
            <span className="text-gold text-uppercase tracking-widest small fw-bold mb-3 d-block">Ambiance</span>
            <h2 className="display-6 text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              A warm Turkish dining experience in the heart of Nairobi.
            </h2>
            <Link to="/gallery" className="btn btn-outline-gold align-self-lg-start mt-2">
              View Gallery
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
