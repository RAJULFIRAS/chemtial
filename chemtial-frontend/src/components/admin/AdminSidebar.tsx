import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import logo from "../../asset/image/logo.png";
import { logout } from "../../store/slices/authSlice";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Ticket,
  Image,
  Grid3x3,
  LogOut,
  Store,
  DollarSign,
  Smartphone,
  History,
  Banknote,
  X,
} from "lucide-react";

type Role = "manager" | "admin" | "courier" | "user";

interface MenuItem {
  to: string;
  icon: React.ElementType;
  label: string;
  end?: boolean;
  roles: Role[];
}

interface AdminSidebarProps {
  onClose?: () => void;
}

const menuItems: MenuItem[] = [
  {
    to: "/admin",
    icon: LayoutDashboard,
    label: "Dashboard",
    end: true,
    roles: ["manager", "admin"],
  },
  {
    to: "/admin/products",
    icon: Package,
    label: "Products",
    roles: ["manager", "admin"],
  },
  {
    to: "/admin/categories",
    icon: Grid3x3,
    label: "Categories",
    roles: ["manager", "admin"],
  },
  {
    to: "/admin/brands",
    icon: Store,
    label: "Brands",
    roles: ["manager", "admin"],
  },
  {
    to: "/admin/orders",
    icon: ShoppingBag,
    label: "Orders",
    roles: ["manager", "admin", "courier"],
  },
  {
    to: "/admin/order-history",
    icon: History,
    label: "Order History",
    roles: ["manager", "admin", "courier"],
  },
  {
    to: "/admin/cod",
    icon: Banknote,
    label: "COD",
    roles: ["manager", "admin", "courier"],
  },
  {
    to: "/admin/vouchers",
    icon: Ticket,
    label: "Vouchers",
    roles: ["manager", "admin"],
  },
  {
    to: "/admin/banners",
    icon: Image,
    label: "Banners",
    roles: ["manager", "admin"],
  },
  {
    to: "/admin/users",
    icon: Users,
    label: "Users",
    roles: ["manager", "admin"],
  },
  {
    to: "/admin/accounting",
    icon: DollarSign,
    label: "Accounting",
    roles: ["manager"],
  },
  {
    to: "/admin/app-tracker",
    icon: Smartphone,
    label: "App Tracker",
    roles: ["manager", "admin"],
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const userRole = (user?.role ?? "user") as Role;
  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole),
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Chemtial Logo"
            className="h-7 w-auto object-contain"
          />
          <span className="text-lg font-bold text-primary">Chemtial</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-secondary hover:bg-gray-50"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
