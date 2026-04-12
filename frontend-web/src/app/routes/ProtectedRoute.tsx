import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

export default function ProtectedRoute() {
  // Bypassed for development
  return <Outlet />;
}
