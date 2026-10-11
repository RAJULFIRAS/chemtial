import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { User, Bell, AlertTriangle, Package } from "lucide-react";
import { productApi } from "../../services/adminApi";
import { useNavigate } from "react-router-dom";

interface LowStockProduct {
  id: string;
  name: string;
  image: string;
  stock: number;
  unit: string;
}

const AdminHeader: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>(
    [],
  );
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchLowStock = async () => {
    setIsLoading(true);
    try {
      const result = await productApi.getAll({ page: 1, limit: 500 });
      const products = result.data as any[];

      const lowStock: LowStockProduct[] = products
        .filter((p) => {
          if (!p.inStock) return true;
          if (p.units && p.units.length > 0) {
            return p.units.some((u: any) => u.isActive && u.stock <= 5);
          }
          return false;
        })
        .map((p) => {
          let stock = 0;
          if (p.units && p.units.length > 0) {
            stock = p.units
              .filter((u: any) => u.isActive)
              .reduce((sum: number, u: any) => sum + u.stock, 0);
          }
          return {
            id: p.id,
            name: p.name,
            image: p.image,
            stock,
            unit: p.unit,
          };
        });

      setLowStockProducts(lowStock);
    } catch (error) {
      console.error("Failed to fetch low stock products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
    const interval = setInterval(fetchLowStock, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasNotifications = lowStockProducts.length > 0;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-secondary">
            Welcome back, {user?.name}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-secondary" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-secondary text-sm">
                    Notifications
                  </h3>
                  {hasNotifications && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      {lowStockProducts.length}
                    </span>
                  )}
                </div>

                {isLoading ? (
                  <div className="p-6 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                  </div>
                ) : !hasNotifications ? (
                  <div className="p-6 text-center text-secondary/60 text-sm">
                    No notifications
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {lowStockProducts.slice(0, 10).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          navigate("/admin/products");
                          setIsNotifOpen(false);
                        }}
                        className="w-full p-3 hover:bg-gray-50 transition-colors text-left flex items-start gap-3"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={16} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-secondary line-clamp-2">
                            {product.name}
                          </p>
                          <p className="text-xs text-red-600 mt-0.5 flex items-center gap-1">
                            <AlertTriangle size={10} />
                            {product.stock <= 0
                              ? "Out of stock"
                              : `Low stock: ${product.stock} ${product.unit}`}
                          </p>
                        </div>
                      </button>
                    ))}
                    {lowStockProducts.length > 10 && (
                      <button
                        onClick={() => {
                          navigate("/admin/products");
                          setIsNotifOpen(false);
                        }}
                        className="w-full p-3 text-center text-xs text-primary hover:bg-gray-50 transition-colors"
                      >
                        View all ({lowStockProducts.length})
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 px-3 py-2 select-none">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={18} className="text-primary" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-secondary">{user?.name}</p>
              <p className="text-xs text-secondary/60 capitalize">
                {user?.role ?? "User"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
