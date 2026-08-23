import { useEffect, useMemo, useState } from 'react';
import { subscribeToOrders, normalizeOrderStatus } from '../../services/orderService';

const DELIVERY_STATUSES = ['all', 'pending', 'assigned', 'picked_up', 'out_for_delivery', 'delivered', 'failed'];

const Deliveries = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');

  useEffect(() => {
    const unsubscribe = subscribeToOrders((data) => {
      setOrders(data);
      setLoading(false);
    }, 200);
    return () => unsubscribe();
  }, []);

  const rows = useMemo(() => {
    return orders
      .filter((order) => (order.deliveryMethod || order.orderType || '').toLowerCase() === 'delivery')
      .filter((order) => (providerFilter === 'all' ? true : (order.deliveryProvider || 'Unknown') === providerFilter))
      .filter((order) => {
        if (statusFilter === 'all') return true;
        const normalized = normalizeOrderStatus(order);
        if (statusFilter === 'out_for_delivery') return normalized === 'out_for_delivery';
        if (statusFilter === 'delivered') return normalized === 'completed';
        if (statusFilter === 'pending') return ['pending', 'confirmed', 'preparing', 'ready'].includes(normalized);
        return normalized === statusFilter;
      });
  }, [orders, statusFilter, providerFilter]);

  if (loading) return <div className="text-light">Loading deliveries...</div>;

  const providers = ['all', ...new Set(rows.map((order) => order.deliveryProvider || 'Unknown'))];

  return (
    <div className="text-light">
      <div className="d-flex flex-wrap gap-2 mb-3">
        <select className="form-select bg-dark text-light border-secondary" style={{ maxWidth: 220 }} value={providerFilter} onChange={(event) => setProviderFilter(event.target.value)}>
          {providers.map((provider) => (
            <option key={provider} value={provider}>{provider === 'all' ? 'All providers' : provider}</option>
          ))}
        </select>
        <select className="form-select bg-dark text-light border-secondary" style={{ maxWidth: 220 }} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          {DELIVERY_STATUSES.map((status) => (
            <option key={status} value={status}>{status === 'all' ? 'All statuses' : status.replaceAll('_', ' ')}</option>
          ))}
        </select>
      </div>

      <div className="card border-0" style={{ backgroundColor: '#1B1B1B' }}>
        <div className="card-body p-0">
          {rows.length === 0 ? (
            <div className="p-4 text-muted">No deliveries found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark align-middle mb-0">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Provider</th>
                    <th>Location</th>
                    <th>Landmark</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((order) => (
                    <tr key={order.id}>
                      <td>{order.orderNumber || order.id}</td>
                      <td>{order.customerName || 'N/A'}</td>
                      <td>{order.deliveryProvider || 'N/A'}</td>
                      <td>{order.deliveryLocation?.formattedAddress || 'N/A'}</td>
                      <td>{order.deliveryLocation?.landmark || 'N/A'}</td>
                      <td className="text-capitalize">{normalizeOrderStatus(order).replaceAll('_', ' ')}</td>
                      <td>{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deliveries;
