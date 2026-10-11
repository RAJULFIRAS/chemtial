import React, { useEffect, useState } from "react";
import { downloadApi } from "../../services/adminApi";
import { Smartphone, Apple, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

interface DailyStats {
  date: string;
  playstore: number;
  appstore: number;
  total: number;
}

interface Analytics {
  total: {
    playstore: number;
    appstore: number;
    total: number;
  };
  daily: DailyStats[];
}

const AppTrackerPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState(30);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await downloadApi.getAnalytics(days);
      setAnalytics(data);
    } catch {
      toast.error("Failed to load download data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!analytics) return null;

  const maxTotal = Math.max(...analytics.daily.map((d) => d.total), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Mobile App Download Statistics
          </h1>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-900 rounded-xl flex items-center justify-center">
              <Smartphone size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-secondary/60">Play Store</p>
              <p className="text-2xl font-bold text-primary">
                {analytics.total.playstore.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-900 rounded-xl flex items-center justify-center">
              <Apple size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-secondary/60">App Store</p>
              <p className="text-2xl font-bold text-primary">
                {analytics.total.appstore.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-900 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-secondary/60">Total Visitors</p>
              <p className="text-2xl font-bold text-primary">
                {analytics.total.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-secondary mb-4">
          Visitors per Day (last {days} days)
        </h2>

        <div className="space-y-2">
          {analytics.daily.map((d) => (
            <div key={d.date} className="flex items-center gap-3 text-xs">
              <span className="w-20 text-secondary/60 shrink-0">
                {new Date(d.date).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
              <div className="flex-1 flex items-center gap-1">
                <div
                  className="bg-green-900 h-5 rounded-l"
                  style={{
                    width: `${(d.playstore / maxTotal) * 50}%`,
                    minWidth: d.playstore > 0 ? "4px" : "0",
                  }}
                  title={`Play Store: ${d.playstore}`}
                />
                <div
                  className="bg-green-100 h-5 rounded-r"
                  style={{
                    width: `${(d.appstore / maxTotal) * 50}%`,
                    minWidth: d.appstore > 0 ? "4px" : "0",
                  }}
                  title={`App Store: ${d.appstore}`}
                />
              </div>
              <span className="w-10 text-right text-secondary font-medium">
                {d.total}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-900 rounded" />
            <span className="text-xs text-secondary">Play Store</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 rounded" />
            <span className="text-xs text-secondary">App Store</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppTrackerPage;
