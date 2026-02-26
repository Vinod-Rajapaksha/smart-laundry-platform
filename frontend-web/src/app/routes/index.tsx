import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import NotFoundPage from "../../pages/NotFoundPage";
import UnauthorizedPage from "../../pages/UnauthorizedPage";
import LoginPage from "../../pages/LoginPage";
import InventoryDashboard from "../../pages/inventory/InventoryDashboard";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { ADMIN_PORTAL_ROLES } from "../../types/enums";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        children: [
          {
            element: <RoleRoute allowed={ADMIN_PORTAL_ROLES} />,
            children: [
              { index: true, element: <HomePage /> },
              { path: "inventory", element: <InventoryDashboard /> },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
