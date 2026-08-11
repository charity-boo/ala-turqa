import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { updateOrderStatus } from '../../services/orderService';
import { formatPrice, parseBasePrice } from '../../utils/priceFormatter';

const OrderDetailsModal = ({ order, onClose }) => {
  const [updating, setUpdating] = useState(false);

  if (!order) return null;

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await updateOrderStatus(order.id, newStatus);
    } catch (error) {
      alert("Failed to update status. See console for details.");
    } finally {
      setUpdating(false);
    }
  };

  const getAvailableActions = (currentStatus) => {
    const status = currentStatus?.toLowerCase() || 'pending';
    switch (status) {
      case 'pending':
        return [
          { label: 'Confirm Order', value: 'confirmed', class: 'btn-info' },
          { label: 'Cancel Order', value: 'cancelled', class: 'btn-danger' }
        ];
      case 'confirmed':
        return [
          { label: 'Mark as Preparing', value: 'preparing', class: 'btn-primary' },
          { label: 'Cancel Order', value: 'cancelled', class: 'btn-danger' }
        ];
      case 'preparing':
        return [
          { label: 'Mark as Ready', value: 'ready', class: 'btn-success' },
          { label: 'Cancel Order', value: 'cancelled', class: 'btn-danger' }
        ];
      case 'ready':
        return [
          { label: 'Mark as Completed', value: 'completed', class: 'btn-secondary' }
        ];
      default:
        return [];
    }
  };

  const actions = getAvailableActions(order.status);

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0" style={{ backgroundColor: '#1B1B1B', color: '#FFFFFF' }}>
          
          <div className="modal-header border-0" style={{ borderBottom: '1px solid #333' }}>
            <h5 className="modal-title" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227', fontWeight: 'bold' }}>
              Order Details #{order.orderNumber || order.id.slice(-6).toUpperCase()}
            </h5>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose} disabled={updating}></button>
          </div>
          
          <div className="modal-body" style={{ fontFamily: '"Poppins", sans-serif' }}>
            <div className="row g-4">
              
              {/* Customer Info */}
              <div className="col-md-6">
                <div className="p-3 rounded h-100" style={{ backgroundColor: '#222' }}>
                  <h6 style={{ color: '#C9A227', borderBottom: '1px solid #444', paddingBottom: '8px', marginBottom: '15px' }}>Customer Information</h6>
                  <p className="mb-2"><strong>Name:</strong> {order.customerName || `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'N/A'}</p>
                  <p className="mb-2"><strong>Email:</strong> {order.email || 'N/A'}</p>
                  <p className="mb-2"><strong>Phone:</strong> {order.phoneNumber || order.phone || 'N/A'}</p>
                  <p className="mb-0"><strong>Address:</strong> {order.address || order.deliveryAddress || 'N/A'}</p>
                </div>
              </div>

              {/* Order Info */}
              <div className="col-md-6">
                <div className="p-3 rounded h-100" style={{ backgroundColor: '#222' }}>
                  <h6 style={{ color: '#C9A227', borderBottom: '1px solid #444', paddingBottom: '8px', marginBottom: '15px' }}>Order Information</h6>
                  <div className="mb-3 d-flex justify-content-between align-items-center">
                    <strong>Current Status:</strong> <StatusBadge status={order.status} />
                  </div>
                  <p className="mb-2"><strong>Type:</strong> <span style={{ textTransform: 'capitalize' }}>{order.orderType || 'N/A'}</span></p>
                  <p className="mb-2"><strong>Payment:</strong> <span style={{ textTransform: 'capitalize' }}>{order.paymentMethod || 'N/A'}</span></p>
                  {order.specialInstructions && (
                    <div className="mt-3 p-2 rounded" style={{ backgroundColor: '#332a00', border: '1px solid #C9A227' }}>
                      <strong style={{ color: '#C9A227' }}>Special Instructions:</strong>
                      <p className="mb-0 mt-1 text-light" style={{ fontSize: '0.9rem' }}>{order.specialInstructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="col-12 mt-4">
                <h6 style={{ color: '#C9A227', borderBottom: '1px solid #444', paddingBottom: '8px', marginBottom: '15px' }}>
                  Order Items ({order.items?.length || 0})
                </h6>
                <div className="table-responsive">
                  <table className="table table-dark table-sm mb-0 align-middle" style={{ backgroundColor: '#1B1B1B' }}>
                    <thead style={{ color: '#aaa' }}>
                      <tr>
                        <th>Item</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                          <td className="py-2">{item.itemName || item.name}</td>
                          <td className="text-center py-2">{item.quantity}</td>
                          <td className="text-end py-2">{formatPrice(item.price)}</td>
                          <td className="text-end py-2 fw-bold">KES {(parseBasePrice(item.price) * Number(item.quantity || 1)).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end py-3 pe-3 text-uppercase" style={{ color: '#888', fontSize: '0.9rem', letterSpacing: '1px' }}>Grand Total:</td>
                        <td className="text-end py-3 fw-bold fs-5" style={{ color: '#C9A227' }}>KES {parseBasePrice(order.totalAmount || order.total).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
            </div>
          </div>
          
          <div className="modal-footer border-0" style={{ borderTop: '1px solid #333', backgroundColor: '#222' }}>
            <div className="w-100 d-flex justify-content-between align-items-center">
              <button 
                type="button" 
                className="btn text-light" 
                style={{ backgroundColor: '#444' }} 
                onClick={onClose}
                disabled={updating}
              >
                Close
              </button>
              <div className="d-flex gap-2">
                {actions.map((action, i) => (
                  <button 
                    key={i} 
                    className={`btn ${action.class} fw-bold text-dark`} 
                    onClick={() => handleStatusUpdate(action.value)}
                    disabled={updating}
                  >
                    {updating ? 'Updating...' : action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
