import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";

interface OrderCardProps {
  id: string;
  orderNumber: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    image: string;
  }>;
}

const statusConfig = {
  processing: { label: 'Processing', variant: 'default' as const, icon: Package, color: 'text-chart-2' },
  shipped: { label: 'Shipped', variant: 'default' as const, icon: Truck, color: 'text-chart-4' },
  delivered: { label: 'Delivered', variant: 'default' as const, icon: CheckCircle, color: 'text-chart-3' },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle, color: 'text-destructive' },
};

export default function OrderCard({ id, orderNumber, date, status, total, items }: OrderCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="border rounded-md p-6 hover-elevate" data-testid={`order-card-${id}`}>
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="font-semibold mb-1" data-testid={`text-order-number-${id}`}>Order #{orderNumber}</h3>
          <p className="text-sm text-muted-foreground" data-testid={`text-order-date-${id}`}>{date}</p>
        </div>
        <Badge variant={config.variant} className="flex items-center gap-1" data-testid={`badge-status-${id}`}>
          <StatusIcon className="h-3 w-3" />
          {config.label}
        </Badge>
      </div>

      <div className="flex gap-3 mb-4 overflow-x-auto">
        {items.map((item, idx) => (
          <div key={idx} className="flex-shrink-0">
            <div className="w-16 h-16 rounded-md overflow-hidden bg-card">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">×{item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <p className="text-sm text-muted-foreground">Total Amount</p>
        <p className="font-accent font-semibold text-lg" data-testid={`text-order-total-${id}`}>₹{total}</p>
      </div>
    </div>
  );
}
