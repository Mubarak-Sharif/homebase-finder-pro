import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import CategoryCard from "@/components/CategoryCard";
import { useData } from "@/contexts/DataContext";

const Categories = () => {
  const { categories } = useData();
  const active = categories.filter(c => c.active).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Marble Categories</h1>
        <p className="text-sm text-muted-foreground mb-6">Browse our premium marble collection by category</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {active.map(cat => <CategoryCard key={cat.id} category={cat} />)}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Categories;
