import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RootState, AppDispatch } from "../../store";
import { fetchBrands } from "../../store/slices/brandSlice";
import { getImageUrl } from "../../utils/image";
import { openBrand } from "../../store/slices/uiSlice";

const BrandSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { brands, isLoading } = useSelector((state: RootState) => state.brand);

  useEffect(() => {
    dispatch(fetchBrands({}));
  }, [dispatch]);

  const displayBrands = brands.slice(0, 5);

  if (isLoading && brands.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-primary mb-6">
          {t("brand_section.title")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="p-4 bg-gray-100 rounded-xl animate-pulse h-24"
            />
          ))}
        </div>
      </section>
    );
  }

  if (displayBrands.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">
          {t("brand_section.title")}
        </h2>
        <button
          onClick={() => dispatch(openBrand())}
          className="text-secondary hover:text-primary transition-colors text-sm"
        >
          {t("brand_section.view_all")}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {displayBrands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => navigate(`/products?brand=${brand.id}`)}
            className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary/5 hover:shadow-md transition-all group"
          >
            <div className="h-12 mb-2 flex items-center justify-center">
              {brand.logo ? (
                <img
                  src={getImageUrl(brand.logo)}
                  alt={brand.name}
                  className="max-h-full object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-primary">
                  {brand.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="text-secondary group-hover:text-primary font-medium text-sm">
              {brand.name}
            </div>
            <p className="text-xs text-secondary/60 mt-1">
              {brand.productCount || 0} {t("brand_section.products")}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default BrandSection;
