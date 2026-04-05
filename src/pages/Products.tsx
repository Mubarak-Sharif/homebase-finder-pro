import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { useData } from "@/contexts/DataContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Products = () => {
  const [searchParams] = useSearchParams();
  const { products, categories } = useData();
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all");
  const [colorFilter, setColorFilter] = useState("all");
  const [usageFilter, setUsageFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const colors = useMemo(() => [...new Set(products.map(p => p.color))], [products]);
  const usages = useMemo(() => [...new Set(products.flatMap(p => p.usage))], [products]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (categoryFilter !== "all") result = result.filter(p => p.categoryId === categoryFilter);
    if (colorFilter !== "all") result = result.filter(p => p.color === colorFilter);
    if (usageFilter !== "all") result = result.filter(p => p.usage.includes(usageFilter));
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.color.toLowerCase().includes(q) || p.origin.toLowerCase().includes(q));
    }
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, categoryFilter, colorFilter, usageFilter, sortBy, query]);

  const clearFilters = () => { setCategoryFilter("all"); setColorFilter("all"); setUsageFilter("all"); setSortBy("newest"); setQuery(""); };
  const hasFilters = categoryFilter !== "all" || colorFilter !== "all" || usageFilter !== "all" || query;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">All Marble</h1>
        <p className="text-sm text-muted-foreground mb-6">Browse and filter our complete collection</p>

        {/* Search + Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search marble..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[130px] h-9 text-xs bg-card"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.filter(c => c.active).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={colorFilter} onValueChange={setColorFilter}>
              <SelectTrigger className="w-[120px] h-9 text-xs bg-card"><SelectValue placeholder="Color" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                {colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={usageFilter} onValueChange={setUsageFilter}>
              <SelectTrigger className="w-[120px] h-9 text-xs bg-card"><SelectValue placeholder="Usage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Usage</SelectItem>
                {usages.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px] h-9 text-xs bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low→High</SelectItem>
                <SelectItem value="price-desc">Price: High→Low</SelectItem>
              </SelectContent>
            </Select>
            {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground gap-1"><X className="w-3 h-3" />Clear</Button>}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">{filtered.length} products found</p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-3">Clear Filters</Button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Products;
