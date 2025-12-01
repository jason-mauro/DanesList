import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";
import LoadingSpinner from "./LoadingSpinner";



export default function ProtectedRoute({ children, admin = false }: { children: ReactNode, admin?: boolean}) {
  const { loading, authenticated, isAdmin} = useAuth();

  if (loading) return <LoadingSpinner size="small"/>;
  
  if (admin && !isAdmin) return <Navigate to="/home" replace />;

  if (!authenticated) return <Navigate to="/login" replace />;

  return children;
}
