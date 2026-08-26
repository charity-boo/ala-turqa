import { useState } from 'react';
import StatusBadge from './StatusBadge';
import { updateOrderStatus } from '../../services/orderService';
import { formatPrice, parseBasePrice } from '../../utils/priceFormatter';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CreditCard, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  History,
  ShoppingBag,
  X
} from 'lucide-react';

const OrderDetailsModal = ({ order, onClose }) => {
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  if (!order) return null;

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === 'cancelled') {
      setConfirmCancelOpen(true);
      return;
    }
    
    try {
      setUpdating(true);
      setErrorMessage('');
      setSuccessMessage('');
      await updateOrderStatus(order.id, newStatus);
      setSuccessMessage(`Order status updated to ${newStatus.replace('_', ' ')}.`);
    } catch (error) {
      console.error("Order status transition error:", error);
      setErrorMessage(error.message || "Unable to update order status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const confirmCancelAction = async () => {
    try {
      setUpdating(true);
      setErrorMessage('');
      setSuccessMessage('');
      await updateOrderStatus(order.id, 'cancelled');
      setSuccessMessage("Order cancelled successfully.");
    } catch (error) {
      console.error("Cancellation error:", error);
      setErrorMessage(error.message || "Unable to cancel order. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const getAvailableActions = (currentStatus) => {
    const status = currentStatus?.toLowerCase() || 'pending';

    // Comprehensive detection of delivery vs pickup
    const rawMethod = String(order.deliveryMethod || order.orderType || '').toLowerCase().trim();
    const rawProvider = String(order.deliveryProvider || '').toLowerCase().trim();
    
    // An order is pickup if explicitly set to 'pickup', 'restaurant', or 'pay at restaurant'
    const isExplicitPickup = ['pickup', 'restaurant', 'pay at restaurant'].some(val => rawMethod.includes(val) || rawProvider.includes(val));

    // An order is delivery if method/provider specifies delivery or a delivery provider name (vipi/glovo)
    const isExplicitDelivery = ['delivery', 'vipi', 'glovo'].some(val => rawMethod.includes(val) || rawProvider.includes(val)) || Boolean(order.deliveryAddress || order.deliveryLocation);

    const isPickup = isExplicitPickup || (!isExplicitDelivery);

    switch (status) {
      case 'pending':
        return [
          { label: 'Confirm Order', value: 'confirmed', variant: 'default' },
          { label: 'Cancel Order', value: 'cancelled', variant: 'destructive' }
        ];
      case 'confirmed':
        return [
          { label: 'Start Preparing', value: 'preparing', variant: 'default' },
          { label: 'Cancel Order', value: 'cancelled', variant: 'destructive' }
        ];
      case 'preparing':
        return [
          { label: 'Mark as Ready', value: 'ready', variant: 'default' },
          { label: 'Cancel Order', value: 'cancelled', variant: 'destructive' }
        ];
      case 'ready':
        if (isPickup) {
          return [
            { label: 'Mark Completed', value: 'completed', variant: 'default' }
          ];
        }
        return [
          { label: 'Out for Delivery', value: 'out_for_delivery', variant: 'default' },
          { label: 'Cancel Order', value: 'cancelled', variant: 'destructive' }
        ];
      case 'out_for_delivery':
        return [
          { label: 'Mark Completed', value: 'completed', variant: 'default' }
        ];
      default:
        return [];
    }
  };

  const actions = getAvailableActions(order.status);

  // Status History
  const historyList = order.statusHistory || [
    { status: order.status || 'pending', timestamp: order.createdAt, note: 'Order initialized' }
  ];

  return (
    <>
      <Sheet open={!!order} onOpenChange={(open) => !open && onClose()}>
        <SheetHeader className="relative pr-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold font-mono">
                  #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                </SheetTitle>
                <SheetDescription>
                  Placed on {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'N/A'}
                </SheetDescription>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <SheetClose onClick={onClose} />
        </SheetHeader>

        <SheetContent className="space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-lg border border-red-800/80 bg-red-950/60 text-red-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                {errorMessage}
              </span>
              <Button size="xs" variant="outline" className="text-[10px] h-6 px-2 border-red-800 hover:bg-red-900" onClick={() => setErrorMessage('')}>
                Dismiss
              </Button>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg border border-emerald-800/80 bg-emerald-950/60 text-emerald-300 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              {successMessage}
            </div>
          )}

          {/* Customer Information */}
          <div className="rounded-xl bg-neutral-950/60 border border-neutral-800 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-gold uppercase tracking-wider flex items-center gap-1.5 m-0">
              <User className="w-3.5 h-3.5" /> Customer Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-neutral-500 block">Name</span>
                <span className="font-semibold text-neutral-200">
                  {order.customerName || `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Phone</span>
                <span className="font-semibold text-neutral-200 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gold" />
                  {order.phoneNumber || order.phone || 'N/A'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-neutral-500 block">Email</span>
                <span className="font-semibold text-neutral-200 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gold" />
                  {order.email || 'N/A'}
                </span>
              </div>
              <div className="sm:col-span-2 border-t border-neutral-800/80 pt-2 mt-1">
                <span className="text-neutral-500 block">Delivery Address</span>
                <span className="font-medium text-neutral-300 flex items-start gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                  {order.address || order.deliveryAddress || 'Pickup at restaurant'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Delivery Information */}
          <div className="rounded-xl bg-neutral-950/60 border border-neutral-800 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-gold uppercase tracking-wider flex items-center gap-1.5 m-0">
              <CreditCard className="w-3.5 h-3.5" /> Payment & Logistics
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-neutral-500 block">Method</span>
                <span className="font-semibold text-neutral-200 capitalize">
                  {order.paymentMethod || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Payment Status</span>
                <span className="font-semibold text-emerald-400 capitalize">
                  {order.paymentStatus || 'pending'}
                </span>
              </div>
              {order.mpesaReceiptNumber && (
                <div className="col-span-2 bg-neutral-900 border border-neutral-800 p-2.5 rounded-lg text-xs space-y-1 font-mono">
                  <div className="text-neutral-400">M-Pesa Receipt: <span className="text-gold font-bold">{order.mpesaReceiptNumber}</span></div>
                  {order.checkoutRequestId && <div className="text-[10px] text-neutral-500 truncate">Checkout ID: {order.checkoutRequestId}</div>}
                </div>
              )}
            </div>

            {order.specialInstructions && (
              <div className="mt-3 p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs">
                <span className="font-semibold text-amber-400 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> Special Instructions:
                </span>
                <p className="text-neutral-300 m-0 mt-1">{order.specialInstructions}</p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gold uppercase tracking-wider flex items-center gap-1.5 m-0">
              Order Items ({order.items?.length || 0})
            </h3>
            <div className="rounded-xl border border-neutral-800 overflow-hidden divide-y divide-neutral-800/60 bg-neutral-950/40">
              {order.items?.map((item, index) => (
                <div key={index} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-neutral-100 m-0">{item.itemName || item.name}</p>
                    <p className="text-neutral-400 m-0 text-[11px]">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="font-bold font-mono text-neutral-200">
                    KSh {(parseBasePrice(item.price) * Number(item.quantity || 1)).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="p-3 bg-neutral-900 flex justify-between items-center text-sm font-bold border-t border-neutral-800">
                <span className="text-neutral-400 uppercase tracking-wider text-xs">Total Amount</span>
                <span className="text-gold font-mono text-base">
                  KSh {parseBasePrice(order.totalAmount || order.total).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status History Timeline */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold text-gold uppercase tracking-wider flex items-center gap-1.5 m-0">
              <History className="w-3.5 h-3.5" /> Order History
            </h3>
            <div className="space-y-2 border-l-2 border-neutral-800 pl-4 ml-2 text-xs">
              {historyList.map((hist, i) => {
                const histDate = hist.timestamp?.toDate ? hist.timestamp.toDate() : (hist.timestamp ? new Date(hist.timestamp) : null);
                return (
                  <div key={i} className="relative pb-2">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-gold border border-neutral-900" />
                    <p className="font-semibold text-neutral-200 capitalize m-0">{hist.status?.replace('_', ' ')}</p>
                    {histDate && <p className="text-[10px] text-neutral-500 m-0">{histDate.toLocaleString()}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </SheetContent>

        <SheetFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={updating}>
            Close
          </Button>
          <div className="flex gap-2">
            {actions.map((action, i) => (
              <Button
                key={i}
                variant={action.variant}
                onClick={() => handleStatusUpdate(action.value)}
                disabled={updating}
              >
                {updating ? 'Updating...' : action.label}
              </Button>
            ))}
          </div>
        </SheetFooter>
      </Sheet>

      {/* Confirmation Dialog for Cancellation */}
      <AlertDialog
        open={confirmCancelOpen}
        onOpenChange={setConfirmCancelOpen}
        title="Cancel Order?"
        description={`This action will mark order #${order.orderNumber || order.id.slice(-6).toUpperCase()} as cancelled. ${(order.paymentStatus || '').toLowerCase() === 'paid' ? 'Warning: Order is already paid. A manual refund may be required.' : ''}`}
        confirmText="Yes, Cancel Order"
        cancelText="Keep Order"
        onConfirm={confirmCancelAction}
      />
    </>
  );
};

export default OrderDetailsModal;
