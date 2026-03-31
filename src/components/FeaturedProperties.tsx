import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";

const FeaturedProperties = () => {
  const featured = properties.filter((p) => p.isFeatured);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary font-medium text-sm tracking-widest uppercase mb-2">Curated Selection</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Featured Properties</h2>
          </div>
          <Link to="/properties">
            <Button variant="outline" className="hidden md:flex gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((property, i) => (
            <div key={property.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/properties">
            <Button variant="outline" className="gap-2">
              View All Properties <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
