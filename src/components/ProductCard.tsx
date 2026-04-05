import { Link } from "react-router-dom";
import { Product } from "@/data/mockData";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";

const stockColors = {
  in_stock: "bg-green-500/20 text-green-400 border-green-500/30",
  limited: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  out_of_stock: "bg-red-500/20 text-red-400 border-red-500/30",
};
const stockLabels = { in_stock: "In Stock", limited: "Limited", out_of_stock: "Out of Stock" };

const ProductCard = ({ product }: { product: Product }) => {
  const { categories } = useData();
  const category = categories.find(c => c.id === product.categoryId);

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <Badge variant="outline" className={`absolute top-2 right-2 text-[10px] ${stockColors[product.stockStatus]}`}>
            {stockLabels[product.stockStatus]}
          </Badge>
          {product.featured && (
            <Badge className="absolute top-2 left-2 gold-gradient text-primary-foreground text-[10px] border-0">Featured</Badge>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs text-muted-foreground">{category?.name}</p>
          <h3 className="font-heading text-lg font-semibold text-foreground mt-0.5 leading-tight">{product.name}</h3>
          <p className="text-primary font-bold mt-1">Rs. {product.price.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/sqft</span></p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
