const HeroSection = () => {
  return (
    <section className="position-relative d-flex align-items-center justify-content-center text-center" style={{ height: '50vh', minHeight: '350px', marginTop: '76px' }}>
      <div 
        className="position-absolute w-100 h-100 top-0 start-0" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }}
      ></div>
      <div className="position-absolute w-100 h-100 top-0 start-0" style={{ backgroundColor: 'rgba(17,17,17,0.75)', zIndex: 1 }}></div>
      
      <div className="container position-relative slide-up" style={{ zIndex: 2 }}>
        <h1 className="display-3 fw-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Visit Ala Turqa</h1>
        <div className="divider mx-auto mb-4" style={{ width: '60px', height: '3px', backgroundColor: '#C9A227' }}></div>
        <p className="lead text-light mb-0 mx-auto" style={{ maxWidth: '600px', fontSize: '1.2rem' }}>
          Authentic Turkish cuisine
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
