import React, { useState, useEffect } from 'react';
import OrderTable from '../../components/Admin/OrderTable';
import OrderDetailsModal from '../../components/Admin/OrderDetailsModal';
import { subscribeToOrders } from '../../services/orderService';
import { FaSearch, FaFilter } from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Search
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Subscribe to real-time updates from Firestore
    const unsubscribe = subscribeToOrders((fetchedOrders) => {
      setOrders(fetchedOrders);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Update selectedOrder gracefully when orders array changes (e.g. status update syncs back)
  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find(o => o.id === selectedOrder.id);
      if (updated && updated.status !== selectedOrder.status) {
        setSelectedOrder(updated);
      }
    }
  }, [orders, selectedOrder]);

  const filteredOrders = orders.filter(order => {
    // 1. Status Filter
    if (filterStatus !== 'all' && (order.status || 'pending').toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }

    // 2. Search Term Filter (Order Number, Name, Phone)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const orderNumber = (order.orderNumber || order.id).toLowerCase();
      const customerName = (order.customerName || `${order.firstName || ''} ${order.lastName || ''}`).toLowerCase();
      const phoneNumber = (order.phoneNumber || order.phone || '').toLowerCase();
      
      if (!orderNumber.includes(term) && !customerName.includes(term) && !phoneNumber.includes(term)) {
        return false;
      }
    }

    return true;
  });

  const statuses = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Preparing', value: 'preparing' },
    { label: 'Ready', value: 'ready' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100vh', padding: '40px 0', fontFamily: '"Poppins", sans-serif' }}>
      <div className="container-fluid px-4">
        
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <h2 className="mb-0" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227', fontWeight: 'bold' }}>
            Order Dashboard
          </h2>
          <div className="p-2 px-3 rounded" style={{ backgroundColor: '#1B1B1B', color: '#fff', border: '1px solid #333' }}>
            Total Orders: <span className="ms-2 fs-5" style={{ color: '#C9A227', fontWeight: 'bold' }}>{filteredOrders.length}</span>
          </div>
        </div>

        {/* Filters and Search Area */}
        <div className="card border-0 mb-4 shadow-sm" style={{ backgroundColor: '#1B1B1B', borderRadius: '15px' }}>
          <div className="card-body p-4">
            <div className="row g-4 align-items-center">
              
              {/* Search Box */}
              <div className="col-12 col-xl-4">
                <div className="input-group">
                  <span className="input-group-text border-0" style={{ backgroundColor: '#222', color: '#C9A227' }}>
                    <FaSearch />
                  </span>
                  <input 
                    type="text" 
                    className="form-control border-0 shadow-none text-light" 
                    placeholder="Search by Order #, Name, or Phone..."
                    style={{ backgroundColor: '#222' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filters */}
              <div className="col-12 col-xl-8">
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <span className="text-muted me-2 fw-bold d-flex align-items-center">
                    <FaFilter className="me-2" /> Filter:
                  </span>
                  {statuses.map(status => (
                    <button
                      key={status.value}
                      className="btn btn-sm fw-bold px-3 py-2"
                      style={{
                        backgroundColor: filterStatus === status.value ? '#C9A227' : '#222',
                        color: filterStatus === status.value ? '#111111' : '#aaa',
                        border: 'none',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setFilterStatus(status.value)}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="card border-0 shadow-sm" style={{ backgroundColor: '#1B1B1B', borderRadius: '15px', overflow: 'hidden' }}>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center p-5 text-light">
                <div className="spinner-border" style={{ color: '#C9A227', width: '3rem', height: '3rem' }} role="status"></div>
                <h5 className="mt-4" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>Loading Orders...</h5>
              </div>
            ) : (
              <OrderTable orders={filteredOrders} onViewDetails={setSelectedOrder} />
            )}
          </div>
        </div>

      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
      
    </div>
  );
};

export default Orders;
