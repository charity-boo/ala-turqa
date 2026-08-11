import React, { useState } from 'react';
import { FaClock, FaFire, FaLeaf, FaStar } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { formatPrice, parseBasePrice } from '../../utils/priceFormatter';
import SizeSelectorModal from './SizeSelectorModal';

const MenuCard = ({ item }) => {
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = () => {
    if (item.smallPrice && item.mediumPrice) {
      setShowModal(true);
    } else {
      addToCart({ ...item, price: parseBasePrice(item.price) });
      alert(`${item.name} added to cart!`);
    }
  };

  const handleConfirmSize = (size, price) => {
    addToCart({ 
      ...item, 
      size, 
      price: parseBasePrice(price),
      specialInstructions: size ? `Size: ${size}` : '' 
    });
    setShowModal(false);
    alert(`${size} ${item.name} added to cart!`);
  };

  return (
    <>
      <div className="card h-100 border-0 menu-card" style={{ backgroundColor: '#1B1B1B', color: '#FFFFFF', borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
        <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
          <img
            src={item.image || 'https://via.placeholder.com/300x200?text=Ala+Turqa'}
            className="card-img-top"
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
          <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px', flexDirection: 'column' }}>
            {item.featured && <span className="badge" style={{ backgroundColor: '#C9A227', color: '#111111' }}><FaStar /> Featured</span>}
            {item.popular && <span className="badge bg-danger"><FaFire /> Popular</span>}
            {item.vegetarian && <span className="badge bg-success"><FaLeaf /> Veg</span>}
          </div>
        </div>
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="card-title mb-0" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 'bold' }}>{item.name}</h5>
            <h5 className="mb-0" style={{ color: '#C9A227', fontWeight: 'bold' }}>
              {formatPrice(item.price, item.displayPrice)}
            </h5>
          </div>
          <p className="card-text text-muted" style={{ fontSize: '0.9rem', flexGrow: 1, fontFamily: '"Poppins", sans-serif' }}>{item.description}</p>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              <FaClock className="me-1" /> {item.preparationTime} min
            </span>
            <button 
              className="btn btn-sm text-dark fw-bold" 
              style={{ backgroundColor: '#C9A227', borderRadius: '20px', padding: '5px 15px' }} 
              disabled={!item.available}
              onClick={handleAddToCart}
            >
              {item.available ? 'Add to Cart' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
      
      <SizeSelectorModal 
        item={item} 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onConfirm={handleConfirmSize} 
      />
    </>
  );
};

export default MenuCard;
