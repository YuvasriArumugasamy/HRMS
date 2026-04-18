import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full fixed inset-0 overflow-hidden bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
