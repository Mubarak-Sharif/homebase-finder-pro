import AdminSidebar from "@/components/AdminSidebar";
import { useOrders } from "@/contexts/OrderContext";
import { useData } from "@/contexts/DataContext";
import { Package, ClipboardList, TrendingUp, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AdminDashboard = () => {
  const { orders } = useOrders();
  const { products } = useData();

  const pending = orders.filter(o => o.status === "pending").length;
  const delivered = orders.filter(o => o.status === "delivered").length;
  const totalSales = orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ClipboardList, color: "text-blue-400" },
    { label: "Pending", value: pending, icon: Package, color: "text-yellow-400" },
    { label: "Delivered", value: delivered, icon: CheckCircle, color: "text-green-400" },
    { label: "Total Sales", value: `Rs. ${totalSales.toLocaleString()}`, icon: TrendingUp, color: "text-primary" },
  ];

  const chartData = [
    { day: "Mon", orders: 3 }, { day: "Tue", orders: 5 }, { day: "Wed", orders: 2 },
    { day: "Thu", orders: 7 }, { day: "Fri", orders: 4 }, { day: "Sat", orders: 8 }, { day: "Sun", orders: 1 },
  ];

  const statusData = [
    { name: "Pending", value: pending, color: "#eab308" },
    { name: "Confirmed", value: orders.filter(o => o.status === "confirmed").length, color: "#3b82f6" },
    { name: "Delivered", value: delivered, color: "#22c55e" },
    { name: "Cancelled", value: orders.filter(o => o.status === "cancelled").length, color: "#ef4444" },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Dashboard</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Orders (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="day" tick={{ fill: "hsl(0 0% 55%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(0 0% 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(0 0% 11%)", border: "1px solid hsl(0 0% 18%)", borderRadius: 8, color: "#fff" }} />
                <Bar dataKey="orders" fill="hsl(43 74% 49%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Orders by Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(0 0% 11%)", border: "1px solid hsl(0 0% 18%)", borderRadius: 8, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
