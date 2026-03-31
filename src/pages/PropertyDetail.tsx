import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Heart, Share2, Phone, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { useState } from "react";

const PropertyDetail = () => {
  const { id } = useParams();
  const property = properties.find((p) => p.id === id);
  const [liked, setLiked] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center space-y-4">
            <h1 className="font-heading text-2xl font-bold">Property Not Found</h1>
            <Link to="/properties"><Button>Browse Properties</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const similar = properties.filter((p) => p.id !== property.id && p.category === property.category).slice(0, 3);
  const formatPrice = property.type === "rent" ? `$${property.price.toLocaleString()}/mo` : `$${property.price.toLocaleString()}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero image */}
        <div className="relative h-[50vh] md:h-[60vh]">
          <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-dark/50 to-transparent" />
          <div className="absolute top-4 left-4">
            <Link to="/properties">
              <Button variant="secondary" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-primary text-primary" : "text-foreground"}`} />
            </button>
            <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Details */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-primary text-primary-foreground capitalize">For {property.type}</Badge>
                  <Badge variant="secondary" className="capitalize">{property.category}</Badge>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{property.title}</h1>
                <div className="flex items-center gap-1 text-muted-foreground mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location}, {property.city}</span>
                </div>
                <p className="text-3xl font-heading font-bold text-primary mt-4">{formatPrice}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {property.bedrooms > 0 && (
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <Bed className="w-6 h-6 text-primary mx-auto mb-1" />
                    <p className="font-semibold text-foreground">{property.bedrooms}</p>
                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                  </div>
                )}
                <div className="bg-secondary rounded-lg p-4 text-center">
                  <Bath className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="font-semibold text-foreground">{property.bathrooms}</p>
                  <p className="text-xs text-muted-foreground">Bathrooms</p>
                </div>
                <div className="bg-secondary rounded-lg p-4 text-center">
                  <Maximize className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="font-semibold text-foreground">{property.area}</p>
                  <p className="text-xs text-muted-foreground">Sq. Ft.</p>
                </div>
              </div>

              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-3">About This Property</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact sidebar */}
            <div>
              <div className="bg-card border rounded-xl p-6 sticky top-20 space-y-5">
                <h3 className="font-heading font-semibold text-lg text-card-foreground">Contact Agent</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-heading font-bold text-primary">JD</span>
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">John Davis</p>
                    <p className="text-sm text-muted-foreground">Licensed Agent</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <textarea
                    placeholder="I'm interested in this property..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>
                <Button className="w-full gap-2"><Mail className="w-4 h-4" /> Send Message</Button>
                <Button variant="outline" className="w-full gap-2"><Phone className="w-4 h-4" /> Call Agent</Button>
              </div>
            </div>
          </div>

          {/* Similar */}
          {similar.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Similar Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similar.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
