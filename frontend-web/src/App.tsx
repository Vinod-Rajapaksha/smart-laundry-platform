import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminDashboardPage from './features/dashboard/AdminDashboardPage';
import SystemAnalysis from './features/systemAnalysis/SystemAnalysis';
import AddStaff from './features/staff/AddStaff';
import AdminSidebar from './features/dashboard/AdminSidebar';
import FinancialAnalysisPage from './features/financialAnalysis/pages/FinancialAnalysisPage';
import AdminProfilePage from './pages/AdminProfilePage';

import ReportPage from './features/report/pages/ReportPage';


function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-[#f8f9fc]">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
        <Route path="/admin-dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
        <Route path="/admin-profile" element={<AdminLayout><AdminProfilePage /></AdminLayout>} />
        <Route path="/system-analysis" element={<AdminLayout><SystemAnalysis /></AdminLayout>} />
        <Route path="/staff" element={<AdminLayout><AddStaff /></AdminLayout>} />
        <Route path="/financial-analysis" element={<AdminLayout><FinancialAnalysisPage /></AdminLayout>} />
        <Route path="/report" element={<AdminLayout><ReportPage /></AdminLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
