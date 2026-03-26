"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

type Booking = {
  id: string;
  booking_number: string;
  client_name: string;
  caregiver_name: string;
  service_name: string;
  start_date: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
};

export default function AdminBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [status, router, session]);

  const {
    data: bookingsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/bookings");
      if (!response.ok) throw new Error("Failed to fetch bookings");
      return response.json();
    },
    enabled: status === "authenticated" && session?.user?.role === "ADMIN",
  });

  const bookings: Booking[] = bookingsData?.bookings || [];

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      if (response.ok) {
        toast.success("Booking status updated");
        refetch();
      } else {
        toast.error("Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading bookings...</p>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.booking_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.caregiver_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || booking.payment_status === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    ongoing: bookings.filter((b) => b.status === "ONGOING").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
    totalRevenue: bookings
      .filter((b) => b.payment_status === "PAID")
      .reduce((sum, b) => sum + parseFloat(b.total_amount.toString()), 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "ONGOING":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "REFUNDED":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <>
      
      <div className="mb-4 sm:mb-8">
        <h1 className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Booking Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Manage all platform bookings
        </p>
      </div>

      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-4 sm:mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Total</p>
          <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
            {stats.total}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Confirmed</p>
          <p className="text-lg sm:text-2xl font-bold text-blue-600">
            {stats.confirmed}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Ongoing</p>
          <p className="text-lg sm:text-2xl font-bold text-purple-600">
            {stats.ongoing}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Revenue</p>
          <p className="text-lg sm:text-2xl font-bold text-teal-600">
            ${stats.totalRevenue.toFixed(0)}
          </p>
        </div>
      </div>

      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by booking #, client, caregiver..."
              className="w-full px-3 sm:px-4 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-xs sm:text-sm text-slate-900 dark:text-white dark:bg-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-xs sm:text-sm text-slate-900 dark:text-white dark:bg-slate-700"
            >
              <option value="all">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
              Payment
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none transition-colors text-xs sm:text-sm text-slate-900 dark:text-white dark:bg-slate-700"
            >
              <option value="all">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700">
                  Booking #
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700">
                  Client
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700">
                  Caregiver
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700">
                  Service
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700">
                  Date
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700">
                  Amount
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <span className="material-icons text-slate-400 text-5xl mb-3">
                        event_busy
                      </span>
                      <p className="text-slate-600 dark:text-white font-medium">
                        No bookings found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <p className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {booking.booking_number}
                      </p>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4">
                      <p className="text-xs sm:text-sm text-slate-900 dark:text-white">
                        {booking.client_name}
                      </p>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4">
                      <p className="text-xs sm:text-sm text-slate-900 dark:text-white">
                        {booking.caregiver_name}
                      </p>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <p className="text-xs sm:text-sm text-slate-900 dark:text-white">
                        {booking.service_name}
                      </p>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {new Date(booking.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <p className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                        $
                        {parseFloat(booking.total_amount.toString()).toFixed(2)}
                      </p>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            booking.status,
                          )}`}
                        >
                          {booking.status}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentColor(
                            booking.payment_status,
                          )}`}
                        >
                          {booking.payment_status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <span className="material-icons text-slate-600 dark:text-slate-400 text-xl">
                            visibility
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Booking Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-all"
              >
                <span className="material-icons text-slate-600 dark:text-slate-400">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Booking Number</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedBooking.booking_number}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      selectedBooking.status,
                    )}`}
                  >
                    {selectedBooking.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentColor(
                      selectedBooking.payment_status,
                    )}`}
                  >
                    {selectedBooking.payment_status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Client</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {selectedBooking.client_name}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Caregiver</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {selectedBooking.caregiver_name}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Service</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {selectedBooking.service_name}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Start Date</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {new Date(selectedBooking.start_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Amount</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    $
                    {parseFloat(
                      selectedBooking.total_amount.toString(),
                    ).toFixed(2)}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Created</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {new Date(selectedBooking.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              
              {selectedBooking.status !== "COMPLETED" &&
                selectedBooking.status !== "CANCELLED" && (
                  <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    {selectedBooking.status === "CONFIRMED" && (
                      <button
                        onClick={() => {
                          updateBookingStatus(selectedBooking.id, "ONGOING");
                          setShowDetailsModal(false);
                        }}
                        className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
                      >
                        Mark as Ongoing
                      </button>
                    )}
                    {selectedBooking.status === "ONGOING" && (
                      <button
                        onClick={() => {
                          updateBookingStatus(selectedBooking.id, "COMPLETED");
                          setShowDetailsModal(false);
                        }}
                        className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                      >
                        Mark as Completed
                      </button>
                    )}
                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBooking.id, "CANCELLED");
                        setShowDetailsModal(false);
                      }}
                      className="flex-1 px-4 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
