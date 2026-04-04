import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import type { RootState } from "../app/store";
import type { MenuItem } from "./menu";
import { MENU } from "./menu";

export default function Sidebar() {
  const { role } = useSelector((state: RootState) => (state as any).auth);
  const normalizedRole = (role as string)?.toLowerCase() || "admin";
  const menuItems: MenuItem[] = normalizedRole && MENU[normalizedRole] ? MENU[normalizedRole] : [];
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Employees", "Organization"]);
  const [hoveredParent, setHoveredParent] = useState<string | null>(null);

  const isParentActive = (item: MenuItem) => {
    if (!item.children) return false;
    return item.children.some(
      (child) => child.path && location.pathname.startsWith(child.path),
    );
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const bottomLabels = ["Settings"];
  const mainItems = menuItems.filter((i) => !bottomLabels.includes(i.label));
  const bottomItems = menuItems.filter((i) => bottomLabels.includes(i.label));

  return (
    <aside
      className={`
        h-full shrink-0 text-white transition-all duration-300 relative flex flex-col shadow-2xl
        ${collapsed ? "w-16" : "w-64"}
      `}
      style={{
        background: "linear-gradient(180deg, #0a3d5c 0%, #082e45 100%)",
      }}
    >
      {/* Decorative gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(96,165,250,0.05) 0%, transparent 60%)",
        }}
      />

      {/* ================= HEADER ================= */}
      <div
        className={`flex items-center px-4 py-4 border-b relative z-10 ${collapsed ? "justify-center" : "justify-between"
          }`}
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        {!collapsed && (
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-lg shadow-lg">H</div>
                <div className="font-bold text-lg tracking-tight">HRMS</div>
             </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer transition-all rounded-lg p-1 hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.6)" }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight
            size={20}
            className={`transition-transform duration-300 ${!collapsed ? "rotate-180" : ""
              }`}
          />
        </button>
      </div>

      {/* ================= MAIN MENU ================= */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 space-y-0.5 relative z-10 custom-scrollbar"
      >
        {mainItems.map((item: MenuItem) => {
          const Icon = item.icon;
          const parentActive = isParentActive(item);
          const isExpanded = expandedMenus.includes(item.label);

          if (item.children) {
            return (
              <div
                key={item.label}
                onMouseEnter={() => collapsed && setHoveredParent(item.label)}
                onMouseLeave={() => collapsed && setHoveredParent(null)}
                className="relative"
              >
                {/* Parent button */}
                <button
                  onClick={() => !collapsed && toggleMenu(item.label)}
                  className={`
                    w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold
                    transition-all duration-200 shadow-lg group mb-1
                    ${collapsed ? "justify-center" : ""}
                  `}
                  style={
                    parentActive
                      ? {
                        background:
                          "linear-gradient(135deg, rgba(249,115,22,0.9) 0%, rgba(234,88,12,0.9) 100%)",
                        boxShadow: "0 4px 15px rgba(249,115,22,0.25)",
                        color: "white"
                      }
                      : {
                        color: "rgba(255,255,255,0.7)"
                      }
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && (
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-200 opacity-80 ${isExpanded ? "rotate-180" : ""
                        }`}
                    />
                  )}
                </button>

                {/* CHILDREN - Normal expanded view */}
                {!collapsed && isExpanded && (
                  <div
                    className="ml-4 mt-2 space-y-0.5 pl-2 mb-2"
                    style={{ borderLeft: "2px solid rgba(255,255,255,0.1)" }}
                  >
                    {item.children!.map((child: MenuItem) => {
                      const ChildIcon = child.icon;
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path!}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group
                            ${isActive
                              ? "font-medium text-white"
                              : "text-blue-100/70 hover:text-white hover:bg-white/10"
                            }`
                          }
                          style={({ isActive }) =>
                            isActive
                              ? {
                                backgroundColor: "rgba(255,255,255,0.1)",
                                backdropFilter: "blur(4px)",
                              }
                              : {}
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200 ${isActive
                                    ? ""
                                    : "bg-gray-400 group-hover:bg-orange-300"
                                  }`}
                                style={
                                  isActive
                                    ? { backgroundColor: "#f97316" }
                                    : {}
                                }
                              />
                              <ChildIcon
                                size={15}
                                className={
                                  isActive
                                    ? "text-white"
                                    : "text-blue-300 group-hover:text-white transition-colors"
                                }
                              />
                              <span className={isActive ? "" : "opacity-90 group-hover:opacity-100"}>
                                {child.label}
                              </span>
                            </>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}

                {/* CHILDREN - Collapsed hover flyout */}
                {collapsed && hoveredParent === item.label && (
                  <div
                    className="absolute left-full top-0 ml-2 rounded-xl shadow-2xl py-2 px-2 min-w-[200px] z-50 overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(180deg, #0a3d5c 0%, #082e45 100%)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div
                      className="text-xs font-semibold px-3 py-1.5 tracking-wide uppercase"
                      style={{ color: "#93c5fd" }}
                    >
                      {item.label}
                    </div>
                    {item.children!.map((child: MenuItem) => {
                      const ChildIcon = child.icon;
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path!}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group
                            ${isActive
                              ? "text-white font-medium bg-white/10"
                              : "text-blue-100/70 hover:bg-white/10 hover:text-white"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${isActive
                                    ? ""
                                    : "bg-gray-400 group-hover:bg-orange-300"
                                  }`}
                                style={
                                  isActive
                                    ? { backgroundColor: "#f97316" }
                                    : {}
                                }
                              />
                              <ChildIcon
                                size={15}
                                className={
                                  isActive
                                    ? "text-white"
                                    : "text-blue-300 group-hover:text-white transition-colors"
                                }
                              />
                              {child.label}
                            </>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Top-level item (no children)
          return (
            <NavLink
              key={item.path}
              to={item.path!}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group mb-1
                ${collapsed ? "justify-center" : ""}
                ${isActive
                  ? "text-white shadow-lg"
                  : "text-blue-100/60 hover:bg-white/10 hover:text-white"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                    background:
                      "linear-gradient(135deg, rgba(249,115,22,0.9) 0%, rgba(234,88,12,0.9) 100%)",
                    boxShadow: "0 4px 15px rgba(249,115,22,0.25)",
                  }
                  : {}
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${isActive
                        ? "text-white"
                        : "text-blue-300 group-hover:text-white"
                      }`}
                  />
                  {!collapsed && item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ================= BOTTOM ITEMS ================= */}
      {bottomItems.length > 0 && (
        <div
          className="px-3 pb-4 pt-3 space-y-0.5 relative z-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          {bottomItems.map((item: MenuItem) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path!}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${collapsed ? "justify-center" : ""}
                  ${isActive
                    ? "text-white shadow-lg"
                    : "text-blue-100/50 hover:bg-white/10 hover:text-white"
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                      background:
                        "linear-gradient(135deg, rgba(249,115,22,0.9) 0%, rgba(234,88,12,0.9) 100%)",
                      boxShadow: "0 4px 15px rgba(249,115,22,0.25)",
                    }
                    : {}
                }
                title={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={`shrink-0 transition-colors ${isActive
                          ? "text-white"
                          : "text-blue-300 group-hover:text-white"
                        }`}
                    />
                    {!collapsed && item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </aside>
  );
}
