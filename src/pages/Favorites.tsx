import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Favorites = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Your Favorites</h1>
          <p className="text-muted-foreground max-w-md">
            Start saving properties you love! Click the heart icon on any property to add it here.
          </p>
          <Link to="/properties">
            <Button className="mt-2">Browse Properties</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
