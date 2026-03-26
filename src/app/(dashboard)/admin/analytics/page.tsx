"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

type AnalyticsData = {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  bookings: {
    total: number;
    thisMonth: number;
    byStatus: Record<string, number>;
    byService: Record<string, number>;
  };
  users: {
    total: number;
    clients: number;
    caregivers: number;
    newThisMonth: number;
  };
  topCaregivers: Array<{
    id: string;
    name: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
  topServices: Array<{
    id: string;
    name: string;
    bookings: number;
    revenue: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
};

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dateRange, setDateRange] = useState("30"); 

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [status, router, session]);

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["admin-analytics", dateRange],
    queryFn: async () => {
      const response = await fetch(`/api/admin/analytics?days=${dateRange}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    enabled: status === "authenticated" && session?.user?.role === "ADMIN",
  });

  const analytics: AnalyticsData | null = analyticsData?.analytics || null;

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">No analytics data available</p>
      </div>
    );
  }

  return (
    <>
      
      <div className="mb-4 sm:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Platform performance and insights
          </p>
        </div>

        
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 mb-4 sm:mb-8">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-3 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="material-icons text-xl sm:text-3xl">
              attach_money
            </span>
            <span
              className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-full ${
                analytics.revenue.growth >= 0 ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {analytics.revenue.growth >= 0 ? "+" : ""}
              {analytics.revenue.growth.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs sm:text-sm opacity-90 mb-1">Total Revenue</p>
          <p className="text-xl sm:text-3xl font-bold">
            ${analytics.revenue.total.toFixed(0)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-base sm:text-xl text-blue-600">
                event_note
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
            Total Bookings
          </p>
          <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {analytics.bookings.total}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {analytics.bookings.thisMonth} this month
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-base sm:text-xl text-green-600">
                trending_up
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">This Month</p>
          <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            ${analytics.revenue.thisMonth.toFixed(0)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            vs ${analytics.revenue.lastMonth.toFixed(0)} last month
          </p>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
            Bookings by Status
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.bookings.byStatus).map(
              ([status, count]) => {
                const total = analytics.bookings.total;
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const colors: Record<string, string> = {
                  CONFIRMED: "bg-blue-500",
                  ONGOING: "bg-purple-500",
                  COMPLETED: "bg-green-500",
                  CANCELLED: "bg-red-500",
                };

                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {status}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`${colors[status] || "bg-slate-500"} h-2 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>

        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
            Revenue Trend
          </h3>
          <div className="space-y-3">
            {analytics.revenueByMonth.slice(-6).map((item) => {
              const maxRevenue = Math.max(
                ...analytics.revenueByMonth.map((m) => m.revenue),
              );
              const percentage =
                maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;

              return (
                <div key={item.month}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {item.month}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      ${item.revenue.toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
            Top Caregivers
          </h3>
          <div className="space-y-3">
            {analytics.topCaregivers.slice(0, 5).map((caregiver, index) => (
              <div
                key={caregiver.id}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-100 rounded-full flex items-center justify-center font-bold text-teal-600 text-xs sm:text-sm shrink-0">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {caregiver.name}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {caregiver.bookings} bookings • $
                    {caregiver.revenue.toFixed(0)} revenue
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="material-icons text-yellow-500 text-sm">
                    star
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                    {caregiver.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
          <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
            Top Services
          </h3>
          <div className="space-y-3">
            {analytics.topServices.slice(0, 5).map((service, index) => (
              <div
                key={service.id}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xs sm:text-sm shrink-0">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {service.name}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {service.bookings} bookings • ${service.revenue.toFixed(0)}{" "}
                    revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
        <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
          User Distribution
        </h3>
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-2 sm:mb-3 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xl sm:text-3xl font-bold text-green-600">
                {analytics.users.clients}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              Clients
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {(
                (analytics.users.clients / analytics.users.total) *
                100
              ).toFixed(1)}
              % of total
            </p>
          </div>{" "}
          <div className="text-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-2 sm:mb-3 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xl sm:text-3xl font-bold text-blue-600">
                {analytics.users.caregivers}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              Caregivers
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {(
                (analytics.users.caregivers / analytics.users.total) *
                100
              ).toFixed(1)}
              % of total
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-2 sm:mb-3 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-xl sm:text-3xl font-bold text-purple-600">
                {analytics.users.total}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              Total Users
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {analytics.users.newThisMonth} new this month
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
