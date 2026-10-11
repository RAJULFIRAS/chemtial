import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star, Eye, Sparkles, PackageOpen } from "lucide-react";
import { Product } from "../../types";
import Button from "../common/Button";
import { getImageUrl } from "../../utils/image";
import { apiClient } from "../../services/api";
import { getLocalizedName } from "../../utils/i18n-content";
import { formatCurrency } from "../../utils/format";

const getDisplayPrice = (product: Product): number => {
  if (product.units && product.units.length > 0) {
    const activeUnits = product.units.filter((u) => u.isActive);
    if (activeUnits.length > 0) {
      return Math.min(...activeUnits.map((u) => u.discountedPrice));
    }
  }
  return product.discountedPrice ?? product.price;
};

const getDisplayOriginalPrice = (product: Product): number | null => {
  if (!product.isPromo) return null;
  if (product.units && product.units.length > 0) {
    const activeUnits = product.units.filter((u) => u.isActive);
    if (activeUnits.length > 0) {
      return Math.min(...activeUnits.map((u) => u.price));
    }
  }
  return product.originalPrice;
};

const NewProductsSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewProducts = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/products", {
          params: { recent: "true", limit: 12, page: 1 },
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed to load new products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product): void => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleProductClick = (productId: string): void => {
    navigate(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Sparkles size={24} />
            {t("home.new_products") || "Produk Terbaru"}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Sparkles size={24} />
          {t("home.new_products") || "Produk Terbaru"}
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="text-secondary hover:text-primary transition-colors text-sm flex items-center gap-1"
        >
          {t("home.view_all_products")} <Eye size={16} />
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 py-10 text-center">
          <PackageOpen size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-secondary font-medium">
            {t("home.no_new_products") ||
              "Belum ada produk terbaru sejak 30 hari terakhir"}
          </p>
          <p className="text-xs text-secondary/60 mt-1">
            {t("home.no_new_products_hint") ||
              "Produk baru akan muncul di sini setelah ditambahkan admin."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {products.map((product) => {
            const displayName = getLocalizedName(product);
            const displayPrice = getDisplayPrice(product);
            const originalPrice = getDisplayOriginalPrice(product);
            return (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={getImageUrl(product.image)}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {product.isPromo && product.promoDiscount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{product.promoDiscount}%
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {t("product.out_of_stock")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <div className="text-xs text-secondary/60 mb-1 truncate">
                    {product.brand}
                  </div>
                  <h3 className="font-semibold text-secondary line-clamp-2 mb-2 min-h-[40px] text-sm">
                    {displayName}
                  </h3>

                  <div className="flex items-center gap-1 mb-2">
                    <Star
                      size={12}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-xs font-medium">
                      {product.rating}
                    </span>
                    <span className="text-xs text-secondary/60">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-1 mb-2">
                    <span className="text-sm font-bold text-primary">
                      {formatCurrency(displayPrice)}
                    </span>
                    {originalPrice && (
                      <span className="text-[10px] text-secondary/60 line-through">
                        {formatCurrency(originalPrice)}
                      </span>
                    )}
                  </div>

                  <Button
                    variant={product.inStock ? "primary" : "secondary"}
                    size="sm"
                    icon={ShoppingCart}
                    disabled={!product.inStock}
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full !px-2"
                  >
                    <span className="hidden sm:inline text-xs">
                      {product.inStock
                        ? t("product.add_to_cart")
                        : t("product.out_of_stock")}
                    </span>
                    <span className="sm:hidden text-xs">
                      {product.inStock ? t("product.add") : t("product.empty")}
                    </span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default NewProductsSection;
