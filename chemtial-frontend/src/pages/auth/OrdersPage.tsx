import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "../../store";
import { fetchOrders, fetchOrderHistory } from "../../store/slices/orderSlice";
import { Order } from "../../store/slices/orderSlice";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Ban,
  Eye,
  X,
  Truck,
  Star,
} from "lucide-react";
import OrderTimeline from "../../components/order/OrderTimeline";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import ReviewModal from "../../components/order/ReviewModal";
import { orderAdminApi, reviewApi } from "../../services/adminApi";
import { formatCurrency } from "../../utils/format";
import { getImageUrl } from "../../utils/image";
import toast from "react-hot-toast";

const OrdersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { orders, orderHistory, isLoading, isHistoryLoading } = useSelector(
    (state: RootState) => state.order,
  );
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null,
  );
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [reviewItem, setReviewItem] = useState<{
    orderItemId: string;
    productId: string;
    productName: string;
  } | null>(null);
  const [reviewedProductIds, setReviewedProductIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const deliveredOrderItemIds = useMemo(() => {
    return orders
      .filter((o) => o.status === "delivered")
      .flatMap((o) => o.items.map((item) => item.id));
  }, [orders]);

  useEffect(() => {
    const loadReviewed = async () => {
      if (deliveredOrderItemIds.length === 0) {
        setReviewedProductIds(new Set());
        return;
      }
      try {
        const reviews = await reviewApi.getMyReviews(deliveredOrderItemIds);
        setReviewedProductIds(new Set(reviews.map((r) => r.productId)));
      } catch {}
    };
    loadReviewed();
  }, [deliveredOrderItemIds]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
      case "paid":
      case "processing":
        return <Clock size={16} className="text-white" />;
      case "shipped":
        return <Package size={16} className="text-white" />;
      case "awaiting_payment":
        return <Truck size={16} className="text-white" />;
      case "delivered":
        return <CheckCircle size={16} className="text-white" />;
      case "cancelled":
        return <XCircle size={16} className="text-white" />;
      default:
        return <Package size={16} className="text-primary" />;
    }
  };

  const getStatusColor = (status: string): string => {
    const map: Record<string, string> = {
      pending: "bg-green-900 text-white",
      paid: "bg-green-900 text-white",
      processing: "bg-green-900 text-white",
      shipped: "bg-green-900 text-white",
      awaiting_payment: "bg-orange-700 text-white",
      delivered: "bg-green-900 text-white",
      cancelled: "bg-red-900 text-white",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  const handleToggleHistory = (orderId: string): void => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }
    setExpandedOrderId(orderId);
    dispatch(fetchOrderHistory(orderId));
  };

  const canCancelOrder = (status: string): boolean =>
    status === "pending" || status === "paid";

  const handleOpenCancel = (orderId: string): void => {
    setCancellingOrderId(orderId);
    setCancelReason("");
  };

  const handleConfirmCancel = async (): Promise<void> => {
    if (!cancellingOrderId) return;
    setIsCancelling(true);
    try {
      await orderAdminApi.cancelMyOrder(
        cancellingOrderId,
        cancelReason || undefined,
      );
      toast.success(t("orders.cancel_success"));
      setCancellingOrderId(null);
      setCancelReason("");
      dispatch(fetchOrders());
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("orders.cancel_failed");
      toast.error(message);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReviewSuccess = (productId: string): void => {
    setReviewedProductIds((prev) => new Set(prev).add(productId));
    dispatch(fetchOrders());
  };

  const formatDate = (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">{t("orders.loading")}</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={20} /> <span>{t("orders.back_to_home")}</span>
      </button>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">
          {t("orders.title")}
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-secondary text-lg">{t("orders.empty")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const isDelivered = order.status === "delivered";

              const uniqueItems = isDelivered
                ? Array.from(
                    new Map(
                      order.items.map((item) => [item.productId, item]),
                    ).values(),
                  )
                : [];

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div
                      className="cursor-pointer hover:opacity-95"
                      onClick={() => handleToggleHistory(order.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                        <div>
                          <h3 className="font-semibold text-secondary">
                            {order.orderNumber}
                          </h3>
                          <p className="text-sm text-secondary/60">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1.5 ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {t(`orders.status.${order.status}`)}
                          </span>
                          {canCancelOrder(order.status) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCancel(order.id);
                              }}
                              className="text-xs px-2 py-1 rounded-lg border bg-red-600 border-red-500 text-white hover:bg-red-300 transition-colors flex items-center gap-1"
                            >
                              <Ban size={12} /> {t("orders.cancel_order")}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-3">
                        {order.items.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-secondary">
                              {item.product.name} × {item.quantity}
                            </span>
                            <span className="font-medium text-primary">
                              {formatCurrency(item.totalPrice)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-secondary/60">
                            +{order.items.length - 2}{" "}
                            {t("orders.items_more_label")}
                          </p>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailOrder(order);
                            }}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            <Eye size={14} /> {t("orders.view_detail")}
                          </button>
                          <div className="flex items-center gap-2 text-sm text-primary">
                            {isExpanded ? (
                              <>
                                <ChevronUp size={16} />{" "}
                                {t("orders.hide_status")}
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} />{" "}
                                {t("orders.show_status")}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-secondary/60">
                            {t("orders.total")}
                          </span>
                          <p className="font-bold text-primary">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {isDelivered && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-semibold text-secondary/70 mb-2 uppercase tracking-wide">
                          {t("orders.rate_products")}
                        </p>
                        <div className="space-y-2">
                          {uniqueItems.map((item) => {
                            const alreadyReviewed = reviewedProductIds.has(
                              item.productId,
                            );
                            return (
                              <div
                                key={item.productId}
                                className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg px-3 py-2"
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <img
                                    src={getImageUrl(item.product.image)}
                                    alt={item.product.name}
                                    className="w-10 h-10 object-cover rounded flex-shrink-0"
                                  />
                                  <span className="text-sm text-secondary truncate">
                                    {item.product.name}
                                  </span>
                                </div>
                                {alreadyReviewed ? (
                                  <span className="text-xs text-green-600 flex items-center gap-1 flex-shrink-0">
                                    <CheckCircle size={12} />{" "}
                                    {t("orders.reviewed")}
                                  </span>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setReviewItem({
                                        orderItemId: item.id,
                                        productId: item.productId,
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
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                      <h4 className="font-medium text-secondary text-sm mb-4">
                        {t("orders.status_history")}
                      </h4>
                      <OrderTimeline
                        history={
                          orderHistory?.orderId === order.id
                            ? orderHistory.history
                            : []
                        }
                        currentStatus={order.status}
                        isLoading={isHistoryLoading}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!cancellingOrderId}
        onClose={() => {
          if (isCancelling) return;
          setCancellingOrderId(null);
          setCancelReason("");
        }}
        onConfirm={handleConfirmCancel}
        title={t("orders.cancel_dialog_title")}
        message={t("orders.cancel_dialog_message")}
        isLoading={isCancelling}
        confirmText={t("orders.cancel_confirm")}
        cancelText={t("orders.cancel_decline")}
        variant="danger"
      />

      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDetailOrder(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-secondary">
                {t("orders.detail_title")}
              </h3>
              <button
                onClick={() => setDetailOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label={t("common.close")}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-secondary/60 mb-1">
                      {t("orders.order_number")}
                    </div>
                    <div className="font-mono text-sm font-medium text-primary">
                      {detailOrder.orderNumber}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 ${getStatusColor(
                      detailOrder.status,
                    )}`}
                  >
                    {getStatusIcon(detailOrder.status)}
                    {t(`orders.status.${detailOrder.status}`)}
                  </span>
                </div>
                <div className="text-xs text-secondary/60 mt-2">
                  {formatDate(detailOrder.createdAt)}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-secondary text-sm mb-2 flex items-center gap-2">
                  <Truck size={16} className="text-primary" />
                  {t("orders.shipping_address")}
                </h4>
                <div className="text-sm text-secondary/70 bg-gray-50 rounded-lg p-3">
                  <div className="font-medium text-secondary">
                    {detailOrder.shippingAddress.recipientName}
                  </div>
                  <div>{detailOrder.shippingAddress.phone}</div>
                  <div>{detailOrder.shippingAddress.address}</div>
                  <div>
                    {detailOrder.shippingAddress.city},{" "}
                    {detailOrder.shippingAddress.state}{" "}
                    {detailOrder.shippingAddress.zipCode}
                  </div>
                  <div>{detailOrder.shippingAddress.country}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-secondary text-sm mb-2">
                  {t("orders.order_items")}
                </h4>
                <div className="space-y-2">
                  {detailOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                    >
                      <img
                        src={getImageUrl(item.product.image)}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/placeholder.png";
                        }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-secondary">
                          {item.product.name}
                        </div>
                        <div className="text-xs text-secondary/60">
                          {item.product.brand} × {item.quantity}
                          {item.unitName && ` (${item.unitName})`}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-primary">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary/70">
                    {t("orders.subtotal")}
                  </span>
                  <span className="text-secondary font-medium">
                    {formatCurrency(detailOrder.subtotal)}
                  </span>
                </div>
                {detailOrder.productDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary/70">
                      {t("orders.product_discount")}
                    </span>
                    <span className="text-green-700 font-medium">
                      -{formatCurrency(detailOrder.productDiscount)}
                    </span>
                  </div>
                )}
                {detailOrder.voucherDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary/70">
                      {t("orders.voucher_discount")}
                      {detailOrder.voucherCode && (
                        <span className="text-xs text-primary ml-1">
                          ({detailOrder.voucherCode})
                        </span>
                      )}
                    </span>
                    <span className="text-green-600 font-medium">
                      -{formatCurrency(detailOrder.voucherDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-secondary/70">
                    {t("orders.shipping_cost")}
                  </span>
                  <span className="text-secondary font-medium">
                    {detailOrder.shippingCost === 0 ? (
                      <span className="text-green-700">{t("orders.free")}</span>
                    ) : (
                      formatCurrency(detailOrder.shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary/70">
                    {t("orders.payment_method")}
                  </span>
                  <span className="text-secondary font-medium capitalize">
                    {detailOrder.paymentMethod.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="font-semibold text-secondary">
                    {t("orders.total")}
                  </span>
                  <span className="font-bold text-primary text-xl">
                    {formatCurrency(detailOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reviewItem && (
        <ReviewModal
          isOpen={!!reviewItem}
          onClose={() => setReviewItem(null)}
          orderItemId={reviewItem.orderItemId}
          productName={reviewItem.productName}
          onSuccess={() => handleReviewSuccess(reviewItem.productId)}
        />
      )}
    </div>
  );
};

export default OrdersPage;
