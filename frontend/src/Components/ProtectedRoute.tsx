import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";


export default function ProtectedRoute({ children }: { children: ReactNode}) {
  const { loading, authenticated } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!authenticated) return <Navigate to="/login" replace />;

  return children;
}
