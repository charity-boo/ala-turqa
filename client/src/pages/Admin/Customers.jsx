import { useEffect, useMemo, useState } from 'react';
import { subscribeToOrders } from '../../services/orderService';
import { parseBasePrice } from '../../utils/priceFormatter';

const getCustomerKey = (order) => order.email || order.phone || order.customerName || order.id;

const Customers = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToOrders((data) => {
      setOrders(data);
      setLoading(false);
    }, 250);
    return () => unsubscribe();
  }, []);

  const customers = useMemo(() => {
    const grouped = new Map();
    for (const order of orders) {
      const key = getCustomerKey(order);
      const entry = grouped.get(key) || {
        key,
        name: order.customerName || 'N/A',
        email: order.email || '',
        phone: order.phone || '',
        orders: 0,
        totalSpent: 0,
        lastOrderAt: null,
      };
      entry.orders += 1;
      entry.totalSpent += parseBasePrice(order.total || order.totalAmount || 0);
      const createdAt = order.createdAt?.toDate ? order.createdAt.toDate() : null;
      if (createdAt && (!entry.lastOrderAt || createdAt > entry.lastOrderAt)) {
        entry.lastOrderAt = createdAt;
      }
      grouped.set(key, entry);
    }
    return Array.from(grouped.values())
      .filter((customer) => {
        if (!search.trim()) return true;
        const needle = search.toLowerCase();
        return [customer.name, customer.email, customer.phone].some((value) =>
          value?.toLowerCase().includes(needle),
        );
      })
      .sort((a, b) => (b.lastOrderAt?.getTime() || 0) - (a.lastOrderAt?.getTime() || 0));
  }, [orders, search]);

  if (loading) return <div className="text-light">Loading customers...</div>;

  return (
    <div className="text-light">
      <div className="mb-3">
        <input
          className="form-control bg-dark text-light border-secondary"
          placeholder="Search by name, email, phone"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="card border-0" style={{ backgroundColor: '#1B1B1B' }}>
        <div className="card-body p-0">
          {customers.length === 0 ? (
            <div className="p-4 text-muted">No customers found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark align-middle mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Last Order</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.key}>
                      <td>{customer.name}</td>
                      <td>{customer.phone || 'N/A'}</td>
                      <td>{customer.email || 'N/A'}</td>
                      <td>{customer.orders}</td>
                      <td>KES {customer.totalSpent.toLocaleString()}</td>
                      <td>{customer.lastOrderAt ? customer.lastOrderAt.toLocaleString() : 'N/A'}</td>
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

export default Customers;
