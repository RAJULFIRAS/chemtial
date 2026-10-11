import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid3x3,
  Store,
  Tag,
  Ticket,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Clock,
  Banknote,
} from "lucide-react";
import {
  categoryApi,
  brandApi,
  voucherApi,
  productApi,
  userApi,
  orderAdminApi,
} from "../../services/adminApi";
import { formatCurrency } from "../../utils/format";

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
}

interface Stats {
  categories: number;
  brands: number;
  productPromos: number;
  vouchers: number;
  vouchersActive: number;
  products: number;
  users: number;
  orders: number;
  pendingOrders: number;
  codPending: number;
  recentRevenue: number;
  lowStockProducts: LowStockProduct[];
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    categories: 0,
    brands: 0,
    productPromos: 0,
    vouchers: 0,
    vouchersActive: 0,
    products: 0,
    users: 0,
    orders: 0,
    pendingOrders: 0,
    codPending: 0,
    recentRevenue: 0,
    lowStockProducts: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          categoriesRes,
          brandsRes,
          vouchersRes,
          productsRes,
          usersRes,
          ordersRes,
          revenueRes,
          codRes,
        ] = await Promise.allSettled([
          categoryApi.getAll(),
          brandApi.getAll(),
          voucherApi.getAll(),
          productApi.getAll({ page: 1, limit: 500 }),
          userApi.getAll({ page: 1, limit: 1 }),
          orderAdminApi.getAll({ page: 1, limit: 500 }),
          orderAdminApi.getRevenueReport("month"),
          orderAdminApi.getCodPending(),
        ]);

        const now = new Date();

        const categoriesCount =
          categoriesRes.status === "fulfilled" ? categoriesRes.value.length : 0;

        const brandsCount =
          brandsRes.status === "fulfilled" ? brandsRes.value.length : 0;

        const vouchersData =
          vouchersRes.status === "fulfilled"
            ? (vouchersRes.value as any[])
            : [];
        const activeVouchers = vouchersData.filter(
          (v) =>
            v.isActive &&
            new Date(v.startDate) <= now &&
            new Date(v.endDate) >= now,
        );
        const vouchersCount = vouchersData.length;
        const vouchersActiveCount = activeVouchers.length;

        const productsData =
          productsRes.status === "fulfilled" ? productsRes.value.data : [];
        const productsCount = productsData.length;

        const productPromosCount = (productsData as any[]).filter(
          (p) => p.isPromo === true,
        ).length;

        const lowStockProducts: LowStockProduct[] = (productsData as any[])
          .map((p) => {
            const activeUnits = (p.units || []).filter((u: any) => u.isActive);
            const stock = activeUnits.reduce(
              (s: number, u: any) => s + u.stock,
              0,
            );
            return {
              id: p.id,
              name: p.nameEn || p.name,
              stock,
            };
          })
          .filter((p) => p.stock < 10)
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 5);

        const usersTotal =
          usersRes.status === "fulfilled" ? usersRes.value.meta?.total || 0 : 0;

        const ordersData =
          ordersRes.status === "fulfilled" ? ordersRes.value.data : [];
        const ordersTotal =
          ordersRes.status === "fulfilled"
            ? ordersRes.value.meta?.total || 0
            : 0;

        const pendingOrdersCount = (ordersData as any[]).filter((o) =>
          ["pending", "paid", "processing"].includes(o.status),
        ).length;

        const revenueData =
          revenueRes.status === "fulfilled" ? revenueRes.value : null;
        const recentRevenue = revenueData?.summary?.totalRevenue ?? 0;

        const codPendingCount =
          codRes.status === "fulfilled" ? codRes.value.length : 0;

        setStats({
          categories: categoriesCount,
          brands: brandsCount,
          productPromos: productPromosCount,
          vouchers: vouchersCount,
          vouchersActive: vouchersActiveCount,
          products: productsCount,
          users: usersTotal,
          orders: ordersTotal,
          pendingOrders: pendingOrdersCount,
          codPending: codPendingCount,
          recentRevenue,
          lowStockProducts,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Products",
      value: stats.products,
      icon: Package,
      color: "bg-green-900",
      link: "/admin/products",
    },
    {
      label: "Orders",
      value: stats.orders,
      icon: ShoppingBag,
      color: "bg-green-900",
      link: "/admin/orders",
    },
    {
      label: "Users",
      value: stats.users,
      icon: Users,
      color: "bg-green-900",
      link: "/admin/users",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: Grid3x3,
      color: "bg-green-900",
      link: "/admin/categories",
    },
    {
      label: "Brands",
      value: stats.brands,
      icon: Store,
      color: "bg-green-900",
      link: "/admin/brands",
    },
    {
      label: "Product Promos",
      value: stats.productPromos,
      icon: Tag,
      color: "bg-green-900",
      link: "/admin/products",
    },
    {
      label: "Vouchers",
      value:
        stats.vouchers > stats.vouchersActive
          ? `${stats.vouchersActive} active / ${stats.vouchers} total`
          : stats.vouchers,
      icon: Ticket,
      color: "bg-green-900",
      link: "/admin/vouchers",
    },
    {
      label: "Revenue (This Month)",
      value: formatCurrency(stats.recentRevenue),
      icon: DollarSign,
      color: "bg-green-900",
      link: "/admin/accounting",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Chemtial Data Overview
        </h1>
        <p className="text-secondary/60 mt-1 text-sm">
          Business snapshot at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isLongValue =
            typeof stat.value === "string" && stat.value.length > 12;
          return (
            <button
              key={stat.label}
              onClick={() => navigate(stat.link)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <p className="text-sm text-secondary/60">{stat.label}</p>
              <p
                className={`font-bold text-primary mt-1 ${
                  isLongValue ? "text-base" : "text-2xl"
                }`}
              >
                {isLoading ? "..." : stat.value}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/admin/orders")}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">
              {isLoading ? "..." : stats.pendingOrders}
            </span>
          </div>
          <p className="text-sm font-medium text-secondary">
            Orders Needing Action
          </p>
          <p className="text-xs text-secondary/60 mt-0.5">
            Pending, paid, or processing
          </p>
        </button>

        <button
          onClick={() => navigate("/admin/cod")}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-700 rounded-lg flex items-center justify-center">
              <Banknote size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">
              {isLoading ? "..." : stats.codPending}
            </span>
          </div>
          <p className="text-sm font-medium text-secondary">
            COD Awaiting Confirmation
          </p>
          <p className="text-xs text-secondary/60 mt-0.5">
            Ready for delivery collection
          </p>
        </button>

        <button
          onClick={() => navigate("/admin/products")}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">
              {isLoading ? "..." : stats.lowStockProducts.length}
            </span>
          </div>
          <p className="text-sm font-medium text-secondary">
            Low Stock Products
          </p>
          <p className="text-xs text-secondary/60 mt-0.5">Below 10 units</p>
        </button>
      </div>

      {stats.lowStockProducts.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-red-700" />
            <h2 className="text-lg font-semibold text-secondary">
              Low Stock Products
            </h2>
          </div>
          <div className="space-y-2">
            {stats.lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 bg-red-50 rounded-lg px-4 py-2"
              >
                <span className="text-sm text-secondary truncate flex-1">
                  {p.name}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                    p.stock === 0
                      ? "bg-red-700 text-white"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {p.stock === 0 ? "Out of Stock" : `${p.stock} units`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-secondary">
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => navigate("/admin/products")}
            className="p-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors text-left"
          >
            <Package size={20} className="text-primary mb-2" />
            <p className="text-sm font-medium text-secondary">Add Product</p>
          </button>
          <button
            onClick={() => navigate("/admin/orders")}
            className="p-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors text-left"
          >
            <ShoppingBag size={20} className="text-primary mb-2" />
            <p className="text-sm font-medium text-secondary">View Orders</p>
          </button>
          <button
            onClick={() => navigate("/admin/vouchers")}
            className="p-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors text-left"
          >
            <Ticket size={20} className="text-primary mb-2" />
            <p className="text-sm font-medium text-secondary">
              Manage Vouchers
            </p>
          </button>
          <button
            onClick={() => navigate("/admin/accounting")}
            className="p-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors text-left"
          >
            <DollarSign size={20} className="text-primary mb-2" />
            <p className="text-sm font-medium text-secondary">Revenue Report</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
