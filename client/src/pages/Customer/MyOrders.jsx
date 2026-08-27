import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { fetchUserOrders } from '../../services/userService';
import { FaHistory, FaShoppingBag, FaMotorcycle, FaSpinner, FaExternalLinkAlt, FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'completed'

  useEffect(() => {
    const loadOrders = async () => {
      if (currentUser) {
        setLoading(true);
        const orderList = await fetchUserOrders(currentUser.uid, currentUser.email);
        setOrders(orderList);
        setLoading(false);
      }
    };
    loadOrders();
  }, [currentUser]);

  const getStatusBadge = (status) => {
    const s = (status || 'new').toLowerCase();
    switch (s) {
      case 'new':
      case 'pending':
      case 'confirmed':
        return <span className="badge bg-warning text-dark"><FaClock className="me-1"/> Confirmed</span>;
      case 'preparing':
        return <span className="badge bg-info text-dark"><FaSpinner className="fa-spin me-1"/> Preparing</span>;
      case 'ready':
        return <span className="badge bg-primary text-light"><FaCheckCircle className="me-1"/> Ready</span>;
      case 'out_for_delivery':
      case 'out for delivery':
        return <span className="badge bg-secondary text-light"><FaMotorcycle className="me-1"/> Out for Delivery</span>;
      case 'completed':
        return <span className="badge bg-success"><FaCheckCircle className="me-1"/> Completed</span>;
      case 'cancelled':
        return <span className="badge bg-danger"><FaTimesCircle className="me-1"/> Cancelled</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(order => {
    const st = (order.orderStatus || order.status || 'new').toLowerCase();
    if (filterStatus === 'active') {
      return !['completed', 'cancelled'].includes(st);
    }
    if (filterStatus === 'completed') {
      return st === 'completed';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="container py-5 text-center text-gold" style={{ minHeight: '60vh', color: '#C9A227' }}>
        <FaSpinner className="fa-spin fs-1 mb-3" />
        <h4>Loading order history...</h4>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-4 text-light" style={{ minHeight: '80vh' }}>
      
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 border-bottom border-secondary pb-3">
        <div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227', fontWeight: 'bold' }}>
            <FaHistory className="me-2" /> My Orders
          </h2>
          <p className="text-muted mb-0">View past purchases and track active deliveries.</p>
        </div>

        <Link to="/menu" className="btn btn-warning d-inline-flex align-items-center gap-2 mt-3 mt-md-0" style={{ backgroundColor: '#C9A227', color: '#111', fontWeight: 'bold' }}>
          <FaShoppingBag /> Browse Menu
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn btn-sm ${filterStatus === 'all' ? 'btn-warning fw-bold' : 'btn-outline-secondary text-light'}`}
          style={filterStatus === 'all' ? { backgroundColor: '#C9A227', color: '#111', borderColor: '#C9A227' } : {}}
          onClick={() => setFilterStatus('all')}
        >
          All Orders ({orders.length})
        </button>
        <button
          className={`btn btn-sm ${filterStatus === 'active' ? 'btn-warning fw-bold' : 'btn-outline-secondary text-light'}`}
          style={filterStatus === 'active' ? { backgroundColor: '#C9A227', color: '#111', borderColor: '#C9A227' } : {}}
          onClick={() => setFilterStatus('active')}
        >
          Active Orders ({orders.filter(o => !['completed', 'cancelled'].includes((o.orderStatus || o.status || '').toLowerCase())).length})
        </button>
        <button
          className={`btn btn-sm ${filterStatus === 'completed' ? 'btn-warning fw-bold' : 'btn-outline-secondary text-light'}`}
          style={filterStatus === 'completed' ? { backgroundColor: '#C9A227', color: '#111', borderColor: '#C9A227' } : {}}
          onClick={() => setFilterStatus('completed')}
        >
          Completed ({orders.filter(o => (o.orderStatus || o.status || '').toLowerCase() === 'completed').length})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="card border-0 p-5 text-center" style={{ backgroundColor: '#1B1B1B', borderRadius: '12px' }}>
          <FaShoppingBag className="fs-1 text-muted mx-auto mb-3" />
          <h4 className="text-muted">No orders found</h4>
          <p className="text-muted mb-4">You haven't placed any orders matching this filter yet.</p>
          <div>
            <Link to="/menu" className="btn px-4 py-2 fw-bold" style={{ backgroundColor: '#C9A227', color: '#111' }}>
              Order Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {filteredOrders.map((order) => {
            const trackingId = order.publicTrackingId || order.id;
            const items = order.items || [];
            const total = order.total || order.totalAmount || 0;
            const orderDate = order.createdAt
              ? new Date(order.createdAt.seconds ? order.createdAt.seconds * 1000 : order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })
              : 'Recently';

            return (
              <div key={order.id} className="card border-0 shadow-sm" style={{ backgroundColor: '#1B1B1B', borderRadius: '12px', overflow: 'hidden' }}>
                
                <div className="card-header bg-dark p-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom border-secondary gap-2">
                  <div>
                    <span className="text-gold fw-bold me-3" style={{ color: '#C9A227' }}>
                      Order #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-muted small">
                      <FaCalendarAlt className="me-1" /> {orderDate}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    {getStatusBadge(order.orderStatus || order.status)}
                    <Link
                      to={`/track/${trackingId}`}
                      className="btn btn-sm btn-outline-warning d-inline-flex align-items-center gap-1"
                      style={{ color: '#C9A227', borderColor: '#C9A227' }}
                    >
                      Track Order <FaExternalLinkAlt style={{ fontSize: '0.75rem' }} />
                    </Link>
                  </div>
                </div>

                <div className="card-body p-4">
                  <div className="row g-3">
                    
                    {/* Items summary */}
                    <div className="col-12 col-md-8">
                      <h6 className="text-muted mb-3">Order Items</h6>
                      <ul className="list-unstyled mb-0">
                        {items.map((item, idx) => (
                          <li key={idx} className="d-flex justify-content-between py-1 border-bottom border-secondary text-light">
                            <span>
                              <strong className="text-gold" style={{ color: '#C9A227' }}>{item.quantity}x</strong> {item.itemName || item.name}
                            </span>
                            <span className="text-muted">KES {(item.price * item.quantity).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Delivery & Payment details */}
                    <div className="col-12 col-md-4 border-start-md border-secondary">
                      <div className="bg-dark p-3 rounded h-100">
                        <div className="mb-2">
                          <small className="text-muted d-block">Delivery Method</small>
                          <strong className="text-light">{order.deliveryMethod || 'Delivery'} ({order.deliveryProvider || 'Standard'})</strong>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">Payment Method</small>
                          <span className="text-light">{order.paymentMethod || 'M-Pesa'} ({order.paymentStatus || 'Paid'})</span>
                        </div>
                        <div className="mt-3 pt-2 border-top border-secondary d-flex justify-content-between align-items-center">
                          <strong className="text-light">Total Paid</strong>
                          <strong className="fs-5 text-gold" style={{ color: '#C9A227' }}>KES {total.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default MyOrders;
