import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Package,
  Minus,
  Plus,
  Check,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "../store";
import { addToCart } from "../store/slices/cartSlice";
import {
  reviewApi,
  ProductReviewResponse,
  ProductRatingSummary,
} from "../services/adminApi";
import { apiClient } from "../services/api";
import { Product, ProductUnit } from "../types";
import Button from "../components/common/Button";
import { getImageUrl } from "../utils/image";
import {
  getLocalizedName,
  getLocalizedDescription,
} from "../utils/i18n-content";
import { formatCurrency } from "../utils/format";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<ProductUnit | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [reviews, setReviews] = useState<ProductReviewResponse[]>([]);
  const [summary, setSummary] = useState<ProductRatingSummary>({
    average: 0,
    count: 0,
  });
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/products/${id}`);
        const data: Product = response.data.data;
        setProduct(data);

        if (data.images && data.images.length > 0) {
          const primary =
            data.images.find((img) => img.isPrimary) || data.images[0];
          setSelectedImage(primary.image);
        } else {
          setSelectedImage(data.image);
        }

        if (data.units && data.units.length > 0) {
          const available =
            data.units.find((u) => u.isActive && u.stock > 0) || data.units[0];
          setSelectedUnit(available);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : t("product.not_found");
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, t]);

  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      setIsReviewsLoading(true);
      try {
        const result = await reviewApi.getByProduct(id);
        setReviews(result.reviews);
        setSummary(result.summary);
      } catch {
        // silent
      } finally {
        setIsReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const finalPrice = useMemo(() => {
    if (!product) return 0;
    if (selectedUnit) return selectedUnit.discountedPrice;
    return product.discountedPrice ?? product.price;
  }, [product, selectedUnit]);

  const originalUnitPrice = useMemo(() => {
    if (!product) return null;
    if (selectedUnit && product.isPromo) return selectedUnit.price;
    if (product.isPromo && product.originalPrice) return product.originalPrice;
    return null;
  }, [product, selectedUnit]);

  const displayName = useMemo(
    () => (product ? getLocalizedName(product) : ""),
    [product],
  );

  const displayDescription = useMemo(
    () => (product ? getLocalizedDescription(product) : ""),
    [product],
  );

  const allImages = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images.map((img) => img.image);
    }
    return [product.image];
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      toast.error(t("voucher.login_required"));
      navigate("/login");
      return;
    }

    if (selectedUnit && selectedUnit.stock < quantity) {
      toast.error(t("product.stock_available") + ": " + selectedUnit.stock);
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: product.id,
          unitId: selectedUnit?.id,
          quantity,
        }),
      ).unwrap();
      toast.success(t("cart.voucher_applied"));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("errors.generic");
      toast.error(message);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const maxStock = selectedUnit?.stock ?? 99;
    const next = quantity + delta;
    if (next < 1) return;
    if (next > maxStock) {
      toast.error(t("product.stock_available") + ": " + maxStock);
      return;
    }
    setQuantity(next);
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-custom py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={20} /> {t("product.back")}
        </button>
        <div className="text-center py-20">
          <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
          <p className="text-secondary text-lg">
            {error || t("product.not_found")}
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/products")}
            className="mt-4"
          >
            {t("product.view_all_products")}
          </Button>
        </div>
      </div>
    );
  }

  const availableStock = selectedUnit?.stock ?? 99;

  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={20} /> {t("product.back")}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3">
            <img
              src={getImageUrl(selectedImage)}
              alt={displayName}
              className="w-full h-full object-contain"
            />
          </div>

          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? "border-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`${displayName} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-secondary/60 mb-1">{product.brand}</p>

          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-3">
            {displayName}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star size={18} className="fill-yellow-400 text-yellow-300" />
              <span className="font-semibold text-secondary">
                {summary.average.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-secondary/60">
              ({summary.count} {t("product.reviews")})
            </span>
            {product.casNumber && (
              <span className="text-xs bg-gray-100 text-secondary px-2 py-1 rounded">
                {t("product.cas_number")}: {product.casNumber}
              </span>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(finalPrice)}
              </span>
              {originalUnitPrice && (
                <span className="text-lg text-secondary/60 line-through">
                  {formatCurrency(originalUnitPrice)}
                </span>
              )}
            </div>
            {product.isPromo && product.promoDiscount && (
              <span className="inline-block mt-2 text-xs bg-red-600 text-white px-2 py-1 rounded-full font-medium">
                {t("promo.discount")} {product.promoDiscount}%
              </span>
            )}
          </div>

          {product.units && product.units.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary mb-2">
                {t("product.select_unit")}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.units
                  .filter((u) => u.isActive)
                  .map((unit) => {
                    const isSelected = selectedUnit?.id === unit.id;
                    const isOutOfStock = unit.stock <= 0;
                    return (
                      <button
                        key={unit.id}
                        onClick={() => {
                          if (isOutOfStock) {
                            toast.error(t("product.unit_stock_empty"));
                            return;
                          }
                          setSelectedUnit(unit);
                          setQuantity(1);
                        }}
                        disabled={isOutOfStock}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : isOutOfStock
                              ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                              : "border-gray-200 text-secondary hover:border-primary"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isSelected && <Check size={14} />}
                          <span>{unit.unit}</span>
                          <span className="text-xs opacity-70">
                            {formatCurrency(unit.discountedPrice)}
                          </span>
                        </div>
                        {isOutOfStock && (
                          <span className="block text-[10px] mt-0.5">
                            {t("product.unit_stock_empty")}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center gap-2 text-sm">
            <Package size={16} className="text-secondary/60" />
            {availableStock > 0 ? (
              <span className="text-secondary">
                {t("product.stock_available")}:{" "}
                <span className="font-medium text-primary">
                  {availableStock}
                </span>
              </span>
            ) : (
              <span className="text-red-500 font-medium">
                {t("product.out_of_stock")}
              </span>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary mb-2">
              {t("product.quantity")}
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-16 text-center font-semibold text-lg">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= availableStock}
                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={ShoppingCart}
            onClick={handleAddToCart}
            disabled={!product.inStock || availableStock <= 0}
            className="w-full"
          >
            {!product.inStock || availableStock <= 0
              ? t("product.out_of_stock")
              : t("product.add_to_cart")}
          </Button>

          {displayDescription && (
            <div className="mt-6">
              <h2 className="font-semibold text-secondary mb-2">
                {t("product.description")}
              </h2>
              <p className="text-sm text-secondary/70 whitespace-pre-line">
                {displayDescription}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h2 className="text-xl font-bold text-primary mb-6">
          {t("product.product_reviews")} ({summary.count})
        </h2>

        {isReviewsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <Star size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-secondary">{t("product.no_reviews")}</p>
            <p className="text-sm text-secondary/60 mt-1">
              {t("product.be_first_review")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-secondary">
                      {review.userName || "Anonim"}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-secondary/60">
                    {new Date(review.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-secondary/80 mt-2">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
