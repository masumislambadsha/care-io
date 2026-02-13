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
  const [dateRange, setDateRange] = useState("30"); // days

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
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600">Platform performance and insights</p>
        </div>

        {/* Date Range Filter */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-slate-900"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="material-icons text-3xl">attach_money</span>
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
              analytics.revenue.growth >= 0 ? "bg-green-500" : "bg-red-500"
            }`}>
              {analytics.revenue.growth >= 0 ? "+" : ""}{analytics.revenue.growth.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">${analytics.revenue.total.toFixed(0)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-blue-600">event_note</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Total Bookings</p>
          <p className="text-3xl font-bold text-slate-900">{analytics.bookings.total}</p>
          <p className="text-xs text-slate-500 mt-1">
            {analytics.bookings.thisMonth} this month
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-green-600">trending_up</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">This Month</p>
          <p className="text-3xl font-bold text-slate-900">
            ${analytics.revenue.thisMonth.toFixed(0)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            vs ${analytics.revenue.lastMonth.toFixed(0)} last month
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bookings by Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Bookings by Status
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.bookings.byStatus).map(([status, count]) => {
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
                    <span className="text-sm font-semibold text-slate-700">
                      {status}
                    </span>
                    <span className="text-sm text-slate-600">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`${colors[status] || "bg-slate-500"} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by Month */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Revenue Trend
          </h3>
          <div className="space-y-3">
            {analytics.revenueByMonth.slice(-6).map((item) => {
              const maxRevenue = Math.max(...analytics.revenueByMonth.map(m => m.revenue));
              const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;

              return (
                <div key={item.month}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-700">
                      {item.month}
                    </span>
                    <span className="text-sm text-slate-600">
                      ${item.revenue.toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
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

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Caregivers */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Top Caregivers
          </h3>
          <div className="space-y-3">
            {analytics.topCaregivers.slice(0, 5).map((caregiver, index) => (
              <div
                key={caregiver.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center font-bold text-teal-600">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{caregiver.name}</p>
                  <p className="text-xs text-slate-600">
                    {caregiver.bookings} bookings • ${caregiver.revenue.toFixed(0)} revenue
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-icons text-yellow-500 text-sm">star</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {caregiver.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Top Services
          </h3>
          <div className="space-y-3">
            {analytics.topServices.slice(0, 5).map((service, index) => (
              <div
                key={service.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{service.name}</p>
                  <p className="text-xs text-slate-600">
                    {service.bookings} bookings • ${service.revenue.toFixed(0)} revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          User Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-green-600">
                {analytics.users.clients}
              </span>
            </div>
            <p className="font-semibold text-slate-900">Clients</p>
            <p className="text-sm text-slate-600">
              {((analytics.users.clients / analytics.users.total) * 100).toFixed(1)}% of total
            </p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">
                {analytics.users.caregivers}
              </span>
            </div>
            <p className="font-semibold text-slate-900">Caregivers</p>
            <p className="text-sm text-slate-600">
              {((analytics.users.caregivers / analytics.users.total) * 100).toFixed(1)}% of total
            </p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-purple-600">
                {analytics.users.total}
              </span>
            </div>
            <p className="font-semibold text-slate-900">Total Users</p>
            <p className="text-sm text-slate-600">
              {analytics.users.newThisMonth} new this month
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
