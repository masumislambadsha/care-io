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
      // Fetch admin stats
      // For now, using mock data
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
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-600">
          Manage your platform and monitor performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="material-icons text-4xl opacity-80">group</span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Users</p>
          <p className="text-4xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="material-icons text-4xl opacity-80">
              medical_services
            </span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Active
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Caregivers</p>
          <p className="text-4xl font-bold">{stats.totalCaregivers}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="material-icons text-4xl opacity-80">
              event_note
            </span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              All Time
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Bookings</p>
          <p className="text-4xl font-bold">{stats.totalBookings}</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="material-icons text-4xl opacity-80">
              attach_money
            </span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Revenue
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Revenue</p>
          <p className="text-4xl font-bold">
            ${(stats.totalRevenue / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-orange-600">schedule</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Active Bookings</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.activeBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-yellow-600">
                pending_actions
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Pending Verifications</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.pendingVerifications}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-blue-600">person</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Clients</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalClients}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-purple-600">star</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Reviews</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalReviews}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/users"
              className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="material-icons text-slate-600 group-hover:text-teal-600">
                  group
                </span>
                <span className="font-semibold text-slate-900 group-hover:text-teal-700">
                  Manage Users
                </span>
              </div>
              <span className="material-icons text-slate-400 group-hover:text-teal-600">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/admin/bookings"
              className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="material-icons text-slate-600 group-hover:text-teal-600">
                  event_note
                </span>
                <span className="font-semibold text-slate-900 group-hover:text-teal-700">
                  Manage Bookings
                </span>
              </div>
              <span className="material-icons text-slate-400 group-hover:text-teal-600">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/admin/verifications"
              className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="material-icons text-slate-600 group-hover:text-teal-600">
                  verified_user
                </span>
                <span className="font-semibold text-slate-900 group-hover:text-teal-700">
                  Caregiver Verifications
                </span>
              </div>
              <span className="material-icons text-slate-400 group-hover:text-teal-600">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/admin/services"
              className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="material-icons text-slate-600 group-hover:text-teal-600">
                  medical_services
                </span>
                <span className="font-semibold text-slate-900 group-hover:text-teal-700">
                  Manage Services
                </span>
              </div>
              <span className="material-icons text-slate-400 group-hover:text-teal-600">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-green-600 text-sm">
                  check_circle
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  New booking completed
                </p>
                <p className="text-xs text-slate-600">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-blue-600 text-sm">
                  person_add
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  New caregiver registered
                </p>
                <p className="text-xs text-slate-600">15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-yellow-600 text-sm">
                  pending
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  Verification pending review
                </p>
                <p className="text-xs text-slate-600">1 hour ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-purple-600 text-sm">
                  star
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  New 5-star review received
                </p>
                <p className="text-xs text-slate-600">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
