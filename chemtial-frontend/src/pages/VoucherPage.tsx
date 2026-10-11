import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Ticket, Percent, Truck, Gift, Clock } from "lucide-react";
import SlidePanel from "../components/layout/SlidePanel";
import { apiClient } from "../services/api";
import { RootState } from "../store";
import toast from "react-hot-toast";
import { formatCurrency } from "../utils/format";

interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string | null;
  type: string;
  category: string;
  value: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isActiveNow: boolean;
}

interface MyVoucher {
  usageId: string;
  status: string;
  claimedAt: string;
  usedAt: string | null;
  orderId: string | null;
  discountAmount: number | null;
  voucher: {
    id: string;
    code: string;
    title: string;
    description: string | null;
    type: string;
    category: string;
    value: number;
    minPurchase: number | null;
    maxDiscount: number | null;
    startDate: string;
    endDate: string;
    isActive: boolean;
    isExpired: boolean;
  };
}

interface VoucherPageProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "left" | "right";
  width?: string;
}

const VoucherPage: React.FC<VoucherPageProps> = ({
  isOpen,
  onClose,
  position = "left",
  width = "max-w-3xl",
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState<"available" | "my">("available");
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [myVouchers, setMyVouchers] = useState<MyVoucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const fetchData = async () => {
    if (!isOpen) return;
    setIsLoading(true);
    try {
      const params: any = { activeNow: "true" };
      if (categoryFilter) params.category = categoryFilter;

      const vouchersRes = await apiClient.get("/vouchers", { params });
      setAvailableVouchers(vouchersRes.data.data);

      if (isAuthenticated) {
        const myRes = await apiClient.get("/vouchers/my-vouchers");
        setMyVouchers(myRes.data.data);
      }
    } catch (error) {
      console.error("Failed to load vouchers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isOpen, categoryFilter, isAuthenticated]);

  const handleClaim = async (voucherId: string) => {
    if (!isAuthenticated) {
      toast.error(t("voucher.login_required"));
      navigate("/login");
      return;
    }

    setClaimingId(voucherId);
    try {
      await apiClient.post(`/vouchers/${voucherId}/claim`);
      toast.success(t("voucher.claim_success"));

      await fetchData();

      setActiveTab("my");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("voucher.claim_failed");

      if (
        message.toLowerCase().includes("already") ||
        message.includes("409")
      ) {
        toast.error(t("voucher.claim_already"));
        await fetchData();
      } else {
        toast.error(message);
      }
    } finally {
      setClaimingId(null);
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "free_shipping":
        return <Truck size={24} className="text-primary" />;
      case "new_user":
        return <Gift size={24} className="text-primary" />;
      default:
        return <Percent size={24} className="text-primary" />;
    }
  };

  const formatValue = (type: string, value: number, category: string) => {
    if (category === "free_shipping") return t("voucher_card.free");
    if (type === "percentage") return `${value}%`;
    return formatCurrency(value);
  };

  const claimedVoucherIds = new Set(myVouchers.map((v) => v.voucher.id));

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={t("voucher.title")}
      width={width}
      position={position}
    >
      <div className="flex gap-2 mb-4 border-b border-gray-100">
        <button
          onClick={() => setActiveTab("available")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "available"
              ? "text-primary border-b-2 border-primary"
              : "text-secondary hover:text-primary"
          }`}
        >
          {t("voucher.tab_available")}
        </button>
        <button
          onClick={() => setActiveTab("my")}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "my"
              ? "text-primary border-b-2 border-primary"
              : "text-secondary hover:text-primary"
          }`}
        >
          {t("voucher.tab_my")}
          {myVouchers.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {myVouchers.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "available" && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => setCategoryFilter("")}
            className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
              categoryFilter === ""
                ? "bg-primary text-white"
                : "bg-gray-100 text-secondary hover:bg-gray-200"
            }`}
          >
            {t("voucher.filter_all")}
          </button>
          <button
            onClick={() => setCategoryFilter("discount")}
            className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
              categoryFilter === "discount"
                ? "bg-primary text-white"
                : "bg-gray-100 text-secondary hover:bg-gray-200"
            }`}
          >
            {t("voucher.filter_discount")}
          </button>
          <button
            onClick={() => setCategoryFilter("free_shipping")}
            className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
              categoryFilter === "free_shipping"
                ? "bg-primary text-white"
                : "bg-gray-100 text-secondary hover:bg-gray-200"
            }`}
          >
            {t("voucher.filter_free_shipping")}
          </button>
          <button
            onClick={() => setCategoryFilter("new_user")}
            className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
              categoryFilter === "new_user"
                ? "bg-primary text-white"
                : "bg-gray-100 text-secondary hover:bg-gray-200"
            }`}
          >
            {t("voucher.filter_new_user")}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : activeTab === "available" ? (
        <div className="space-y-3">
          {availableVouchers.length === 0 ? (
            <div className="text-center py-12 text-secondary">
              <Ticket size={48} className="mx-auto mb-3 text-gray-300" />
              <p>{t("voucher.empty_available")}</p>
            </div>
          ) : (
            availableVouchers.map((voucher) => {
              const isClaimed = claimedVoucherIds.has(voucher.id);
              return (
                <div
                  key={voucher.id}
                  className="flex rounded-xl overflow-hidden shadow-sm border border-gray-200"
                >
                  <div className="w-24 bg-primary flex flex-col items-center justify-center text-white p-3">
                    {getIcon(voucher.category)}
                    <div className="text-lg font-bold mt-1">
                      {formatValue(
                        voucher.type,
                        voucher.value,
                        voucher.category,
                      )}
                    </div>
                  </div>
                  <div className="flex-1 bg-white p-3">
                    <h3 className="font-semibold text-secondary text-sm">
                      {voucher.title}
                    </h3>
                    <p className="text-xs font-mono text-primary mt-1">
                      {voucher.code}
                    </p>
                    {voucher.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {voucher.description}
                      </p>
                    )}
                    <div className="flex gap-3 mt-2 text-[10px] text-gray-400">
                      {voucher.minPurchase && (
                        <span>
                          {t("voucher_card.min_purchase", {
                            amount: voucher.minPurchase.toLocaleString("id-ID"),
                          })}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(voucher.endDate).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <button
                      onClick={() => handleClaim(voucher.id)}
                      disabled={isClaimed || claimingId === voucher.id}
                      className={`mt-2 w-full py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isClaimed
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary-dark"
                      }`}
                    >
                      {isClaimed
                        ? t("voucher.claimed")
                        : claimingId === voucher.id
                          ? t("voucher.processing")
                          : t("voucher.claim")}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {myVouchers.length === 0 ? (
            <div className="text-center py-12 text-secondary">
              <Ticket size={48} className="mx-auto mb-3 text-gray-300" />
              <p>{t("voucher.empty_my")}</p>
            </div>
          ) : (
            myVouchers.map((usage) => {
              const v = usage.voucher;
              const isUsed = usage.status === "used";
              const isExpired = v.isExpired;
              return (
                <div
                  key={usage.usageId}
                  className={`flex rounded-xl overflow-hidden shadow-sm border ${
                    isUsed || isExpired
                      ? "border-gray-200 opacity-60"
                      : "border-primary/20"
                  }`}
                >
                  <div
                    className={`w-24 flex flex-col items-center justify-center p-3 ${
                      isUsed || isExpired ? "bg-gray-400" : "bg-primary"
                    } text-white`}
                  >
                    {getIcon(v.category)}
                    <div className="text-lg font-bold mt-1">
                      {formatValue(v.type, v.value, v.category)}
                    </div>
                  </div>
                  <div className="flex-1 bg-white p-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-secondary text-sm">
                        {v.title}
                      </h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isUsed
                            ? "bg-gray-100 text-gray-500"
                            : isExpired
                              ? "bg-red-700 text-white"
                              : "bg-green-700 text-white"
                        }`}
                      >
                        {isUsed
                          ? t("voucher.status_used")
                          : isExpired
                            ? t("voucher.status_expired")
                            : t("voucher.status_active")}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-primary mt-1">
                      {v.code}
                    </p>
                    {v.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {v.description}
                      </p>
                    )}
                    {!isUsed && !isExpired && (
                      <p className="text-[10px] text-primary mt-2">
                        {t("voucher.use_in_cart")}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </SlidePanel>
  );
};

export default VoucherPage;
