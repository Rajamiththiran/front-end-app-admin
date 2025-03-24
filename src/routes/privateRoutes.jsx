// src/routes/privateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ROUTES } from "../utils/constants";

/**
 * Private route component that protects routes by checking authentication
 * Redirects to login if user is not authenticated
 */
const PrivateRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show nothing while checking auth status
  if (loading) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
