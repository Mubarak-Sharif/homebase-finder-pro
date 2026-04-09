import AdminSidebar from "@/components/AdminSidebar";
import { useOrders } from "@/contexts/OrderContext";
import { useData } from "@/contexts/DataContext";
import { Package, ClipboardList, TrendingUp, CheckCircle, Loader2, AlertTriangle, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const AdminDashboard = () => {
  const { orders, loading: ordersLoading } = useOrders();
  const { products, categories, loading: dataLoading } = useData();

  const pending = orders.filter(o => o.status === "PENDING").length;
  const confirmed = orders.filter(o => o.status === "CONFIRMED").length;
  const delivered = orders.filter(o => o.status === "DELIVERED").length;
  const cancelled = orders.filter(o => o.status === "CANCELLED").length;
  const totalSales = orders.filter(o => o.status === "DELIVERED").reduce((s, o) => s + Number(o.total_amount), 0);
  const avgOrder = delivered > 0 ? totalSales / delivered : 0;

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ClipboardList, color: "bg-blue-500/10 text-blue-400" },
    { label: "Pending", value: pending, icon: AlertTriangle, color: "bg-yellow-500/10 text-yellow-400" },
    { label: "Delivered", value: delivered, icon: CheckCircle, color: "bg-green-500/10 text-green-400" },
    { label: "Total Sales", value: `Rs. ${totalSales.toLocaleString()}`, icon: DollarSign, color: "bg-primary/10 text-primary" },
  ];

  const statusData = [
    { name: "Pending", value: pending, color: "#eab308" },
    { name: "Confirmed", value: confirmed, color: "#3b82f6" },
    { name: "Delivered", value: delivered, color: "#22c55e" },
    { name: "Cancelled", value: cancelled, color: "#ef4444" },
  ].filter(d => d.value > 0);

  // Category-wise product count
  const categoryData = categories.map(c => ({
    name: c.name.length > 12 ? c.name.slice(0, 12) + "…" : c.name,
    products: products.filter(p => p.category_id === c.id).length,
  }));

  const recentOrders = [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  const loading = ordersLoading || dataLoading;

  const statusBadge: Record<string, string> = {
    PENDING: "text-yellow-400 bg-yellow-500/10",
    CONFIRMED: "text-blue-400 bg-blue-500/10",
    DELIVERED: "text-green-400 bg-green-500/10",
    CANCELLED: "text-red-400 bg-red-500/10",
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your marble business</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map(s => (
                <div key={s.label} className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-colors">
                  <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Orders by Status</h3>
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}
                        label={({ name, value }) => `${name}: ${value}`} strokeWidth={2} stroke="hsl(0 0% 7%)">
                        {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(0 0% 11%)", border: "1px solid hsl(0 0% 18%)", borderRadius: 12, color: "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-12">No orders yet</p>
                )}
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Products by Category</h3>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 18%)" />
                      <XAxis dataKey="name" tick={{ fill: "hsl(0 0% 55%)", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(0 0% 55%)", fontSize: 11 }} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: "hsl(0 0% 11%)", border: "1px solid hsl(0 0% 18%)", borderRadius: 12, color: "#fff" }} />
                      <Bar dataKey="products" fill="hsl(43 74% 49%)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-12">No categories yet</p>
                )}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Recent Orders</h3>
                {recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map(o => (
                      <div key={o.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">{o.order_number}</p>
                          <p className="text-xs text-muted-foreground">{o.customer_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">Rs. {Number(o.total_amount).toLocaleString()}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusBadge[o.status] || ""}`}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Business Insights</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Total Products</span>
                    <span className="text-foreground font-semibold">{products.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Categories</span>
                    <span className="text-foreground font-semibold">{categories.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Featured Products</span>
                    <span className="text-foreground font-semibold">{products.filter(p => p.featured).length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Out of Stock</span>
                    <span className="text-red-400 font-semibold">{products.filter(p => p.stock_status === "OUT_OF_STOCK").length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Avg. Order Value</span>
                    <span className="text-primary font-semibold">Rs. {Math.round(avgOrder).toLocaleString()}</span>
                  </div>
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
