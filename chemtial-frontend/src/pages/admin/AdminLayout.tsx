import React, { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react";
import { RootState } from "../../store";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

const COURIER_ALLOWED_PATHS = [
  "/admin/orders",
  "/admin/order-history",
  "/admin/cod",
];

const ADMIN_FORBIDDEN_PATHS = ["/admin/accounting"];

const AdminLayout: React.FC = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role;

  if (role !== "admin" && role !== "manager" && role !== "courier") {
    return <Navigate to="/" replace />;
  }

  if (role === "courier") {
    const isAllowed = COURIER_ALLOWED_PATHS.some((p) =>
      location.pathname.startsWith(p),
    );
    if (!isAllowed) {
      return <Navigate to="/admin/orders" replace />;
    }
  }

  if (role === "admin") {
    const isForbidden = ADMIN_FORBIDDEN_PATHS.some((p) =>
      location.pathname.startsWith(p),
    );
    if (isForbidden) {
      return <Navigate to="/admin" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-100"
        aria-label="Open menu"
      >
        <Menu size={20} className="text-primary" />
      </button>

      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 bottom-0 w-64 z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onClose={() => setIsMobileSidebarOpen(false)} />
      </div>

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
