"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Booking = {
  id: string;
  booking_number: string;
  service_name: string;
  caregiver_name: string;
  caregiver_id: string;
  client_name: string;
  start_date: string;
  duration_type: string;
  duration_value: number;
  total_amount: number;
  status: string;
  payment_status: string;
};

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/bookings/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`Booking marked as ${newStatus}`);
        fetchBookings();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetchBookings();
  }, [status, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookings/my-bookings");
      const data = await response.json();
      if (response.ok) {
        setBookings(data.bookings || []);
        if (data.bookings && data.bookings.length > 0) {
          toast.success(`Loaded ${data.bookings.length} booking(s)`);
        }
      } else {
        toast.error(`Failed to load bookings: ${data.error}`);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings. Please try again.");
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
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (s: string) => {
    switch (s) {
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

  const isCaregiver = session?.user?.role === "CAREGIVER";

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          caregiverId: selectedBooking.caregiver_id,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Review submitted successfully!");
        setShowReviewModal(false);
        setReviewData({ rating: 5, comment: "" });
        fetchBookings();
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          reason: cancelReason,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(
          `Booking cancelled. Refund: ${data.refundAmount.toFixed(2)}`,
        );
        setShowCancelModal(false);
        setCancelReason("");
        fetchBookings();
      } else {
        toast.error(data.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((b) =>
    filter === "all" ? true : b.status.toLowerCase() === filter,
  );

  return (
    <>
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
          My Bookings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {isCaregiver
            ? "Manage your service bookings"
            : "Track and manage your care bookings"}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-2">
          {["all", "confirmed", "ongoing", "completed", "cancelled"].map(
            (opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg font-semibold transition-all ${
                  filter === opt
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="material-icons text-slate-400 text-3xl">
              event_busy
            </span>
          </div>
          <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
            No bookings found
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4">
            {isCaregiver
              ? "You don't have any bookings yet. Keep your profile updated!"
              : "You haven't made any bookings yet. Start by finding a caregiver."}
          </p>
          {!isCaregiver && (
            <button
              onClick={() => router.push("/caregivers")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all"
            >
              <span className="material-icons">search</span>
              Find Caregivers
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1 mr-2">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                      {booking.service_name}
                    </h3>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    #{booking.booking_number}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base sm:text-2xl font-bold text-teal-600">
                    ${booking.total_amount}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {booking.payment_status}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-slate-400 text-sm">
                    person
                  </span>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isCaregiver ? "Client" : "Caregiver"}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {isCaregiver
                        ? booking.client_name
                        : booking.caregiver_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-slate-400 text-sm">
                    calendar_today
                  </span>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Start Date
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {new Date(booking.start_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-slate-400 text-sm">
                    schedule
                  </span>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Duration
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {booking.duration_value}{" "}
                      {booking.duration_type.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowDetailsModal(true);
                  }}
                  className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all"
                >
                  View Details
                </button>
                {isCaregiver && booking.status === "CONFIRMED" && (
                  <button
                    onClick={() => handleUpdateStatus(booking.id, "ONGOING")}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                  >
                    Start Service
                  </button>
                )}
                {isCaregiver && booking.status === "ONGOING" && (
                  <button
                    onClick={() => handleUpdateStatus(booking.id, "COMPLETED")}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                  >
                    Complete Service
                  </button>
                )}
                {!isCaregiver && booking.status === "COMPLETED" && (
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowReviewModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Leave Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full">
            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Leave a Review
              </h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <span className="material-icons text-slate-600 dark:text-slate-400">
                  close
                </span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Rate your experience with {selectedBooking.caregiver_name}
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setReviewData({ ...reviewData, rating: star })
                      }
                      className="text-3xl transition-all"
                    >
                      <span
                        className={`material-icons ${star <= reviewData.rating ? "text-yellow-400" : "text-slate-300"}`}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  rows={4}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900 dark:text-white dark:bg-slate-700 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  onClick={() => setShowReviewModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full">
            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Cancel Booking
              </h2>
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <span className="material-icons text-slate-600 dark:text-slate-400">
                  close
                </span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <span className="material-icons text-yellow-600">
                    warning
                  </span>
                  <div>
                    <p className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                      Cancellation Policy
                    </p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Full refund: 24+ hours before start
                      <br />
                      50% refund: 12-24 hours before start
                      <br />
                      No refund: Less than 12 hours before start
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Reason for Cancellation (Optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  placeholder="Let us know why you're cancelling..."
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900 dark:text-white dark:bg-slate-700 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancelBooking}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all"
                >
                  Keep Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Booking Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                <span className="material-icons text-slate-600 dark:text-slate-400">
                  close
                </span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedBooking.status)}`}
                >
                  {selectedBooking.status}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Booking #{selectedBooking.booking_number}
                </span>
              </div>

              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {selectedBooking.service_name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-teal-600">
                    ${selectedBooking.total_amount}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: "person",
                    label: isCaregiver ? "CLIENT" : "CAREGIVER",
                    value: isCaregiver
                      ? selectedBooking.client_name
                      : selectedBooking.caregiver_name,
                  },
                  {
                    icon: "calendar_today",
                    label: "START DATE",
                    value: new Date(
                      selectedBooking.start_date,
                    ).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }),
                  },
                  {
                    icon: "schedule",
                    label: "DURATION",
                    value: `${selectedBooking.duration_value} ${selectedBooking.duration_type.toLowerCase()}`,
                  },
                  {
                    icon: "payment",
                    label: "PAYMENT",
                    value: selectedBooking.payment_status,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-icons text-teal-600 text-sm">
                        {item.icon}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                        {item.label}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                {selectedBooking.status === "CONFIRMED" && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowCancelModal(true);
                    }}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Cancel Booking
                  </button>
                )}
                {selectedBooking.status === "COMPLETED" && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowReviewModal(true);
                    }}
                    className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Leave Review
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
