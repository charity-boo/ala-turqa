import { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { getFeaturedItems } from '../../services/menuService';
import { useCart } from '../../context/CartContext';
import { formatPrice, parseBasePrice } from '../../utils/priceFormatter';
import SizeSelectorModal from '../Menu/SizeSelectorModal';

const SignatureDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  const handleAddToCart = (dish) => {
    if (dish.smallPrice && dish.mediumPrice) {
      setSelectedDish(dish);
      setShowModal(true);
    } else {
      addToCart({ ...dish, price: parseBasePrice(dish.price) });
      alert(`${dish.name} added to cart!`);
    }
  };

  const handleConfirmSize = (size, price) => {
    addToCart({ 
      ...selectedDish, 
      size, 
      price: parseBasePrice(price),
      specialInstructions: size ? `Size: ${size}` : '' 
    });
    setShowModal(false);
    alert(`${size} ${selectedDish.name} added to cart!`);
    setSelectedDish(null);
  };

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const data = await getFeaturedItems();
        setDishes(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching featured dishes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDishes();
  }, []);

  const getImageUrl = (image) => {
    if (image && image.startsWith('http')) return image;
    return "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
  };

  return (
    <section className="py-5 bg-primary-dark">
      <div className="container py-5">
        <div className="text-center mb-5 slide-up">
          <span className="text-gold text-uppercase tracking-widest small fw-bold">Taste The Perfection</span>
          <h2 className="display-5 text-white mt-2 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Signature Dishes</h2>
          <div className="divider mx-auto" style={{ width: '60px', height: '3px', backgroundColor: '#C9A227' }}></div>
        </div>

        {loading ? (
          <div className="text-center w-100 mt-5">
            <div className="spinner-border text-gold" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {dishes.map((dish, idx) => (
              <div key={dish.id || idx} className="col-md-6 col-lg-3 slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="card h-100 border-0 bg-dark-secondary rounded overflow-hidden shadow-lg transition-hover" style={{ cursor: 'pointer' }}>
                  <div className="overflow-hidden" style={{ height: '220px' }}>
                    <img 
                      src={getImageUrl(dish.image)} 
                      alt={dish.name} 
                      className="w-100 h-100 object-fit-cover transition-transform duration-500 hover-scale"
                    />
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="text-white mb-0" style={{ fontFamily: 'Playfair Display, serif' }}>{dish.name}</h5>
                      <span className="text-gold fw-bold">{formatPrice(dish.price, dish.displayPrice)}</span>
                    </div>
                    <p className="text-muted small mb-4 flex-grow-1">{dish.description || dish.desc}</p>
                    <button 
                      className="btn btn-outline-gold w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => handleAddToCart(dish)}
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedDish && (
        <SizeSelectorModal 
          item={selectedDish} 
          isOpen={showModal} 
          onClose={() => {
            setShowModal(false);
            setSelectedDish(null);
          }} 
          onConfirm={handleConfirmSize} 
        />
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hover-scale:hover { transform: scale(1.1); }
        .transition-transform { transition: transform 0.5s ease; }
        .transition-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(201,162,39,0.15) !important; border-bottom: 2px solid #C9A227; }
      `}} />
    </section>
  );
};

export default SignatureDishes;
