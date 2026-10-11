import React, { useEffect, useState } from "react";
import { orderAdminApi } from "../../services/adminApi";
import DataTable from "../../components/admin/DataTable";
import { formatCurrency } from "../../utils/format";
import { getImageUrl } from "../../utils/image";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitName: string | null;
  product: {
    id: string;
    name: string;
    brand: string;
    image: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  totalAmount: number;
  subtotal: number;
  productDiscount: number;
  voucherDiscount: number;
  shippingCost: number;
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
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const ACTIVE_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "awaiting_payment",
];

const STATUS_LABELS: Record<string, string> = {
  pending: "Awaiting Payment",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  awaiting_payment: "Awaiting Payment (COD)",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-orange-600 text-white",
  paid: "bg-blue-600 text-white",
  processing: "bg-green-900 text-white",
  shipped: "bg-green-900 text-white",
  awaiting_payment: "bg-orange-600 text-white",
  delivered: "bg-green-900 text-white",
  cancelled: "bg-red-700 text-white",
};

const getNextStatusOptions = (order: Order): string[] => {
  if (order.paymentMethod === "cod") {
    const codTransitions: Record<string, string[]> = {
      pending: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["awaiting_payment", "cancelled"],
      awaiting_payment: ["delivered"],
    };
    return codTransitions[order.status] || [];
  }

  const nonCodTransitions: Record<string, string[]> = {
    pending: ["paid", "cancelled"],
    paid: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered", "cancelled"],
  };
  return nonCodTransitions[order.status] || [];
};

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingOrder, setUpdatingOrder] = useState<Order | null>(null);
  const [selectedNextStatus, setSelectedNextStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const limit = 10;

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const result = await orderAdminApi.getAll({
        page,
        limit,
        status: statusFilter || undefined,
        search: search || undefined,
      });

      const filtered = statusFilter
        ? result.data
        : result.data.filter((o: Order) => ACTIVE_STATUSES.includes(o.status));

      setOrders(filtered);
      setTotal(result.meta?.total || filtered.length);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, search, statusFilter]);

  const handleOpenUpdate = (order: Order) => {
    setUpdatingOrder(order);
    const options = getNextStatusOptions(order);
    setSelectedNextStatus(options[0] || "");
  };

  const handleUpdateStatus = async () => {
    if (!updatingOrder || !selectedNextStatus) return;
    setIsSubmitting(true);
    try {
      await orderAdminApi.updateStatus(updatingOrder.id, selectedNextStatus);
      toast.success(
        `Order status updated to ${STATUS_LABELS[selectedNextStatus]}`,
      );
      setUpdatingOrder(null);
      setSelectedNextStatus("");
      loadOrders();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update status";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: "orderNumber",
      label: "Order No.",
      render: (o: Order) => (
        <span className="font-mono text-xs font-medium text-primary">
          {o.orderNumber}
        </span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (o: Order) => (
        <div className="text-sm">
          <div className="font-medium text-secondary">
            {o.shippingAddress.recipientName}
          </div>
          <div className="text-xs text-secondary/60">
            {o.shippingAddress.phone}
          </div>
        </div>
      ),
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (o: Order) => (
        <span className="font-medium text-primary">
          {formatCurrency(o.totalAmount)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (o: Order) => (
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            STATUS_COLORS[o.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {STATUS_LABELS[o.status] || o.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (o: Order) => (
        <span className="text-xs text-secondary/70">
          {new Date(o.createdAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (o: Order) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDetailOrder(o)}
            className="p-1.5 hover:bg-blue-700 rounded-lg text-white transition-colors"
            title="View Detail"
          >
            <Eye size={16} />
          </button>
          {getNextStatusOptions(o).length > 0 && (
            <button
              onClick={() => handleOpenUpdate(o)}
              className="px-2 py-1 text-xs bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Update
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
        >
          <option value="">All Active Statuses</option>
          <option value="pending">Awaiting Payment</option>
          <option value="paid">Paid</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="awaiting_payment">Awaiting Payment (COD)</option>
        </select>
      </div>

      <DataTable
        title="Active Orders"
        description="View and confirm orders currently in progress"
        columns={columns}
        data={orders}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        emptyMessage="No active orders"
      />

      {total > limit && (
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-sm text-secondary/70">
            Total: {total} orders
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-secondary">
              {page} / {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {updatingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setUpdatingOrder(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-secondary mb-4">
              Update Order Status
            </h3>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-xs text-secondary/60 mb-1">Order No.</div>
              <div className="font-mono text-sm font-medium text-primary">
                {updatingOrder.orderNumber}
              </div>
              <div className="text-xs text-secondary/60 mt-2 mb-1">
                Customer
              </div>
              <div className="text-sm text-secondary">
                {updatingOrder.shippingAddress.recipientName}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Current Status
              </label>
              <div
                className={`inline-block text-xs px-3 py-1.5 rounded-full font-medium ${
                  STATUS_COLORS[updatingOrder.status] || "bg-gray-100"
                }`}
              >
                {STATUS_LABELS[updatingOrder.status]}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Change To
              </label>
              <select
                value={selectedNextStatus}
                onChange={(e) => setSelectedNextStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              >
                {getNextStatusOptions(updatingOrder).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUpdatingOrder(null)}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={isSubmitting || !selectedNextStatus}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                )}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDetailOrder(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-secondary">Order Detail</h3>
              <button
                onClick={() => setDetailOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
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
                  Shipping Address
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
                    <br />
                    {detailOrder.shippingAddress.country}
                  </div>
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
                        src={getImageUrl(item.product.image)}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
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
                  <span className="text-secondary/70">Subtotal</span>
                  <span className="text-secondary font-medium">
                    {formatCurrency(detailOrder.subtotal)}
                  </span>
                </div>
                {detailOrder.productDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary/70">Product Discount</span>
                    <span className="text-green-600 font-medium">
                      -{formatCurrency(detailOrder.productDiscount)}
                    </span>
                  </div>
                )}
                {detailOrder.voucherDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary/70">Voucher Discount</span>
                    <span className="text-green-600 font-medium">
                      -{formatCurrency(detailOrder.voucherDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-secondary/70">Shipping Cost</span>
                  <span className="text-secondary font-medium">
                    {detailOrder.shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatCurrency(detailOrder.shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary/70">Payment Method</span>
                  <span className="text-secondary font-medium capitalize">
                    {detailOrder.paymentMethod.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="font-semibold text-secondary">Total</span>
                  <span className="font-bold text-primary text-xl">
                    {formatCurrency(detailOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderPage;
