import { Outlet, Link, useLocation, Navigate, useNavigate } from "react-router";
import { useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Grid3x3,
  Calendar,
  Users,
  CreditCard,
  Package,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export function AdminLayoutWithAuth() {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return <AdminLayout />;
}

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const navItems = [
    {
      path: "/admin/dashboard",
      label: "Tổng quan",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      path: "/admin/food-management",
      label: "Quản lý thực đơn",
      icon: <UtensilsCrossed className="w-5 h-5" />,
    },
    {
      path: "/admin/order-management",
      label: "Quản lý đơn hàng",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      path: "/admin/table-management",
      label: "Quản lý bàn",
      icon: <Grid3x3 className="w-5 h-5" />,
    },
    {
      path: "/admin/reservation-management",
      label: "Quản lý đặt bàn",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      path: "/admin/workers-management",
      label: "Quản lý nhân viên",
      icon: <Users className="w-5 h-5" />,
    },
    {
      path: "/admin/payment-management",
      label: "Quản lý thanh toán",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      path: "/admin/inventory-management",
      label: "Quản lý kho",
      icon: <Package className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } bg-gray-900 text-white transition-all duration-300 overflow-hidden fixed h-screen z-40 flex flex-col shrink-0 lg:relative`}
      >
        <div className="p-6 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">R</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Restora Admin</h1>
              <p className="text-xs text-gray-400">Hệ thống quản lý</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-amber-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <span className="mt-0.5 shrink-0">{item.icon}</span>
                  <span className="leading-snug">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 p-4 border-t border-gray-800 space-y-1 bg-gray-900">
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/admin/login", { replace: true });
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <span className="w-5 h-5 text-center text-sm">←</span>
            <span>Về trang chủ</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">Quản trị viên</p>
                <p className="text-sm text-gray-500">Admin</p>
              </div>
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
