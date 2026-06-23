import { FaStar, FaFire, FaUserTie, FaMapMarkerAlt, FaTruck } from 'react-icons/fa';

const WhyChooseSection = () => {
  const reasons = [
    { icon: <FaStar />, title: "High Customer Ratings", desc: "Consistently rated 5-stars by our beloved guests." },
    { icon: <FaFire />, title: "Signature Dishes", desc: "Award-winning kebabs and authentic Turkish delights." },
    { icon: <FaUserTie />, title: "Experienced Chefs", desc: "Culinary masters with decades of combined experience." },
    { icon: <FaMapMarkerAlt />, title: "Prime Location", desc: "Easily accessible and beautifully situated in Nairobi." },
    { icon: <FaTruck />, title: "Delivery Available", desc: "Fast and reliable delivery straight to your door." }
  ];

  return (
    <section className="py-5 bg-dark-secondary">
      <div className="container py-5">
        <div className="text-center mb-5 slide-up">
          <h2 className="text-gold" style={{ fontFamily: 'Playfair Display, serif' }}>Why Choose Us</h2>
          <div className="divider mx-auto mt-3" style={{ width: '60px', height: '3px', backgroundColor: '#C9A227' }}></div>
        </div>
        
        <div className="row g-4 justify-content-center slide-up">
          {reasons.map((item, idx) => (
            <div key={idx} className="col-lg-4 col-md-6">
              <div className="d-flex align-items-start bg-transparent p-3">
                <div className="bg-dark p-3 rounded-circle me-3 border border-secondary d-flex align-items-center justify-content-center text-gold" style={{ width: '60px', height: '60px', fontSize: '1.5rem', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <h5 className="text-white mb-2">{item.title}</h5>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
