"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingReminders: true,
    marketingEmails: false,
    twoFactorAuth: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetchSettings();
    }
  }, [status, router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();

      if (response.ok) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

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

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error(data.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="mb-4 sm:mb-8">
        <h1 className="text-lg sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage your account preferences
        </p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">
          Notifications
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 sm:p-4 border-2 border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="material-icons text-teal-600 text-base sm:text-2xl">
                email
              </span>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                  Email Notifications
                </p>
                <p className="text-xs text-slate-600 hidden sm:block">
                  Receive booking updates via email
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting("emailNotifications")}
              className={`relative w-14 h-8 rounded-full transition-all ${
                settings.emailNotifications ? "bg-teal-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.emailNotifications ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 sm:p-4 border-2 border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="material-icons text-teal-600 text-base sm:text-2xl">
                sms
              </span>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                  SMS Notifications
                </p>
                <p className="text-xs text-slate-600 hidden sm:block">
                  Get text messages for important updates
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting("smsNotifications")}
              className={`relative w-14 h-8 rounded-full transition-all ${
                settings.smsNotifications ? "bg-teal-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.smsNotifications ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 sm:p-4 border-2 border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="material-icons text-teal-600 text-base sm:text-2xl">
                notifications_active
              </span>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                  Booking Reminders
                </p>
                <p className="text-xs text-slate-600 hidden sm:block">
                  Reminders before scheduled bookings
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting("bookingReminders")}
              className={`relative w-14 h-8 rounded-full transition-all ${
                settings.bookingReminders ? "bg-teal-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.bookingReminders ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 sm:p-4 border-2 border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="material-icons text-teal-600 text-base sm:text-2xl">
                campaign
              </span>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                  Marketing Emails
                </p>
                <p className="text-xs text-slate-600 hidden sm:block">
                  Receive news and promotional offers
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting("marketingEmails")}
              className={`relative w-14 h-8 rounded-full transition-all ${
                settings.marketingEmails ? "bg-teal-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.marketingEmails ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">
          Security
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 sm:p-4 border-2 border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="material-icons text-teal-600 text-base sm:text-2xl">
                security
              </span>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-slate-600 hidden sm:block">
                  Add an extra layer of security
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting("twoFactorAuth")}
              className={`relative w-14 h-8 rounded-full transition-all ${
                settings.twoFactorAuth ? "bg-teal-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.twoFactorAuth ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <button className="w-full flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all group">
            <div className="flex items-center gap-3">
              <span className="material-icons text-slate-600 group-hover:text-teal-600">
                vpn_key
              </span>
              <span className="font-semibold text-slate-900 group-hover:text-teal-700">
                Change Password
              </span>
            </div>
            <span className="material-icons text-slate-400 group-hover:text-teal-600">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 sm:p-6">
        <h2 className="text-base sm:text-xl font-bold text-red-600 mb-4 sm:mb-6">
          Danger Zone
        </h2>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 border-2 border-red-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition-all group">
            <div className="flex items-center gap-3">
              <span className="material-icons text-red-600">
                delete_forever
              </span>
              <div className="text-left">
                <p className="font-semibold text-slate-900 group-hover:text-red-700">
                  Delete Account
                </p>
                <p className="text-sm text-slate-600">
                  Permanently delete your account and data
                </p>
              </div>
            </div>
            <span className="material-icons text-red-400 group-hover:text-red-600">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </>
  );
}
