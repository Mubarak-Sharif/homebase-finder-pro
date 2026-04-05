import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/data/mockData";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
  requireAuth?: boolean;
}

const ProtectedRoute = ({ children, roles, requireAuth = true }: ProtectedRouteProps) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname, message: roles ? "Admin access only" : "Please login to continue" }} replace />;
  }

  if (roles && currentUser && !roles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
