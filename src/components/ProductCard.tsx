import { Link } from "react-router-dom";
import { DbProduct } from "@/lib/supabase-api";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";
import FallbackImage from "@/components/FallbackImage";

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
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-[4/3] overflow-hidden">
          <FallbackImage
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <Badge variant="outline" className={`absolute top-2 right-2 text-[10px] backdrop-blur-sm ${stockColors[product.stock_status] || ""}`}>
            {stockLabels[product.stock_status] || product.stock_status}
          </Badge>
          {product.featured && (
            <Badge className="absolute top-2 left-2 gold-gradient text-primary-foreground text-[10px] border-0 shadow-md">Featured</Badge>
          )}
        </div>
        <div className="p-3.5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{category?.name}</p>
          <h3 className="font-heading text-lg font-semibold text-foreground mt-0.5 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-primary font-bold mt-1.5 text-lg">Rs. {Number(product.price_per_sqft).toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/sqft</span></p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
