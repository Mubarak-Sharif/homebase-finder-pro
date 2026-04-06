import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useOrders } from "@/contexts/OrderContext";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PROCESSING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DELIVERED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

const MyOrders = () => {
  const { orders, loading, error } = useOrders();

  // TODO: When auth is added, filter by current user's orders
  const myOrders = orders;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6">My Orders</h1>
        {error && <p className="text-destructive text-sm mb-4">{error}</p>}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
          </div>
        ) : myOrders.length === 0 ? (
          <div className="text-center py-16">
            <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No orders yet</p>
            <Link to="/products"><Button variant="outline" className="mt-4">Browse Products</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map(order => (
              <div key={order.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="outline" className={statusColors[order.status] || ""}>{order.status}</Badge>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.product_name_snapshot} × {Number(item.quantity_sqft)} sqft</span>
                      <span className="text-foreground">Rs. {Number(item.line_total).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-semibold border-t border-border pt-2">
                  <span>Total</span><span className="text-primary">Rs. {Number(order.total_amount).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default MyOrders;
