import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Grid3X3, ClipboardList, Users, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import RoleBadge from "@/components/RoleBadge";
import { useState } from "react";

const AdminSidebar = () => {
  const { profile, isRole, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard", show: true },
    { path: "/admin/products", icon: Package, label: "Products", show: true },
    { path: "/admin/categories", icon: Grid3X3, label: "Categories", show: true },
    { path: "/admin/orders", icon: ClipboardList, label: "Orders", show: true },
    { path: "/admin/users", icon: Users, label: "Users", show: isRole("admin") },
    { path: "/admin/settings", icon: Settings, label: "Settings", show: true },
  ].filter(i => i.show);

  return (
    <aside className={`hidden md:flex flex-col bg-card border-r border-border transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div>
            <h2 className="font-heading text-lg font-bold gold-text">BS Marble</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground hover:text-foreground p-1">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && profile && (
        <div className="p-4 border-b border-border">
          <p className="text-sm font-medium text-foreground truncate">{profile.full_name || "User"}</p>
          <div className="mt-1"><RoleBadge role={profile.role} /></div>
        </div>
      )}

      <nav className="flex-1 py-2">
        {items.map(({ path, icon: Icon, label }) => {
          const active = path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path);
          return (
            <Link
              key={path} to={path}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${active ? "text-primary bg-primary/10 border-r-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border space-y-2">
        <Link to="/" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary">
          <Package className="w-4 h-4" />
          {!collapsed && <span>View Store</span>}
        </Link>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md w-full">
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
