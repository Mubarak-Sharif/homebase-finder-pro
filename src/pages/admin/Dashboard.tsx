import AdminSidebar from "@/components/AdminSidebar";
import { useOrders } from "@/contexts/OrderContext";
import { useData } from "@/contexts/DataContext";
import { Package, ClipboardList, TrendingUp, CheckCircle, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AdminDashboard = () => {
  const { orders, loading: ordersLoading } = useOrders();
  const { products, loading: dataLoading } = useData();

  const pending = orders.filter(o => o.status === "PENDING").length;
  const delivered = orders.filter(o => o.status === "DELIVERED").length;
  const totalSales = orders.filter(o => o.status === "DELIVERED").reduce((s, o) => s + Number(o.total_amount), 0);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ClipboardList, color: "text-blue-400" },
    { label: "Pending", value: pending, icon: Package, color: "text-yellow-400" },
    { label: "Delivered", value: delivered, icon: CheckCircle, color: "text-green-400" },
    { label: "Total Sales", value: `Rs. ${totalSales.toLocaleString()}`, icon: TrendingUp, color: "text-primary" },
  ];

  const statusData = [
    { name: "Pending", value: pending, color: "#eab308" },
    { name: "Confirmed", value: orders.filter(o => o.status === "CONFIRMED").length, color: "#3b82f6" },
    { name: "Delivered", value: delivered, color: "#22c55e" },
    { name: "Cancelled", value: orders.filter(o => o.status === "CANCELLED").length, color: "#ef4444" },
  ].filter(d => d.value > 0);

  const loading = ordersLoading || dataLoading;

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Dashboard</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map(s => (
                <div key={s.label} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Orders by Status</h3>
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`}>
                        {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(0 0% 11%)", border: "1px solid hsl(0 0% 18%)", borderRadius: 8, color: "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-8">No orders yet</p>
                )}
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Products</span><span className="text-foreground font-medium">{products.length}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Featured Products</span><span className="text-foreground font-medium">{products.filter(p => p.featured).length}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Out of Stock</span><span className="text-foreground font-medium">{products.filter(p => p.stock_status === "OUT_OF_STOCK").length}</span></div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
