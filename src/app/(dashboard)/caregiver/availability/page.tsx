"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type TimeSlot = {
  hour: number;
  available: boolean;
};

type DaySchedule = {
  day: string;
  slots: TimeSlot[];
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function CaregiverAvailabilityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [vacationMode, setVacationMode] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      if (session?.user?.role !== "CAREGIVER") {
        router.push("/dashboard");
        return;
      }
      fetchAvailability();
    }
  }, [status, router, session]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/caregiver/availability");
      const data = await response.json();

      if (response.ok && data.availability) {
        setSchedule(data.availability);
      } else {
        // Initialize with default schedule (all unavailable)
        initializeSchedule();
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      initializeSchedule();
    } finally {
      setLoading(false);
    }
  };

  const initializeSchedule = () => {
    const defaultSchedule = DAYS.map((day) => ({
      day,
      slots: HOURS.map((hour) => ({ hour, available: false })),
    }));
    setSchedule(defaultSchedule);
  };

  const toggleSlot = (dayIndex: number, hourIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots[hourIndex].available =
      !newSchedule[dayIndex].slots[hourIndex].available;
    setSchedule(newSchedule);
  };

  const toggleDay = (dayIndex: number, available: boolean) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots = newSchedule[dayIndex].slots.map((slot) => ({
      ...slot,
      available,
    }));
    setSchedule(newSchedule);
  };

  const toggleAllDays = (available: boolean) => {
    const newSchedule = schedule.map((day) => ({
      ...day,
      slots: day.slots.map((slot) => ({ ...slot, available })),
    }));
    setSchedule(newSchedule);
  };

  const saveAvailability = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/caregiver/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: schedule }),
      });

      if (response.ok) {
        toast.success("Availability saved successfully");
      } else {
        toast.error("Failed to save availability");
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error("Failed to save availability");
    } finally {
      setIsSaving(false);
    }
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading availability...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-lg sm:text-3xl font-bold text-slate-900 mb-2">
          Manage Availability
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Set your available hours for each day of the week
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <button
            onClick={() => toggleAllDays(true)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all"
          >
            Mark All Available
          </button>
          <button
            onClick={() => toggleAllDays(false)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all"
          >
            Mark All Unavailable
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <input
              type="checkbox"
              id="vacation"
              checked={vacationMode}
              onChange={(e) => setVacationMode(e.target.checked)}
              className="w-5 h-5 text-teal-600 border-2 border-slate-300 rounded focus:ring-teal-600"
            />
            <label htmlFor="vacation" className="font-semibold text-slate-700">
              Vacation Mode (Block all bookings)
            </label>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-4 mb-6">
        {schedule.map((daySchedule, dayIndex) => (
          <div
            key={daySchedule.day}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex gap-3 items-center justify-between mb-4">
              <h3 className="text-sm  sm:text-lg font-bold text-slate-900">
                {daySchedule.day}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleDay(dayIndex, true)}
                  className="px-1 sm:px-3 py-1 sm:text-sm bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-lg transition-all text-[10px]"
                >
                  All Available
                </button>
                <button
                  onClick={() => toggleDay(dayIndex, false)}
                  className="px-1 sm:px-3 py-1 text-[10px] sm:text-sm bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-all"
                >
                  All Unavailable
                </button>
              </div>
            </div>

            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
              {daySchedule.slots.map((slot, slotIndex) => (
                <button
                  key={slot.hour}
                  onClick={() => toggleSlot(dayIndex, slotIndex)}
                  className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                    slot.available
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  title={formatHour(slot.hour)}
                >
                  {slot.hour}
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs text-slate-600">
              Click on hour blocks to toggle availability
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg"></div>
            <span className="text-sm text-slate-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
            <span className="text-sm text-slate-600">Unavailable</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveAvailability}
          disabled={isSaving}
          className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <span className="material-icons">save</span>
              Save Availability
            </>
          )}
        </button>
      </div>
    </>
  );
}
