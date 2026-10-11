import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "../../store";
import {
  fetchOrderById,
  fetchOrderHistory,
  clearOrder,
} from "../../store/slices/orderSlice";
import { CheckCircle, Star, Truck, Clock, Banknote } from "lucide-react";
import Button from "../../components/common/Button";
import OrderTimeline from "../../components/order/OrderTimeline";
import ReviewModal from "../../components/order/ReviewModal";
import { reviewApi } from "../../services/adminApi";
import { formatCurrency } from "../../utils/format";

const BANK_NAME = import.meta.env.VITE_BANK_NAME || "Bank of America";
const BANK_ACCOUNT_NAME =
  import.meta.env.VITE_BANK_ACCOUNT_NAME || "Chemtial LLC";
const BANK_ACCOUNT_NUMBER =
  import.meta.env.VITE_BANK_ACCOUNT_NUMBER || "1234567890";
const BANK_ROUTING_NUMBER =
  import.meta.env.VITE_BANK_ROUTING_NUMBER || "026009593";

const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentOrder, orderHistory, isLoading, isHistoryLoading } =
    useSelector((state: RootState) => state.order);

  const [reviewItem, setReviewItem] = useState<{
    orderItemId: string;
    productName: string;
  } | null>(null);
  const [reviewedItemIds, setReviewedItemIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
      dispatch(fetchOrderHistory(id));
    }
    return () => {
      dispatch(clearOrder());
    };
  }, [dispatch, id]);

  useEffect(() => {
    const loadReviewed = async () => {
      if (!currentOrder || currentOrder.status !== "delivered") {
        setReviewedItemIds(new Set());
        return;
      }
      try {
        const itemIds = currentOrder.items.map((i) => i.id);
        const reviews = await reviewApi.getMyReviews(itemIds);
        setReviewedItemIds(new Set(reviews.map((r) => r.orderItemId ?? "")));
      } catch {}
    };
    loadReviewed();
  }, [currentOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">
          {t("order_confirmation.loading")}
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary text-xl">
            {t("order_confirmation.not_found")}
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/")}
            className="mt-4"
          >
            {t("order_confirmation.back_to_home")}
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const showBankReceipt =
    currentOrder.paymentMethod === "bank_transfer" &&
    currentOrder.status === "pending";

  const showCodReceipt =
    currentOrder.paymentMethod === "cod" && currentOrder.status === "shipped";

  const showCodPending =
    currentOrder.paymentMethod === "cod" &&
    currentOrder.status === "awaiting_payment";

  return (
    <div className="container-custom py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary">
            {t("order_confirmation.success_title")}
          </h1>
          <p className="text-secondary mt-2">
            {t("order_confirmation.success_subtitle")}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
            <div>
              <h3 className="font-semibold text-secondary">
                {currentOrder.orderNumber}
              </h3>
              <p className="text-sm text-secondary/60">
                {formatDate(currentOrder.createdAt)}
              </p>
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full self-start">
              {t(`orders.status.${currentOrder.status}`)}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            {currentOrder.items.map((item) => {
              const alreadyReviewed = reviewedItemIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center gap-3 text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-secondary truncate">
                      {item.product.name} × {item.quantity}
                      {item.unitName && ` (${item.unitName})`}
                    </p>
                    <p className="font-medium text-primary">
                      {formatCurrency(item.totalPrice)}
                    </p>
                  </div>
                  {currentOrder.status === "delivered" && (
                    <>
                      {alreadyReviewed ? (
                        <span className="flex-shrink-0 text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle size={12} />
                          {t("orders.reviewed")}
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReviewItem({
                              orderItemId: item.id,
                              productName: item.product.name,
                            });
                          }}
                          className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 transition-colors flex items-center gap-1"
                        >
                          <Star
                            size={12}
                            className="fill-yellow-500 text-yellow-500"
                          />
                          {t("orders.give_rating")}
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary/70">{t("orders.subtotal")}</span>
              <span className="text-secondary font-medium">
                {formatCurrency(currentOrder.subtotal)}
              </span>
            </div>
            {currentOrder.productDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-secondary/70">
                  {t("orders.product_discount")}
                </span>
                <span className="text-green-600 font-medium">
                  -{formatCurrency(currentOrder.productDiscount)}
                </span>
              </div>
            )}
            {currentOrder.voucherDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-secondary/70">
                  {t("orders.voucher_discount")}
                  {currentOrder.voucherCode && (
                    <span className="text-xs text-primary ml-1">
                      ({currentOrder.voucherCode})
                    </span>
                  )}
                </span>
                <span className="text-green-600 font-medium">
                  -{formatCurrency(currentOrder.voucherDiscount)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-secondary/70">
                {t("orders.shipping_cost")}
              </span>
              <span className="text-secondary font-medium">
                {currentOrder.shippingCost === 0 ? (
                  <span className="text-green-600">{t("orders.free")}</span>
                ) : (
                  formatCurrency(currentOrder.shippingCost)
                )}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="font-semibold text-secondary">
                {t("orders.total")}
              </span>
              <span className="font-bold text-primary text-xl">
                {formatCurrency(currentOrder.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {showBankReceipt && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Banknote size={18} />
              {t("order_confirmation.bank_transfer_instructions")}
            </h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                <strong>{t("order_confirmation.bank_name")}:</strong>{" "}
                {BANK_NAME}
              </p>
              <p>
                <strong>{t("order_confirmation.account_name")}:</strong>{" "}
                {BANK_ACCOUNT_NAME}
              </p>
              <p>
                <strong>{t("order_confirmation.account_number")}:</strong>{" "}
                {BANK_ACCOUNT_NUMBER}
              </p>
              <p>
                <strong>{t("order_confirmation.routing_number")}:</strong>{" "}
                {BANK_ROUTING_NUMBER}
              </p>
              <p>
                <strong>{t("order_confirmation.amount")}:</strong>{" "}
                {formatCurrency(currentOrder.totalAmount)}
              </p>
              <p>
                <strong>{t("order_confirmation.reference")}:</strong>{" "}
                {currentOrder.orderNumber}
              </p>
            </div>
            <p className="text-xs text-blue-700 mt-3">
              {t("order_confirmation.bank_transfer_note")}
            </p>
          </div>
        )}

        {showCodReceipt && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-orange-900 mb-3 flex items-center gap-2">
              <Truck size={20} />
              {t("order_confirmation.cod_receipt_title")}
            </h4>

            <div className="bg-white rounded-lg p-3 mb-3 border border-orange-200">
              <div className="text-xs text-orange-700 uppercase tracking-wide mb-1">
                {t("order_confirmation.order_number")}
              </div>
              <div className="font-mono text-sm font-bold text-secondary mb-3">
                {currentOrder.orderNumber}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-secondary/60 mb-0.5">
                    {t("order_confirmation.recipient")}
                  </div>
                  <div className="font-medium text-secondary">
                    {currentOrder.shippingAddress.recipientName}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-secondary/60 mb-0.5">
                    {t("order_confirmation.phone")}
                  </div>
                  <div className="font-medium text-secondary">
                    {currentOrder.shippingAddress.phone}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs text-secondary/60 mb-0.5">
                    {t("order_confirmation.address")}
                  </div>
                  <div className="font-medium text-secondary">
                    {currentOrder.shippingAddress.address},{" "}
                    {currentOrder.shippingAddress.city},{" "}
                    {currentOrder.shippingAddress.state}{" "}
                    {currentOrder.shippingAddress.zipCode}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-orange-200 flex items-center justify-between">
                <span className="text-sm font-medium text-orange-900">
                  {t("order_confirmation.amount_due")}
                </span>
                <span className="text-xl font-bold text-orange-900">
                  {formatCurrency(currentOrder.totalAmount)}
                </span>
              </div>
            </div>

            <p className="text-xs text-orange-800">
              {t("order_confirmation.cod_receipt_note")}
            </p>
          </div>
        )}

        {showCodPending && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
              <Clock size={18} />
              {t("order_confirmation.cod_pending_title")}
            </h4>
            <p className="text-sm text-yellow-800">
              {t("order_confirmation.cod_pending_note", {
                amount: formatCurrency(currentOrder.totalAmount),
              })}
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-semibold text-secondary mb-4">
            {t("order_confirmation.order_status")}
          </h3>
          <OrderTimeline
            history={orderHistory?.history ?? []}
            currentStatus={orderHistory?.currentStatus ?? currentOrder.status}
            isLoading={isHistoryLoading}
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => navigate("/orders")}
        >
          {t("order_confirmation.view_all_orders")}
        </Button>
      </div>

      {reviewItem && (
        <ReviewModal
          isOpen={!!reviewItem}
          onClose={() => setReviewItem(null)}
          orderItemId={reviewItem.orderItemId}
          productName={reviewItem.productName}
          onSuccess={() => {
            setReviewedItemIds((prev) =>
              new Set(prev).add(reviewItem.orderItemId),
            );
            if (id) dispatch(fetchOrderById(id));
          }}
        />
      )}
    </div>
  );
};

export default OrderConfirmationPage;
