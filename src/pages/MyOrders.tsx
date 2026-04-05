import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { useData } from "@/contexts/DataContext";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const MyOrders = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { orders } = useOrders();
  const { products } = useData();

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <ClipboardList className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Login to View Orders</h2>
        <Link to="/login" state={{ from: "/orders" }}><Button className="gold-gradient text-primary-foreground mt-4">Login</Button></Link>
      </div>
      <BottomNav />
    </div>
  );

  const myOrders = orders.filter(o => o.userId === currentUser?.id);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6">My Orders</h1>
        {myOrders.length === 0 ? (
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
                    <p className="font-semibold text-foreground">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.createdAt}</p>
                  </div>
                  <Badge variant="outline" className={statusColors[order.status]}>{order.status}</Badge>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items.map(item => {
                    const prod = products.find(p => p.id === item.productId);
                    return (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{prod?.name || item.productId} × {item.quantity} sqft</span>
                        <span className="text-foreground">Rs. {(item.pricePerSqft * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between font-semibold border-t border-border pt-2">
                  <span>Total</span><span className="text-primary">Rs. {order.total.toLocaleString()}</span>
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
