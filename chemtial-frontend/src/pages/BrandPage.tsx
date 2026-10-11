import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SlidePanel from "../components/layout/SlidePanel";
import { RootState, AppDispatch } from "../store";
import { fetchBrands } from "../store/slices/brandSlice";
import { getImageUrl } from "../utils/image";

interface BrandPageProps {
  isOpen: boolean;
  onClose: () => void;
  onBrandSelect?: (brand: string) => void;
  position?: "left" | "right";
  width?: string;
}

const BrandPage: React.FC<BrandPageProps> = ({
  isOpen,
  onClose,
  onBrandSelect,
  position = "left",
  width = "max-w-2xl",
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { brands, isLoading, error } = useSelector(
    (state: RootState) => state.brand,
  );

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchBrands({}));
    }
  }, [isOpen, dispatch]);

  const handleBrandClick = (brandId: string, brandName: string) => {
    if (onBrandSelect) {
      onBrandSelect(brandName);
    }
    onClose();
    navigate(`/products?brand=${encodeURIComponent(brandId)}`);
  };

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={t("brand.title")}
      width={width}
      position={position}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
          <button
            onClick={() => dispatch(fetchBrands({}))}
            className="mt-3 text-sm text-primary hover:underline"
          >
            {t("brand.retry")}
          </button>
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-12 text-secondary">
          <p>{t("brand.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleBrandClick(brand.id, brand.name)}
              className="group p-4 bg-gray-50 rounded-xl text-center hover:bg-primary/5 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-full h-16 mb-2 flex items-center justify-center">
                {brand.logo ? (
                  <img
                    src={getImageUrl(brand.logo)}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}
                <span
                  className={`text-2xl font-bold text-primary ${
                    brand.logo ? "hidden" : "flex"
                  }`}
                >
                  {brand.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors text-sm">
                {brand.name}
              </h3>
              <p className="text-xs text-secondary/60 mt-0.5">
                {brand.productCount || 0} {t("brand.products_count")}
              </p>
            </button>
          ))}
        </div>
      )}
    </SlidePanel>
  );
};

export default BrandPage;
