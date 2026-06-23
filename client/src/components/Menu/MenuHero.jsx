import React from 'react';

const MenuHero = () => {
  return (
    <section 
      className="position-relative d-flex align-items-center justify-content-center text-center text-white"
      style={{
        height: '400px',
        backgroundImage: 'linear-gradient(rgba(17, 17, 17, 0.7), rgba(17, 17, 17, 0.9)), url("https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginTop: '-80px', // Compensate for fixed navbar
        paddingTop: '80px'
      }}
    >
      <div className="container px-3 slide-up">
        <h1 className="display-3 fw-bold text-gold mb-3" style={{ fontFamily: 'Playfair Display, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', color: '#C9A227' }}>
          Authentic Turkish Cuisine
        </h1>
        <div className="divider mx-auto mb-4" style={{ width: '80px', height: '3px', backgroundColor: '#C9A227' }}></div>
        <p className="lead mx-auto text-light" style={{ maxWidth: '700px', fontFamily: 'Poppins, sans-serif' }}>
          Experience the rich flavors of Turkey with our carefully crafted dishes, prepared using traditional recipes and fresh ingredients.
        </p>
      </div>
    </section>
  );
};

export default MenuHero;
