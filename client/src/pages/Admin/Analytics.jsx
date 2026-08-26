import React, { useEffect, useState, useMemo } from 'react';
import { fetchOrdersByDateRange, normalizeOrderStatus } from '../../services/orderService';
import { FaChartLine, FaCreditCard, FaMotorcycle } from 'react-icons/fa';

const Analytics = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('today'); // today, yesterday, thisWeek, thisMonth

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const now = new Date();
        const kenyaFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Nairobi', year: 'numeric', month: 'numeric', day: 'numeric' });
        
        let start = new Date();
        let end = new Date();
        
        if (dateRange === 'today') {
          const [month, day, year] = kenyaFormatter.format(now).split('/');
          start = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00+03:00`);
          end = new Date();
        } else if (dateRange === 'yesterday') {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const [month, day, year] = kenyaFormatter.format(yesterday).split('/');
          start = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00+03:00`);
          
          const [tm, td, ty] = kenyaFormatter.format(now).split('/');
          end = new Date(`${ty}-${tm.padStart(2, '0')}-${td.padStart(2, '0')}T00:00:00+03:00`);
        } else if (dateRange === 'thisWeek') {
          const thisWeek = new Date(now);
          thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
          const [month, day, year] = kenyaFormatter.format(thisWeek).split('/');
          start = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00+03:00`);
          end = new Date();
        } else if (dateRange === 'thisMonth') {
          const [month, , year] = kenyaFormatter.format(now).split('/');
          start = new Date(`${year}-${month.padStart(2, '0')}-01T00:00:00+03:00`);
          end = new Date();
        }

        const data = await fetchOrdersByDateRange(start, end);
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  const stats = useMemo(() => {
    let totalRevenue = 0;
    let completedRevenue = 0;
    let totalOrdersCount = orders.length;
    let cancelledOrders = 0;
    let failedPayments = 0;
    let completedOrders = 0;

    const itemsMap = {}; // { itemName: { quantity, revenue } }
    const paymentMethods = {};
    const deliveryProviders = {};

    orders.forEach(order => {
      const status = normalizeOrderStatus(order);
      const isCompleted = status === 'completed';
      const isCancelled = status === 'cancelled';
      const isFailedPayment = order.paymentStatus === 'failed';

      if (isCancelled) cancelledOrders++;
      if (isFailedPayment) failedPayments++;
      if (isCompleted) {
        completedOrders++;
        completedRevenue += (order.total || 0);
      }

      // Include all valid non-cancelled/failed orders in total revenue attempt
      if (!isCancelled && !isFailedPayment) {
        totalRevenue += (order.total || 0);
      }

      // Items aggregation (only for non-cancelled)
      if (!isCancelled) {
        (order.items || []).forEach(item => {
          const name = item.itemName || item.name;
          if (!name) return;
          if (!itemsMap[name]) itemsMap[name] = { quantity: 0, revenue: 0 };
          itemsMap[name].quantity += (item.quantity || 1);
          itemsMap[name].revenue += ((item.price || 0) * (item.quantity || 1));
        });
      }

      // Payment method aggregation
      const pMethod = order.paymentMethod || 'Unknown';
      paymentMethods[pMethod] = (paymentMethods[pMethod] || 0) + 1;

      // Delivery provider aggregation
      const dProvider = (order.deliveryMethod === 'Pickup') ? 'Pickup' : (order.deliveryProvider || 'Unknown');
      deliveryProviders[dProvider] = (deliveryProviders[dProvider] || 0) + 1;
    });

    const topItems = Object.entries(itemsMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const avgOrderValue = completedOrders > 0 ? completedRevenue / completedOrders : 0;

    return {
      totalRevenue,
      completedRevenue,
      totalOrdersCount,
      cancelledOrders,
      failedPayments,
      avgOrderValue,
      topItems,
      paymentMethods: Object.entries(paymentMethods).map(([name, count]) => ({ name, count })),
      deliveryProviders: Object.entries(deliveryProviders).map(([name, count]) => ({ name, count }))
    };
  }, [orders]);

  const formatMoney = (val) => `KSh ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="text-light">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h2 className="mb-0" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>Sales & Analytics</h2>
        <select 
          className="form-select w-auto bg-dark text-white border-secondary"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-gold" style={{ color: '#C9A227' }} role="status"></div>
          <div className="mt-2 text-muted">Analyzing data...</div>
        </div>
      ) : (
        <>
          <div className="row mb-4 g-3">
            <div className="col-6 col-md-3">
              <div className="card h-100 border-0 bg-dark p-3 rounded text-center shadow-sm">
                <div className="text-muted small text-uppercase mb-1">Total Revenue</div>
                <div className="fs-4 fw-bold text-white">{formatMoney(stats.totalRevenue)}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card h-100 border-0 bg-dark p-3 rounded text-center shadow-sm">
                <div className="text-muted small text-uppercase mb-1">Completed Revenue</div>
                <div className="fs-4 fw-bold text-success">{formatMoney(stats.completedRevenue)}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card h-100 border-0 bg-dark p-3 rounded text-center shadow-sm">
                <div className="text-muted small text-uppercase mb-1">Total Orders</div>
                <div className="fs-4 fw-bold text-info">{stats.totalOrdersCount}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card h-100 border-0 bg-dark p-3 rounded text-center shadow-sm">
                <div className="text-muted small text-uppercase mb-1">Avg Order Value</div>
                <div className="fs-4 fw-bold" style={{ color: '#C9A227' }}>{formatMoney(stats.avgOrderValue)}</div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Top Items */}
            <div className="col-lg-6">
              <div className="card border-0 h-100 shadow-sm" style={{ backgroundColor: '#1B1B1B' }}>
                <div className="card-body">
                  <h5 className="text-gold mb-4 d-flex align-items-center" style={{ color: '#C9A227' }}>
                    <FaChartLine className="me-2" /> Top Menu Items (by quantity)
                  </h5>
                  {stats.topItems.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-dark table-hover table-borderless align-middle mb-0">
                        <thead>
                          <tr className="border-bottom border-secondary text-muted small">
                            <th>Item Name</th>
                            <th className="text-center">Qty Sold</th>
                            <th className="text-end">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.topItems.map((item, idx) => (
                            <tr key={idx}>
                              <td>{item.name}</td>
                              <td className="text-center"><span className="badge bg-secondary">{item.quantity}</span></td>
                              <td className="text-end text-gold">{formatMoney(item.revenue)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-muted text-center py-4">No item data for this period.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Breakdowns */}
            <div className="col-lg-6">
              <div className="row g-4 h-100">
                <div className="col-12">
                  <div className="card border-0 h-100 shadow-sm" style={{ backgroundColor: '#1B1B1B' }}>
                    <div className="card-body">
                      <h5 className="text-gold mb-3 d-flex align-items-center" style={{ color: '#C9A227' }}>
                        <FaMotorcycle className="me-2" /> Delivery vs Pickup
                      </h5>
                      <div className="d-flex flex-wrap gap-2">
                        {stats.deliveryProviders.length > 0 ? stats.deliveryProviders.map((p, idx) => (
                          <div key={idx} className="bg-dark px-3 py-2 rounded border border-secondary d-flex justify-content-between flex-grow-1">
                            <span>{p.name}</span>
                            <span className="fw-bold ms-3">{p.count}</span>
                          </div>
                        )) : <span className="text-muted small">No data</span>}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-12">
                  <div className="card border-0 h-100 shadow-sm" style={{ backgroundColor: '#1B1B1B' }}>
                    <div className="card-body">
                      <h5 className="text-gold mb-3 d-flex align-items-center" style={{ color: '#C9A227' }}>
                        <FaCreditCard className="me-2" /> Payment Methods
                      </h5>
                      <div className="d-flex flex-wrap gap-2">
                        {stats.paymentMethods.length > 0 ? stats.paymentMethods.map((p, idx) => (
                          <div key={idx} className="bg-dark px-3 py-2 rounded border border-secondary d-flex justify-content-between flex-grow-1">
                            <span>{p.name}</span>
                            <span className="fw-bold ms-3">{p.count}</span>
                          </div>
                        )) : <span className="text-muted small">No data</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card border-0 shadow-sm" style={{ backgroundColor: '#1B1B1B' }}>
                    <div className="card-body d-flex justify-content-around">
                      <div className="text-center">
                        <div className="text-muted small mb-1">Cancelled Orders</div>
                        <div className="fs-5 text-danger fw-bold">{stats.cancelledOrders}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted small mb-1">Failed Payments</div>
                        <div className="fs-5 text-warning fw-bold">{stats.failedPayments}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
