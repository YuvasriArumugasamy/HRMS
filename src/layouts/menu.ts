import {
  LayoutDashboard,
  Users,
  Shield,
  UserCheck,
  History,
  Bell,
  Building2,
  DollarSign,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

export interface MenuItem {
  label: string;
  path: string;
  icon: any;
  badge?: number;
}

export const MENU: Record<string, MenuItem[]> = {
  admin: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Employees",
      path: "/employees",
      icon: Users,
    },
    {
      label: "Immigration Compliance",
      path: "/immigration-compliance",
      icon: Shield,
    },
    {
      label: "Immigration Profiles",
      path: "/immigration-profiles",
      icon: UserCheck,
    },
    {
      label: "Resolution History",
      path: "/resolution-history",
      icon: History,
      badge: 5,
    },
    {
      label: "Alerts & Notifications",
      path: "/alerts",
      icon: Bell,
    },
    {
      label: "Departments and Designations",
      path: "/departments",
      icon: Building2,
    },
    {
      label: "Payroll",
      path: "/payroll",
      icon: DollarSign,
    },
    {
      label: "Documents",
      path: "/documents",
      icon: FileText,
    },
    {
      label: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ],
};