import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SlidePanel from "../components/layout/SlidePanel";
import { apiClient } from "../services/api";
import { getImageUrl } from "../utils/image";
import { Tag, Sparkles, Loader2 } from "lucide-react";
import { formatCurrency } from "../utils/format";

interface PromoProduct {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice: number | null;
  promoDiscount: number | null;
}

interface PromoPageProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "left" | "right";
  width?: string;
}

const PromoPage: React.FC<PromoPageProps> = ({
  isOpen,
  onClose,
  position = "left",
  width = "max-w-2xl",
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<PromoProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchPromoProducts = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/products", {
          params: { page: 1, limit: 50, isPromo: "true" },
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed to load promo products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromoProducts();
  }, [isOpen]);

  const handleProductClick = (productId: string): void => {
    onClose();
    navigate(`/product/${productId}`);
  };

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={t("promo.title")}
      width={width}
      position={position}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="text-sm text-secondary/60">{t("common.loading")}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Tag size={32} className="text-primary/60" />
          </div>
          <p className="text-secondary font-medium">{t("promo.empty")}</p>
          <p className="text-xs text-secondary/60 mt-1">
            {t("home.no_new_products_hint")}
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <Sparkles size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-secondary">
              {t("promo.products")}
            </h3>
            <span className="ml-auto text-xs text-secondary/60">
              {products.length} {t("navbar.products")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-left"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {product.promoDiscount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{product.promoDiscount}%
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                      {t("promo.discount")}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-secondary/60 mb-1 truncate">
                    {product.brand}
                  </p>
                  <h4 className="text-xs font-semibold text-secondary line-clamp-2 mb-2 min-h-[32px]">
                    {product.name}
                  </h4>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-primary">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-secondary/60 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </SlidePanel>
  );
};

export default PromoPage;
