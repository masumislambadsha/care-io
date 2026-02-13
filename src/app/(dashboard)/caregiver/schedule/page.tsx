"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Booking = {
  id: string;
  booking_number: string;
  service_name: string;
  client_name: string;
  start_date: string;
  end_date: string;
  duration_type: string;
  duration_value: number;
  total_amount: number;
  status: string;
  address: string;
  full_address: string;
};

export default function CaregiverSchedulePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      if (session?.user?.role !== "CAREGIVER") {
        router.push("/dashboard");
        return;
      }
      fetchSchedule();
    }
  }, [status, router, session]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookings/assigned-jobs");
      const data = await response.json();

      if (response.ok) {
        setBookings(data.jobs || []);
      } else {
        toast.error("Failed to load schedule");
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "ONGOING",
  );

  const todayBookings = upcomingBookings.filter((b) => {
    const bookingDate = new Date(b.start_date);
    const today = new Date();
    return (
      bookingDate.getDate() === today.getDate() &&
      bookingDate.getMonth() === today.getMonth() &&
      bookingDate.getFullYear() === today.getFullYear()
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "ONGOING":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Schedule</h1>
        <p className="text-slate-600">Manage your upcoming appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-blue-600">today</span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Today's Bookings</p>
              <p className="text-2xl font-bold text-slate-900">
                {todayBookings.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-purple-600">
                event_available
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Upcoming</p>
              <p className="text-2xl font-bold text-slate-900">
                {upcomingBookings.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-green-600">
                check_circle
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-slate-900">
                {bookings.filter((b) => b.status === "COMPLETED").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Today's Schedule
        </h2>
        {todayBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-slate-400 text-4xl">
                event_available
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No bookings today
            </h3>
            <p className="text-slate-600">Enjoy your day off!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayBookings.map((booking) => (
              <div
                key={booking.id}
                className="border-l-4 border-teal-600 bg-teal-50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900">
                      {booking.service_name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      Client: {booking.client_name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      booking.status,
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-sm">schedule</span>
                    <span>
                      {new Date(booking.start_date).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-sm">location_on</span>
                    <span>
                      {booking.full_address || "Address not provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-sm">attach_money</span>
                    <span>${booking.total_amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Upcoming Bookings
        </h2>
        {upcomingBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-slate-400 text-4xl">
                event_busy
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No upcoming bookings
            </h3>
            <p className="text-slate-600">New bookings will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-slate-200 rounded-lg p-4 hover:border-teal-600 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      {booking.service_name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      Client: {booking.client_name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      booking.status,
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500 mb-1">Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(booking.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Time</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(booking.start_date).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Duration</p>
                    <p className="font-semibold text-slate-900">
                      {booking.duration_value}{" "}
                      {booking.duration_type.toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Amount</p>
                    <p className="font-semibold text-teal-600">
                      ${booking.total_amount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
