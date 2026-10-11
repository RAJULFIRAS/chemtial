import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { X, Ticket, AlertCircle } from "lucide-react";
import { AppDispatch, RootState } from "../../store";
import {
  validateVoucher,
  clearSelectedVoucher,
  clearVoucherError,
} from "../../store/slices/cartSlice";
import { apiClient } from "../../services/api";
import VoucherCard, { VoucherCardData } from "./VoucherCard";
import toast from "react-hot-toast";

interface VoucherSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MyVoucher {
  usageId: string;
  status: string;
  claimedAt: string;
  usedAt: string | null;
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

const VoucherSelector: React.FC<VoucherSelectorProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const {
    totalAmount,
    selectedVoucherUsageId,
    isVoucherLoading,
    voucherError,
  } = useSelector((state: RootState) => state.cart);

  const [vouchers, setVouchers] = useState<MyVoucher[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMyVouchers = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/vouchers/my-vouchers", {
          params: { status: "claimed" },
        });
        setVouchers(response.data.data || []);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : t("voucher_selector.invalid");
        console.error("Failed to load vouchers:", error);
        toast.error(message);
        setVouchers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyVouchers();
    dispatch(clearVoucherError());
  }, [isOpen, dispatch, t]);

  if (!isOpen) return null;

  const handleSelect = async (usageId: string) => {
    dispatch(clearVoucherError());
    const result = await dispatch(
      validateVoucher({ voucherUsageId: usageId, orderAmount: totalAmount }),
    );

    if (validateVoucher.fulfilled.match(result)) {
      toast.success(t("voucher_selector.apply_success"));
      onClose();
    } else {
      toast.error((result.payload as string) || t("voucher_selector.invalid"));
    }
  };

  const handleRemove = () => {
    dispatch(clearSelectedVoucher());
    toast.success(t("voucher_selector.remove_success"));
    onClose();
  };

  const availableVouchers = vouchers.filter(
    (v) => v.status === "claimed" && !v.voucher.isExpired && v.voucher.isActive,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Ticket size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-secondary">
              {t("voucher_selector.title")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={t("common.close")}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {selectedVoucherUsageId && (
            <button
              onClick={handleRemove}
              className="w-full mb-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              {t("voucher_selector.remove_selected")}
            </button>
          )}

          {voucherError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle
                size={16}
                className="text-red-500 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-red-600">{voucherError}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          ) : availableVouchers.length === 0 ? (
            <div className="text-center py-12">
              <Ticket size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-secondary text-sm">
                {t("voucher_selector.empty")}
              </p>
              <p className="text-secondary/60 text-xs mt-1">
                {t("voucher_selector.empty_hint")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableVouchers.map((v) => {
                const isSelected = selectedVoucherUsageId === v.usageId;
                const data: VoucherCardData = {
                  id: v.voucher.id,
                  usageId: v.usageId,
                  code: v.voucher.code,
                  title: v.voucher.title,
                  description: v.voucher.description,
                  type: v.voucher.type,
                  category: v.voucher.category,
                  value: v.voucher.value,
                  minPurchase: v.voucher.minPurchase,
                  maxDiscount: v.voucher.maxDiscount,
                  startDate: v.voucher.startDate,
                  endDate: v.voucher.endDate,
                };
                return (
                  <VoucherCard
                    key={v.usageId}
                    voucher={data}
                    variant={isSelected ? "selected" : "selectable"}
                    onAction={() => handleSelect(v.usageId)}
                    actionLabel={
                      isSelected
                        ? t("voucher_selector.selected")
                        : t("voucher_selector.use")
                    }
                    isLoading={isVoucherLoading}
                    disabled={isVoucherLoading}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex-shrink-0">
          <p className="text-xs text-secondary/60 text-center">
            {t("voucher_selector.note")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoucherSelector;
