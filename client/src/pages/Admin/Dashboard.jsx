import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToOrders, normalizeOrderStatus, getKenyaMidnight, formatOrderStatusLabel } from '../../services/orderService';
import StatCard from '../../components/Admin/StatCard';
import StatusBadge from '../../components/Admin/StatusBadge';
import { parseBasePrice } from '../../utils/priceFormatter';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    const unsubscribe = subscribeToOrders((data) => {
      setOrders(data);
      setLoading(false);
    }, 200);
    
    return () => unsubscribe();
  }, []);

  const kenyaMidnight = useMemo(() => getKenyaMidnight(), []);

  const { stats, attentionOrders, recentOrders } = useMemo(() => {
    const todayOrdersList = orders.filter(o => {
      const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
      return d >= kenyaMidnight;
    });

    const totalSales = todayOrdersList.reduce((sum, order) => sum + parseBasePrice(order.total || order.totalAmount || 0), 0);
    const completedOrders = todayOrdersList.filter(o => normalizeOrderStatus(o) === 'completed').length;
    
    const activeStatuses = ['pending', 'confirmed', 'preparing'];
    const attentionOrdersList = orders.filter(o => activeStatuses.includes(normalizeOrderStatus(o)));

    return {
      stats: {
        totalOrders: todayOrdersList.length,
        totalSales,
        pendingOrders: attentionOrdersList.length,
        completedOrders
      },
      attentionOrders: attentionOrdersList,
      recentOrders: orders.slice(0, 8)
    };
  }, [orders, kenyaMidnight]);

  if (loading) {
    return <div className="text-light">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const handleOrderClick = (orderId) => {
    navigate('/admin/orders', { state: { orderId } });
  };

  const renderTable = (orderList, emptyMessage) => (
    orderList.length === 0 ? (
      <div className="text-muted p-3">{emptyMessage}</div>
    ) : (
      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((order) => (
              <tr 
                key={order.id} 
                onClick={() => handleOrderClick(order.id)}
                style={{ cursor: 'pointer' }}
              >
                <td className="fw-bold">{order.orderNumber || order.id.slice(-6).toUpperCase()}</td>
                <td>{order.customerName || 'N/A'}</td>
                <td><StatusBadge status={order.status} /></td>
                <td>KES {parseBasePrice(order.total || order.totalAmount || 0).toLocaleString()}</td>
                <td className="text-muted">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );

  return (
    <div className="text-light">
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard label="Today's Orders" value={stats.totalOrders} />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard label="Today's Sales" value={`KES ${stats.totalSales.toLocaleString()}`} />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard label="Pending Orders" value={stats.pendingOrders} />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard label="Completed Orders" value={stats.completedOrders} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card border-0 h-100" style={{ backgroundColor: '#1B1B1B' }}>
            <div className="card-header border-0 bg-transparent pt-3 pb-0">
              <h5 className="text-danger fw-bold d-flex align-items-center">
                <span className="me-2">Orders Requiring Attention</span>
                {attentionOrders.length > 0 && (
                  <span className="badge bg-danger rounded-pill">{attentionOrders.length}</span>
                )}
              </h5>
            </div>
            <div className="card-body p-0 mt-2">
              {renderTable(attentionOrders, "No pending orders requiring attention.")}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card border-0 h-100" style={{ backgroundColor: '#1B1B1B' }}>
            <div className="card-header border-0 bg-transparent pt-3 pb-0">
              <h5 className="text-gold fw-bold">Recent Orders</h5>
            </div>
            <div className="card-body p-0 mt-2">
              {renderTable(recentOrders, "No recent orders found.")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
