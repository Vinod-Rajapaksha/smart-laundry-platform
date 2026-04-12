import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import type { ROLES } from "../../types/enums";

export default function RoleRoute({ allowed }: { allowed: ROLES[] }) {
  // Bypassed for development
  return <Outlet />;
}
