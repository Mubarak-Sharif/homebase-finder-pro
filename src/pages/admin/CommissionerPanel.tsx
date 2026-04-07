import AdminSidebar from "@/components/AdminSidebar";
import { useOrders } from "@/contexts/OrderContext";
import { useData } from "@/contexts/DataContext";
import { Crown, TrendingUp, ClipboardList, Package, Loader2 } from "lucide-react";

const CommissionerPanel = () => {
  const { orders, loading: ordersLoading } = useOrders();
  const { products, categories, loading: dataLoading } = useData();

  const totalSales = orders.filter(o => o.status === "DELIVERED").reduce((s, o) => s + Number(o.total_amount), 0);
  const totalOrders = orders.length;

  const productRevenue: Record<string, { name: string; revenue: number }> = {};
  orders.filter(o => o.status === "DELIVERED").forEach(o => {
    o.items.forEach(item => {
      const prod = products.find(p => p.id === item.product_id);
      if (prod) {
        if (!productRevenue[item.product_id]) productRevenue[item.product_id] = { name: prod.name, revenue: 0 };
        productRevenue[item.product_id].revenue += Number(item.price_per_sqft_snapshot) * Number(item.quantity_sqft);
      }
    });
  });
  const topProducts = Object.values(productRevenue).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const loading = ordersLoading || dataLoading;

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center gap-3 mb-6">
          <Crown className="w-7 h-7 text-primary" />
          <h1 className="font-heading text-3xl font-bold text-foreground">Admin Overview</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-4">
                <TrendingUp className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground">Rs. {totalSales.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Sales (Delivered)</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <ClipboardList className="w-5 h-5 text-blue-400 mb-2" />
                <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <Package className="w-5 h-5 text-green-400 mb-2" />
                <p className="text-2xl font-bold text-foreground">{products.length}</p>
                <p className="text-xs text-muted-foreground">Total Products</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Top Products by Revenue</h3>
                {topProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No delivered orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {topProducts.map((p, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold text-sm">#{i + 1}</span>
                          <span className="text-sm text-foreground">{p.name}</span>
                        </div>
                        <span className="text-sm font-medium text-primary">Rs. {p.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Categories Overview</h3>
                <div className="space-y-2">
                  {categories.map(c => (
                    <div key={c.id} className="flex justify-between text-sm">
                      <span className="text-foreground">{c.name}</span>
                      <span className={`text-xs ${c.is_active ? "text-green-400" : "text-red-400"}`}>{c.is_active ? "Active" : "Inactive"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CommissionerPanel;
