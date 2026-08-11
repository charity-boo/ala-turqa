import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { FaCheckCircle, FaReceipt, FaClock, FaPhone } from 'react-icons/fa';
import { parseBasePrice } from '../../utils/priceFormatter';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container py-5 mt-5 d-flex justify-content-center">
      <div className="card border-0 shadow-lg text-center p-5" style={{ backgroundColor: '#1B1B1B', color: '#FFFFFF', maxWidth: '600px', width: '100%' }}>
        <FaCheckCircle className="text-success mx-auto mb-4" size={80} />
        <h2 className="mb-3" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>Order Placed Successfully!</h2>
        <p className="text-muted mb-4">Thank you for your order, {order.customerName}. Your delicious meal is being prepared.</p>

        <div className="bg-dark rounded p-4 mb-4 text-start">
          <div className="d-flex align-items-center mb-3">
            <FaReceipt className="text-gold me-3" style={{ color: '#C9A227' }} />
            <div>
              <small className="text-muted d-block">Order Number</small>
              <span className="fw-bold fs-5">{order.orderNumber}</span>
            </div>
          </div>
          <div className="d-flex align-items-center mb-3">
            <FaClock className="text-gold me-3" style={{ color: '#C9A227' }} />
            <div>
              <small className="text-muted d-block">Estimated Preparation Time</small>
              <span className="fw-bold fs-5">20 - 30 Minutes</span>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <FaPhone className="text-gold me-3" style={{ color: '#C9A227' }} />
            <div>
              <small className="text-muted d-block">Restaurant Contact</small>
              <span className="fw-bold fs-5">+254 700 000 000</span>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between border-top border-secondary pt-3 mb-4 text-white">
          <span className="fs-5">Total Amount</span>
          <span className="fs-5 fw-bold" style={{ color: '#C9A227' }}>KES {parseBasePrice(order.total).toLocaleString()}</span>
        </div>

        <Link to="/menu" className="btn w-100 py-3" style={{ backgroundColor: '#C9A227', color: '#111111', fontWeight: 'bold' }}>
          Back to Menu
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
