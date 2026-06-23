import { FaUtensils, FaLeaf, FaConciergeBell, FaMotorcycle, FaGlassCheers } from 'react-icons/fa';

const OffersSection = () => {
  const offers = [
    { icon: <FaUtensils />, title: "Authentic Turkish Cuisine", desc: "Traditional recipes handed down through generations." },
    { icon: <FaLeaf />, title: "Fresh Ingredients Daily", desc: "Locally sourced produce paired with premium Turkish spices." },
    { icon: <FaConciergeBell />, title: "Dine-in Experience", desc: "A luxurious and welcoming atmosphere for all our guests." },
    { icon: <FaMotorcycle />, title: "Fast Delivery", desc: "Enjoy our delicacies from the comfort of your home." },
    { icon: <FaGlassCheers />, title: "Catering Services", desc: "Make your special events unforgettable with our authentic menus." }
  ];

  return (
    <section className="py-5 bg-dark-secondary">
      <div className="container py-5">
        <div className="text-center mb-5 slide-up">
          <h2 className="text-gold" style={{ fontFamily: 'Playfair Display, serif' }}>What We Offer</h2>
          <div className="divider mx-auto mt-3" style={{ width: '60px', height: '3px', backgroundColor: '#C9A227' }}></div>
        </div>

        <div className="row g-4 justify-content-center slide-up">
          {offers.map((offer, idx) => (
            <div key={idx} className="col-md-6 col-lg-4">
              <div className="card card-luxury h-100 text-center p-4 border-0">
                <div className="text-gold mb-4" style={{ fontSize: '2.5rem' }}>
                  {offer.icon}
                </div>
                <h4 className="text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{offer.title}</h4>
                <p className="text-muted mb-0">{offer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
