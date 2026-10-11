import React from "react";
import { useTranslation } from "react-i18next";
import { Percent, Truck, Gift, Clock, Check } from "lucide-react";
import { formatCurrency } from "../../utils/format";

export interface VoucherCardData {
  id: string;
  usageId?: string;
  code: string;
  title: string;
  description: string | null;
  type: string;
  category: string;
  value: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  startDate: string | Date;
  endDate: string | Date;
  isExpired?: boolean;
  isUsed?: boolean;
}

type VoucherCardVariant =
  | "available"
  | "claimed"
  | "used"
  | "expired"
  | "selectable"
  | "selected";

interface VoucherCardProps {
  voucher: VoucherCardData;
  variant?: VoucherCardVariant;
  onAction?: () => void;
  actionLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  variant = "available",
  onAction,
  actionLabel,
  isLoading = false,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const getIcon = (category: string) => {
    switch (category) {
      case "free_shipping":
        return <Truck size={24} />;
      case "new_user":
        return <Gift size={24} />;
      default:
        return <Percent size={24} />;
    }
  };

  const formatValue = (
    type: string,
    value: number,
    category: string,
  ): string => {
    if (category === "free_shipping") return t("voucher_card.free");
    if (type === "percentage") return `${value}%`;
    return formatCurrency(value);
  };

  const formatDate = (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isInactive =
    variant === "used" ||
    variant === "expired" ||
    voucher.isUsed ||
    voucher.isExpired;

  const leftBg = isInactive ? "bg-gray-400" : "bg-primary";
  const cardBorder =
    variant === "selected"
      ? "border-2 border-primary shadow-md"
      : isInactive
        ? "border border-gray-200 opacity-70"
        : "border border-gray-200 hover:shadow-md";

  return (
    <div
      className={`flex rounded-xl overflow-hidden transition-all ${cardBorder}`}
    >
      <div
        className={`w-24 flex flex-col items-center justify-center text-white p-3 ${leftBg} flex-shrink-0`}
      >
        {getIcon(voucher.category)}
        <div className="text-base font-bold mt-1 text-center leading-tight">
          {formatValue(voucher.type, voucher.value, voucher.category)}
        </div>
      </div>

      <div className="flex-1 bg-white p-3 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-secondary text-sm leading-tight">
            {voucher.title}
          </h3>

          {variant === "selected" && (
            <span className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <Check size={12} className="text-white" />
            </span>
          )}
          {variant === "used" && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 whitespace-nowrap">
              {t("voucher_card.used")}
            </span>
          )}
          {variant === "expired" && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 whitespace-nowrap">
              {t("voucher_card.expired")}
            </span>
          )}
          {variant === "claimed" && !voucher.isExpired && !voucher.isUsed && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 whitespace-nowrap">
              {t("voucher_card.active")}
            </span>
          )}
        </div>

        <p className="text-xs font-mono text-primary mt-1 truncate">
          {voucher.code}
        </p>

        {voucher.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {voucher.description}
          </p>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-gray-400">
          {voucher.minPurchase && (
            <span>
              {t("voucher_card.min_purchase", {
                amount: voucher.minPurchase.toLocaleString("id-ID"),
              })}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {t("voucher_card.valid_until", {
              date: formatDate(voucher.endDate),
            })}
          </span>
        </div>

        {onAction && actionLabel && (
          <button
            type="button"
            onClick={onAction}
            disabled={disabled || isLoading}
            className={`mt-3 w-full py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              variant === "selected"
                ? "bg-primary text-white hover:bg-primary-dark"
                : isInactive
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading && (
              <span className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
            )}
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default VoucherCard;
