import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import RoleBadge from "@/components/RoleBadge";
import NotificationBell from "@/components/NotificationBell";
import { useState } from "react";

const TopBar = () => {
  const { profile, isAuthenticated, isRole, logout } = useAuth();
  const { getItemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = getItemCount();

  const isAdminOrUser = isRole("ADMIN", "USER");

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold gold-text">BS Marble</span>
          <span className="hidden sm:inline text-xs text-muted-foreground">Karachi</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Categories</Link>
          <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Products</Link>
          <Link to="/calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Calculator</Link>
        </nav>

        <div className="flex items-center gap-3">
          <NotificationBell />
          
          <Link to="/cart" className="relative hidden md:block">
            <ShoppingCart className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full gold-gradient text-[10px] font-bold flex items-center justify-center text-primary-foreground">{cartCount}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin" className="text-xs text-primary hover:underline flex items-center gap-1">
                  <LayoutDashboard className="w-3 h-3" /> Dashboard
                </Link>
              )}
              <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                <User className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex text-sm px-4 py-1.5 rounded-md gold-gradient text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              Login
            </Link>
          )}

          <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border py-4 px-4 space-y-3 animate-fade-in">
          {isAuthenticated && profile && (
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-primary-foreground font-bold text-sm">
                {(profile.full_name || "U")[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{profile.full_name || "User"}</p>
                <RoleBadge role={profile.role} />
              </div>
            </div>
          )}
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-sm text-foreground py-2">Home</Link>
          <Link to="/categories" onClick={() => setMenuOpen(false)} className="block text-sm text-foreground py-2">Categories</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block text-sm text-foreground py-2">Products</Link>
          <Link to="/calculator" onClick={() => setMenuOpen(false)} className="block text-sm text-foreground py-2">Calculator</Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-sm text-primary py-2 font-medium">Admin Dashboard</Link>
          )}
          {isAuthenticated ? (
            <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-2 text-sm text-destructive py-2">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm text-primary font-medium py-2">Login / Sign Up</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default TopBar;
