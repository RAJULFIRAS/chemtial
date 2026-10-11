import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ChevronRight } from "lucide-react";
import { RootState, AppDispatch } from "../../store";
import { fetchCategories } from "../../store/slices/categorySlice";
import { apiClient } from "../../services/api";
import { useNavigate } from "react-router-dom";

interface ProductItem {
  id: string;
  name: string;
  nameEn: string | null;
}

interface CategoryDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect: (category: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  isOpen,
  onClose,
  onCategorySelect,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { categories, isLoading } = useSelector(
    (state: RootState) => state.category,
  );
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null,
  );
  const [productsByCategory, setProductsByCategory] = useState<
    Record<string, ProductItem[]>
  >({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories({ isActive: true }));
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!hoveredCategoryId) return;
    if (productsByCategory[hoveredCategoryId]) return;

    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await apiClient.get("/products", {
          params: { category: hoveredCategoryId, limit: 30 },
        });
        setProductsByCategory((prev) => ({
          ...prev,
          [hoveredCategoryId]: response.data.data,
        }));
      } catch {
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [hoveredCategoryId, productsByCategory]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getName = (item: { name: string; nameEn: string | null }): string => {
    if (i18n.language === "en" && item.nameEn) return item.nameEn;
    return item.name;
  };

  const hoveredCategory = categories.find((c) => c.id === hoveredCategoryId);
  const currentProducts = hoveredCategoryId
    ? productsByCategory[hoveredCategoryId] || []
    : [];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      <div
        ref={dropdownRef}
        className="absolute left-0 top-full mt-1 w-[900px] max-w-[95vw] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in"
        style={{ maxHeight: "80vh" }}
      >
        <div className="flex h-full">
          <div className="w-1/2 border-r border-gray-100 overflow-y-auto p-2 max-h-[70vh]">
            {isLoading ? (
              <div className="p-4 space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-9 bg-gray-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onMouseEnter={() => setHoveredCategoryId(category.id)}
                  onClick={() => {
                    onCategorySelect(category.id);
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                    hoveredCategoryId === category.id
                      ? "bg-primary/10 text-primary"
                      : "text-secondary hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {getName(category)}
                  </span>
                  <ChevronRight
                    size={16}
                    className={`transition-all ${
                      hoveredCategoryId === category.id
                        ? "text-primary opacity-100"
                        : "text-gray-400 opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </button>
              ))
            )}
          </div>

          <div className="w-1/2 p-4 overflow-y-auto max-h-[70vh]">
            {hoveredCategory && currentProducts.length > 0 ? (
              <div>
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                  {t("navbar.products")}
                </h4>
                <div className="space-y-1">
                  {currentProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        navigate(`/product/${product.id}`);
                        onClose();
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-secondary hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                    >
                      {getName(product)}
                    </button>
                  ))}
                </div>
              </div>
            ) : hoveredCategory && loadingProducts ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                {t("navbar.select_category")}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 p-3 bg-gray-50/50 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {categories.length} {t("navbar.categories").toLowerCase()}
          </span>
          <button
            onClick={onClose}
            className="text-xs text-primary hover:underline"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </>
  );
};

export default CategoryDropdown;
