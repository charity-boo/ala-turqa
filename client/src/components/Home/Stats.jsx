const Stats = () => {
  return (
    <section className="py-5" style={{ backgroundColor: '#111111', borderTop: '1px solid rgba(201,162,39,0.2)', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
      <div className="container py-4">
        <div className="row g-4 text-center slide-up justify-content-center">
          <div className="col-md-6">
            <div className="text-gold mb-2" style={{ fontSize: '2.5rem' }}>👥</div>
            <h2 className="display-5 fw-bold text-white mb-0" style={{ fontFamily: 'Playfair Display, serif' }}>10,000+</h2>
            <p className="text-muted text-uppercase tracking-widest small">Happy Customers</p>
          </div>
          <div className="col-md-6">
            <div className="text-gold mb-2" style={{ fontSize: '2.5rem' }}>🍽️</div>
            <h2 className="display-5 fw-bold text-white mb-0" style={{ fontFamily: 'Playfair Display, serif' }}>50+</h2>
            <p className="text-muted text-uppercase tracking-widest small">Menu Items</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
