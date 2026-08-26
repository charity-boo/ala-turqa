import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import OrderDetailsModal from '../../components/Admin/OrderDetailsModal';
import OrderTable from '../../components/Admin/OrderTable';
import { FaShoppingCart, FaDollarSign, FaClock, FaFire, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import {
  ORDER_STATUS_FLOW,
  formatOrderStatusLabel,
  normalizeOrderStatus,
  subscribeToOrders,
} from '../../services/orderService';
import { parseBasePrice } from '../../utils/priceFormatter';

const ORDER_FILTERS = ['all', ...ORDER_STATUS_FLOW];

const DATE_FILTERS = [
  { label: 'All Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' }
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [selectedDeliveryProvider, setSelectedDeliveryProvider] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.orderId && orders.length > 0) {
      const order = orders.find(o => o.id === location.state.orderId);
      if (order) {
        setSelectedOrder(order);
        // Clear state so it doesn't reopen on refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, orders]);

  useEffect(() => {
    const unsubscribe = subscribeToOrders((data) => {
      setOrders(data);
      setLoading(false);
    }, 200); // Increased buffer to allow better client-side date filtering
    return () => unsubscribe();
  }, []);

  const filteredOrders = useMemo(() => {
    let startDate = null;
    let endDate = null;
    const now = new Date();
    
    if (selectedDateRange === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (selectedDateRange === 'yesterday') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (selectedDateRange === '7days') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else if (selectedDateRange === '30days') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    }

    return orders.filter((order) => {
      // Status filter
      const normalizedStatus = normalizeOrderStatus(order);
      if (selectedStatus !== 'all' && normalizedStatus !== selectedStatus) return false;

      // Payment filter
      if (selectedPaymentStatus !== 'all') {
         const pStatus = (order.paymentStatus || 'pending').toLowerCase();
         if (pStatus !== selectedPaymentStatus) return false;
      }
      
      // Delivery filter
      if (selectedDeliveryProvider !== 'all') {
         const method = (order.deliveryMethod || order.orderType || '').toLowerCase();
         const provider = (order.deliveryProvider || '').toLowerCase();
         if (selectedDeliveryProvider === 'pickup') {
            if (method !== 'pickup') return false;
         } else {
            if (provider !== selectedDeliveryProvider) return false;
         }
      }

      // Date filter
      if (startDate || endDate) {
         if (!order.createdAt) return false;
         const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
         if (startDate && orderDate < startDate) return false;
         if (endDate && orderDate >= endDate) return false;
      }

      // Search filter
      if (!searchTerm.trim()) return true;
      const needle = searchTerm.toLowerCase();
      return [
        order.orderNumber,
        order.customerName,
        order.phone,
        order.email,
        order.deliveryProvider,
      ]
        .filter(Boolean)
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(needle));
    });
  }, [orders, searchTerm, selectedStatus, selectedPaymentStatus, selectedDeliveryProvider, selectedDateRange]);

  const summary = useMemo(() => {
    let todayOrders = 0;
    let todaySales = 0;
    let pendingOrders = 0;
    let preparingOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    orders.forEach((order) => {
      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      const isToday = orderDate.getTime() >= startOfToday;
      const normalizedStatus = normalizeOrderStatus(order);

      if (isToday) {
        todayOrders++;
        const pStatus = (order.paymentStatus || '').toLowerCase();
        const pMethod = (order.paymentMethod || '').toLowerCase();
        if (pStatus === 'paid' || (pMethod === 'cash' && normalizedStatus === 'completed')) {
          todaySales += parseBasePrice(order.totalAmount || order.total || 0);
        }
      }

      if (normalizedStatus === 'pending') pendingOrders++;
      else if (normalizedStatus === 'preparing') preparingOrders++;
      else if (normalizedStatus === 'completed') completedOrders++;
      else if (normalizedStatus === 'cancelled') cancelledOrders++;
    });

    return { todayOrders, todaySales, pendingOrders, preparingOrders, completedOrders, cancelledOrders };
  }, [orders]);

  if (loading) {
    return <div className="text-light p-4">Loading orders...</div>;
  }

  if (error) {
    return <div className="alert alert-danger m-4">{error}</div>;
  }

  return (
    <div className="text-light">
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-lg-2">
          <div className="card border-0 h-100" style={{ backgroundColor: '#1B1B1B', borderRadius: '12px' }}>
            <div className="card-body text-center p-3">
              <FaShoppingCart size={24} className="mb-2" style={{ color: '#C9A227' }} />
              <div className="text-muted small fw-bold text-uppercase">Today's Orders</div>
              <div className="fs-4 fw-bold mt-1 text-light">{summary.todayOrders}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="card border-0 h-100" style={{ backgroundColor: '#1B1B1B', borderRadius: '12px' }}>
            <div className="card-body text-center p-3">
              <FaDollarSign size={24} className="mb-2 text-success" />
              <div className="text-muted small fw-bold text-uppercase">Today's Sales</div>
              <div className="fs-5 fw-bold mt-1 text-success">KES {summary.todaySales.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="card border-0 h-100" style={{ backgroundColor: '#1B1B1B', borderRadius: '12px' }}>
            <div className="card-body text-center p-3">
              <FaClock size={24} className="mb-2 text-warning" />
              <div className="text-muted small fw-bold text-uppercase">Pending</div>
              <div className="fs-4 fw-bold mt-1 text-warning">{summary.pendingOrders}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="card border-0 h-100" style={{ backgroundColor: '#1B1B1B', borderRadius: '12px' }}>
            <div className="card-body text-center p-3">
              <FaFire size={24} className="mb-2 text-orange" style={{ color: '#fd7e14' }} />
              <div className="text-muted small fw-bold text-uppercase">Preparing</div>
              <div className="fs-4 fw-bold mt-1 text-orange" style={{ color: '#fd7e14' }}>{summary.preparingOrders}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="card border-0 h-100" style={{ backgroundColor: '#1B1B1B', borderRadius: '12px' }}>
            <div className="card-body text-center p-3">
              <FaCheckCircle size={24} className="mb-2 text-info" />
              <div className="text-muted small fw-bold text-uppercase">Completed</div>
              <div className="fs-4 fw-bold mt-1 text-info">{summary.completedOrders}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="card border-0 h-100" style={{ backgroundColor: '#1B1B1B', borderRadius: '12px' }}>
            <div className="card-body text-center p-3">
              <FaTimesCircle size={24} className="mb-2 text-danger" />
              <div className="text-muted small fw-bold text-uppercase">Cancelled</div>
              <div className="fs-4 fw-bold mt-1 text-danger">{summary.cancelledOrders}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-lg-center mb-3">
        <div className="d-flex gap-2 flex-wrap">
          {ORDER_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className="btn btn-sm"
              style={{
                backgroundColor: selectedStatus === status ? '#C9A227' : '#1B1B1B',
                color: selectedStatus === status ? '#111111' : '#FFFFFF',
              }}
            >
              {status === 'all' ? 'All' : formatOrderStatusLabel(status)}
            </button>
          ))}
        </div>
        <input
          className="form-control bg-dark text-light border-secondary"
          style={{ maxWidth: 360 }}
          placeholder="Search order, customer, phone, provider..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <select 
          className="form-select form-select-sm bg-dark text-light border-secondary" 
          style={{ width: 'auto' }}
          value={selectedPaymentStatus}
          onChange={e => setSelectedPaymentStatus(e.target.value)}
        >
          <option value="all">Payment: All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>

        <select 
          className="form-select form-select-sm bg-dark text-light border-secondary" 
          style={{ width: 'auto' }}
          value={selectedDeliveryProvider}
          onChange={e => setSelectedDeliveryProvider(e.target.value)}
        >
          <option value="all">Delivery: All</option>
          <option value="vipi">Vipi</option>
          <option value="glovo">Glovo</option>
          <option value="pickup">Pickup</option>
        </select>

        <select 
          className="form-select form-select-sm bg-dark text-light border-secondary" 
          style={{ width: 'auto' }}
          value={selectedDateRange}
          onChange={e => setSelectedDateRange(e.target.value)}
        >
          {DATE_FILTERS.map(f => <option key={f.value} value={f.value}>Date: {f.label}</option>)}
        </select>
        
        <div className="text-muted d-flex align-items-center small ms-auto">
          Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} (from recent buffer)
        </div>
      </div>

      <div className="card border-0" style={{ backgroundColor: '#1B1B1B' }}>
        <div className="card-body p-0">
          <OrderTable 
            orders={filteredOrders} 
            onViewDetails={(order) => setSelectedOrder(order)} 
          />
        </div>
      </div>

      {selectedOrder ? (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      ) : null}
    </div>
  );
};

export default Orders;
