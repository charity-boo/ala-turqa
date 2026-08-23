import React from 'react';
import StatusBadge from './StatusBadge';
import { FaEye } from 'react-icons/fa';
import { parseBasePrice } from '../../utils/priceFormatter';

const OrderTable = ({ orders, onViewDetails }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-5 text-muted" style={{ backgroundColor: '#1B1B1B' }}>
        <h5 style={{ fontFamily: '"Playfair Display", serif' }}>No orders found</h5>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: '#1B1B1B' }}>
          <thead style={{ borderBottom: '2px solid #C9A227' }}>
            <tr>
              <th scope="col" style={{ color: '#C9A227', backgroundColor: '#222' }}>Order #</th>
              <th scope="col" style={{ color: '#C9A227', backgroundColor: '#222' }}>Date & Time</th>
              <th scope="col" style={{ color: '#C9A227', backgroundColor: '#222' }}>Customer</th>
              <th scope="col" style={{ color: '#C9A227', backgroundColor: '#222' }}>Phone</th>
              <th scope="col" style={{ color: '#C9A227', backgroundColor: '#222' }}>Type</th>
              <th scope="col" style={{ color: '#C9A227', backgroundColor: '#222' }}>Payment</th>
              <th scope="col" style={{ color: '#C9A227', backgroundColor: '#222' }}>Total</th>
              <th scope="col" style={{ color: '#C9A227', backgroundColor: '#222' }}>Status</th>
              <th scope="col" style={{ color: '#C9A227', backgroundColor: '#222' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ fontWeight: 'bold' }}>
                  {order.orderNumber || order.id.slice(-6).toUpperCase()}
                </td>
                <td className="text-muted">{formatDate(order.createdAt)}</td>
                <td>{order.customerName || `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'N/A'}</td>
                <td>{order.phoneNumber || order.phone || 'N/A'}</td>
                <td style={{ textTransform: 'capitalize' }}>{order.orderType || 'N/A'}</td>
                <td style={{ textTransform: 'capitalize' }}>{order.paymentMethod || 'N/A'}</td>
                <td style={{ fontWeight: 'bold', color: '#C9A227' }}>KES {parseBasePrice(order.totalAmount || order.total).toLocaleString()}</td>
                <td><StatusBadge status={order.status} /></td>
                <td>
                  <button 
                    className="btn btn-sm d-flex align-items-center fw-bold" 
                    style={{ backgroundColor: '#C9A227', color: '#111111', borderRadius: '8px' }}
                    onClick={() => onViewDetails(order)}
                  >
                    <FaEye className="me-1" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="d-block d-md-none p-2">
        {orders.map((order) => (
          <div key={order.id} className="card border-0 mb-3" style={{ backgroundColor: '#222', borderRadius: '10px' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span style={{ fontWeight: 'bold', color: '#C9A227', fontSize: '1.1rem' }}>
                  #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                </span>
                <StatusBadge status={order.status} />
              </div>
              <div className="mb-2 text-light">
                <div className="fw-bold fs-5">{order.customerName || `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'N/A'}</div>
                <div className="small text-muted">{order.phoneNumber || order.phone || 'N/A'}</div>
              </div>
              <div className="row g-2 mb-3 text-light small">
                <div className="col-6">
                  <span className="text-muted d-block">Time</span>
                  {formatDate(order.createdAt)}
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Type</span>
                  <span style={{ textTransform: 'capitalize' }}>{order.orderType || 'N/A'}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Payment</span>
                  <span style={{ textTransform: 'capitalize' }}>{order.paymentMethod || 'N/A'}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Total</span>
                  <span className="fw-bold" style={{ color: '#C9A227' }}>KES {parseBasePrice(order.totalAmount || order.total).toLocaleString()}</span>
                </div>
              </div>
              <button 
                className="btn w-100 d-flex justify-content-center align-items-center fw-bold" 
                style={{ backgroundColor: '#C9A227', color: '#111111', borderRadius: '8px' }}
                onClick={() => onViewDetails(order)}
              >
                <FaEye className="me-2" /> View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderTable;
