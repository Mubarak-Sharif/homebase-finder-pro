import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-property.jpg";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"buy" | "rent">("buy");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/properties?q=${searchQuery}&type=${activeTab === "buy" ? "sale" : "rent"}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroImage}
        alt="Luxury property"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-warm-dark/60 via-warm-dark/40 to-warm-dark/70" />

      <div className="relative z-10 container mx-auto px-4 text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <p className="text-gold font-medium tracking-widest uppercase text-sm">Find Your Dream Property</p>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
            Discover Your
            <br />
            <span className="text-gold">Perfect Home</span>
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto font-body">
            Browse thousands of verified listings. Buy, sell, or rent properties with confidence.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-card/95 backdrop-blur-md rounded-xl p-2 shadow-2xl">
          <div className="flex gap-1 mb-2">
            {(["buy", "rent"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search by city, location, or property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            <Button onClick={handleSearch} size="lg" className="shrink-0 gap-2">
              <Search className="w-4 h-4" /> Search
            </Button>
          </div>
        </div>

        <div className="flex justify-center gap-8 md:gap-16 text-primary-foreground/90">
          {[
            { num: "2,500+", label: "Properties" },
            { num: "1,200+", label: "Happy Clients" },
            { num: "50+", label: "Cities" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-heading font-bold">{stat.num}</p>
              <p className="text-sm text-primary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
