import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "./layouts/MainLayout";
import { Login } from "./pages/auth/Login";
import { OTPVerification } from "./pages/OTP/OTPVerification";
import { ImmigrationCompliance } from "./pages/immigration/ImmigrationCompliance";
import { ImmigrationProfiles } from "./pages/immigration/ImmigrationProfiles";
import ResolutionHistory from "./pages/ResolutionHistory/Resolution_history";
import Departments from "./pages/Departments/Departments";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { PlaceholderPage } from "@/components/common/PlaceholderPage";
import type { RootState } from "./app/store";
import {
  LayoutDashboard,
  Contact,
  UserCheck,
  Briefcase,
  DollarSign,
  FileText,
  BarChart3,
  SettingsIcon,
} from "lucide-react";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // For development, we also check localStorage
  const isAuth = isAuthenticated || localStorage.getItem("isAuthenticated") === "true";

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OTPVerification />} />

        {/* Protected Routes Wrapper */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="departments" element={<Departments />} />
          <Route path="resolution-history" element={<ResolutionHistory />} />
          
          {/* Real Immigration Pages (Newly Built) */}
          <Route path="immigration-compliance" element={<ImmigrationCompliance />} />
          <Route path="immigration-profiles" element={<ImmigrationProfiles />} />

          {/* Other Menu Placeholders */}
          <Route path="home" element={<Navigate to="/dashboard" replace />} />
          <Route path="employees" element={<PlaceholderPage title="Employees List" description="This page is under construction." icon={<Contact size={48} />} />} />
          <Route path="employees/add" element={<PlaceholderPage title="Add Employee" description="This page is under construction." icon={<UserCheck size={48} />} />} />
          <Route path="designations" element={<PlaceholderPage title="Designations" description="This page is under construction." icon={<Briefcase size={48} />} />} />
          <Route path="payroll" element={<PlaceholderPage title="Payroll" description="This page is under construction." icon={<DollarSign size={48} />} />} />
          <Route path="documents" element={<PlaceholderPage title="Documents" description="This page is under construction." icon={<FileText size={48} />} />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" description="This page is under construction." icon={<BarChart3 size={48} />} />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" description="This page is under construction." icon={<SettingsIcon size={48} />} />} />

          {/* Tab Placeholder */}
          <Route path="tab/:id" element={<PlaceholderPage title="Dynamic Tab" description="Dynamic content loading..." icon={<FileText size={48} />} />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;