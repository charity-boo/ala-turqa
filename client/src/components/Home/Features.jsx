import { FaUtensils, FaUserTie, FaMotorcycle, FaMapMarkerAlt } from 'react-icons/fa';

const Features = () => {
  const features = [
    { icon: <FaUtensils />, title: 'Authentic Recipes' },
    { icon: <FaUserTie />, title: 'Expert Chefs' },
    { icon: <FaMotorcycle />, title: 'Fast Delivery' },
    { icon: <FaMapMarkerAlt />, title: 'Prime Location' }
  ];

  return (
    <section className="py-4 position-relative z-2" style={{ backgroundColor: '#1B1B1B', borderTop: '2px solid #C9A227' }}>
      <div className="container">
        <div className="row g-3 justify-content-center">
          {features.map((feature, idx) => (
            <div key={idx} className="col-6 col-md-3">
              <div className="d-flex align-items-center justify-content-center p-2 text-center text-md-start">
                <div className="text-gold fs-3 me-3 d-none d-md-block">{feature.icon}</div>
                <div>
                  <div className="text-gold fs-4 mb-2 d-md-none">{feature.icon}</div>
                  <h6 className="text-white mb-0 text-uppercase tracking-widest" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>{feature.title}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
