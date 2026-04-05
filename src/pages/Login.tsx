import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = (location.state as any)?.message;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        <div className="text-center space-y-1">
          <h1 className="font-heading text-3xl font-bold gold-text">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Login to BS Marble Karachi</p>
        </div>

        {message && (
          <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 border border-primary/20 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="your@email.com" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Password</label>
            <div className="relative mt-1">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 pr-10"
                placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full gold-gradient text-primary-foreground font-semibold">Login</Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
        </p>

        <div className="bg-secondary/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Demo Accounts:</p>
          <p>Commissioner: commissioner@bsmarble.pk / admin123</p>
          <p>Admin: admin@bsmarble.pk / admin123</p>
          <p>Manager: manager@bsmarble.pk / manager123</p>
          <p>Customer: ali@gmail.com / customer123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
