import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Login } from "../pages/auth/Login";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { EmployeeList } from "../pages/employees/EmployeeList";
import { PlaceholderPage } from "../components/common/PlaceholderPage";
import { ImmigrationCompliance } from "../pages/immigration/ImmigrationCompliance";
import { ImmigrationProfiles } from "../pages/immigration/ImmigrationProfiles";
import { EmployeeProfile } from "../pages/employees/EmployeeProfile";
import {
  DollarSign,
  FileText,
  BarChart3,
  Settings,
  UserPlus,
  Building,
  Briefcase
} from "lucide-react";


export default function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Layout Wrapper */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route
            path="/employees/add"
            element={
              <PlaceholderPage
                title="Add Employee"
                description="Add a new employee to the system."
                icon={<UserPlus size={32} />}
              />
            }
          />
          <Route
            path="/employees/:id"
            element={<EmployeeProfile />}
          />
          <Route
            path="/immigration-compliance"
            element={<ImmigrationCompliance />}
          />
          <Route
            path="/immigration-profiles"
            element={<ImmigrationProfiles />}
          />
          <Route
            path="/departments"
            element={
              <PlaceholderPage
                title="Departments"
                description="Manage organizational departments."
                icon={<Building size={32} />}
              />
            }
          />
          <Route
            path="/designations"
            element={
              <PlaceholderPage
                title="Designations"
                description="Manage employee job designations."
                icon={<Briefcase size={32} />}
              />
            }
          />

          <Route
            path="/payroll"
            element={
              <PlaceholderPage
                title="Payroll"
                description="Manage payroll and compensation"
                icon={<DollarSign className="w-8 h-8 text-[rgb(17,94,136)]" />}
              />
            }
          />
          <Route
            path="/documents"
            element={
              <PlaceholderPage
                title="Documents"
                description="Manage company and employee documents"
                icon={<FileText className="w-8 h-8 text-[rgb(17,94,136)]" />}
              />
            }
          />
          <Route
            path="/reports"
            element={
              <PlaceholderPage
                title="Reports"
                description="Generate and view reports"
                icon={<BarChart3 className="w-8 h-8 text-[rgb(17,94,136)]" />}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <PlaceholderPage
                title="Settings"
                description="Configure system settings"
                icon={<Settings className="w-8 h-8 text-[rgb(17,94,136)]" />}
              />
            }
          />
        </Route>

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </HashRouter>
  );
}