import { Link } from "react-router-dom";
import { Category } from "@/data/mockData";

const CategoryCard = ({ category }: { category: Category }) => (
  <Link to={`/products?category=${category.id}`} className="group block">
    <div className="relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary/30 transition-all">
      <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <h3 className="font-heading text-lg font-bold text-foreground">{category.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{category.description}</p>
      </div>
    </div>
  </Link>
);

export default CategoryCard;
