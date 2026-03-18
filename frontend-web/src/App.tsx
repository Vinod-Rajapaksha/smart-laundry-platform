import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminDashboardPage from './features/dashboard/AdminDashboardPage';
import SystemAnalysis from './features/systemAnalysis/SystemAnalysis';
import AddStaff from './features/staff/AddStaff';
import AdminSidebar from './features/dashboard/AdminSidebar';
import ReportGenerationPage from './features/reports/ReportGenerationPage';
import './App.css';


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
        <Route path="/" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
        <Route path="/system-analysis" element={<AdminLayout><SystemAnalysis /></AdminLayout>} />
        <Route path="/staff" element={<AdminLayout><AddStaff /></AdminLayout>} />
        <Route path="/reports" element={<AdminLayout><ReportGenerationPage /></AdminLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
