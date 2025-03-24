import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  // No loading check needed as it's handled in AppRoutes
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
