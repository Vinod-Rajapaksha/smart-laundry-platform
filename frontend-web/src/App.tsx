import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import AdminDashboardPage from './features/dashboard/AdminDashboardPage';
import SystemAnalysis from './features/systemAnalysis/SystemAnalysis';
import AddStaff from './features/staff/AddStaff';
import AdminSidebar from './features/dashboard/AdminSidebar';
import './App.css';

function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      <Sidebar />
      <LandingPage />
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      <AdminSidebar />
      <div className="flex-1 overflow-auto bg-[#1c222d]">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/admin-dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
        <Route path="/system-analysis" element={<AdminLayout><SystemAnalysis /></AdminLayout>} />
        <Route path="/staff" element={<AdminLayout><AddStaff /></AdminLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
