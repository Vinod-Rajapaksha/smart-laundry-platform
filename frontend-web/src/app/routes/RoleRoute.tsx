import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import type { ROLES } from "../config/constants";

export default function RoleRoute({ allowed }: { allowed: ROLES[] }) {
  const { user, role } = useAuth();

  if (!user || !role) return <Navigate to="/login" replace />;
  if (!allowed.includes(role)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
