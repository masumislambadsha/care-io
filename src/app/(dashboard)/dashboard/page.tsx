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

          // Caregivers see their ASSIGNED JOBS stats, clients see their bookings
          const endpoint = isCaregiver
            ? "/api/bookings/assigned-jobs"
            : "/api/bookings/my-bookings";

          const response = await fetch(endpoint);
          const data = await response.json();

          if (response.ok) {
            const bookings = isCaregiver
              ? data.jobs || []
              : data.bookings || [];

            // Calculate total amount (for caregivers, show earnings at 85%)
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
            // Get the 3 most recent bookings
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
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isCaregiver = session?.user?.role === "CAREGIVER";

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="text-slate-600">
          {isCaregiver
            ? "Manage your schedule and bookings"
            : "Track your bookings and find care"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-teal-600">event_note</span>
            </div>
            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">
            {isLoadingStats ? (
              <span className="inline-block w-12 h-8 bg-slate-200 animate-pulse rounded"></span>
            ) : (
              stats.totalBookings
            )}
          </h3>
          <p className="text-sm text-slate-600">Total Bookings</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-blue-600">schedule</span>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">
            {isLoadingStats ? (
              <span className="inline-block w-12 h-8 bg-slate-200 animate-pulse rounded"></span>
            ) : (
              stats.activeBookings
            )}
          </h3>
          <p className="text-sm text-slate-600">Active Bookings</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-green-600">
                check_circle
              </span>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Done
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">
            {isLoadingStats ? (
              <span className="inline-block w-12 h-8 bg-slate-200 animate-pulse rounded"></span>
            ) : (
              stats.completedBookings
            )}
          </h3>
          <p className="text-sm text-slate-600">Completed</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-purple-600">
                {isCaregiver ? "payments" : "account_balance_wallet"}
              </span>
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              {isCaregiver ? "Earned" : "Spent"}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">
            {isLoadingStats ? (
              <span className="inline-block w-20 h-8 bg-slate-200 animate-pulse rounded"></span>
            ) : (
              `$${stats.totalSpent.toFixed(2)}`
            )}
          </h3>
          <p className="text-sm text-slate-600">
            {isCaregiver ? "Total Earnings" : "Total Spent"}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Recent Bookings
              </h2>
              <Link
                href="/my-bookings"
                className="text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                View All →
              </Link>
            </div>

            {/* Recent Bookings List */}
            {isLoadingStats ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border border-slate-200 rounded-lg p-4 animate-pulse"
                  >
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-slate-200 rounded-lg p-4 hover:border-teal-600 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {booking.service_name}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {booking.booking_number
                            ? `Booking #${booking.booking_number}`
                            : `Job #${booking.id.slice(0, 8)}`}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "CONFIRMED"
                            ? "bg-blue-100 text-blue-700"
                            : booking.status === "ONGOING"
                              ? "bg-yellow-100 text-yellow-700"
                              : booking.status === "COMPLETED"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <span className="material-icons text-sm">person</span>
                        <span>
                          {isCaregiver
                            ? booking.client_name
                            : booking.caregiver_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-icons text-sm">
                          calendar_today
                        </span>
                        <span>
                          {new Date(booking.start_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-icons text-sm">schedule</span>
                        <span>
                          {booking.duration_value}{" "}
                          {booking.duration_type?.toLowerCase()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-lg font-bold text-teal-600">
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
                        className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-slate-400 text-4xl">
                    event_busy
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No bookings yet
                </h3>
                <p className="text-slate-600 mb-6">
                  {isCaregiver
                    ? "You'll see your bookings here once clients book your services"
                    : "Start by finding a caregiver for your needs"}
                </p>
                {!isCaregiver && (
                  <Link
                    href="/caregivers"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all"
                  >
                    <span className="material-icons">search</span>
                    Find Caregivers
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {!isCaregiver ? (
              <>
                <Link
                  href="/caregivers"
                  className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group"
                >
                  <span className="material-icons text-teal-600">search</span>
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-teal-700">
                      Find Caregivers
                    </p>
                    <p className="text-xs text-slate-600">
                      Browse available caregivers
                    </p>
                  </div>
                </Link>

                <Link
                  href="/services"
                  className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group"
                >
                  <span className="material-icons text-teal-600">
                    medical_services
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-teal-700">
                      Browse Services
                    </p>
                    <p className="text-xs text-slate-600">
                      Explore care services
                    </p>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/caregiver/schedule"
                  className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group"
                >
                  <span className="material-icons text-teal-600">
                    calendar_month
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-teal-700">
                      My Schedule
                    </p>
                    <p className="text-xs text-slate-600">View your calendar</p>
                  </div>
                </Link>

                <Link
                  href="/caregiver/earnings"
                  className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group"
                >
                  <span className="material-icons text-teal-600">payments</span>
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-teal-700">
                      Earnings
                    </p>
                    <p className="text-xs text-slate-600">Track your income</p>
                  </div>
                </Link>
              </>
            )}

            <Link
              href="/profile"
              className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group"
            >
              <span className="material-icons text-teal-600">person</span>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-teal-700">
                  Edit Profile
                </p>
                <p className="text-xs text-slate-600">
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
