import { Badge } from "@/components/ui/badge";

const statusConfig = {
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'info' },
  preparing: { label: 'Preparing', variant: 'secondary' },
  ready: { label: 'Ready', variant: 'default' },
  out_for_delivery: { label: 'Out for Delivery', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

const StatusBadge = ({ status }) => {
  const normalized = (status || 'pending').toLowerCase();
  const config = statusConfig[normalized] || { label: status || 'Unknown', variant: 'secondary' };

  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
