"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [countdown, setCountdown] = useState(5);
  const [bookingCreated, setBookingCreated] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }

    
    const createBooking = async () => {
      try {
        const bookingDataStr = sessionStorage.getItem("pendingBooking");
        console.log("Pending booking data:", bookingDataStr);

        if (!bookingDataStr || bookingCreated) return;

        const bookingData = JSON.parse(bookingDataStr);
        console.log("Creating booking with data:", bookingData);

        const response = await fetch("/api/bookings/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...bookingData,
            stripeSessionId: sessionId,
          }),
        });

        const result = await response.json();
        console.log("Booking creation response:", response.status, result);

        if (response.ok) {
          console.log("Booking created successfully!");
          toast.success("Booking created successfully!");
          setBookingCreated(true);
          sessionStorage.removeItem("pendingBooking");
        } else {
          console.error("Failed to create booking:", result);
          toast.error(
            `Failed to create booking: ${result.error || "Unknown error"}`,
          );
        }
      } catch (error) {
        console.error("Failed to create booking:", error);
        toast.error("Failed to create booking. Please contact support.");
      }
    };

    createBooking();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/my-bookings");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, router, bookingCreated]);

  if (!sessionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 text-center"
      >
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <span className="material-icons text-teal-600 text-6xl">
            check_circle
          </span>
        </motion.div>

        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Booking Confirmed!
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Your payment was successful and your booking has been confirmed.
          You'll receive a confirmation email shortly.
        </p>

        
        <div className="bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-200 dark:border-teal-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 mb-2">
            <span className="material-icons text-sm">info</span>
            <span className="font-semibold text-sm">What&apos;s Next?</span>
          </div>
          <p className="text-sm text-teal-800 dark:text-teal-300">
            The caregiver will contact you soon to confirm the schedule and
            discuss any special requirements.
          </p>
        </div>

        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Redirecting to your bookings in {countdown} seconds...
        </p>

        
        <div className="space-y-3">
          <Link
            href="/my-bookings"
            className="block w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-all"
          >
            View My Bookings
          </Link>
          <Link
            href="/"
            className="block w-full px-6 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:border-teal-600 hover:text-teal-600 dark:hover:border-teal-500 dark:hover:text-teal-400 transition-all"
          >
            Go to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-teal-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
