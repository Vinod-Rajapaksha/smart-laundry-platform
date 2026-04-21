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
import PaymentDashboard from "../../features/payments/pages/PaymentDashboard";
import PaymentPage from "../../features/payments/pages/PaymentPage";
import OnlineTransactionPage from "../../features/payments/pages/OnlineTransactionPage";
import CODPage from "../../features/payments/pages/CODPage";
import BankTransferPage from "../../features/payments/pages/BankTransferPage";
import BankVerificationPage from "../../features/bank-verification/pages/BankVerificationPage";
import ServicesPage from "../../features/services/pages/ServicesPage";
import InventoryPage from "../../features/inventory/pages/InventoryPage";
import SupplierPage from "../../features/suppliers/pages/SupplierPage";
import StatusUpdatePage from "../../features/status-update/pages/StatusUpdatePage";
import VouchersPage from "../../features/vouchers/pages/VouchersPage";
import LoyaltyPage from "../../features/loyalty/pages/LoyaltyPage";
import FeedbackPage from "../../features/feedback/pages/FeedbackPage";
import PickupDeliveryPage from "../../features/pickupDelivery/pages/PickupDeliveryPage";
import ReportsPage from "../../features/reports/pages/ReportsPage";
import ProfilePage from "../../features/profile/pages/ProfilePage";

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
              {
                path: "payments",
                children: [
                  { index: true, element: <PaymentDashboard /> },
                  { path: "ledger", element: <PaymentPage /> },
                  { path: "online", element: <OnlineTransactionPage /> },
                  { path: "cod", element: <CODPage /> },
                  { path: "bank-transfer", element: <BankTransferPage /> }
                ]
              },
              { path: "bank-verification", element: <BankVerificationPage /> },
              { path: "services", element: <ServicesPage /> },
              { path: "inventory", element: <InventoryPage /> },
              { path: "suppliers", element: <SupplierPage /> },
              { path: "status-update", element: <StatusUpdatePage /> },
              { path: "vouchers", element: <VouchersPage /> },
              { path: "loyalty", element: <LoyaltyPage /> },
              { path: "feedbacks", element: <FeedbackPage /> },
              { path: "deliveries", element: <PickupDeliveryPage /> },
              { path: "reports", element: <ReportsPage /> },
              { path: "profile", element: <ProfilePage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
