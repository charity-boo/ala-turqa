import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { FaMoneyBillWave, FaSearch, FaFileInvoiceDollar, FaSpinner } from 'react-icons/fa';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const ordersRef = collection(db, 'orders');
      // Fetch all orders, ordered by creation date
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const paymentsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Only include orders that have payment information
        if (data.paymentMethod || data.paymentStatus || data.total > 0) {
          paymentsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date()
          });
        }
      });
      
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning text-dark';
      case 'failed':
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const filteredPayments = payments.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      (p.orderNumber && p.orderNumber.toLowerCase().includes(term)) ||
      (p.mpesaReceiptNumber && p.mpesaReceiptNumber.toLowerCase().includes(term)) ||
      (p.customerName && p.customerName.toLowerCase().includes(term)) ||
      (p.customerPhone && p.customerPhone.toLowerCase().includes(term))
    );
  });

  const totalRevenue = payments
    .filter(p => p.paymentStatus?.toLowerCase() === 'paid' || p.paymentStatus?.toLowerCase() === 'completed')
    .reduce((sum, p) => sum + (Number(p.total) || 0), 0);

  return (
    <div className="container-fluid py-4 text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>
          <FaFileInvoiceDollar className="me-2 mb-1" /> Payments Ledger
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#1B1B1B' }}>
            <div className="card-body p-4 d-flex align-items-center">
              <div className="rounded-circle bg-dark d-flex align-items-center justify-content-center border border-success" style={{ width: '60px', height: '60px' }}>
                <FaMoneyBillWave className="text-success fs-4" />
              </div>
              <div className="ms-3">
                <p className="text-muted mb-0">Total Revenue</p>
                <h4 className="mb-0 fw-bold">KES {totalRevenue.toLocaleString()}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#1B1B1B' }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="text-gold mb-0">Transaction History</h5>
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <span className="input-group-text bg-dark border-secondary text-muted">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Search receipt, order, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <FaSpinner className="fa-spin fs-2 text-warning" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No payment records found matching your search.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Method</th>
                    <th>Receipt No.</th>
                    <th>Status</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(payment => (
                    <tr key={payment.id}>
                      <td className="text-muted">
                        {payment.createdAt.toLocaleDateString()} {payment.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="fw-bold">{payment.orderNumber || payment.id.slice(-6).toUpperCase()}</td>
                      <td>{payment.customerName || 'N/A'}</td>
                      <td>{payment.customerPhone || 'N/A'}</td>
                      <td>{payment.paymentMethod || 'M-Pesa'}</td>
                      <td className="text-info font-monospace">{payment.mpesaReceiptNumber || '-'}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(payment.paymentStatus)} px-3 py-2 rounded-pill text-capitalize`}>
                          {payment.paymentStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="text-end fw-bold">KES {Number(payment.total).toLocaleString()}</td>
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

export default Payments;
