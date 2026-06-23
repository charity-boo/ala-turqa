import { FaParking, FaConciergeBell, FaMotorcycle, FaShoppingBag } from 'react-icons/fa';

const FeatureCards = () => {
  const features = [
    { icon: <FaParking />, title: 'Secure Parking', desc: 'Ample parking available at Safari Park Arcade.' },
    { icon: <FaConciergeBell />, title: 'Dine-in Available', desc: 'Experience luxury dining with our authentic ambience.' },
    { icon: <FaMotorcycle />, title: 'Delivery Available', desc: 'Fast delivery straight to your doorstep.' },
    { icon: <FaShoppingBag />, title: 'Takeaway', desc: 'Call ahead and pick up your fresh order.' }
  ];

  return (
    <section className="py-5" style={{ backgroundColor: '#111111' }}>
      <div className="container py-4">
        <div className="row g-4">
          {features.map((item, idx) => (
            <div key={idx} className="col-6 col-md-3 slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="text-center p-3 border border-secondary rounded hover-gold-border transition-all h-100">
                <div className="text-gold mb-3" style={{ fontSize: '2rem' }}>{item.icon}</div>
                <h6 className="text-white mb-2">{item.title}</h6>
                <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
