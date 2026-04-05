import { Link, useLocation } from "react-router-dom";
import { Home, Grid3X3, ShoppingCart, ClipboardList, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/categories", icon: Grid3X3, label: "Categories" },
  { path: "/cart", icon: ShoppingCart, label: "Cart" },
  { path: "/orders", icon: ClipboardList, label: "Orders" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
          return (
            <Link key={path} to={path} className="flex flex-col items-center gap-0.5 relative">
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                {label === "Cart" && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full gold-gradient text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${active ? "text-primary font-medium" : "text-muted-foreground"}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
