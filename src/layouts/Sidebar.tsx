import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import type { RootState } from "../app/store";
import { MENU, type MenuItem } from "./menu";

export default function Sidebar() {
  const { role } = useSelector((state: RootState) => (state as any).auth);

  const normalizedRole = (role as string)?.toLowerCase() || "admin";
  const menuItems: MenuItem[] = MENU[normalizedRole] || [];

  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-full shrink-0 flex flex-col bg-gray-100 border-r transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* ================= HEADER ================= */}
      <div
        className="flex items-center justify-between px-4 py-5 border-b text-white"
        style={{
          backgroundColor:
            " rgb(17, 94, 136)",
        }}
      >
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-lg">
              🛡️
            </div>
            <div>
              <div className="font-semibold text-lg">HRMS Portal</div>
              <div className="text-xs opacity-80">Human Resources</div>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-white/20"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* ================= MENU ================= */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all
                ${collapsed ? "justify-center" : ""}
                ${
                  isActive
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      backgroundColor: "rgb(17, 94, 136)",
                    }
                  : {}
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    className={`${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  />

                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>

                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ================= PROFILE (FIXED BOTTOM) ================= */}
      <div className="p-4 border-t bg-gray-100">
        <div className="flex items-center gap-3 bg-white rounded-2xl shadow-md p-3 hover:shadow-lg transition-all">
          
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
            style={{ backgroundColor: "rgb(17, 94, 136)" }}
          >
            JM
          </div>

          {/* User Info */}
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">
                Jessica Martinez
              </span>
              <span className="text-sm text-gray-500">
                HR Manager
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}