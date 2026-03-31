import { Link } from "react-router-dom";
import { Home, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Home className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold text-background">Real Estatify</span>
            </div>
            <p className="text-sm text-background/60">Your trusted partner in finding the perfect property. Verified listings, transparent deals.</p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-background mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block hover:text-primary transition-colors">Home</Link>
              <Link to="/properties" className="block hover:text-primary transition-colors">Properties</Link>
              <Link to="/properties?type=sale" className="block hover:text-primary transition-colors">Buy</Link>
              <Link to="/properties?type=rent" className="block hover:text-primary transition-colors">Rent</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-background mb-4">Property Types</h4>
            <div className="space-y-2 text-sm">
              {["Houses", "Apartments", "Villas", "Commercial", "Penthouses"].map((t) => (
                <Link key={t} to="/properties" className="block hover:text-primary transition-colors">{t}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-background mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> 123 Real Estate Ave, NY</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +1 (555) 123-4567</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> info@realestatify.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 text-center text-sm text-background/40">
          © 2026 Real Estatify. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
