import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "../../utils/image";
import { useNavigate } from "react-router-dom";
import {
  X,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  CreditCard,
  Ticket,
  Check,
} from "lucide-react";
import { RootState, AppDispatch } from "../../store";
import {
  updateQuantity,
  removeFromCart,
  clearSelectedVoucher,
} from "../../store/slices/cartSlice";
import { CartItem } from "../../store/slices/cartSlice";
import Button from "../common/Button";
import VoucherSelector from "../voucher/VoucherSelector";
import { getLocalizedName } from "../../utils/i18n-content";
import { formatCurrency } from "../../utils/format";

const DEFAULT_SHIPPING_COST = parseFloat(
  import.meta.env.VITE_SHIPPING_COST || "3.00",
);

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const getCartItemPrice = (item: CartItem): number => {
  if (item.unitName && item.product.units) {
    const matchedUnit = item.product.units.find(
      (u) => u.unit === item.unitName,
    );
    if (matchedUnit) return matchedUnit.discountedPrice;
  }
  return item.product.discountedPrice ?? item.product.price;
};

const roundMoney = (n: number): number => Math.round(n * 100) / 100;

const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { items, voucherPreview } = useSelector(
    (state: RootState) => state.cart,
  );
  const [isVoucherSelectorOpen, setIsVoucherSelectorOpen] = useState(false);

  if (!isOpen) return null;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const discountedSubtotal = roundMoney(
    items.reduce(
      (sum, item) => sum + getCartItemPrice(item) * item.quantity,
      0,
    ),
  );

  const productDiscount = roundMoney(
    items.reduce((sum, item) => {
      if (item.product.isPromo && item.product.promoDiscount) {
        const originalPrice =
          item.unitName && item.product.units
            ? (item.product.units.find((u) => u.unit === item.unitName)
                ?.price ?? item.product.price)
            : item.product.price;
        const discountedPrice = getCartItemPrice(item);
        return sum + (originalPrice - discountedPrice) * item.quantity;
      }
      return sum;
    }, 0),
  );

  const voucherDiscount = roundMoney(voucherPreview?.discount ?? 0);
  const freeShipping = voucherPreview?.freeShipping ?? false;
  const shippingCost =
    discountedSubtotal > 0 ? (freeShipping ? 0 : DEFAULT_SHIPPING_COST) : 0;
  const finalTotal = roundMoney(
    Math.max(0, discountedSubtotal - voucherDiscount + shippingCost),
  );

  const handleCheckout = (): void => {
    onClose();
    navigate("/checkout");
  };

  const handleRemoveVoucher = (): void => {
    dispatch(clearSelectedVoucher());
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 animate-slide-up overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-primary">
              {t("cart.title")}
            </h2>
            <span className="text-secondary">
              ({totalQuantity}{" "}
              {totalQuantity > 1 ? t("cart.items") : t("cart.item")})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={t("common.close")}
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <ShoppingBag size={64} className="text-gray-300 mb-4" />
            <p className="text-secondary text-lg">{t("cart.empty")}</p>
            <Button variant="primary" onClick={onClose} className="mt-4">
              {t("cart.shop_now")}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 p-4 space-y-4">
              {items.map((item: CartItem) => {
                const displayName = getLocalizedName(item.product);
                const itemPrice = getCartItemPrice(item);
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={displayName}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-secondary line-clamp-2 text-sm">
                        {displayName}
                      </h3>
                      <p className="text-xs text-secondary/70">
                        {item.product.brand}
                      </p>
                      {item.unitName && (
                        <p className="text-xs text-primary font-medium mt-0.5">
                          {t("product.unit")}: {item.unitName}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  cartItemId: item.id,
                                  quantity: item.quantity - 1,
                                }),
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="p-1 hover:bg-white rounded-md transition-colors disabled:opacity-30"
                            aria-label={t("cart.decrease_quantity")}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  cartItemId: item.id,
                                  quantity: item.quantity + 1,
                                }),
                              )
                            }
                            className="p-1 hover:bg-white rounded-md transition-colors"
                            aria-label={t("cart.increase_quantity")}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary text-sm">
                            {formatCurrency(itemPrice * item.quantity)}
                          </p>
                          <button
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1 mt-1"
                          >
                            <Trash2 size={12} /> {t("cart.remove")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex-shrink-0">
              <button
                onClick={() => setIsVoucherSelectorOpen(true)}
                className="w-full mb-3 py-2.5 px-4 border border-dashed border-primary/40 rounded-lg text-sm text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
              >
                <Ticket size={16} />
                {voucherPreview
                  ? t("cart.change_voucher")
                  : t("cart.use_voucher")}
              </button>

              {voucherPreview && (
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Check
                        size={14}
                        className="text-green-600 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-green-700 truncate">
                          {voucherPreview.code}
                        </p>
                        <p className="text-[10px] text-green-600 truncate">
                          {voucherPreview.title}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveVoucher}
                      className="p-1 hover:bg-green-100 rounded transition-colors flex-shrink-0"
                      aria-label={t("checkout.remove_voucher")}
                    >
                      <X size={14} className="text-green-700" />
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 mb-3 text-sm">
                <div className="flex justify-between text-secondary/70">
                  <span>{t("cart.subtotal")}</span>
                  <span>{formatCurrency(discountedSubtotal)}</span>
                </div>
                {productDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("checkout.product_discount")}</span>
                    <span>-{formatCurrency(productDiscount)}</span>
                  </div>
                )}
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("cart.voucher_discount")}</span>
                    <span>-{formatCurrency(voucherDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-secondary/70">
                  <span>{t("cart.shipping_cost")}</span>
                  <span>
                    {freeShipping ? (
                      <span className="text-green-600">{t("cart.free")}</span>
                    ) : (
                      formatCurrency(shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="font-semibold text-secondary">
                    {t("cart.total")}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                icon={CreditCard}
                onClick={handleCheckout}
              >
                {t("cart.checkout")}
              </Button>
            </div>
          </>
        )}

        <VoucherSelector
          isOpen={isVoucherSelectorOpen}
          onClose={() => setIsVoucherSelectorOpen(false)}
        />
      </div>
    </>
  );
};

export default CartDropdown;
