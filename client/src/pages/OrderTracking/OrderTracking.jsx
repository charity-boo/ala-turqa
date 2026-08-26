import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link, Navigate } from 'react-router-dom';
import { FaCheckCircle, FaReceipt, FaClock, FaPhone, FaMotorcycle, FaStore, FaSpinner } from 'react-icons/fa';
import { parseBasePrice } from '../../utils/priceFormatter';
import './OrderTracking.css'; // Let's use a small css file for the timeline animations

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const ORDER_STATUS_FLOW = {
  Delivery: [
    { id: 'new', label: 'Order Placed' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'completed', label: 'Delivered' }
  ],
  Pickup: [
    { id: 'new', label: 'Order Placed' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'ready', label: 'Ready for Pickup' },
    { id: 'completed', label: 'Picked Up' }
  ]
};

const OrderTracking = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const initialOrder = location.state?.order;
  
  const [order, setOrder] = useState(initialOrder || null);
  const [loading, setLoading] = useState(!initialOrder);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;

    let isMounted = true;
    
    const fetchTrackingData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tracking/${orderId}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Order not found');
          throw new Error('Failed to load tracking data.');
        }
        const data = await response.json();
        if (isMounted) {
          setOrder(data);
          setError('');
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching order:", err);
          if (initialOrder && !order) {
            setOrder(initialOrder); // Keep showing initial data initially
          } else if (!order) {
            setError(err.message || 'Failed to load tracking data. Make sure you are connected to the internet.');
          }
          setLoading(false);
        }
      }
    };

    fetchTrackingData();
    // Poll every 5 seconds since real-time is disabled for public endpoint
    const intervalId = setInterval(fetchTrackingData, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [orderId, initialOrder]);

  if (error) {
    return (
      <div className="container py-5 mt-5 text-center text-white">
        <h2>Oops!</h2>
        <p className="text-muted">{error}</p>
        <Link to="/" className="btn btn-warning mt-3">Return Home</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 mt-5 text-center text-white">
        <FaSpinner className="fa-spin mb-3" size={40} style={{ color: '#C9A227' }} />
        <h4>Connecting to Restaurant...</h4>
      </div>
    );
  }

  if (!order) {
    return <Navigate to="/" />;
  }

  const flow = ORDER_STATUS_FLOW[order.deliveryMethod === 'Pickup' ? 'Pickup' : 'Delivery'];
  
  // Find current step index based on order status, fallback to 0 if not found
  // Special case: if status is 'ready' for delivery, map it to 'preparing' or 'out_for_delivery'
  let currentStatusId = order.status || 'new';
  if (order.deliveryMethod === 'Delivery' && currentStatusId === 'ready') {
    currentStatusId = 'preparing'; // 'ready' isn't explicitly in delivery flow here, but we show it as preparing until out
  }
  
  const currentIndex = flow.findIndex(s => s.id === currentStatusId);
  const activeIndex = currentIndex === -1 ? (order.status === 'cancelled' ? -1 : 0) : currentIndex;

  return (
    <div className="container py-5 mt-5 d-flex justify-content-center">
      <div className="card border-0 shadow-lg p-4 p-md-5 w-100" style={{ backgroundColor: '#1B1B1B', color: '#FFFFFF', maxWidth: '800px' }}>
        
        <div className="text-center mb-5">
          {order.status === 'completed' ? (
            <FaCheckCircle className="text-success mx-auto mb-3" size={70} />
          ) : order.status === 'cancelled' ? (
            <div className="text-danger mx-auto mb-3" style={{ fontSize: '70px' }}>&times;</div>
          ) : (
            <div className="spinner-grow mx-auto mb-3" style={{ width: '4rem', height: '4rem', color: '#C9A227' }} role="status"></div>
          )}
          
          <h2 style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>
            {order.status === 'completed' ? 'Order Complete!' : 
             order.status === 'cancelled' ? 'Order Cancelled' : 
             'Live Tracking'}
          </h2>
          <p className="text-muted">Order #{order.orderNumber}</p>
        </div>

        {/* Live Tracker Timeline */}
        {order.status !== 'cancelled' && (
          <div className="tracking-timeline mb-5 px-3">
            <div className="d-flex justify-content-between position-relative">
              {/* Background Line */}
              <div className="position-absolute" style={{ top: '15px', left: '0', right: '0', height: '4px', backgroundColor: '#333', zIndex: 1 }}></div>
              
              {/* Progress Line */}
              <div className="position-absolute tracking-progress-bar" style={{ 
                top: '15px', left: '0', height: '4px', backgroundColor: '#C9A227', zIndex: 2,
                width: `${(activeIndex / (flow.length - 1)) * 100}%`,
                transition: 'width 1s ease-in-out'
              }}></div>

              {flow.map((step, idx) => {
                const isCompleted = idx <= activeIndex;
                const isCurrent = idx === activeIndex;
                
                return (
                  <div key={step.id} className="text-center position-relative" style={{ zIndex: 3, width: '80px' }}>
                    <div 
                      className={`rounded-circle mx-auto d-flex align-items-center justify-content-center mb-2 tracking-dot ${isCurrent ? 'pulse-animation' : ''}`}
                      style={{
                        width: '34px', height: '34px',
                        backgroundColor: isCompleted ? '#C9A227' : '#222',
                        border: `4px solid ${isCompleted ? '#1B1B1B' : '#333'}`,
                        color: isCompleted ? '#111' : '#666',
                        transition: 'all 0.5s ease'
                      }}
                    >
                      {isCompleted ? <FaCheckCircle size={16} /> : <div style={{width:'10px', height:'10px', borderRadius:'50%', backgroundColor: '#555'}}></div>}
                    </div>
                    <small className="d-block text-center fw-bold mt-2" style={{ 
                      color: isCurrent ? '#C9A227' : (isCompleted ? '#FFF' : '#666'),
                      fontSize: '0.75rem',
                      fontFamily: '"Poppins", sans-serif',
                      lineHeight: '1.2'
                    }}>
                      {step.label}
                    </small>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-dark rounded p-4 mb-4">
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-start mb-3">
                <FaReceipt className="mt-1 me-3" style={{ color: '#C9A227' }} size={20} />
                <div>
                  <small className="text-muted d-block text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Customer</small>
                  <span className="fw-bold">{order.customerName}</span>
                </div>
              </div>
              <div className="d-flex align-items-start mb-3">
                {order.deliveryMethod === 'Pickup' ? 
                  <FaStore className="mt-1 me-3" style={{ color: '#C9A227' }} size={20} /> : 
                  <FaMotorcycle className="mt-1 me-3" style={{ color: '#C9A227' }} size={20} />
                }
                <div>
                  <small className="text-muted d-block text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Method</small>
                  <span className="fw-bold">{order.deliveryMethod} {order.deliveryProvider ? `via ${order.deliveryProvider}` : ''}</span>
                </div>
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-start mb-3">
                <FaCheckCircle className="mt-1 me-3" style={{ color: '#C9A227' }} size={20} />
                <div>
                  <small className="text-muted d-block text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Payment</small>
                  <span className="fw-bold">
                    {order.paymentMethod} - <span className={order.paymentStatus === 'paid' ? 'text-success' : 'text-warning'}>
                      {order.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                    </span>
                  </span>
                  {order.mpesaReceiptNumber && <small className="d-block text-muted">{order.mpesaReceiptNumber}</small>}
                </div>
              </div>
              <div className="d-flex align-items-start mb-3">
                <FaPhone className="mt-1 me-3" style={{ color: '#C9A227' }} size={20} />
                <div>
                  <small className="text-muted d-block text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Restaurant Contact</small>
                  <span className="fw-bold">+254 700 000 000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between border-top border-secondary pt-4 mb-4">
          <span className="fs-5" style={{ fontFamily: '"Playfair Display", serif' }}>Total Amount</span>
          <span className="fs-4 fw-bold" style={{ color: '#C9A227' }}>KES {parseBasePrice(order.total).toLocaleString()}</span>
        </div>

        <Link to="/menu" className="btn w-100 py-3 rounded-pill shadow" style={{ backgroundColor: '#C9A227', color: '#111111', fontWeight: 'bold', fontSize: '1.1rem' }}>
          Explore Menu
        </Link>
      </div>
    </div>
  );
};

export default OrderTracking;
