import AdminSidebar from "@/components/AdminSidebar";
import { useOrders } from "@/contexts/OrderContext";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PROCESSING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DELIVERED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "DELIVERED", "CANCELLED"];

const AdminOrders = () => {
  const { orders, updateOrderStatus, loading } = useOrders();
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      toast({ title: `Order status updated to ${status}` });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

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
              {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
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
                  <React.Fragment key={o.id}>
                    <tr className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                      <td className="p-3">
                        <p className="font-medium text-foreground">{o.order_number}</p>
                        <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="p-3 text-foreground hidden md:table-cell">{o.customer_name}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{o.customer_phone}</td>
                      <td className="p-3 text-foreground font-medium">Rs. {Number(o.total_amount).toLocaleString()}</td>
                      <td className="p-3"><Badge variant="outline" className={statusColors[o.status] || ""}>{o.status}</Badge></td>
                      <td className="p-3" onClick={e => e.stopPropagation()}>
                        <Select value={o.status} onValueChange={v => handleStatusChange(o.id, v)}>
                          <SelectTrigger className="w-[120px] h-8 text-xs bg-secondary"><SelectValue /></SelectTrigger>
                          <SelectContent>{statuses.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                    </tr>
                    {expanded === o.id && (
                      <tr>
                        <td colSpan={6} className="p-4 bg-secondary/30">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-foreground mb-2">Items:</p>
                              {o.items.map(item => (
                                <p key={item.id} className="text-muted-foreground">
                                  {item.product_name_snapshot} × {Number(item.quantity_sqft)} sqft = Rs. {Number(item.line_total).toLocaleString()}
                                </p>
                              ))}
                            </div>
                            <div className="space-y-1 text-muted-foreground">
                              <p><span className="text-foreground">Customer:</span> {o.customer_name}</p>
                              <p><span className="text-foreground">Phone:</span> {o.customer_phone}</p>
                              <p><span className="text-foreground">Address:</span> {o.customer_address}</p>
                              <p><span className="text-foreground">Type:</span> {o.order_type}</p>
                              {o.notes && <p><span className="text-foreground">Notes:</span> {o.notes}</p>}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

import React from "react";
export default AdminOrders;
