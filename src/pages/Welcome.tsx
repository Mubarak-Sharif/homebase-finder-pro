import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="animate-fade-in space-y-6 max-w-sm">
        <div className="space-y-2">
          <h1 className="font-heading text-4xl font-bold gold-text">BS Marble</h1>
          <p className="font-heading text-xl text-foreground">Karachi</p>
          <p className="text-sm text-muted-foreground mt-2">Buy Premium Quality Marble at Affordable Prices</p>
        </div>
        <div className="w-20 h-0.5 gold-gradient mx-auto" />
        <div className="space-y-3 pt-4">
          <Button asChild className="w-full gold-gradient text-primary-foreground font-semibold hover:opacity-90">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-primary/30 text-foreground hover:bg-primary/10">
            <Link to="/register">Create Account</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
            <Link to="/">Continue as Guest</Link>
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">This app uses local mock data. Online sync coming soon.</p>
      </div>
    </div>
  );
};

export default Welcome;
