import {
  Briefcase,
  Building,
  Contact,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
  DollarSign,
  BarChart3,
  Settings,
} from "lucide-react";

export interface MenuItem {
  label: string;
  path?: string;
  icon: any;
  children?: MenuItem[];
}

export const MENU: Record<string, MenuItem[]> = {
  admin: [
    {
      label: "Dashboard",
      path: "/home",
      icon: LayoutDashboard,
    },
    {
      label: "Employees",
      icon: Contact,
      children: [
        { label: "List", path: "/employees", icon: Contact },
        { label: "Add Employee", path: "/employees/add", icon: UserCheck },
      ],
    },
    {
      label: "Organization",
      icon: Building,
      children: [
        { label: "Departments", path: "/departments", icon: Building },
        { label: "Designations", path: "/designations", icon: Briefcase },
      ],
    },
    {
      label: "Immigration",
      icon: ShieldCheck,
      children: [
        { label: "Compliance", path: "/immigration-compliance", icon: ShieldCheck },
        { label: "Profiles", path: "/immigration-profiles", icon: FileText },
      ],
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
