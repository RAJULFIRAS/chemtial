import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star, Eye, Package } from "lucide-react";
import { Product } from "../../types";
import Button from "../common/Button";
import { getImageUrl } from "../../utils/image";
import { getLocalizedName } from "../../utils/i18n-content";
import { formatCurrency } from "../../utils/format";

interface ProductGridProps {
  products: Product[];
  title?: string;
  hideViewAll?: boolean;
}

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

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  hideViewAll = false,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const displayTitle = title?.includes(".")
    ? t(title)
    : title || t("home.featured_products");

  const handleAddToCart = (e: React.MouseEvent, product: Product): void => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleProductClick = (productId: string): void => {
    navigate(`/product/${productId}`);
  };

  return (
    <section>
      {displayTitle && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Package size={24} />
            {displayTitle}
          </h2>
          {!hideViewAll && (
            <button
              onClick={() => navigate("/products")}
              className="text-secondary hover:text-primary transition-colors text-sm flex items-center gap-1"
            >
              {t("home.view_all_products")} <Eye size={16} />
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
                    <span className="text-white font-semibold text-sm">
                      {t("product.out_of_stock")}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-4">
                <div className="text-xs text-secondary/60 mb-1 truncate">
                  {product.brand}
                </div>
                <h3 className="font-semibold text-secondary line-clamp-2 mb-2 min-h-[40px] sm:min-h-[48px] text-sm sm:text-base">
                  {displayName}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-sm font-medium">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-xs text-secondary/60">
                    ({product.reviews})
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-1 sm:gap-2 mb-2">
                  <span className="text-base sm:text-lg font-bold text-primary">
                    {formatCurrency(displayPrice)}
                  </span>
                  {originalPrice && (
                    <span className="text-xs sm:text-sm text-secondary/60 line-through">
                      {formatCurrency(originalPrice)}
                    </span>
                  )}
                </div>

                <div className="text-xs text-secondary/60 mb-3 truncate">
                  {t("product.unit")}: {product.unit}
                </div>

                <Button
                  variant={product.inStock ? "primary" : "secondary"}
                  size="sm"
                  icon={ShoppingCart}
                  disabled={!product.inStock}
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full"
                >
                  <span className="hidden sm:inline">
                    {product.inStock
                      ? t("product.add_to_cart")
                      : t("product.out_of_stock")}
                  </span>
                  <span className="sm:hidden">
                    {product.inStock ? t("product.add") : t("product.empty")}
                  </span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductGrid;
