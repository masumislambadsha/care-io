"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Earning = {
  id: string;
  booking_number: string;
  service_name: string;
  client_name: string;
  amount: number;
  date: string;
  status: string;
};

export default function CaregiverEarningsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      if (session?.user?.role !== "CAREGIVER") {
        router.push("/dashboard");
        return;
      }
      fetchEarnings();
    }
  }, [status, router, session]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookings/assigned-jobs");
      const data = await response.json();

      if (response.ok) {
        const earningsData = (data.jobs || [])
          .filter((b: any) => b.payment_status === "PAID")
          .map((b: any) => ({
            id: b.id,
            booking_number: b.booking_number,
            service_name: b.service_name,
            client_name: b.client_name,
            amount: parseFloat(b.total_amount) * 0.85,
            date: b.start_date,
            status: b.status,
          }));
        setEarnings(earningsData);
      } else {
        toast.error("Failed to load earnings");
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
      toast.error("Failed to load earnings");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading earnings...
          </p>
        </div>
      </div>
    );
  }

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const thisMonthEarnings = earnings
    .filter((e) => {
      const date = new Date(e.date);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const completedBookings = earnings.filter(
    (e) => e.status === "COMPLETED",
  ).length;

  return (
    <>
      
      <div className="mb-4 sm:mb-8">
        <h1 className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          My Earnings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Track your income and payments
        </p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 mb-4 sm:mb-8">
        <div className="bg-linear-to-br from-teal-600 to-teal-700 rounded-xl shadow-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <span className="material-icons text-2xl sm:text-4xl opacity-80">
              account_balance_wallet
            </span>
            <span className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-xs sm:text-sm opacity-90 mb-1">Total Earnings</p>
          <p className="text-2xl sm:text-4xl font-bold">
            ${totalEarnings.toFixed(2)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-base sm:text-2xl text-blue-600">
                calendar_month
              </span>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                This Month
              </p>
              <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                ${thisMonthEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-base sm:text-2xl text-green-600">
                check_circle
              </span>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Completed Jobs
              </p>
              <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                {completedBookings}
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8">
        <div className="flex gap-3">
          <span className="material-icons text-blue-600">info</span>
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
              Payment Information
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Platform fee: 15% — Payments are processed within 3-5 business
              days after service completion — Minimum withdrawal: $50
            </p>
          </div>
        </div>
      </div>

      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {["all", "completed", "ongoing"].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                filter === filterOption
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      
      {earnings.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-slate-400 text-4xl">
              payments
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No earnings yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Complete bookings to start earning
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Date
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Booking ID
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Service
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Client
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Amount
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {earnings
                  .filter((e) =>
                    filter === "all" ? true : e.status.toLowerCase() === filter,
                  )
                  .map((earning) => (
                    <tr
                      key={earning.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-900 dark:text-white">
                        {new Date(earning.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono">
                        {earning.booking_number}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        {earning.service_name}
                      </td>
                      <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        {earning.client_name}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-teal-600">
                        ${earning.amount.toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            earning.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {earning.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      
      {totalEarnings >= 50 && (
        <div className="mt-6 flex justify-end">
          <button className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all shadow-lg">
            Withdraw Earnings
          </button>
        </div>
      )}
    </>
  );
}
