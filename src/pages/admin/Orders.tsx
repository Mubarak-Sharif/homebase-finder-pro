import AdminSidebar from "@/components/AdminSidebar";
import { useOrders } from "@/contexts/OrderContext";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatus } from "@/data/mockData";
import { useState } from "react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statuses: OrderStatus[] = ["pending", "confirmed", "processing", "delivered", "cancelled"];

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useOrders();
  const { products } = useData();
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="font-heading text-3xl font-bold text-foreground">Orders</h1>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px] bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">Order</th>
                <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Customer</th>
                <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Phone</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Total</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <>
                  <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                    <td className="p-3">
                      <p className="font-medium text-foreground">{o.id}</p>
                      <p className="text-xs text-muted-foreground">{o.createdAt}</p>
                    </td>
                    <td className="p-3 text-foreground hidden md:table-cell">{o.customerName}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{o.phone}</td>
                    <td className="p-3 text-foreground font-medium">Rs. {o.total.toLocaleString()}</td>
                    <td className="p-3"><Badge variant="outline" className={statusColors[o.status]}>{o.status}</Badge></td>
                    <td className="p-3" onClick={e => e.stopPropagation()}>
                      <Select value={o.status} onValueChange={v => updateOrderStatus(o.id, v as OrderStatus)}>
                        <SelectTrigger className="w-[110px] h-8 text-xs bg-secondary"><SelectValue /></SelectTrigger>
                        <SelectContent>{statuses.map(s => <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr key={`${o.id}-detail`}>
                      <td colSpan={6} className="p-4 bg-secondary/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-foreground mb-2">Items:</p>
                            {o.items.map(item => {
                              const prod = products.find(p => p.id === item.productId);
                              return <p key={item.productId} className="text-muted-foreground">{prod?.name} × {item.quantity} sqft = Rs. {(item.pricePerSqft * item.quantity).toLocaleString()}</p>;
                            })}
                          </div>
                          <div className="space-y-1 text-muted-foreground">
                            <p><span className="text-foreground">Customer:</span> {o.customerName}</p>
                            <p><span className="text-foreground">Phone:</span> {o.phone}</p>
                            <p><span className="text-foreground">Address:</span> {o.address}</p>
                            <p><span className="text-foreground">Payment:</span> {o.paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}</p>
                            {o.notes && <p><span className="text-foreground">Notes:</span> {o.notes}</p>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
