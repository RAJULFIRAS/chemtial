import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Ticket, ArrowLeft, RefreshCw } from "lucide-react";
import { apiClient } from "../services/api";
import { RootState } from "../store";
import VoucherCard, {
  VoucherCardData,
} from "../components/voucher/VoucherCard";
import toast from "react-hot-toast";

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
  usageLimit: number | null;
  usageCount: number;
  perUserLimit: number;
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

type TabType = "available" | "my";
type CategoryFilter = "" | "discount" | "free_shipping" | "new_user";

const MyVouchersPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
    { value: "", label: t("my_vouchers.filter_all") },
    { value: "discount", label: t("my_vouchers.filter_discount") },
    { value: "free_shipping", label: t("my_vouchers.filter_free_shipping") },
    { value: "new_user", label: t("my_vouchers.filter_new_user") },
  ];

  const [activeTab, setActiveTab] = useState<TabType>("available");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("");
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [myVouchers, setMyVouchers] = useState<MyVoucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = { activeNow: "true" };

      const [vouchersRes, myRes] = await Promise.all([
        apiClient.get("/vouchers", { params }),
        apiClient.get("/vouchers/my-vouchers"),
      ]);

      setAvailableVouchers(vouchersRes.data.data);
      setMyVouchers(myRes.data.data);
    } catch (error) {
      console.error("Failed to load vouchers:", error);
      toast.error(t("my_vouchers.load_failed"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    fetchData();
  }, [isAuthenticated, fetchData, navigate]);

  const handleClaim = async (voucherId: string): Promise<void> => {
    setClaimingId(voucherId);
    try {
      await apiClient.post(`/vouchers/${voucherId}/claim`);
      toast.success(t("my_vouchers.claim_success"));

      await fetchData();

      setActiveTab("my");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("my_vouchers.claim_failed");

      if (
        message.toLowerCase().includes("already") ||
        message.includes("409")
      ) {
        toast.error(t("my_vouchers.claim_already"));
        await fetchData();
      } else {
        toast.error(message);
      }
    } finally {
      setClaimingId(null);
    }
  };

  const claimedVoucherIds = useMemo(
    () => new Set(myVouchers.map((v) => v.voucher.id)),
    [myVouchers],
  );

  const filteredAvailableVouchers = useMemo(() => {
    if (!categoryFilter) return availableVouchers;
    return availableVouchers.filter((v) => v.category === categoryFilter);
  }, [availableVouchers, categoryFilter]);

  const filteredMyVouchers = useMemo(() => {
    if (!categoryFilter) return myVouchers;
    return myVouchers.filter((v) => v.voucher.category === categoryFilter);
  }, [myVouchers, categoryFilter]);

  const renderAvailable = (): React.ReactNode => {
    if (filteredAvailableVouchers.length === 0) {
      return (
        <div className="col-span-full text-center py-12 text-secondary">
          <Ticket size={48} className="mx-auto mb-3 text-gray-300" />
          <p>{t("my_vouchers.empty_available")}</p>
        </div>
      );
    }

    return filteredAvailableVouchers.map((voucher) => {
      const isClaimed = claimedVoucherIds.has(voucher.id);
      const data: VoucherCardData = {
        id: voucher.id,
        code: voucher.code,
        title: voucher.title,
        description: voucher.description,
        type: voucher.type,
        category: voucher.category,
        value: voucher.value,
        minPurchase: voucher.minPurchase,
        maxDiscount: voucher.maxDiscount,
        startDate: voucher.startDate,
        endDate: voucher.endDate,
      };

      return (
        <VoucherCard
          key={voucher.id}
          voucher={data}
          variant="available"
          onAction={() => handleClaim(voucher.id)}
          actionLabel={
            isClaimed ? t("my_vouchers.claimed") : t("my_vouchers.claim")
          }
          disabled={isClaimed || claimingId === voucher.id}
          isLoading={claimingId === voucher.id}
        />
      );
    });
  };

  const renderMyVouchers = (): React.ReactNode => {
    if (filteredMyVouchers.length === 0) {
      return (
        <div className="col-span-full text-center py-12 text-secondary">
          <Ticket size={48} className="mx-auto mb-3 text-gray-300" />
          <p>{t("my_vouchers.empty_my")}</p>
        </div>
      );
    }

    return filteredMyVouchers.map((usage): React.ReactNode => {
      const v = usage.voucher;
      const isUsed = usage.status === "used";
      const isExpired = v.isExpired;

      const data: VoucherCardData = {
        id: v.id,
        usageId: usage.usageId,
        code: v.code,
        title: v.title,
        description: v.description,
        type: v.type,
        category: v.category,
        value: v.value,
        minPurchase: v.minPurchase,
        maxDiscount: v.maxDiscount,
        startDate: v.startDate,
        endDate: v.endDate,
        isExpired,
        isUsed,
      };

      const variant: "used" | "expired" | "claimed" = isUsed
        ? "used"
        : isExpired
          ? "expired"
          : "claimed";

      return (
        <VoucherCard key={usage.usageId} voucher={data} variant={variant} />
      );
    });
  };

  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={20} /> <span>{t("my_vouchers.back_to_home")}</span>
      </button>

      <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {t("my_vouchers.title")}
          </h1>
          <p className="text-secondary/60 mt-2">{t("my_vouchers.subtitle")}</p>
        </div>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 self-start"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          {t("my_vouchers.refresh")}
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-100 overflow-x-auto">
        <button
          onClick={() => setActiveTab("available")}
          className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === "available"
              ? "text-primary border-b-2 border-primary"
              : "text-secondary hover:text-primary"
          }`}
        >
          {t("my_vouchers.tab_available")}
        </button>
        <button
          onClick={() => setActiveTab("my")}
          className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
            activeTab === "my"
              ? "text-primary border-b-2 border-primary"
              : "text-secondary hover:text-primary"
          }`}
        >
          {t("my_vouchers.tab_my")}
          {myVouchers.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {myVouchers.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORY_OPTIONS.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-colors ${
              categoryFilter === cat.value
                ? "bg-primary text-white"
                : "bg-gray-100 text-secondary hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === "available" ? renderAvailable() : renderMyVouchers()}
        </div>
      )}

      {activeTab === "my" && filteredMyVouchers.length > 0 && (
        <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <p className="text-xs text-secondary/70 text-center">
            {t("my_vouchers.note")}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyVouchersPage;
