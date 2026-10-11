import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Phone, CheckCircle, Eye, RefreshCw } from "lucide-react";
import { orderAdminApi } from "../../services/adminApi";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { formatCurrency } from "../../utils/format";
import { getImageUrl } from "../../utils/image";

interface CodOrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface CodOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: {
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: CodOrderItem[];
  createdAt: string;
  shippedAt: string | null;
}

const CodPage: React.FC = () => {
  const [orders, setOrders] = useState<CodOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingOrder, setConfirmingOrder] = useState<CodOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailOrder, setDetailOrder] = useState<CodOrder | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await orderAdminApi.getCodPending();
      setOrders(response);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load COD orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleConfirm = async () => {
    if (!confirmingOrder) return;
    setIsSubmitting(true);
    try {
      await orderAdminApi.confirmCod(confirmingOrder.id);
      toast.success(`COD ${confirmingOrder.orderNumber} confirmed`);
      setConfirmingOrder(null);
      loadOrders();
    } catch (error: any) {
      toast.error(error?.message || "Failed to confirm COD");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallCustomer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const getStageLabel = () => ({
    label: "Ready for Delivery",
    cls: "bg-orange-100 text-orange-700",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">COD Orders</h1>
          <p className="text-secondary/60 mt-1">
            Confirm COD payments that have been delivered
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <CheckCircle
            size={48}
            className="mx-auto mb-3 text-green-500 opacity-50"
          />
          <p className="text-secondary">No COD orders awaiting confirmation</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {orders.map((order) => {
            const stage = getStageLabel();
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 bg-orange-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-xs text-primary font-medium">
                        {order.orderNumber}
                      </div>
                      <div className="text-xs text-secondary/60 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-secondary/60">
                        Amount Due
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <span
                        className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${stage.cls}`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-xs text-secondary/60 mb-1">
                      Recipient
                    </div>
                    <div className="text-sm font-medium text-secondary">
                      {order.shippingAddress.recipientName}
                    </div>
                    <div className="text-xs text-secondary/70 mt-0.5">
                      {order.shippingAddress.phone}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-secondary/60 mb-1">
                      Address
                    </div>
                    <div className="text-xs text-secondary/80">
                      {order.shippingAddress.address}
                      <br />
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                      <br />
                      {order.shippingAddress.country}
                    </div>
                  </div>

                  <div className="text-xs text-secondary/60">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""} · Total{" "}
                    {formatCurrency(order.totalAmount)}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() =>
                        handleCallCustomer(order.shippingAddress.phone)
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Phone size={14} />
                      Call
                    </button>
                    <button
                      onClick={() => setDetailOrder(order)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye size={14} />
                      Detail
                    </button>
                    <button
                      onClick={() => setConfirmingOrder(order)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <CheckCircle size={14} />
                      Confirm Receipt
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmingOrder}
        onClose={() => setConfirmingOrder(null)}
        onConfirm={handleConfirm}
        title="Confirm COD Received"
        message={`Are you sure you have received ${formatCurrency(
          confirmingOrder?.totalAmount || 0,
        )} from ${confirmingOrder?.shippingAddress.recipientName}? The order will be marked as completed.`}
        isLoading={isSubmitting}
        confirmText="Yes, Confirm"
        cancelText="Cancel"
        variant="info"
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
                COD Order Detail
              </h3>
              <button
                onClick={() => setDetailOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-secondary/60 mb-1">Order No.</div>
                <div className="font-mono text-sm font-medium text-primary">
                  {detailOrder.orderNumber}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-secondary text-sm mb-2">
                  Order Items
                </h4>
                <div className="space-y-2">
                  {detailOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                    >
                      <img
                        src={getImageUrl(item.productImage)}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-secondary">
                          {item.productName}
                        </div>
                        <div className="text-xs text-secondary/60">
                          {item.quantity} × {formatCurrency(item.unitPrice)}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-primary">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-secondary">
                    Amount Due
                  </span>
                  <span className="font-bold text-primary text-xl">
                    {formatCurrency(detailOrder.totalAmount)}
                  </span>
                </div>
                <div className="text-xs text-secondary/60 mt-2 text-center">
                  Collect cash in the amount above from the customer.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CodPage;
