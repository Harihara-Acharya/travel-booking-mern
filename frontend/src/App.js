import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Packages from "./pages/Packages";
import PackageDetails from "./pages/PackageDetails";
import MyBookings from "./pages/MyBookings";
import AdminAddPackage from "./pages/AdminAddPackage";
import PartnerDashboard from "./pages/PartnerDashboard";
import PartnerPackages from "./pages/PartnerPackages";
import PartnerPackageForm from "./pages/PartnerPackageForm";
import PartnerBookings from "./pages/PartnerBookings";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Packages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/package/:id" element={<PackageDetails />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/admin/add-package" element={<AdminAddPackage />} />
        
        {/* Partner Routes */}
        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        <Route path="/partner/packages" element={<PartnerPackages />} />
        <Route path="/partner/packages/new" element={<PartnerPackageForm />} />
        <Route path="/partner/packages/edit/:id" element={<PartnerPackageForm />} />
        <Route path="/partner/bookings" element={<PartnerBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
