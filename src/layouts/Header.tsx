import { generateInitials } from "@/core/utils/helpers";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../app/store";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch({ type: "auth/logout" });
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  return (
    <header
      className="py-5 px-6 flex items-center z-30 justify-between shadow-xl relative"
      style={{
        background: "linear-gradient(135deg, #115e88 10%, #0d4d70 45%, #0a3d5c 100%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-white/5 pointer-events-none" />

      <div className="relative z-10">
        <h2 className="text-xl font-bold text-white drop-shadow-sm">HRMS Portal</h2>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <button className="relative w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 transition-all duration-200 flex items-center justify-center group">
          <Bell size={18} className="text-white group-hover:scale-110 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-400 rounded-full ring-2 ring-white/30" />
        </button>

        <button className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 transition-all duration-200 flex items-center justify-center group">
          <Settings size={18} className="text-white group-hover:rotate-45 transition-transform duration-300" />
        </button>

        <div className="w-px h-8 bg-white/20 mx-1" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full pl-1 pr-3 py-1 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-full ring-2 ring-white/40 overflow-hidden flex-shrink-0 flex items-center justify-center bg-white/20 text-white font-bold text-xs">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{generateInitials(user?.name || "HRMS")}</span>
              )}
            </div>

            <span className="text-white text-sm font-medium leading-none">
              {user?.name || "Admin"}
            </span>

            <ChevronDown
              size={16}
              className={`text-white/80 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-50 overflow-hidden text-gray-800">
              <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                <p className="text-sm font-semibold truncate">
                  {user?.name || "HRMS Admin"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || "admin@hrms.com"}
                </p>
              </div>

              <button
                onClick={handleProfile}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
              >
                <User size={16} className="text-gray-400" />
                <span>Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors"
              >
                <LogOut size={16} className="text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
