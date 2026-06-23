import { FaShoppingCart } from 'react-icons/fa';

const SignatureDishes = () => {
  const dishes = [
    {
      name: "Adana Kebab",
      desc: "Hand-minced meat kebab mounted on a wide iron skewer and grilled over burning charcoal.",
      price: "1,800",
      image: "https://images.unsplash.com/photo-1599858639891-b3846cd5d137?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Chicken Shawarma",
      desc: "Slow-roasted marinated chicken wraps with garlic sauce, fries, and fresh pickles.",
      price: "1,200",
      image: "https://images.unsplash.com/photo-1644565780362-e6e737031eb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Mixed Grill",
      desc: "A feast of lamb chops, shish kebab, chicken wings, and Adana served with bulgur pilaf.",
      price: "3,500",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Classic Baklava",
      desc: "Rich, sweet dessert pastry made of layers of filo filled with chopped nuts and sweetened with syrup.",
      price: "850",
      image: "https://images.unsplash.com/photo-1519671282429-b44660ead0a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section className="py-5 bg-primary-dark">
      <div className="container py-5">
        <div className="text-center mb-5 slide-up">
          <span className="text-gold text-uppercase tracking-widest small fw-bold">Taste The Perfection</span>
          <h2 className="display-5 text-white mt-2 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Signature Dishes</h2>
          <div className="divider mx-auto" style={{ width: '60px', height: '3px', backgroundColor: '#C9A227' }}></div>
        </div>

        <div className="row g-4">
          {dishes.map((dish, idx) => (
            <div key={idx} className="col-md-6 col-lg-3 slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="card h-100 border-0 bg-dark-secondary rounded overflow-hidden shadow-lg transition-hover" style={{ cursor: 'pointer' }}>
                <div className="overflow-hidden" style={{ height: '220px' }}>
                  <img 
                    src={dish.image} 
                    alt={dish.name} 
                    className="w-100 h-100 object-fit-cover transition-transform duration-500 hover-scale"
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="text-white mb-0" style={{ fontFamily: 'Playfair Display, serif' }}>{dish.name}</h5>
                    <span className="text-gold fw-bold">KES {dish.price}</span>
                  </div>
                  <p className="text-muted small mb-4 flex-grow-1">{dish.desc}</p>
                  <button className="btn btn-outline-gold w-100 d-flex align-items-center justify-content-center gap-2">
                    <FaShoppingCart /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hover-scale:hover { transform: scale(1.1); }
        .transition-transform { transition: transform 0.5s ease; }
        .transition-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(201,162,39,0.15) !important; border-bottom: 2px solid #C9A227; }
      `}} />
    </section>
  );
};

export default SignatureDishes;
