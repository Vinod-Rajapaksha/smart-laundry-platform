import AppProviders from "./app/providers/AppProviders";
import SupplierPage from "./features/supplier/pages/SupplierPage";
import './App.css'

function App() {
  if (window.location.pathname === '/suppliers') {
    return <SupplierPage />;
  }
  return (
    <AppProviders />
  );
}

export default App
