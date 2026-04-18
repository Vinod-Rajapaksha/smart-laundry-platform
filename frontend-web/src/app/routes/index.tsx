import { createBrowserRouter, Navigate } from "react-router-dom";

import NotFoundPage from "../../pages/NotFoundPage";
import UnauthorizedPage from "../../pages/UnauthorizedPage";
import LoginPage from "../../pages/LoginPage";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import { ADMIN_PORTAL_ROLES } from "../../types/enums";

import AdminLayout from "../../layouts/AdminLayout";

import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import UserListPage from "../../features/users/pages/UserListPage";
import OrderListPage from "../../features/orders/pages/OrderListPage";
import PaymentPage from "../../features/payments/pages/PaymentPage";
import BankVerificationPage from "../../features/bank-verification/pages/BankVerificationPage";
import ServicesPage from "../../features/services/pages/ServicesPage";
import InventoryPage from "../../features/inventory/pages/InventoryPage";
import StatusUpdatePage from "../../features/status-update/pages/StatusUpdatePage";
import VouchersPage from "../../features/vouchers/pages/VouchersPage";
import LoyaltyPage from "../../features/loyalty/pages/LoyaltyPage";
import FeedbackPage from "../../features/feedback/pages/FeedbackPage";
import PickupDeliveryPage from "../../features/pickupDelivery/pages/PickupDeliveryPage";
import ReportsPage from "../../features/reports/pages/ReportsPage";

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
              { index: true, element: <DashboardPage /> },

              { path: "users", element: <UserListPage /> },
              { path: "orders", element: <OrderListPage /> },
              { path: "payments", element: <PaymentPage /> },
              { path: "bank-verification", element: <BankVerificationPage /> },
              { path: "services", element: <ServicesPage /> },
              { path: "inventory", element: <InventoryPage /> },
              { path: "status-update", element: <StatusUpdatePage /> },
              { path: "vouchers", element: <VouchersPage /> },
              { path: "loyalty", element: <LoyaltyPage /> },
              { path: "feedback", element: <FeedbackPage /> },
              { path: "deliveries", element: <PickupDeliveryPage /> },
              { path: "reports", element: <ReportsPage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
