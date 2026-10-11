import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RootState, AppDispatch } from "../../store";
import { createOrder } from "../../store/slices/orderSlice";
import { clearCart, clearSelectedVoucher } from "../../store/slices/cartSlice";
import Input from "../../components/common/Input";
import { paymentApi } from "../../services/adminApi";
import Button from "../../components/common/Button";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Ticket,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { getLocalizedName } from "../../utils/i18n-content";
import { formatCurrency } from "../../utils/format";
import {
  getUSStates,
  getUSCitiesByState,
  isValidUSZipCode,
  COUNTRIES,
} from "../../utils/usData";

const DEFAULT_SHIPPING_COST = parseFloat(
  import.meta.env.VITE_SHIPPING_COST || "3.00",
);

const roundMoney = (n: number): number => Math.round(n * 100) / 100;

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { items, selectedVoucherUsageId, voucherPreview } = useSelector(
    (state: RootState) => state.cart,
  );
  const { isLoading } = useSelector((state: RootState) => state.order);

  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<string>("US");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const usStates = useMemo(() => getUSStates(), []);
  const usCities = useMemo(() => getUSCitiesByState(state), [state]);

  useEffect(() => {
    setCity("");
  }, [state]);

  const discountedSubtotal = roundMoney(
    items.reduce((sum, item) => {
      let unitPrice = item.product.discountedPrice ?? item.product.price;
      if (item.unitName && item.product.units) {
        const matched = item.product.units.find(
          (u) => u.unit === item.unitName,
        );
        if (matched) unitPrice = matched.discountedPrice;
      }
      return sum + unitPrice * item.quantity;
    }, 0),
  );

  const productDiscount = roundMoney(
    items.reduce((sum, item) => {
      if (item.product.isPromo && item.product.promoDiscount) {
        const originalPrice =
          item.unitName && item.product.units
            ? (item.product.units.find((u) => u.unit === item.unitName)
                ?.price ?? item.product.price)
            : item.product.price;
        let discountedPrice =
          item.product.discountedPrice ?? item.product.price;
        if (item.unitName && item.product.units) {
          const matched = item.product.units.find(
            (u) => u.unit === item.unitName,
          );
          if (matched) discountedPrice = matched.discountedPrice;
        }
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!recipientName.trim() || recipientName.length < 2) {
      newErrors.recipientName = t("checkout.validation.recipient_name");
    }
    if (!phone.trim() || phone.length < 8) {
      newErrors.phone = t("checkout.validation.phone");
    }
    if (!country.trim()) {
      newErrors.country = t("checkout.validation.country");
    }
    if (!state.trim()) {
      newErrors.state = t("checkout.validation.state");
    }
    if (!city.trim()) {
      newErrors.city = t("checkout.validation.city");
    }
    if (!isValidUSZipCode(zipCode.trim())) {
      newErrors.zipCode = t("checkout.validation.zip_code");
    }
    if (!address.trim() || address.length < 5) {
      newErrors.address = t("checkout.validation.address");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRemoveVoucher = () => {
    dispatch(clearSelectedVoucher());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector("[data-error]");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const result = await dispatch(
      createOrder({
        shippingAddress: {
          recipientName: recipientName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          zipCode: zipCode.trim(),
          country: country.trim(),
        },
        paymentMethod,
        voucherUsageId: selectedVoucherUsageId ?? undefined,
      }),
    );

    if (createOrder.fulfilled.match(result)) {
      dispatch(clearCart());

      const createdOrder = result.payload;

      if (paymentMethod === "e_wallet") {
        try {
          const sessionResult = await paymentApi.createCheckoutSession({
            orderId: createdOrder.id,
            successUrl: `${window.location.origin}/orders/${createdOrder.id}`,
            cancelUrl: `${window.location.origin}/checkout`,
          });
          if (sessionResult.url) {
            window.location.href = sessionResult.url;
            return;
          }
        } catch {
          toast.error("Failed to start payment. Please try again.");
          navigate(`/orders/${createdOrder.id}`);
          return;
        }
      }
      navigate(`/orders/${createdOrder.id}`);
    } else {
      toast.error((result.payload as string) || t("errors.generic"));
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-16">
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-secondary text-lg">{t("checkout.empty_cart")}</p>
          <Button
            variant="primary"
            onClick={() => navigate("/")}
            className="mt-4"
          >
            {t("checkout.shop_now")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={20} /> <span>{t("checkout.back_to_home")}</span>
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">
          {t("checkout.title")}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                  <Truck size={20} className="text-primary" />
                  {t("checkout.shipping_address")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1.5">
                      {t("checkout.country")}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1" data-error>
                        {errors.country}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1.5">
                      {t("checkout.state")}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">{t("checkout.select_state")}</option>
                      {usStates.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1" data-error>
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1.5">
                      {t("checkout.city")}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={!state}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {state
                          ? t("checkout.select_city")
                          : t("checkout.select_state_first")}
                      </option>
                      {usCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1" data-error>
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      id="zipCode"
                      label={t("checkout.zip_code")}
                      value={zipCode}
                      onChange={setZipCode}
                      required
                      placeholder="12345 or 12345-6789"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1" data-error>
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      id="recipientName"
                      label={t("checkout.recipient_name")}
                      value={recipientName}
                      onChange={setRecipientName}
                      required
                    />
                    {errors.recipientName && (
                      <p className="text-red-500 text-sm mt-1" data-error>
                        {errors.recipientName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      id="phone"
                      label={t("checkout.phone")}
                      value={phone}
                      onChange={setPhone}
                      required
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1" data-error>
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      id="address"
                      label={t("checkout.full_address")}
                      value={address}
                      onChange={setAddress}
                      required
                      placeholder={t("checkout.address_placeholder")}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1" data-error>
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-secondary mb-4">
                  {t("checkout.payment_method")}
                </h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>{t("checkout.bank_transfer")}</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="e_wallet"
                      checked={paymentMethod === "e_wallet"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>{t("checkout.e_wallet")}</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>{t("checkout.cod")}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
                <h2 className="text-lg font-semibold text-secondary mb-4">
                  {t("checkout.order_summary")}
                </h2>

                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => {
                    let unitPrice =
                      item.product.discountedPrice ?? item.product.price;
                    if (item.unitName && item.product.units) {
                      const matched = item.product.units.find(
                        (u) => u.unit === item.unitName,
                      );
                      if (matched) unitPrice = matched.discountedPrice;
                    }
                    return (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-secondary line-clamp-1">
                          {getLocalizedName(item.product)} × {item.quantity}
                        </span>
                        <span className="font-medium text-primary flex-shrink-0 ml-2">
                          {formatCurrency(unitPrice * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {voucherPreview && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <Ticket
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
                        type="button"
                        onClick={handleRemoveVoucher}
                        className="p-1 hover:bg-green-100 rounded transition-colors flex-shrink-0"
                        aria-label={t("checkout.remove_voucher")}
                      >
                        <X size={14} className="text-green-700" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 mb-4 text-sm border-t border-gray-100 pt-3">
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
                    <span className="font-bold text-primary text-xl">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={CheckCircle}
                  disabled={isLoading}
                >
                  {isLoading
                    ? t("checkout.processing")
                    : t("checkout.create_order")}
                </Button>

                {Object.keys(errors).length > 0 && (
                  <p className="text-red-500 text-sm mt-3 text-center">
                    {t("checkout.required_fields")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
