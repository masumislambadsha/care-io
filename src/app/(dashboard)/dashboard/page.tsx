"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      const fetchStats = async () => {
        try {
          setIsLoadingStats(true);
          const isCaregiver = session?.user?.role === "CAREGIVER";
          const endpoint = isCaregiver
            ? "/api/bookings/assigned-jobs"
            : "/api/bookings/my-bookings";
          const response = await fetch(endpoint);
          const data = await response.json();
          if (response.ok) {
            const bookings = isCaregiver
              ? data.jobs || []
              : data.bookings || [];
            const totalAmount = bookings.reduce(
              (sum: number, b: { total_amount: string | number }) =>
                sum + parseFloat(String(b.total_amount || 0)),
              0,
            );
            setStats({
              totalBookings: bookings.length,
              activeBookings: bookings.filter(
                (b: { status: string }) =>
                  b.status === "CONFIRMED" || b.status === "ONGOING",
              ).length,
              completedBookings: bookings.filter(
                (b: { status: string }) => b.status === "COMPLETED",
              ).length,
              totalSpent: isCaregiver ? totalAmount * 0.85 : totalAmount,
            });
            setRecentBookings(bookings.slice(0, 3));
          }
        } catch (error) {
          console.error("Error fetching stats:", error);
        } finally {
          setIsLoadingStats(false);
        }
      };
      fetchStats();
    }
  }, [status, router]);

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

  const isCaregiver = session?.user?.role === "CAREGIVER";

  const statCards = [
    {
      icon: "event_note",
      label: "Total Bookings",
      value: stats.totalBookings,
      badge: "Total",
      color: "teal",
    },
    {
      icon: "schedule",
      label: "Active Bookings",
      value: stats.activeBookings,
      badge: "Active",
      color: "blue",
    },
    {
      icon: "check_circle",
      label: "Completed",
      value: stats.completedBookings,
      badge: "Done",
      color: "green",
    },
    {
      icon: isCaregiver ? "payments" : "account_balance_wallet",
      label: isCaregiver ? "Total Earnings" : "Total Spent",
      value: `$${stats.totalSpent.toFixed(2)}`,
      badge: isCaregiver ? "Earned" : "Spent",
      color: "purple",
    },
  ];

  const colorMap: Record<string, string> = {
    teal: "bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 badge:text-teal-600 badge:bg-teal-50",
    blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    purple:
      "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  };

  return (
    <>
      <div className="mb-4 sm:mb-8">
        <h1 className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {isCaregiver
            ? "Manage your schedule and bookings"
            : "Track your bookings and find care"}
        </p>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 mb-4 sm:mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div
                className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center bg-${card.color}-100 dark:bg-${card.color}-900/20`}
              >
                <span
                  className={`material-icons text-base sm:text-2xl text-${card.color}-600 dark:text-${card.color}-400`}
                >
                  {card.icon}
                </span>
              </div>
              <span
                className={`text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-${card.color}-600 bg-${card.color}-50`}
              >
                {card.badge}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mb-0.5">
              {isLoadingStats ? (
                <span className="inline-block w-10 h-6 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></span>
              ) : (
                card.value
              )}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-6">
              <h2 className="text-sm sm:text-xl font-bold text-slate-900 dark:text-white">
                Recent Bookings
              </h2>
              <Link
                href="/my-bookings"
                className="text-xs sm:text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                View All →
              </Link>
            </div>
            {isLoadingStats ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 animate-pulse"
                  >
                    <div className="h-3 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentBookings.length > 0 ? (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:border-teal-600 transition-all"
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="min-w-0 flex-1 mr-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {booking.service_name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {booking.booking_number
                            ? `#${booking.booking_number}`
                            : `#${booking.id.slice(0, 8)}`}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          booking.status === "CONFIRMED"
                            ? "bg-blue-100 text-blue-700"
                            : booking.status === "ONGOING"
                              ? "bg-yellow-100 text-yellow-700"
                              : booking.status === "COMPLETED"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400">
                        $
                        {isCaregiver
                          ? (parseFloat(booking.total_amount) * 0.85).toFixed(2)
                          : parseFloat(booking.total_amount).toFixed(2)}
                      </span>
                      <Link
                        href={
                          isCaregiver
                            ? "/caregiver/assigned-jobs"
                            : "/my-bookings"
                        }
                        className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-icons text-slate-400 text-2xl">
                    event_busy
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  No bookings yet
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  {isCaregiver
                    ? "Bookings will appear here"
                    : "Start by finding a caregiver"}
                </p>
                {!isCaregiver && (
                  <Link
                    href="/caregivers"
                    className="inline-flex items-center gap-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-all"
                  >
                    <span className="material-icons text-sm">search</span>
                    Find Caregivers
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
          <h2 className="text-sm sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-6">
            Quick Actions
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {!isCaregiver ? (
              <>
                <Link
                  href="/caregivers"
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group"
                >
                  <span className="material-icons text-teal-600 dark:text-teal-400 text-base sm:text-2xl">
                    search
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-teal-700">
                      Find Caregivers
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                      Browse available caregivers
                    </p>
                  </div>
                </Link>
                <Link
                  href="/services"
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group"
                >
                  <span className="material-icons text-teal-600 dark:text-teal-400 text-base sm:text-2xl">
                    medical_services
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-teal-700">
                      Browse Services
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                      Explore care services
                    </p>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/caregiver/schedule"
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group"
                >
                  <span className="material-icons text-teal-600 dark:text-teal-400 text-base sm:text-2xl">
                    calendar_month
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-teal-700">
                      My Schedule
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                      View your calendar
                    </p>
                  </div>
                </Link>
                <Link
                  href="/caregiver/earnings"
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group"
                >
                  <span className="material-icons text-teal-600 dark:text-teal-400 text-base sm:text-2xl">
                    payments
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-teal-700">
                      Earnings
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                      Track your income
                    </p>
                  </div>
                </Link>
              </>
            )}
            <Link
              href="/profile"
              className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group"
            >
              <span className="material-icons text-teal-600 dark:text-teal-400 text-base sm:text-2xl">
                person
              </span>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-teal-700">
                  Edit Profile
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Update your information
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
