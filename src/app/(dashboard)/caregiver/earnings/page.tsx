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
            amount: parseFloat(b.total_amount) * 0.85, // 85% after platform fee
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
          <p className="text-slate-600">Loading earnings...</p>
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Earnings</h1>
        <p className="text-slate-600">Track your income and payments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="material-icons text-4xl opacity-80">
              account_balance_wallet
            </span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Earnings</p>
          <p className="text-4xl font-bold">${totalEarnings.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-blue-600">
                calendar_month
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-600">This Month</p>
              <p className="text-2xl font-bold text-slate-900">
                ${thisMonthEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-green-600">
                check_circle
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Completed Jobs</p>
              <p className="text-2xl font-bold text-slate-900">
                {completedBookings}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <div className="flex gap-3">
          <span className="material-icons text-blue-600">info</span>
          <div>
            <p className="font-semibold text-blue-900 mb-1">
              Payment Information
            </p>
            <p className="text-sm text-blue-800">
              Platform fee: 15% • Payments are processed within 3-5 business
              days after service completion • Minimum withdrawal: $50
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {["all", "completed", "ongoing"].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === filterOption
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Earnings Table */}
      {earnings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-slate-400 text-4xl">
              payments
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No earnings yet
          </h3>
          <p className="text-slate-600">Complete bookings to start earning</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {earnings
                  .filter((e) =>
                    filter === "all" ? true : e.status.toLowerCase() === filter,
                  )
                  .map((earning) => (
                    <tr
                      key={earning.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {new Date(earning.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                        {earning.booking_number}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {earning.service_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {earning.client_name}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-teal-600">
                        ${earning.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
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

      {/* Withdraw Button */}
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
