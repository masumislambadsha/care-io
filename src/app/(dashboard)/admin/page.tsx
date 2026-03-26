"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCaregivers: 0,
    totalClients: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0,
    pendingVerifications: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
      
      
      setStats({
        totalUsers: 1250,
        totalCaregivers: 450,
        totalClients: 800,
        totalBookings: 3420,
        totalRevenue: 125000,
        activeBookings: 89,
        pendingVerifications: 12,
        totalReviews: 2150,
      });
    }
  }, [status, router, session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      
      <div className="mb-4 sm:mb-8">
        <h1 className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Manage your platform and monitor performance
        </p>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 mb-4 sm:mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-3 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <span className="material-icons text-2xl sm:text-4xl opacity-80">
              group
            </span>
            <span className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-xs sm:text-sm opacity-90 mb-1">Total Users</p>
          <p className="text-2xl sm:text-4xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl shadow-lg p-3 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <span className="material-icons text-2xl sm:text-4xl opacity-80">
              medical_services
            </span>
            <span className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full">
              Active
            </span>
          </div>
          <p className="text-xs sm:text-sm opacity-90 mb-1">Caregivers</p>
          <p className="text-2xl sm:text-4xl font-bold">
            {stats.totalCaregivers}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg p-3 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <span className="material-icons text-2xl sm:text-4xl opacity-80">
              event_note
            </span>
            <span className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full">
              All Time
            </span>
          </div>
          <p className="text-xs sm:text-sm opacity-90 mb-1">Total Bookings</p>
          <p className="text-2xl sm:text-4xl font-bold">
            {stats.totalBookings}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-3 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <span className="material-icons text-2xl sm:text-4xl opacity-80">
              attach_money
            </span>
            <span className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full">
              Revenue
            </span>
          </div>
          <p className="text-xs sm:text-sm opacity-90 mb-1">Total Revenue</p>
          <p className="text-2xl sm:text-4xl font-bold">
            ${(stats.totalRevenue / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 mb-4 sm:mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <span className="material-icons text-base sm:text-2xl text-orange-600 dark:text-orange-400">
                schedule
              </span>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Active Bookings
              </p>
              <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                {stats.activeBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <span className="material-icons text-base sm:text-2xl text-yellow-600 dark:text-yellow-400">
                pending_actions
              </span>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Pending Verifications
              </p>
              <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                {stats.pendingVerifications}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <span className="material-icons text-base sm:text-2xl text-blue-600 dark:text-blue-400">
                person
              </span>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Clients
              </p>
              <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalClients}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <span className="material-icons text-base sm:text-2xl text-purple-600 dark:text-purple-400">
                star
              </span>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Total Reviews
              </p>
              <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalReviews}
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/users"
              className="flex items-center justify-between p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-teal-600 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="material-icons text-slate-600 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                  group
                </span>
                <span className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400">
                  Manage Users
                </span>
              </div>
              <span className="material-icons text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/admin/bookings"
              className="flex items-center justify-between p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-teal-600 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="material-icons text-slate-600 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                  event_note
                </span>
                <span className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400">
                  Manage Bookings
                </span>
              </div>
              <span className="material-icons text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/admin/verifications"
              className="flex items-center justify-between p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-teal-600 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="material-icons text-slate-600 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                  verified_user
                </span>
                <span className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400">
                  Caregiver Verifications
                </span>
              </div>
              <span className="material-icons text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/admin/services"
              className="flex items-center justify-between p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-teal-600 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="material-icons text-slate-600 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                  medical_services
                </span>
                <span className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400">
                  Manage Services
                </span>
              </div>
              <span className="material-icons text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-green-600 dark:text-green-400 text-sm">
                  check_circle
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  New booking completed
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  2 minutes ago
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-blue-600 dark:text-blue-400 text-sm">
                  person_add
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  New caregiver registered
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  15 minutes ago
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-yellow-600 dark:text-yellow-400 text-sm">
                  pending
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Verification pending review
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  1 hour ago
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-purple-600 dark:text-purple-400 text-sm">
                  star
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  New 5-star review received
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  3 hours ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
