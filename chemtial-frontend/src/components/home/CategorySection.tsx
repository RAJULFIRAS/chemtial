import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Layers } from "lucide-react";
import { RootState, AppDispatch } from "../../store";
import { fetchCategories } from "../../store/slices/categorySlice";

const CategorySection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { categories, isLoading } = useSelector(
    (state: RootState) => state.category,
  );

  useEffect(() => {
    dispatch(fetchCategories({}));
  }, [dispatch]);

  if (isLoading && categories.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Layers size={24} />
            {t("navbar.categories")}
          </h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  const getName = (cat: { name: string; nameEn: string | null }): string => {
    if (i18n.language === "en" && cat.nameEn) return cat.nameEn;
    return cat.name;
  };

  const displayCategories = categories.slice(0, 6);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Layers size={24} />
          {t("navbar.categories")}
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="text-secondary hover:text-primary transition-colors flex items-center gap-1 text-sm"
        >
          {t("home.view_all")} <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {displayCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => navigate(`/products?category=${category.id}`)}
            className="group text-center p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 transition-all hover:shadow-md"
          >
            <h3 className="font-medium text-secondary group-hover:text-primary text-sm line-clamp-2 mb-1">
              {getName(category)}
            </h3>
            <p className="text-xs text-secondary/60">
              {category.productCount || 0} {t("navbar.products")}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
