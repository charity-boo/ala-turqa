import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/authContext';
import { createOrder } from '../../services/orderService';
import { FaMoneyBillWave, FaMobileAlt, FaMotorcycle, FaStore, FaSpinner } from 'react-icons/fa';
import { initiateStkPush, pollPaymentStatus } from '../../services/mpesaService';
import GoogleMapPicker from '../../components/GoogleMapPicker';
import { generateOrderNumber } from '../../utils/idGenerator';
import { parseBasePrice } from '../../utils/priceFormatter';
import { useContext, useEffect, useRef } from 'react';

const Checkout = () => {
  const { cart, calculateSubtotal, calculateTotal, clearCart } = useCart();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'prompting', 'polling'
  const [error, setError] = useState(null);
  const [existingOrder, setExistingOrder] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    landmark: '',
    orderType: 'Delivery', // Delivery or Pickup
    deliveryProvider: 'Vipi', // Vipi or Glovo
    paymentMethod: 'M-Pesa', // M-Pesa
    notes: '',
    deliveryLocation: null // { latitude, longitude, formattedAddress }
  });

  const DELIVERY_FEE = formData.orderType === 'Delivery' ? 300 : 0;
  const subtotal = calculateSubtotal();
  const total = calculateTotal(DELIVERY_FEE);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setExistingOrder(null);
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) return "Name is required.";
    if (!formData.phone.trim()) return "Phone number is required.";
    // Kenyan phone validation (starts with 07, 01, 254, +254 and length)
    const phoneRegex = /^(?:254|\+254|0)?(7|1)(?:(?:[0-9][0-9])|(?:[0-9][0-9]))[0-9]{6}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) return "Please enter a valid Kenyan phone number.";
    
    if (formData.orderType === 'Delivery') {
      if (!formData.deliveryLocation || !formData.deliveryLocation.latitude || !formData.deliveryLocation.longitude) {
        return "Please select a valid delivery location on the map.";
      }
    }

    if (cart.length === 0) return "Your cart is empty.";

    // Prevent checkout if prices are missing or invalid
    const invalidPrice = cart.some(item => {
      const base = parseBasePrice(item.price);
      return typeof base === 'undefined' || base === null || isNaN(base) || base <= 0;
    });
    if (invalidPrice) return "Some items have invalid prices. Please check your cart.";

    const invalidQuantity = cart.some(item => typeof item.quantity !== 'number' || item.quantity < 1);
    if (invalidQuantity) return "Some items have invalid quantities. Please check your cart.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const orderData = {
      orderNumber: generateOrderNumber(),
      userId: currentUser?.uid || null,
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email,
      deliveryMethod: formData.orderType,
      deliveryProvider: formData.orderType === 'Delivery' ? formData.deliveryProvider : null,
      deliveryLocation: formData.orderType === 'Delivery' ? {
        latitude: formData.deliveryLocation.latitude,
        longitude: formData.deliveryLocation.longitude,
        formattedAddress: formData.deliveryLocation.formattedAddress || `Lat: ${formData.deliveryLocation.latitude}, Lng: ${formData.deliveryLocation.longitude}`,
        landmark: formData.landmark || ''
      } : null,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes || '',
      items: cart.map(item => ({
        menuId: item.id,
        menuSlug: item.id, // the ID will be the slug after migration
        itemName: item.name,
        price: parseBasePrice(item.price),
        quantity: item.quantity,
        notes: item.specialInstructions || '',
        image: item.image || null
      })),
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total
    };

    try {
      // 1. Save the order to Firestore first
      let savedOrder = existingOrder;
      if (!savedOrder) {
        savedOrder = await createOrder({
          ...orderData,
          paymentStatus: 'pending'
        });
        setExistingOrder(savedOrder);
      }

      if (formData.paymentMethod === 'M-Pesa') {
        // 2. Trigger M-Pesa STK Push
        setPaymentStatus('prompting');
        const stkResponse = await initiateStkPush(savedOrder.id, formData.phone, total);
        
        // 3. Display prompt and poll status (180 second timeout = 3 minutes)
        setPaymentStatus('polling');
        
        abortControllerRef.current = new AbortController();
        const finalDoc = await pollPaymentStatus(stkResponse.checkoutRequestId, () => {}, 180000, abortControllerRef.current.signal);

        // 4. Handle terminal payment statuses
        if (finalDoc.status === 'completed') {
          clearTimeout(abortControllerRef.current);
          clearCart();
          setPaymentStatus(null);
          navigate('/track/' + savedOrder.trackingId, { state: { order: { ...savedOrder, paymentStatus: 'paid', mpesaReceiptNumber: finalDoc.mpesaReceiptNumber, paymentMethod: 'M-Pesa' } } });
        } else if (finalDoc.status === 'cancelled') {
          setError("Payment cancelled. No payment was made.");
          setPaymentStatus(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (finalDoc.status === 'failed') {
          setError("Payment failed. Please try again.");
          setPaymentStatus(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        // Bypass M-Pesa for testing/cash
        clearCart();
        navigate('/track/' + savedOrder.trackingId, { state: { order: { ...savedOrder, paymentMethod: formData.paymentMethod } } });
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      if (err.code === 'ABORTED') {
        // Component unmounted, ignore
        return;
      }
      if (err.message === 'TIMEOUT' || err.code === 'TIMEOUT') {
        setError("Payment confirmation timed out. Please check your M-Pesa messages to confirm if payment was made. You can retry the checkout or contact support if you were charged.");
      } else {
        setError(err.message || "Failed to process order. Please try again.");
      }
      setPaymentStatus(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 mt-5 text-center text-white">
        <h2>Your cart is empty</h2>
        <button className="btn btn-warning mt-3" onClick={() => navigate('/menu')}>Back to Menu</button>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      <h2 className="mb-4 text-center" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227', fontWeight: 'bold' }}>Checkout</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-5">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4" style={{ backgroundColor: '#1B1B1B', color: '#FFFFFF' }}>
            <h4 className="mb-4" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>Delivery Details</h4>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name *</label>
                <input type="text" className="form-control bg-dark text-white border-secondary" name="customerName" value={formData.customerName} onChange={handleInputChange} required />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Phone Number *</label>
                <input type="tel" className="form-control bg-dark text-white border-secondary" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="e.g. 0712345678" required />
              </div>

              <div className="mb-3">
                <label className="form-label">Email (Optional)</label>
                <input type="email" className="form-control bg-dark text-white border-secondary" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" />
              </div>

              <div className="mb-4">
                <label className="form-label">Delivery Method</label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="orderType" id="delivery" value="Delivery" checked={formData.orderType === 'Delivery'} onChange={handleInputChange} />
                    <label className="form-check-label" htmlFor="delivery"><FaMotorcycle className="me-2"/>Delivery</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="orderType" id="pickup" value="Pickup" checked={formData.orderType === 'Pickup'} onChange={handleInputChange} />
                    <label className="form-check-label" htmlFor="pickup"><FaStore className="me-2"/>Pickup</label>
                  </div>
                </div>
              </div>

              {formData.orderType === 'Delivery' && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Delivery Provider</label>
                    <select className="form-select bg-dark text-white border-secondary" name="deliveryProvider" value={formData.deliveryProvider} onChange={handleInputChange}>
                      <option value="Vipi">Vipi Delivery</option>
                      <option value="Glovo">Glovo</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Delivery Location *</label>
                    <GoogleMapPicker 
                      onLocationSelect={(location) => setFormData(prev => ({ ...prev, deliveryLocation: location }))} 
                      initialLocation={formData.deliveryLocation}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Landmark</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="e.g. Near ABC Plaza" />
                  </div>
                </>
              )}

              <h4 className="mt-5 mb-4" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>Payment Method</h4>
              <div className="mb-4">
                <div className="d-flex flex-wrap gap-4">
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="paymentMethod" id="mpesa" value="M-Pesa" checked={formData.paymentMethod === 'M-Pesa'} onChange={handleInputChange} />
                    <label className="form-check-label" htmlFor="mpesa"><FaMobileAlt className="me-2"/>Pay via M-Pesa</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="paymentMethod" id="cash" value="Cash" checked={formData.paymentMethod === 'Cash'} onChange={handleInputChange} />
                    <label className="form-check-label" htmlFor="cash"><FaMoneyBillWave className="me-2"/>Cash / Pay on Delivery (Test Mode)</label>
                  </div>
                  </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Additional Notes</label>
                <textarea className="form-control bg-dark text-white border-secondary" name="notes" rows="2" value={formData.notes} onChange={handleInputChange} placeholder="Any specific instructions for your order..."></textarea>
              </div>

            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-4 sticky-top" style={{ backgroundColor: '#1B1B1B', top: '100px' }}>
            <h4 className="mb-4" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>Order Summary</h4>
            
            <div className="mb-4">
              {cart.map((item, idx) => (
                <div key={idx} className="d-flex justify-content-between mb-2 text-white">
                  <span>{item.quantity}x {item.name}</span>
                  <span>KES {(parseBasePrice(item.price) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <hr className="bg-secondary" />

            <div className="d-flex justify-content-between mb-2 text-white">
              <span>Subtotal</span>
              <span>KES {subtotal.toLocaleString()}</span>
            </div>
            
            {formData.orderType === 'Delivery' && (
              <div className="d-flex justify-content-between mb-3 text-white">
                <span>Delivery Fee</span>
                <span>KES {DELIVERY_FEE.toLocaleString()}</span>
              </div>
            )}
            
            <hr className="bg-secondary" />
            
            <div className="d-flex justify-content-between mb-4 text-white">
              <strong className="fs-5">Grand Total</strong>
              <strong className="fs-5 text-gold" style={{ color: '#C9A227' }}>KES {total.toLocaleString()}</strong>
            </div>
            
            {paymentStatus === 'prompting' && (
              <div className="alert alert-info mt-3 mb-0 text-center">
                <FaSpinner className="fa-spin me-2" /> Initiating M-Pesa payment...
              </div>
            )}
            {paymentStatus === 'polling' && (
              <div className="alert alert-warning mt-3 mb-0 text-center border-warning">
                <div className="spinner-grow spinner-grow-sm text-warning me-2" role="status"></div>
                <strong>Check your phone!</strong>
                <p className="mb-0 mt-1 small">Please enter your M-Pesa PIN to complete the payment.</p>
                <p className="mb-0 mt-1 small text-muted">Waiting for confirmation... (up to 3 minutes)</p>
              </div>
            )}

            <button 
              className="btn w-100 py-3 mt-4"
              style={{ backgroundColor: '#C9A227', color: '#111111', fontWeight: 'bold', fontSize: '1.1rem' }}
              onClick={handleSubmit}
              disabled={loading || paymentStatus}
            >
              {loading || paymentStatus ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
