import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Package, Filter, X } from "lucide-react";
import { AppDispatch, RootState } from "../store";
import { fetchProducts } from "../store/slices/productSlice";
import { fetchCategories } from "../store/slices/categorySlice";
import { fetchBrands } from "../store/slices/brandSlice";
import ProductGrid from "../components/home/ProductGrid";
import Button from "../components/common/Button";
import { useDebounce } from "../hooks/useDebounce";
import { getLocalizedName } from "../utils/i18n-content";

const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { products, isLoading, meta } = useSelector(
    (state: RootState) => state.product,
  );
  const { categories } = useSelector((state: RootState) => state.category);
  const { brands } = useSelector((state: RootState) => state.brand);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== searchInput) {
      setSearchInput(urlSearch);
    }
  }, [searchParams]);
  const search = useDebounce(searchInput, 500);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    searchParams.get("category") || "",
  );
  useEffect(() => {
    const urlCategory = searchParams.get("category") || "";
    if (urlCategory !== selectedCategoryId) {
      setSelectedCategoryId(urlCategory);
    }
  }, [searchParams]);

  const [selectedBrandId, setSelectedBrandId] = useState(
    searchParams.get("brand") || "",
  );
  useEffect(() => {
    const urlBrand = searchParams.get("brand") || "";
    if (urlBrand !== selectedBrandId) {
      setSelectedBrandId(urlBrand);
    }
  }, [searchParams]);
  const limit = 12;

  useEffect(() => {
    dispatch(fetchCategories({ isActive: true }));
    dispatch(fetchBrands({ isActive: true }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        page,
        limit,
        search: search || undefined,
        category: selectedCategoryId || undefined,
        brand: selectedBrandId || undefined,
      }),
    );

    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (selectedCategoryId) params.category = selectedCategoryId;
    if (selectedBrandId) params.brand = selectedBrandId;
    if (page > 1) params.page = String(page);
    setSearchParams(params, { replace: true });
  }, [
    dispatch,
    page,
    search,
    selectedCategoryId,
    selectedBrandId,
    setSearchParams,
  ]);

  const handleClearFilters = (): void => {
    setSearchInput("");
    setSelectedCategoryId("");
    setSelectedBrandId("");
    setPage(1);
  };

  const hasFilters = searchInput || selectedCategoryId || selectedBrandId;

  const totalPages = Math.ceil((meta.total || 0) / limit);

  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={20} /> <span>{t("products.back_to_home")}</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Package size={28} />
          {t("products.title")}
        </h1>
        <p className="text-secondary/60 mt-2">{t("products.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-secondary flex items-center gap-2">
                <Filter size={18} />
                {t("products.filter")}
              </h3>
              {hasFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <X size={12} /> {t("products.clear")}
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-secondary/70 mb-2 uppercase">
                {t("products.search")}
              </label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
                placeholder={t("products.search_placeholder")}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-secondary/70 mb-2 uppercase">
                {t("products.category")}
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">{t("products.all_categories")}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {getLocalizedName(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary/70 mb-2 uppercase">
                {t("products.brand")}
              </label>
              <select
                value={selectedBrandId}
                onChange={(e) => {
                  setSelectedBrandId(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">{t("products.all_brands")}</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3" id="product-grid">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <Package size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-secondary text-lg">{t("products.empty")}</p>
              {hasFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-primary hover:underline text-sm"
                >
                  {t("products.clear_filters")}
                </button>
              )}
            </div>
          ) : (
            <>
              <ProductGrid products={products} title="" />

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    {t("products.previous")}
                  </Button>
                  <span className="text-sm text-secondary px-4">
                    {t("products.page")} {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages}
                  >
                    {t("products.next")}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
