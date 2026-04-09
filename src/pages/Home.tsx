import { Link, useNavigate } from "react-router-dom";
import { Search, MessageCircle, Sparkles, Calculator, ShoppingBag, ClipboardList } from "lucide-react";
import { useState } from "react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { useData } from "@/contexts/DataContext";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { products, categories, settings, loading, error } = useData();
  const featured = products.filter(p => p.featured);
  const activeCategories = categories.filter(c => c.is_active);
  const whatsapp = settings?.whatsapp_number || "";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />

      {/* Hero */}
      <section className="relative px-4 py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
        <div className="container mx-auto max-w-2xl text-center space-y-5 animate-fade-in relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mx-auto">
            <Sparkles className="w-3 h-3" /> Premium Quality Stone
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
            <span className="gold-text">Premium Marble</span><br />
            <span className="text-foreground">at Affordable Prices</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            Granite, Ziarat White, Onyx & more — delivered across Karachi
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search marble by name, color..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" />
            </div>
            <button type="submit" className="px-6 py-3 rounded-xl gold-gradient text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
              Search
            </button>
          </form>
        </div>
      </section>

      {error && <div className="container mx-auto px-4"><p className="text-center text-destructive text-sm py-4">{error}</p></div>}

      {/* Categories */}
      <section className="px-4 py-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-primary font-medium tracking-widest uppercase mb-1">Browse</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Categories</h2>
            </div>
            <Link to="/categories" className="text-sm text-primary hover:underline font-medium">View All →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {activeCategories.slice(0, 5).map((cat, i) => (
                <div key={cat.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <CategoryCard category={cat} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured */}
      <section className="px-4 py-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-primary font-medium tracking-widest uppercase mb-1">Curated Selection</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Featured Marble</h2>
            </div>
            <Link to="/products" className="text-sm text-primary hover:underline font-medium">View All →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3] rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.slice(0, 4).map((p, i) => (
                <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick links */}
      <section className="px-4 py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Calculator", desc: "Estimate marble cost", path: "/calculator", icon: Calculator, color: "text-blue-400" },
              { label: "All Products", desc: "Browse full catalog", path: "/products", icon: ShoppingBag, color: "text-green-400" },
              { label: "Track Orders", desc: "View your orders", path: "/orders", icon: ClipboardList, color: "text-purple-400" },
              { label: "Contact Us", desc: "WhatsApp inquiry", path: "#whatsapp", icon: MessageCircle, color: "text-emerald-400" },
            ].map((item, i) => (
              <Link key={item.label} to={item.path === "#whatsapp" ? `https://wa.me/${whatsapp}` : item.path}
                target={item.path === "#whatsapp" ? "_blank" : undefined}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}>
                <item.icon className={`w-6 h-6 ${item.color} mb-3 group-hover:scale-110 transition-transform`} />
                <h3 className="font-heading text-lg font-semibold text-foreground">{item.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="container mx-auto text-center space-y-2">
          <p className="font-heading text-xl font-bold gold-text">{settings?.org_name || "BS Marble Karachi"}</p>
          <p className="text-sm text-muted-foreground">Buy Premium Quality Marble at Affordable Prices</p>
          <p className="text-[11px] text-muted-foreground/60">Powered by Supabase — live data</p>
        </div>
      </footer>

      {whatsapp && (
        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener"
          className="fixed bottom-20 md:bottom-6 right-4 z-40 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-xl shadow-green-500/30 hover:bg-green-600 hover:scale-110 transition-all duration-300">
          <MessageCircle className="w-6 h-6 text-white" />
        </a>
      )}

      <BottomNav />
    </div>
  );
};

export default Home;
