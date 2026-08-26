import StatusBadge from './StatusBadge';
import { parseBasePrice } from '../../utils/priceFormatter';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, CreditCard, Truck, Calendar, ShoppingBag } from 'lucide-react';

const OrderTable = ({ orders, onViewDetails }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="py-12 text-center text-neutral-400 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/40">
        <ShoppingBag className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-neutral-200 m-0">No orders found</h3>
        <p className="text-xs text-neutral-500 mt-1 m-0">Try changing your search query or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/90 overflow-hidden shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const itemCount = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
            const dateStr = order.createdAt?.toDate 
              ? order.createdAt.toDate().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
              : (order.createdAt ? new Date(order.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A');

            const pStatus = (order.paymentStatus || 'pending').toLowerCase();
            const delivery = order.deliveryProvider || order.orderType || order.deliveryMethod || 'Pickup';

            return (
              <TableRow 
                key={order.id}
                className="hover:bg-neutral-800/50 transition cursor-pointer"
                onClick={() => onViewDetails(order)}
              >
                <TableCell className="font-mono font-bold text-gold">
                  #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-neutral-100">{order.customerName || 'N/A'}</div>
                  <div className="text-xs text-neutral-400">{order.phone || order.phoneNumber || ''}</div>
                </TableCell>
                <TableCell className="text-neutral-300">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </TableCell>
                <TableCell className="font-semibold text-neutral-100 whitespace-nowrap">
                  KSh {parseBasePrice(order.total || order.totalAmount || 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                    pStatus === 'paid' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40' :
                    pStatus === 'failed' ? 'bg-red-950/80 text-red-400 border border-red-800/40' :
                    'bg-neutral-800 text-neutral-400'
                  }`}>
                    <CreditCard className="w-3 h-3" />
                    {pStatus}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-xs text-neutral-300 capitalize">
                    <Truck className="w-3 h-3 text-neutral-500" />
                    {delivery}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-xs text-neutral-400 whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    {dateStr}
                  </span>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onViewDetails(order)}
                    className="text-neutral-300 hover:text-gold hover:bg-neutral-800"
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
