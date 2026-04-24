import { createBrowserRouter, Navigate } from "react-router-dom";

import AdminDashboardPage from "../../features/dashboard/AdminDashboardPage";
import NotFoundPage from "../../pages/NotFoundPage";
import UnauthorizedPage from "../../pages/UnauthorizedPage";
import LoginPage from "../../pages/LoginPage";
import AdminProfilePage from "../../pages/AdminProfilePage";
import GeneratedReportsPage from "../../features/report/pages/GeneratedReportsPage";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import { ADMIN_PORTAL_ROLES } from "../../types/enums";

import AdminLayout from "../../layouts/AdminLayout";
import CustomersPage from "../../features/dashboard/pages/CustomersPage";
import FinancialAnalysisPage from "../../features/financialAnalysis/pages/FinancialAnalysisPage";
import ReportPage from "../../features/report/pages/ReportPage";

// import BankVerificationPage from "../../features/bank-verification/pages/BankVerificationPage";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/admin-profile", element: <AdminProfilePage /> },
  { path: "/generated-reports", element: <GeneratedReportsPage /> },

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
              { index: true, element: <AdminDashboardPage /> },
              { path: "customers", element: <CustomersPage /> },
              { path: "financial-analysis", element: <FinancialAnalysisPage /> },
              { path: "reports", element: <ReportPage /> },

              // { path: "bank-verification", element: <BankVerificationPage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
