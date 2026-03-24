"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Payment = {
  id: string;
  booking_id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  created_at: string;
  service_name: string;
  caregiver_name: string;
};

export default function PaymentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetchPayments();
    }
  }, [status, router]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookings/my-bookings");
      const data = await response.json();

      if (response.ok) {
        // Transform bookings to payment records
        const paymentRecords = data.bookings.map((booking: any) => ({
          id: booking.id,
          booking_id: booking.id,
          amount: parseFloat(booking.total_amount),
          payment_method: "Stripe",
          payment_status: booking.payment_status,
          transaction_id: booking.booking_number,
          created_at: booking.created_at || booking.start_date,
          service_name: booking.service_name,
          caregiver_name: booking.caregiver_name,
        }));
        setPayments(paymentRecords);
      } else {
        toast.error("Failed to load payment history");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);
  const successfulPayments = payments.filter(
    (p) => p.payment_status === "PAID",
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "REFUNDED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <>
      <div className="mb-4 sm:mb-8">
        <h1 className="text-lg sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
          Payment History
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          View all your payment transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-4 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
            <div className="w-7 h-7 sm:w-12 sm:h-12 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
              <span className="material-icons text-teal-600 text-sm sm:text-2xl">
                account_balance_wallet
              </span>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-600 leading-tight">
                Total Spent
              </p>
              <p className="text-xs sm:text-2xl font-bold text-slate-900 leading-tight">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
            <div className="w-7 h-7 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
              <span className="material-icons text-green-600 text-sm sm:text-2xl">
                check_circle
              </span>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-600 leading-tight">
                Successful
              </p>
              <p className="text-xs sm:text-2xl font-bold text-slate-900 leading-tight">
                {successfulPayments}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
            <div className="w-7 h-7 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <span className="material-icons text-blue-600 text-sm sm:text-2xl">
                receipt_long
              </span>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-600 leading-tight">
                Transactions
              </p>
              <p className="text-xs sm:text-2xl font-bold text-slate-900 leading-tight">
                {payments.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-2">
          {["all", "paid", "pending", "failed", "refunded"].map(
            (filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg font-semibold transition-all ${
                  filter === filterOption
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-slate-400 text-4xl">
              receipt
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No payments yet
          </h3>
          <p className="text-slate-600">
            Your payment history will appear here
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                    Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                    Service
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                    Caregiver
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                    Transaction ID
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                    Amount
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payments
                  .filter((p) =>
                    filter === "all"
                      ? true
                      : p.payment_status.toLowerCase() === filter,
                  )
                  .map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-900">
                        {payment.created_at
                          ? new Date(payment.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "N/A"}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-900">
                        {payment.service_name}
                      </td>
                      <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600">
                        {payment.caregiver_name}
                      </td>
                      <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600 font-mono">
                        {payment.transaction_id}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-teal-600">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(payment.payment_status)}`}
                        >
                          {payment.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
