import React, { useEffect, useState } from "react";
import { orderAdminApi } from "../../services/adminApi";
import { DollarSign, ShoppingCart, TrendingUp, Clock } from "lucide-react";
import { formatCurrency } from "../../utils/format";
import toast from "react-hot-toast";

type RevenueRange =
  | "day"
  | "week"
  | "month"
  | "3months"
  | "6months"
  | "12months";

interface MonthlyRevenue {
  month: string;
  revenue: number;
  orderCount: number;
}

interface RevenueReport {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    pendingRevenue: number;
    paidRevenue: number;
    completedRevenue: number;
  };
  monthly: MonthlyRevenue[];
  byStatus: Record<string, { count: number; totalAmount: number }>;
  range: RevenueRange;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Awaiting Payment",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  awaiting_payment: "Awaiting Payment (COD)",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const RANGE_OPTIONS: { value: RevenueRange; label: string }[] = [
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "3months", label: "3 Months" },
  { value: "6months", label: "6 Months" },
  { value: "12months", label: "12 Months" },
];

const AccountingPage: React.FC = () => {
  const [report, setReport] = useState<RevenueReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState<RevenueRange>("12months");

  const loadReport = async (selectedRange: RevenueRange) => {
    setIsLoading(true);
    try {
      const data = await orderAdminApi.getRevenueReport(selectedRange);
      setReport(data);
    } catch {
      toast.error("Failed to load revenue report");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport(range);
  }, [range]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!report) return null;

  const maxRevenue = Math.max(...report.monthly.map((m) => m.revenue), 1);

  const chartTitle =
    range === "day"
      ? "Revenue Today"
      : range === "week"
        ? "Revenue This Week"
        : range === "month"
          ? "Revenue This Month"
          : "Revenue per Month";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Order Revenue Report
          </h1>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as RevenueRange)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
        >
          {RANGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-900 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-white" />
            </div>
          </div>
          <p className="text-sm text-secondary/60">Total Revenue</p>
          <p className="text-xl font-bold text-primary mt-1">
            {formatCurrency(report.summary.totalRevenue)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-900 rounded-xl flex items-center justify-center">
              <ShoppingCart size={24} className="text-white" />
            </div>
          </div>
          <p className="text-sm text-secondary/60">Total Orders</p>
          <p className="text-xl font-bold text-primary mt-1">
            {report.summary.totalOrders.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-900 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
          <p className="text-sm text-secondary/60">Average Order Value</p>
          <p className="text-xl font-bold text-primary mt-1">
            {formatCurrency(report.summary.averageOrderValue)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-900 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-white" />
            </div>
          </div>
          <p className="text-sm text-secondary/60">Pending Revenue</p>
          <p className="text-xl font-bold text-primary mt-1">
            {formatCurrency(report.summary.pendingRevenue)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-secondary mb-4">
          {chartTitle}
        </h2>

        {report.monthly.length === 0 ? (
          <div className="text-center py-8 text-secondary/60">
            No data available for this period
          </div>
        ) : (
          <div className="space-y-3">
            {report.monthly.map((m) => {
              const monthDate = new Date(`${m.month}-01`);
              const label = monthDate.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              });
              const widthPct = (m.revenue / maxRevenue) * 100;

              return (
                <div key={m.month} className="flex items-center gap-3 text-sm">
                  <span className="w-24 text-secondary/70 shrink-0 text-xs">
                    {label}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-lg h-7 relative overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-lg transition-all"
                      style={{ width: `${widthPct}%` }}
                    />
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white mix-blend-difference">
                      {m.orderCount} order{m.orderCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <span className="w-32 text-right text-secondary font-medium text-xs">
                    {formatCurrency(m.revenue)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-secondary mb-4">
          Breakdown by Status
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-secondary uppercase">
                  Order Count
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-secondary uppercase">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(report.byStatus).map(([status, data]) => (
                <tr key={status}>
                  <td className="px-4 py-3 text-sm text-secondary">
                    {STATUS_LABELS[status] || status}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-secondary">
                    {data.count}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-primary">
                    {formatCurrency(data.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountingPage;
