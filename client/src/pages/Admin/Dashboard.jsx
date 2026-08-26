import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToOrders, normalizeOrderStatus, getKenyaMidnight } from '../../services/orderService';
import StatCard from '../../components/Admin/StatCard';
import StatusBadge from '../../components/Admin/StatusBadge';
import { parseBasePrice } from '../../utils/priceFormatter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Banknote, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ChevronRight,
  PieChart,
  CalendarDays
} from 'lucide-react';

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

  const { stats, attentionOrders, statusDistribution, last7DaysTrend } = useMemo(() => {
    const todayOrdersList = orders.filter(o => {
      const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
      return d >= kenyaMidnight;
    });

    const totalSales = todayOrdersList.reduce((sum, order) => sum + parseBasePrice(order.total || order.totalAmount || 0), 0);
    const completedOrders = todayOrdersList.filter(o => normalizeOrderStatus(o) === 'completed').length;
    const cancelledOrders = todayOrdersList.filter(o => normalizeOrderStatus(o) === 'cancelled').length;
    const failedPayments = todayOrdersList.filter(o => (o.paymentStatus || '').toLowerCase() === 'failed').length;
    
    const activeStatuses = ['pending', 'confirmed', 'preparing'];
    const attentionOrdersList = orders.filter(o => activeStatuses.includes(normalizeOrderStatus(o)));

    // Status distribution across all recent buffer
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
    };

    orders.forEach(o => {
      const st = normalizeOrderStatus(o);
      if (statusCounts[st] !== undefined) {
        statusCounts[st]++;
      }
    });

    // 7 Days Trend
    const last7Days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayStart = d.getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;

      const dayOrders = orders.filter(o => {
        const oDate = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
        const t = oDate.getTime();
        return t >= dayStart && t < dayEnd;
      });

      const daySales = dayOrders.reduce((sum, o) => sum + parseBasePrice(o.total || o.totalAmount || 0), 0);
      
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      last7Days.push({ day: dayName, count: dayOrders.length, sales: daySales });
    }

    const maxSalesIn7Days = Math.max(...last7Days.map(d => d.sales), 1);

    return {
      stats: {
        totalOrders: todayOrdersList.length,
        totalSales,
        pendingOrders: attentionOrdersList.length,
        completedOrders,
        cancelledOrders,
        failedPayments,
      },
      attentionOrders: attentionOrdersList,
      statusDistribution: statusCounts,
      last7DaysTrend: { days: last7Days, maxSales: maxSalesIn7Days }
    };
  }, [orders, kenyaMidnight]);

  const handleOrderClick = (orderId) => {
    navigate('/admin/orders', { state: { orderId } });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="border-neutral-800 bg-neutral-900/80 p-5">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-32" />
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-neutral-800 bg-neutral-900/80 p-6 h-64">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-40 w-full" />
          </Card>
          <Card className="border-neutral-800 bg-neutral-900/80 p-6 h-64">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-40 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-800/50 bg-red-950/30 p-6 text-center text-red-400">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <p className="font-semibold">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const totalBufferOrders = orders.length || 1;

  return (
    <div className="space-y-6">
      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Today's Orders" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          description="Orders placed today"
        />
        <StatCard 
          label="Today's Sales" 
          value={`KSh ${stats.totalSales.toLocaleString()}`} 
          icon={Banknote} 
          description="Total revenue today"
        />
        <StatCard 
          label="Pending Orders" 
          value={stats.pendingOrders} 
          icon={Clock} 
          description="Requires processing"
        />
        <StatCard 
          label="Completed Orders" 
          value={stats.completedOrders} 
          icon={CheckCircle2} 
          description="Fulfilled today"
        />
      </div>

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-gold" />
              <CardTitle>Order Status Distribution</CardTitle>
            </div>
            <span className="text-xs text-neutral-400">Recent buffer ({orders.length})</span>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {[
              { key: 'pending', label: 'Pending', color: 'bg-amber-500', count: statusDistribution.pending },
              { key: 'confirmed', label: 'Confirmed', color: 'bg-blue-500', count: statusDistribution.confirmed },
              { key: 'preparing', label: 'Preparing', color: 'bg-orange-500', count: statusDistribution.preparing },
              { key: 'ready', label: 'Ready', color: 'bg-gold', count: statusDistribution.ready },
              { key: 'completed', label: 'Completed', color: 'bg-emerald-500', count: statusDistribution.completed },
              { key: 'cancelled', label: 'Cancelled', color: 'bg-red-500', count: statusDistribution.cancelled },
            ].map(item => {
              const pct = Math.round((item.count / totalBufferOrders) * 100);
              return (
                <div key={item.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-300">{item.label}</span>
                    <span className="text-neutral-400 font-mono">{item.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                    <div 
                      className={`h-full ${item.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* 7 Days Sales Trend */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold" />
              <CardTitle>7-Day Sales Overview</CardTitle>
            </div>
            <span className="text-xs text-neutral-400">Last 7 Days</span>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-48 flex items-end justify-between gap-2 pt-6">
              {last7DaysTrend.days.map((item, idx) => {
                const heightPct = Math.max(10, Math.round((item.sales / last7DaysTrend.maxSales) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="opacity-0 group-hover:opacity-100 text-[10px] text-gold font-mono transition-opacity whitespace-nowrap bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">
                      KSh {item.sales.toLocaleString()}
                    </div>
                    <div 
                      className="w-full bg-gold/30 hover:bg-gold border-t-2 border-gold rounded-t transition-all duration-300" 
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[11px] font-medium text-neutral-400">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Needs Attention Section (Replaces Recent Orders Table) */}
      <Card className="border-amber-900/40 bg-neutral-900/90">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-amber-400 font-semibold">Needs Attention</CardTitle>
              <p className="text-xs text-neutral-400 m-0">Actionable orders requiring manager or kitchen intervention</p>
            </div>
          </div>
          {attentionOrders.length > 0 && (
            <Badge variant="warning" className="px-2.5 py-1 text-xs">
              {attentionOrders.length} {attentionOrders.length === 1 ? 'order' : 'orders'} pending
            </Badge>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {attentionOrders.length === 0 ? (
            <div className="py-8 text-center text-neutral-400 text-sm border border-dashed border-neutral-800 rounded-lg bg-neutral-950/40">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-medium text-neutral-300 m-0">All caught up!</p>
              <p className="text-xs text-neutral-500 m-0 mt-1">No pending orders require immediate attention.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {attentionOrders.slice(0, 6).map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleOrderClick(order.id)}
                  className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 hover:border-gold/40 hover:bg-neutral-800/40 transition cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-gold">
                        #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                      </span>
                      <h4 className="text-sm font-semibold text-neutral-100 truncate m-0 mt-0.5">
                        {order.customerName || 'Walk-in Customer'}
                      </h4>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-neutral-800/80 pt-2.5">
                    <span className="text-neutral-400">
                      KSh {parseBasePrice(order.total || order.totalAmount || 0).toLocaleString()}
                    </span>
                    <span className="text-gold group-hover:translate-x-1 transition-transform flex items-center font-medium">
                      Manage <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {attentionOrders.length > 6 && (
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')}>
                View all {attentionOrders.length} pending orders <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
