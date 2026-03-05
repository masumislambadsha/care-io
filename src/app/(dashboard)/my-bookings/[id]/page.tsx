"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

type BookingDetail = {
  id: string;
  booking_number: string;
  service_name: string;
  caregiver_name: string;
  caregiver_id: string;
  client_name: string;
  start_date: string;
  end_date: string;
  duration_type: string;
  duration_value: number;
  total_amount: number;
  status: string;
  payment_status: string;
  full_address: string;
  created_at: string;
};

export default function BookingDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && bookingId) {
      fetchBookingDetail();
    }
  }, [status, bookingId, router]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookings/my-bookings");
      const data = await response.json();

      if (response.ok) {
        const foundBooking = data.bookings?.find(
          (b: any) => b.id === bookingId,
        );
        if (foundBooking) {
          setBooking(foundBooking);
        } else {
          toast.error("Booking not found");
          router.push("/my-bookings");
        }
      } else {
        toast.error("Failed to load booking details");
        router.push("/my-bookings");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      toast.error("Failed to load booking details");
      router.push("/my-bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          reason: cancelReason,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          `Booking cancelled. Refund: $${data.refundAmount.toFixed(2)}`,
        );
        setShowCancelModal(false);
        fetchBookingDetail();
      } else {
        toast.error(data.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!booking) return;

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caregiverId: booking.caregiver_id,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Review submitted successfully!");
        setShowReviewModal(false);
        setReviewData({ rating: 5, comment: "" });
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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

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

  const isCaregiver = session?.user?.role === "CAREGIVER";

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/my-bookings"
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold mb-4"
        >
          <span className="material-icons text-sm">arrow_back</span>
          Back to Bookings
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Booking Details
        </h1>
        <p className="text-slate-600">Booking #{booking.booking_number}</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  booking.status,
                )}`}
              >
                {booking.status}
              </span>
              <span className="text-sm text-slate-600">
                Booked on {new Date(booking.created_at).toLocaleDateString()}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {booking.service_name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-icons text-teal-600">person</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">
                    {isCaregiver ? "CLIENT" : "CAREGIVER"}
                  </p>
                  <p className="font-bold text-slate-900">
                    {isCaregiver ? booking.client_name : booking.caregiver_name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-icons text-blue-600">
                    calendar_today
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">
                    START DATE
                  </p>
                  <p className="font-bold text-slate-900">
                    {new Date(booking.start_date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-icons text-purple-600">
                    schedule
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">
                    DURATION
                  </p>
                  <p className="font-bold text-slate-900">
                    {booking.duration_value}{" "}
                    {booking.duration_type.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-icons text-amber-600">payment</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">
                    PAYMENT STATUS
                  </p>
                  <p className="font-bold text-slate-900">
                    {booking.payment_status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="material-icons text-teal-600">
                  location_on
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Service Location
              </h3>
            </div>
            <p className="text-slate-700">
              {booking.full_address || "Address not provided"}
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Booking Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="material-icons text-green-600 text-sm">
                      check
                    </span>
                  </div>
                  <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                </div>
                <div className="pb-8">
                  <p className="font-semibold text-slate-900">
                    Booking Created
                  </p>
                  <p className="text-sm text-slate-600">
                    {new Date(booking.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      booking.status !== "PENDING"
                        ? "bg-green-100"
                        : "bg-slate-100"
                    }`}
                  >
                    <span
                      className={`material-icons text-sm ${
                        booking.status !== "PENDING"
                          ? "text-green-600"
                          : "text-slate-400"
                      }`}
                    >
                      {booking.status !== "PENDING" ? "check" : "schedule"}
                    </span>
                  </div>
                  {booking.status !== "CANCELLED" && (
                    <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                  )}
                </div>
                <div className="pb-8">
                  <p className="font-semibold text-slate-900">
                    Service Scheduled
                  </p>
                  <p className="text-sm text-slate-600">
                    {new Date(booking.start_date).toLocaleString()}
                  </p>
                </div>
              </div>

              {booking.status === "COMPLETED" && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="material-icons text-green-600 text-sm">
                        check_circle
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Service Completed
                    </p>
                    <p className="text-sm text-slate-600">
                      {new Date(booking.end_date).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {booking.status === "CANCELLED" && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="material-icons text-red-600 text-sm">
                        cancel
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Booking Cancelled
                    </p>
                    <p className="text-sm text-slate-600">Refund processed</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Price Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Price Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-slate-700">
                <span>Service Fee</span>
                <span>${booking.total_amount}</span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-teal-600">
                    ${booking.total_amount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Actions</h3>
            <div className="space-y-3">
              {booking.status === "CONFIRMED" && !isCaregiver && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-icons text-sm">cancel</span>
                  Cancel Booking
                </button>
              )}

              {booking.status === "COMPLETED" && !isCaregiver && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-icons text-sm">star</span>
                  Leave Review
                </button>
              )}

              <Link
                href="/my-bookings"
                className="w-full px-4 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-icons text-sm">list</span>
                View All Bookings
              </Link>
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex gap-3">
              <span className="material-icons text-blue-600">help</span>
              <div>
                <p className="font-semibold text-blue-900 mb-2">Need Help?</p>
                <p className="text-sm text-blue-800 mb-3">
                  Contact our support team for assistance with your booking.
                </p>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Contact Support →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Cancel Booking
              </h2>
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100"
              >
                <span className="material-icons text-slate-600">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <span className="material-icons text-yellow-600">
                    warning
                  </span>
                  <div>
                    <p className="font-semibold text-yellow-900 mb-1">
                      Cancellation Policy
                    </p>
                    <p className="text-sm text-yellow-800">
                      • Full refund: 24+ hours before start
                      <br />
                      • 50% refund: 12-24 hours before start
                      <br />• No refund: Less than 12 hours before start
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Reason for Cancellation (Optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  placeholder="Let us know why you're cancelling..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900 resize-none"
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
                  className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all"
                >
                  Keep Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Leave a Review
              </h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100"
              >
                <span className="material-icons text-slate-600">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">
                  Rate your experience with {booking.caregiver_name}
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
                        className={`material-icons ${
                          star <= reviewData.rating
                            ? "text-yellow-400"
                            : "text-slate-300"
                        }`}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  rows={4}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-900 resize-none"
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
                  className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
