import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Maximize, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/data/properties";
import { useState } from "react";

const PropertyCard = ({ property }: { property: Property }) => {
  const [liked, setLiked] = useState(false);

  const formatPrice = (price: number, type: string) => {
    if (type === "rent") return `$${price.toLocaleString()}/mo`;
    return `$${price.toLocaleString()}`;
  };

  return (
    <Link
      to={`/property/${property.id}`}
      className="group block bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          width={800}
          height={600}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-primary text-primary-foreground capitalize">
            For {property.type}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {property.category}
          </Badge>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-card"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <p className="text-xl font-bold font-heading text-primary">
          {formatPrice(property.price, property.type)}
        </p>
        <h3 className="font-heading font-semibold text-card-foreground line-clamp-1">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <MapPin className="w-3.5 h-3.5" />
          <span className="line-clamp-1">{property.location}, {property.city}</span>
        </div>
        <div className="flex items-center gap-4 pt-2 border-t text-sm text-muted-foreground">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {property.bedrooms}</span>
          )}
          <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.bathrooms}</span>
          <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {property.area} sqft</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
