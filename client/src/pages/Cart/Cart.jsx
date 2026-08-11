import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { parseBasePrice } from '../../utils/priceFormatter';

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, calculateSubtotal, calculateTotal } = useCart();
  const navigate = useNavigate();

  // Assuming a fixed delivery fee for demonstration, could be calculated based on selection
  const DELIVERY_FEE = 300; 
  const subtotal = calculateSubtotal();
  const total = calculateTotal(DELIVERY_FEE);

  if (cart.length === 0) {
    return (
      <div className="container py-5 mt-5 text-center" style={{ minHeight: '60vh' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>Your Cart is Empty</h2>
        <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/menu" className="btn" style={{ backgroundColor: '#C9A227', color: '#111111', fontWeight: 'bold' }}>
          Explore Menu
        </Link>
      </div>
    );
  }

  const getImageUrl = (image) => {
    if (image && image.startsWith('http')) return image;
    return "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
  };

  return (
    <div className="container py-5 mt-5">
      <h2 className="mb-4 text-center" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227', fontWeight: 'bold' }}>Your Cart</h2>
      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
          {cart.map((item) => (
            <div key={`${item.id}-${item.specialInstructions}`} className="card mb-3 border-0 shadow-sm" style={{ backgroundColor: '#1B1B1B', color: '#FFFFFF' }}>
              <div className="row g-0 align-items-center p-3">
                <div className="col-4 col-md-2">
                  <img src={getImageUrl(item.image)} alt={item.name} className="img-fluid rounded" style={{ objectFit: 'cover', height: '80px', width: '100%' }} />
                </div>
                <div className="col-8 col-md-4 ps-3">
                  <h5 className="mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>{item.name}</h5>
                  <p className="mb-1 text-gold fw-bold" style={{ color: '#C9A227' }}>
                    KES {parseBasePrice(item.price).toLocaleString()}
                  </p>
                  {item.specialInstructions && (
                    <small className="text-muted d-block">Note: {item.specialInstructions}</small>
                  )}
                </div>
                <div className="col-6 col-md-3 mt-3 mt-md-0 d-flex justify-content-center">
                  <div className="input-group" style={{ width: '120px' }}>
                    <button className="btn btn-outline-secondary" type="button" onClick={() => decreaseQuantity(item.id, item.specialInstructions)}>
                      <FaMinus size={10} />
                    </button>
                    <input type="text" className="form-control text-center bg-dark text-white border-secondary" value={item.quantity} readOnly />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => increaseQuantity(item.id, item.specialInstructions)}>
                      <FaPlus size={10} />
                    </button>
                  </div>
                </div>
                <div className="col-4 col-md-2 mt-3 mt-md-0 text-center text-md-end">
                  <span className="fw-bold">KES {(parseBasePrice(item.price) * item.quantity).toLocaleString()}</span>
                </div>
                <div className="col-2 col-md-1 mt-3 mt-md-0 text-end">
                  <button className="btn btn-link text-danger p-0" onClick={() => removeFromCart(item.id, item.specialInstructions)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 sticky-top" style={{ backgroundColor: '#1B1B1B', top: '100px' }}>
            <h4 className="mb-4" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>Order Summary</h4>
            
            <div className="d-flex justify-content-between mb-2 text-white">
              <span>Subtotal</span>
              <span>KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 text-white">
              <span>Delivery Fee (Est.)</span>
              <span>KES {DELIVERY_FEE.toLocaleString()}</span>
            </div>
            
            <hr className="bg-secondary" />
            
            <div className="d-flex justify-content-between mb-4 text-white">
              <strong className="fs-5">Grand Total</strong>
              <strong className="fs-5 text-gold" style={{ color: '#C9A227' }}>KES {total.toLocaleString()}</strong>
            </div>
            
            <button 
              className="btn w-100 d-flex justify-content-center align-items-center gap-2"
              style={{ backgroundColor: '#C9A227', color: '#111111', fontWeight: 'bold' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
