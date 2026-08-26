import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import OrderDetailsModal from '../../components/Admin/OrderDetailsModal';
import OrderTable from '../../components/Admin/OrderTable';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ORDER_STATUS_FLOW,
  formatOrderStatusLabel,
  subscribeToPaginatedOrders,
  getFilteredOrdersCount
} from '../../services/orderService';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  RotateCcw, 
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const ORDER_FILTERS = ['all', ...ORDER_STATUS_FLOW];

const DATE_FILTERS = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Custom Date', value: 'custom' },
  { label: 'All Time', value: 'all' }
];

const PAGE_SIZE = 10;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter States - Default to 'today'
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [selectedDeliveryProvider, setSelectedDeliveryProvider] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  const [customDate, setCustomDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination & Cursor State
  const [page, setPage] = useState(1);
  const [pageCursors, setPageCursors] = useState([null]); // Index i stores startAfter doc for page i+1
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const location = useLocation();

  // Reset pagination cursors whenever filters change
  const handleFilterChange = (filterSetter, value) => {
    filterSetter(value);
    setPage(1);
    setPageCursors([null]);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
    setPageCursors([null]);
  };

  const resetFilters = () => {
    setSelectedStatus('all');
    setSelectedPaymentStatus('all');
    setSelectedDeliveryProvider('all');
    setSelectedDateRange('today');
    setCustomDate('');
    setSearchTerm('');
    setPage(1);
    setPageCursors([null]);
  };

  // Subscribe to paginated orders based on current filters and active page cursor
  useEffect(() => {
    setLoading(true);
    setError('');

    const startAfterDoc = pageCursors[page - 1] || null;

    const unsubscribe = subscribeToPaginatedOrders({
      pageSize: PAGE_SIZE,
      startAfterDoc,
      dateRange: selectedDateRange,
      customDateStr: customDate,
      status: selectedStatus,
      paymentStatus: selectedPaymentStatus,
      deliveryProvider: selectedDeliveryProvider,
      onData: ({ orders: fetchedOrders, lastVisible, hasMore: moreAvailable }) => {
        setOrders(fetchedOrders);
        setHasMore(moreAvailable);

        // Store next page cursor if available
        if (lastVisible && pageCursors.length === page) {
          setPageCursors(prev => [...prev, lastVisible]);
        }
        setLoading(false);
      },
      onError: (err) => {
        console.error("Firestore pagination query error:", err);
        setError("Failed to load orders. If an index error occurs, please verify Firestore composite index requirements.");
        setLoading(false);
      }
    });

    // Fetch total count for active filter context
    getFilteredOrdersCount({
      dateRange: selectedDateRange,
      customDateStr: customDate,
      status: selectedStatus,
      paymentStatus: selectedPaymentStatus,
      deliveryProvider: selectedDeliveryProvider
    }).then(count => {
      setTotalCount(count);
    });

    return () => unsubscribe();
  }, [selectedStatus, selectedPaymentStatus, selectedDeliveryProvider, selectedDateRange, customDate, page]);

  // Handle route state navigation (if opened from another page)
  useEffect(() => {
    if (location.state?.orderId && orders.length > 0) {
      const order = orders.find(o => o.id === location.state.orderId);
      if (order) {
        setSelectedOrder(order);
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, orders]);

  // Client-side search filtering within the current active paginated set
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const needle = searchTerm.toLowerCase();
    return orders.filter((order) => {
      return [
        order.orderNumber,
        order.customerName,
        order.phone,
        order.phoneNumber,
        order.email,
        order.deliveryProvider,
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(needle));
    });
  }, [orders, searchTerm]);

  const handleNextPage = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const isFiltered = selectedStatus !== 'all' || selectedPaymentStatus !== 'all' || selectedDeliveryProvider !== 'all' || selectedDateRange !== 'today' || searchTerm.trim() !== '' || customDate !== '';

  return (
    <div className="space-y-6">
      {/* Prominent Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
        <Input
          className="pl-10 h-11 text-base bg-neutral-900 border-neutral-800 focus:border-gold"
          placeholder="Search orders by order number, customer, phone or email..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Controls Row */}
      <div className="space-y-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-neutral-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            {ORDER_FILTERS.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={selectedStatus === status ? "default" : "outline"}
                onClick={() => handleFilterChange(setSelectedStatus, status)}
                className="h-8 text-xs capitalize"
              >
                {status === 'all' ? 'All' : formatOrderStatusLabel(status)}
              </Button>
            ))}
          </div>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs text-gold hover:text-gold-light hover:bg-neutral-800 ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset to Today
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 border-t border-neutral-800/60">
          <div>
            <label className="text-[11px] font-medium text-neutral-400 mb-1 block">Payment Status</label>
            <Select
              value={selectedPaymentStatus}
              onChange={(e) => handleFilterChange(setSelectedPaymentStatus, e.target.value)}
            >
              <option value="all">Payment: All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </Select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-400 mb-1 block">Delivery Provider</label>
            <Select
              value={selectedDeliveryProvider}
              onChange={(e) => handleFilterChange(setSelectedDeliveryProvider, e.target.value)}
            >
              <option value="all">Delivery: All</option>
              <option value="Vipi">Vipi</option>
              <option value="Glovo">Glovo</option>
              <option value="pickup">Pickup / Restaurant</option>
            </Select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-400 mb-1 block">Date Range</label>
            <Select
              value={selectedDateRange}
              onChange={(e) => handleFilterChange(setSelectedDateRange, e.target.value)}
            >
              {DATE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </Select>
          </div>

          {selectedDateRange === 'custom' && (
            <div>
              <label className="text-[11px] font-medium text-neutral-400 mb-1 block">Select Date</label>
              <Input 
                type="date" 
                value={customDate}
                onChange={(e) => handleFilterChange(setCustomDate, e.target.value)}
                className="h-9 bg-neutral-950 border-neutral-800 text-xs"
              />
            </div>
          )}

          <div className="sm:col-span-3 lg:col-span-1 flex items-end justify-end">
            <span className="text-xs text-neutral-400 font-mono py-2">
              {selectedDateRange === 'today' ? "Today's Orders: " : "Matching Orders: "}
              <strong className="text-gold font-bold text-sm">
                {totalCount !== null ? totalCount : filteredOrders.length}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-800 bg-red-950/40 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Orders Table Loading Skeleton or Results */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl bg-neutral-900" />
          ))}
        </div>
      ) : (
        <OrderTable
          orders={filteredOrders}
          onViewDetails={(order) => setSelectedOrder(order)}
        />
      )}

      {/* Cursor-Based Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <span className="text-xs text-neutral-400 font-mono">
          Page <strong className="text-neutral-200">{page}</strong> 
          {totalCount !== null && ` (${(page - 1) * PAGE_SIZE + 1} - ${Math.min(page * PAGE_SIZE, totalCount)} of ${totalCount})`}
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={page === 1 || loading}
            className="text-xs gap-1 border-neutral-800 hover:bg-neutral-800"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!hasMore || loading}
            className="text-xs gap-1 border-neutral-800 hover:bg-neutral-800 text-gold"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Order Details Sheet */}
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
