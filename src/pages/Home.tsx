import { Link, useNavigate } from "react-router-dom";
import { Search, MessageCircle } from "lucide-react";
import { useState } from "react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { useData } from "@/contexts/DataContext";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { getFeaturedProducts, categories, settings } = useData();
  const featured = getFeaturedProducts();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />

      {/* Hero */}
      <section className="relative px-4 py-10 md:py-16">
        <div className="container mx-auto max-w-2xl text-center space-y-4 animate-fade-in">
          <h1 className="font-heading text-3xl md:text-5xl font-bold">
            <span className="gold-text">Premium Marble</span>
            <br />
            <span className="text-foreground">at Affordable Prices</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">Granite, Ziarat White, Onyx & more — delivered across Karachi</p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search marble by name, color..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button type="submit" className="px-5 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm font-medium hover:opacity-90">Search</button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">Categories</h2>
            <Link to="/categories" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.filter(c => c.active).slice(0, 6).map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="px-4 py-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">Featured Marble</h2>
            <Link to="/products" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {featured.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="px-4 py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Calculator", desc: "Estimate marble cost", path: "/calculator" },
              { label: "All Products", desc: "Browse full catalog", path: "/products" },
              { label: "Track Orders", desc: "View your orders", path: "/orders" },
              { label: "Contact Us", desc: "WhatsApp inquiry", path: "#whatsapp" },
            ].map(item => (
              <Link key={item.label} to={item.path === "#whatsapp" ? `https://wa.me/${settings.whatsappNumber}` : item.path}
                target={item.path === "#whatsapp" ? "_blank" : undefined}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                <h3 className="font-heading text-lg font-semibold text-foreground">{item.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 px-4">
        <div className="container mx-auto text-center space-y-2">
          <p className="font-heading text-lg font-bold gold-text">BS Marble Karachi</p>
          <p className="text-xs text-muted-foreground">Buy Premium Quality Marble at Affordable Prices</p>
          <p className="text-[11px] text-muted-foreground">This app currently uses local mock data. Online sync and real backend will be added later.</p>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener"
        className="fixed bottom-20 md:bottom-6 right-4 z-40 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors">
        <MessageCircle className="w-6 h-6 text-white" />
      </a>

      <BottomNav />
    </div>
  );
};

export default Home;
