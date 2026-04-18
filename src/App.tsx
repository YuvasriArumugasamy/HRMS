import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Departments from "@/pages/Departments/Departments";
import ResolutionHistory from "@/pages/ResolutionHistory/Resolution_history";
import { PlaceholderPage } from "@/components/common/PlaceholderPage";
import {
  LayoutDashboard,
  Contact,
  UserCheck,
  Briefcase,
  ShieldCheck,
  FileText,
  DollarSign,
  BarChart3,
  SettingsIcon,
  HelpCircle,
} from "lucide-react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Wrapper */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Pages inside layout */}
          <Route index element={<Navigate to="/departments" replace />} />
          <Route path="departments" element={<Departments />} />
          
          {/* Placeholder Routes for Sidebar Menu Items */}
          <Route path="home" element={<PlaceholderPage title="Dashboard" description="This page is under construction." icon={<LayoutDashboard size={48} />} />} />
          <Route path="employees" element={<PlaceholderPage title="Employees List" description="This page is under construction." icon={<Contact size={48} />} />} />
          <Route path="employees/add" element={<PlaceholderPage title="Add Employee" description="This page is under construction." icon={<UserCheck size={48} />} />} />
          <Route path="designations" element={<PlaceholderPage title="Designations" description="This page is under construction." icon={<Briefcase size={48} />} />} />
          <Route path="immigration-compliance" element={<PlaceholderPage title="Immigration Compliance" description="This page is under construction." icon={<ShieldCheck size={48} />} />} />
          <Route path="immigration-profiles" element={<PlaceholderPage title="Immigration Profiles" description="This page is under construction." icon={<FileText size={48} />} />} />
          <Route path="resolution-history" element={<ResolutionHistory />} />
          <Route path="payroll" element={<PlaceholderPage title="Payroll" description="This page is under construction." icon={<DollarSign size={48} />} />} />
          <Route path="documents" element={<PlaceholderPage title="Documents" description="This page is under construction." icon={<FileText size={48} />} />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" description="This page is under construction." icon={<BarChart3 size={48} />} />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" description="This page is under construction." icon={<SettingsIcon size={48} />} />} />

          {/* Catch-all route */}
          <Route path="*" element={<PlaceholderPage title="Page Not Found" description="The page you are looking for doesn't exist." icon={<HelpCircle size={48} />} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;