import { Link } from "react-router-dom";
import { DbProduct } from "@/lib/supabase-api";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";

const stockColors: Record<string, string> = {
  IN_STOCK: "bg-green-500/20 text-green-400 border-green-500/30",
  LIMITED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  OUT_OF_STOCK: "bg-red-500/20 text-red-400 border-red-500/30",
};
const stockLabels: Record<string, string> = { IN_STOCK: "In Stock", LIMITED: "Limited", OUT_OF_STOCK: "Out of Stock" };

const ProductCard = ({ product }: { product: DbProduct }) => {
  const { categories } = useData();
  const category = categories.find(c => c.id === product.category_id);
  const imgSrc = product.primary_image_url || (product.gallery_image_urls?.[0]) || "/placeholder.svg";

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={imgSrc} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <Badge variant="outline" className={`absolute top-2 right-2 text-[10px] ${stockColors[product.stock_status] || ""}`}>
            {stockLabels[product.stock_status] || product.stock_status}
          </Badge>
          {product.featured && (
            <Badge className="absolute top-2 left-2 gold-gradient text-primary-foreground text-[10px] border-0">Featured</Badge>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs text-muted-foreground">{category?.name}</p>
          <h3 className="font-heading text-lg font-semibold text-foreground mt-0.5 leading-tight">{product.name}</h3>
          <p className="text-primary font-bold mt-1">Rs. {Number(product.price_per_sqft).toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/sqft</span></p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
