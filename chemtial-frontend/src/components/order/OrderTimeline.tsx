import React from "react";
import { useTranslation } from "react-i18next";
import { Check, X, Clock } from "lucide-react";

export interface OrderHistoryEntry {
  id: string;
  status: string;
  note: string | null;
  changedBy: string | null;
  createdAt: string | Date;
}

interface OrderTimelineProps {
  history: OrderHistoryEntry[];
  currentStatus: string;
  isLoading?: boolean;
}

const formatDateTime = (date: string | Date, locale: string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrderTimeline: React.FC<OrderTimelineProps> = ({
  history,
  currentStatus,
  isLoading = false,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-US" : "id-ID";

  if (isLoading) {
    return (
      <div className="space-y-4 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-6 text-secondary/60 text-sm">
        {t("order_timeline.no_history")}
      </div>
    );
  }

  const isCancelled = currentStatus === "cancelled";

  return (
    <div className="relative">
      {history.map((entry, index) => {
        const isLast = index === history.length - 1;
        const isCancelledEntry = entry.status === "cancelled";
        const isCompleted = !isLast || currentStatus === "delivered";
        const isPending = isLast && !isCompleted && !isCancelledEntry;

        const isAwaitingPayment = entry.status === "awaiting_payment";

        const iconBg = isCancelledEntry
          ? "bg-red-100"
          : isAwaitingPayment
            ? "bg-orange-100"
            : isCompleted
              ? "bg-primary"
              : "bg-gray-200";
        const iconColor = isCancelledEntry
          ? "text-red-600"
          : isAwaitingPayment
            ? "text-orange-600"
            : isCompleted
              ? "text-white"
              : "text-gray-500";
        const lineColor =
          isCompleted || isAwaitingPayment ? "bg-primary" : "bg-gray-200";

        const statusLabel = t(`order_timeline.${entry.status}`);
        const statusDesc = t(`order_timeline.desc_${entry.status}`);

        return (
          <div key={entry.id} className="flex gap-3 relative">
            {!isLast && (
              <div
                className={`absolute left-4 top-8 w-0.5 h-[calc(100%-8px)] ${lineColor}`}
                aria-hidden="true"
              />
            )}

            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${iconBg}`}
            >
              {isCancelledEntry ? (
                <X size={14} className={iconColor} />
              ) : isAwaitingPayment ? (
                <Clock size={14} className={iconColor} />
              ) : isPending ? (
                <Clock size={14} className={iconColor} />
              ) : (
                <Check size={14} className={iconColor} />
              )}
            </div>

            <div className={`flex-1 pb-5 ${isLast ? "pb-0" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <h4
                  className={`font-medium text-sm ${
                    isCancelledEntry
                      ? "text-red-600"
                      : isAwaitingPayment
                        ? "text-orange-600"
                        : isCompleted
                          ? "text-secondary"
                          : "text-gray-500"
                  }`}
                >
                  {statusLabel}
                </h4>
                <span className="text-xs text-secondary/50 whitespace-nowrap flex-shrink-0">
                  {formatDateTime(entry.createdAt, locale)}
                </span>
              </div>
              <p className="text-xs text-secondary/60 mt-0.5">
                {entry.note || statusDesc}
              </p>
            </div>
          </div>
        );
      })}

      {!isCancelled && currentStatus !== "delivered" && (
        <div className="flex gap-3 relative">
          <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0 z-10 bg-white">
            <Clock size={14} className="text-gray-400" />
          </div>
          <div className="flex-1 pt-1">
            <h4 className="font-medium text-sm text-gray-400">
              {t("order_timeline.waiting_next")}
            </h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
