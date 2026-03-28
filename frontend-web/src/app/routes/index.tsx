import { createBrowserRouter, Navigate } from "react-router-dom";

import HomePage from "../../pages/HomePage";
import NotFoundPage from "../../pages/NotFoundPage";
import UnauthorizedPage from "../../pages/UnauthorizedPage";
import LoginPage from "../../pages/LoginPage";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import { ADMIN_PORTAL_ROLES } from "../../types/enums";

import AdminLayout from "../../layouts/AdminLayout";

// import BankVerificationPage from "../../features/bank-verification/pages/BankVerificationPage";
import PickupDeliveryPage from "../../features/pickupDelivery/pages/PickupDeliveryPage";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      { 
        path: "/admin",
        element: <AdminLayout />, 
        children: [
          {
            element: <RoleRoute allowed={ADMIN_PORTAL_ROLES} />,
            children: [
              { index: true, element: <HomePage /> },

              // { path: "bank-verification", element: <BankVerificationPage /> },

              { path: "deliveries", element: <PickupDeliveryPage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
